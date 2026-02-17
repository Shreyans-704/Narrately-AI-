import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background dark">
      <Header />

      <div className="pt-20 min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="mb-6 inline-flex items-center justify-center">
            <div className="text-8xl font-bold text-transparent bg-gradient-to-r from-primary to-accent bg-clip-text">
              404
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
            Page not found
          </h1>

          <p className="text-lg text-foreground/60 mb-8 max-w-md mx-auto">
            Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <Button className="gap-2 bg-primary hover:bg-primary/90 text-white">
                <ArrowLeft className="w-4 h-4" />
                Return to Home
              </Button>
            </Link>

            <a href="mailto:support@narrately.ai">
              <Button variant="outline">
                Contact Support
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
