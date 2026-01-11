import fetch from "node-fetch";
import { jsonrepair } from "jsonrepair";

const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.1-8b-instant";

async function callGroq(messages) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60_000);

  try {
    const res = await fetch(GROQ_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.7,
        messages,
      }),
      signal: controller.signal,
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(err);
    }

    return await res.json();
  } finally {
    clearTimeout(timeout);
  }
}

function extractJSON(text) {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("No JSON found");
  return match[0];
}

function safeParse(text) {
  try {
    return JSON.parse(text);
  } catch {
    return JSON.parse(jsonrepair(text));
  }
}

export async function generateItinerary({ budget, days, destinations }) {
  let raw;

  const systemPrompt = `
You are a PROFESSIONAL travel planner AI.

STRICT RULES:
- Return ONLY valid JSON
- NO markdown
- NO explanations
- VERY DETAILED content
- Fill EVERY field with meaningful data

JSON STRUCTURE (MANDATORY):
{
  "tripTitle": "Creative trip name",
  "summary": "3–4 sentence detailed overview",
  "totalEstimatedCost": number,
  "currency": "INR",
  "days": [
    {
      "day": number,
      "title": "Theme of the day",
      "location": "City / Area name",
      "activities": [
        {
          "time": "Exact time",
          "activity": "Activity name",
          "description": "2–3 sentence detailed description",
          "estimatedCost": number,
          "tips": "Local tips, do's and don'ts"
        }
      ],
      "meals": {
        "breakfast": {
          "suggestion": "Specific local dish + place",
          "estimatedCost": number
        },
        "lunch": {
          "suggestion": "Specific local dish + place",
          "estimatedCost": number
        },
        "dinner": {
          "suggestion": "Specific local dish + place",
          "estimatedCost": number
        }
      },
      "accommodation": {
        "suggestion": "Hotel / hostel / homestay name + area",
        "estimatedCost": number
      }
    }
  ],
  "packingList": [
    "Item with short reason",
    "Item with short reason"
  ],
  "travelTips": [
    "Very practical tip",
    "Local safety or transport tip"
  ],
  "bestTimeToVisit": "Specific months and reasons"
}

CRITICAL:
- Each day MUST have at least 4 activities
- Costs must be realistic and sum up close to total budget
- Use Indian Rupees only
`;

  const userPrompt = `
Create a VERY DETAILED travel itinerary.

Budget: ₹${budget}
Duration: ${days} days
Destinations: ${destinations}

Include:
- Sightseeing
- Local transport
- Cultural experiences
- Hidden gems
- Food experiences
- Exact timings
- Practical travel tips

Ensure data is rich, descriptive, and complete.
`;

  try {
    const res = await callGroq([
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ]);

    raw = res?.choices?.[0]?.message?.content;
    if (!raw) throw new Error("Empty AI response");

    var result = safeParse(extractJSON(raw));
  } catch {
    const fix = await callGroq([
      { role: "system", content: "Fix JSON and return ONLY valid JSON." },
      { role: "user", content: raw || "" },
    ]);

    var result = safeParse(extractJSON(fix.choices[0].message.content));
  }

  // HARD NORMALIZATION
  let total = 0;

  result.days.forEach((day, i) => {
    day.day = day.day ?? i + 1;
    day.title ||= `Day ${i + 1} Exploration`;
    day.location ||= destinations;

    day.activities = Array.isArray(day.activities) ? day.activities : [];
    day.activities.forEach((a) => {
      a.estimatedCost = Number(a.estimatedCost) || 0;
      a.description ||= "Explore and enjoy this experience.";
      a.tips ||= "Arrive early to avoid crowds.";
      total += a.estimatedCost;
    });

    day.meals ||= {};
    ["breakfast", "lunch", "dinner"].forEach((m) => {
      if (!day.meals[m]) {
        day.meals[m] = {
          suggestion: "Local specialty restaurant",
          estimatedCost: 0,
        };
      }
      total += Number(day.meals[m].estimatedCost) || 0;
    });

    day.accommodation ||= {
      suggestion: "Comfortable hotel in city center",
      estimatedCost: 0,
    };
    total += Number(day.accommodation.estimatedCost) || 0;
  });

  result.totalEstimatedCost =
    typeof result.totalEstimatedCost === "number"
      ? result.totalEstimatedCost
      : total;

  result.currency = "INR";

  result.packingList =
    Array.isArray(result.packingList) && result.packingList.length
      ? result.packingList
      : ["Clothes", "Documents", "Toiletries", "Power bank"];

  result.travelTips =
    Array.isArray(result.travelTips) && result.travelTips.length
      ? result.travelTips
      : ["Use local transport", "Carry cash"];

  result.bestTimeToVisit ||= "October to March for best weather";

  return result;
}
