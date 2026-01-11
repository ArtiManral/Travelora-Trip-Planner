import { MapPin, Clock, Utensils, Bed, Lightbulb, Package, Sun, IndianRupee, } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, } from "@/components/ui/accordion";

const ItineraryDisplay = ({ itinerary }) => {
  if (
    !itinerary ||
    !Array.isArray(itinerary.days) ||
    itinerary.days.length === 0
  ) {
    return null;
  }

  const days = itinerary.days;

  const totalEstimatedCost =
    typeof itinerary.totalEstimatedCost === "number"
      ? itinerary.totalEstimatedCost
      : days.reduce((sum, day) => {
          day.activities?.forEach((a) => {
            sum += Number(a.estimatedCost) || 0;
          });
          Object.values(day.meals || {}).forEach((m) => {
            sum += Number(m.estimatedCost) || 0;
          });
          sum += Number(day.accommodation?.estimatedCost) || 0;
          return sum;
        }, 0);

  return (
    <section className="py-10 sm:py-12 px-4 animate-fade-in-up">
      <div className="max-w-5xl mx-auto space-y-8 sm:space-y-10">
        <div className="text-center space-y-4">
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold">
            {itinerary.tripTitle || "Your Personalized Trip"}
          </h2>

          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
            {itinerary.summary || "A custom travel itinerary created for you."}
          </p>

          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            <Badge variant="secondary" className="text-sm sm:text-base px-4 py-2">
              <IndianRupee className="w-4 h-4 mr-1" />
              Est. ₹{totalEstimatedCost.toLocaleString()}
            </Badge>
            <Badge variant="secondary" className="text-sm sm:text-base px-4 py-2">
              <Sun className="w-4 h-4 mr-1" />
              {days.length} Days
            </Badge>
          </div>
        </div>

        <Accordion type="single" collapsible defaultValue="day-1">
          {days.map((day, index) => (
            <AccordionItem
              key={index}
              value={`day-${index + 1}`}
              className="border rounded-xl overflow-hidden"
            >
              <AccordionTrigger className="px-4 sm:px-6 py-3 sm:py-4">
                <div className="flex items-center gap-4 text-left">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    {day.day ?? index + 1}
                  </div>
                  <div>
                    <div className="font-semibold">
                      {day.title || `Day ${index + 1}`}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      {day.location || "Destination"}
                    </div>
                  </div>
                </div>
              </AccordionTrigger>

              <AccordionContent className="px-4 sm:px-6 pb-6 space-y-6">
                <div className="space-y-3">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    Activities
                  </h4>
                  {(day.activities || []).map((a, i) => (
                    <div
                      key={i}
                      className="bg-background p-4 rounded-lg border"
                    >
                      <div className="flex flex-col sm:flex-row sm:justify-between gap-3 sm:gap-4">
                        <div>
                          <Badge variant="outline" className="text-xs mb-1">
                            {a.time || "Time"}
                          </Badge>
                          <div className="font-medium">
                            {a.activity || "Activity"}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {a.description || ""}
                          </p>
                          {a.tips && (
                            <p className="text-xs text-primary italic mt-1">
                              💡 {a.tips}
                            </p>
                          )}
                        </div>
                        <Badge>₹{a.estimatedCost || 0}</Badge>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Utensils className="w-4 h-4 text-primary" />
                    Meals
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {["breakfast", "lunch", "dinner"].map((meal) => {
                      const m = day.meals?.[meal];
                      return (
                        <div
                          key={meal}
                          className="bg-background p-3 rounded-lg border"
                        >
                          <div className="capitalize font-medium">{meal}</div>
                          <p className="text-xs text-muted-foreground">
                            {m?.suggestion || "Local cuisine"}
                          </p>
                          <Badge variant="outline" className="text-xs">
                            ₹{m?.estimatedCost || 0}
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-background p-4 rounded-lg border">
                  <h4 className="font-semibold flex items-center gap-2 mb-2">
                    <Bed className="w-4 h-4 text-primary" />
                    Accommodation
                  </h4>
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                    <span>
                      {day.accommodation?.suggestion || "Hotel / Guesthouse"}
                    </span>
                    <Badge>
                      ₹{day.accommodation?.estimatedCost || 0}/night
                    </Badge>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Packing List
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1 text-sm text-muted-foreground">
                {(itinerary.packingList || []).map((item, idx) => (
                  <li key={idx}>• {item}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                Travel Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1 text-sm text-muted-foreground">
                {(itinerary.travelTips || []).map((tip, idx) => (
                  <li key={idx}>• {tip}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="text-center p-5 sm:p-6 bg-card rounded-xl shadow-card">
          <Sun className="w-7 sm:w-8 h-7 sm:h-8 mx-auto mb-2 text-primary" />
          <h4 className="font-semibold">Best Time to Visit</h4>
          <p className="text-muted-foreground">
            {itinerary.bestTimeToVisit || "All year"}
          </p>
        </div>
      </div>
    </section>
  );
};

export default ItineraryDisplay;
