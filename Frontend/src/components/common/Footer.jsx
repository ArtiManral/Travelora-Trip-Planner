import { Heart, Sparkles } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border py-8 px-4">
      <div className="mx-auto max-w-4xl">
        <p className="flex flex-wrap items-center justify-center gap-2 text-center text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            Made with
            <Heart
              className="h-4 w-4 fill-primary text-primary animate-pulse"
              aria-hidden="true"
            />
            for travelers
          </span>

          <span className="hidden sm:inline">•</span>

          <span>
            by <span className="font-medium text-foreground">Arti Manral</span>
          </span>

          <span className="hidden sm:inline">•</span>

          <span className="flex items-center gap-1">
            Powered by
            <Sparkles className="h-4 w-4 text-primary" aria-hidden="true" />
            AI
          </span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
