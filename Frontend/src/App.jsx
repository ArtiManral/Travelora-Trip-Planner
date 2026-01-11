import { useState } from "react";
import { useToast } from "./components/hooks/use-toast";

import HeroSection from "./components/page/HeroSection";
import TripPlannerForm from "./components/page/TripPlannerForm";
import ItineraryDisplay from "./components/page/ItineraryDisplay";
import Footer from "./components/common/Footer";

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [itinerary, setItinerary] = useState(null);
  const { toast } = useToast();

  const handleSubmit = async (data) => {
    setIsLoading(true);
    setItinerary(null);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 60_000);

    const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, '');

    try {
      const res = await fetch(`${API_URL}/api/generate-itinerary`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
          signal: controller.signal,
      });

      const response = await res.json();

      if (!res.ok) {
        throw new Error(response.error);
      }

      setItinerary(response);

      toast({
        title: "Itinerary Created! 🎉",
        description: "Your personalized travel plan is ready.",
      });

      setTimeout(() => {
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: "smooth",
        });
      }, 100);
    } catch (error) {
      toast({
        title: "Generation failed",
        description:
          error.name === "AbortError"
            ? "Request timed out. Try again."
            : error.message,
        variant: "destructive",
      });
    } finally {
      clearTimeout(timeout);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <TripPlannerForm onSubmit={handleSubmit} isLoading={isLoading} />
      {itinerary && <ItineraryDisplay itinerary={itinerary} />}
      <Footer />
    </div>
  );
};

export default Index;
