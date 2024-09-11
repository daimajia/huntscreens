import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
        <div className="h-screen w-full flex flex-col items-center justify-center bg-background">
          <h1 className="text-9xl font-extrabold text-primary animate-bounce">404</h1>
          <div className="bg-primary px-2 text-sm rounded rotate-12 absolute">
            Page Not Found
          </div>
          <div className="text-xl font-medium text-muted-foreground mt-8 text-center">
            Sorry, the page you are looking for does not exist.
          </div>
          <Link href="/" passHref>
            <Button variant="outline" className="mt-8">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
  );
}