import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Camera, History, Package, Search } from "lucide-react";
import type { ScanHistory } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [, setLocation] = useLocation();
  const [manualBarcode, setManualBarcode] = useState("");
  const { toast } = useToast();

  const { data: history, isLoading } = useQuery<ScanHistory[]>({
    queryKey: ["/api/history"],
  });

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const barcode = manualBarcode.trim();
    
    if (!barcode) {
      toast({
        title: "Please enter a barcode",
        description: "Enter a valid barcode number to search",
        variant: "destructive",
      });
      return;
    }

    if (!/^\d+$/.test(barcode)) {
      toast({
        title: "Invalid barcode",
        description: "Barcode must contain only numbers",
        variant: "destructive",
      });
      return;
    }

    setLocation(`/product/${barcode}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold text-gray-900">
            NutriScan
          </h1>
          <p className="text-xl text-gray-600">
            Scan products to discover nutrition information
          </p>
        </div>

        {/* Main Actions */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Scan Button */}
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <Button
              size="lg"
              onClick={() => setLocation("/scanner")}
              className="w-full h-20 text-lg bg-green-600 hover:bg-green-700"
              data-testid="button-start-scan"
            >
              <Camera className="h-8 w-8 mr-3" />
              <div>
                <div className="font-bold">Scan Product</div>
                <div className="text-sm opacity-90">Use your camera</div>
              </div>
            </Button>
          </Card>

          {/* Manual Entry */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Search className="h-5 w-5" />
              Manual Entry
            </h3>
            <form onSubmit={handleManualSearch} className="space-y-3">
              <Input
                type="text"
                placeholder="Enter barcode number..."
                value={manualBarcode}
                onChange={(e) => setManualBarcode(e.target.value)}
                className="h-12"
                data-testid="input-manual-barcode"
              />
              <Button
                type="submit"
                variant="outline"
                className="w-full h-12"
                data-testid="button-search-barcode"
              >
                Search Product
              </Button>
            </form>
          </Card>

          {/* BMI & Diet Planner */}
          {/* <Card className="p-6 bg-gradient-to-br from-blue-100 to-green-100 hover:shadow-lg transition-shadow">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-blue-700">
              <span role="img" aria-label="bmi">🧑‍⚕️</span>
              BMI & Diet Planner
            </h3>
            <Button
              size="lg"
              onClick={() => setLocation("/bmi")}
              className="w-full h-16 text-lg bg-blue-600 hover:bg-blue-700 text-white"
              data-testid="button-bmi-planner"
            >
              Calculate BMI & Get Diet
            </Button>
          </Card> */}
        </div>

        {/* Recent Scans */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <History className="h-6 w-6 text-gray-600" />
            <h2 className="text-2xl font-bold text-gray-900">Recent Scans</h2>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="p-4">
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-16 w-16 rounded-lg" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : !history || history.length === 0 ? (
            <Card className="p-12 text-center">
              <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No scans yet</h3>
              <p className="text-gray-600 mb-6">
                Start scanning products to view their nutritional information
              </p>
              <Button
                onClick={() => setLocation("/scanner")}
                className="bg-green-600 hover:bg-green-700"
                data-testid="button-scan-first"
              >
                Scan Your First Product
              </Button>
            </Card>
          ) : (
            <div className="grid gap-4">
              {history.map((scan) => (
                <Card
                  key={scan.id}
                  className="p-4 hover:shadow-md cursor-pointer transition-shadow"
                  onClick={() => setLocation(`/product/${scan.barcode}`)}
                  data-testid={`card-history-${scan.id}`}
                >
                  <div className="flex items-center gap-4">
                    {scan.imageUrl ? (
                      <img
                        src={scan.imageUrl}
                        alt={scan.productName}
                        className="h-16 w-16 rounded-lg object-cover"
                        data-testid={`img-history-${scan.id}`}
                      />
                    ) : (
                      <div className="h-16 w-16 rounded-lg bg-gray-200 flex items-center justify-center">
                        <Package className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold truncate" data-testid={`text-history-name-${scan.id}`}>
                        {scan.productName}
                      </h3>
                      {scan.brand && (
                        <p className="text-sm text-gray-600 truncate">
                          {scan.brand}
                        </p>
                      )}
                      <div className="flex items-center gap-4 mt-1">
                        {scan.calories && (
                          <span className="text-sm font-medium text-green-600">
                            {scan.calories.toFixed(0)} kcal
                          </span>
                        )}
                        <span className="text-xs text-gray-500">
                          {formatDistanceToNow(new Date(scan.scannedAt), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
