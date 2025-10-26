import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Home, Camera, AlertCircle } from "lucide-react";

export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="p-8 max-w-md w-full text-center space-y-6">
        <AlertCircle className="h-16 w-16 mx-auto text-red-500" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Page Not Found
          </h1>
          <p className="text-gray-600">
            The page you're looking for doesn't exist.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => setLocation("/")}
            className="flex-1 bg-green-600 hover:bg-green-700 gap-2"
          >
            <Home className="h-4 w-4" />
            Go Home
          </Button>
          <Button
            variant="outline"
            onClick={() => setLocation("/scanner")}
            className="flex-1 gap-2"
          >
            <Camera className="h-4 w-4" />
            Scan
          </Button>
        </div>
      </Card>
    </div>
  );
}
