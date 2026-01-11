import { useState } from "react";
import { MapPin, Sparkles, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { useToast } from "../hooks/use-toast";

const TripPlannerForm = ({ onSubmit, isLoading }) => {
  const [budget, setBudget] = useState("");
  const [days, setDays] = useState("");
  const [destinations, setDestinations] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();

    const budgetNum = parseInt(budget, 10);
    const daysNum = parseInt(days, 10);

    if (!budgetNum || budgetNum < 1000) {
      toast({
        title: "Invalid Budget",
        description: "Please enter a budget of at least ₹1,000",
        variant: "destructive",
      });
      return;
    }

    if (!daysNum || daysNum < 1 || daysNum > 30) {
      toast({
        title: "Invalid Duration",
        description: "Please enter a duration between 1 and 30 days",
        variant: "destructive",
      });
      return;
    }

    if (!destinations.trim() || destinations.trim().length < 3) {
      toast({
        title: "Invalid Destinations",
        description: "Please enter at least one destination",
        variant: "destructive",
      });
      return;
    }

    onSubmit({
      budget: budgetNum,
      days: daysNum,
      destinations: destinations.trim(),
    });
  };

  return (
    <section className="py-12 sm:py-16 px-4">
      <div className="max-w-xl mx-auto w-full">
        <div className="flex items-center justify-center gap-2 mb-6 sm:mb-8">
          <MapPin className="w-6 h-6 text-primary" />
          <h2 className="font-display text-xl sm:text-2xl md:text-3xl font-semibold text-foreground">
            Start Planning
          </h2>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-card rounded-2xl p-5 sm:p-6 md:p-8 shadow-card space-y-5 sm:space-y-6"
        >
          <div className="space-y-2">
            <Label htmlFor="budget" className="text-foreground font-medium">
              Total Budget (INR)
            </Label>
            <Input
              id="budget"
              type="number"
              placeholder="e.g., 50000"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              disabled={isLoading}
              min="1000"
              className="bg-background border-border focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="days" className="text-foreground font-medium">
              Number of Days
            </Label>
            <Input
              id="days"
              type="number"
              placeholder="e.g., 7"
              value={days}
              onChange={(e) => setDays(e.target.value)}
              disabled={isLoading}
              min="1"
              max="30"
              className="bg-background border-border focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="destinations" className="text-foreground font-medium">
              Destinations
            </Label>
            <Textarea
              id="destinations"
              placeholder="e.g., Paris, Rome, Barcelona"
              value={destinations}
              onChange={(e) => setDestinations(e.target.value)}
              disabled={isLoading}
              className="bg-background border-border focus:ring-primary min-h-[100px] resize-none"
            />
            <p className="text-sm text-muted-foreground">
              Enter the cities or places you'd like to visit
            </p>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full gradient-primary text-primary-foreground font-semibold py-5 sm:py-6 text-base sm:text-lg rounded-xl hover:opacity-90 transition-opacity"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Creating Your Itinerary...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Plan My Trip
              </>
            )}
          </Button>
        </form>
      </div>
    </section>
  );
};

export default TripPlannerForm;
