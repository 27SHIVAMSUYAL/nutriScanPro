import { useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, AlertCircle, Package, Camera } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

type ProductNutrients = {
  energy_100g?: number;
  fat_100g?: number;
  saturated_fat_100g?: number;
  carbohydrates_100g?: number;
  sugars_100g?: number;
  proteins_100g?: number;
  fiber_100g?: number;
  salt_100g?: number;
  sodium_100g?: number;
};

type Product = {
  code: string;
  product_name?: string;
  brands?: string;
  image_url?: string;
  categories?: string;
  nutriments?: ProductNutrients;
  serving_size?: string;
  quantity?: string;
};

type OpenFoodFactsResponse = {
  status: number;
  product?: Product;
  status_verbose?: string;
};
export default function ProductPage() {
  const [, params] = useRoute("/product/:barcode");
  const [, setLocation] = useLocation();
  const barcode = params?.barcode || "";

  const { data, isLoading, error } = useQuery<OpenFoodFactsResponse>({
    queryKey: ["openfoodfacts", barcode],
    enabled: !!barcode,
    queryFn: async () => {
      const res = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
      if (!res.ok) throw new Error("Product not found");
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto p-4 py-8 space-y-6">
          <Skeleton className="h-10 w-32" />
          <Card className="p-6 space-y-6">
            <div className="flex gap-6">
              <Skeleton className="h-32 w-32 rounded-lg" />
              <div className="space-y-3 flex-1">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-5 w-1/2" />
                <Skeleton className="h-6 w-24" />
              </div>
            </div>
            <div className="space-y-4">
              <Skeleton className="h-6 w-40" />
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Skeleton key={i} className="h-16" />
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !data || data.status === 0 || !data.product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="p-8 max-w-md w-full text-center space-y-4">
          <AlertCircle className="h-16 w-16 mx-auto text-red-500" />
          <h2 className="text-2xl font-bold">Product Not Found</h2>
          <p className="text-gray-600">
            We couldn't find nutritional information for this product. Try scanning another barcode.
          </p>
          <div className="flex gap-3 justify-center pt-2">
            <Button
              onClick={() => setLocation("/scanner")}
              className="bg-green-600 hover:bg-green-700"
              data-testid="button-scan-again"
            >
              Scan Again
            </Button>
            <Button
              variant="outline"
              onClick={() => setLocation("/")}
              data-testid="button-go-home"
            >
              Go Home
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const product = data.product;
  const nutrients = product.nutriments || {};

  const formatValue = (value: number | undefined, unit: string = "g") => {
    if (value === undefined || value === null) return "N/A";
    return `${value.toFixed(1)}${unit}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4 py-8 space-y-6">
        <Button
          variant="ghost"
          onClick={() => setLocation("/")}
          className="gap-2"
          data-testid="button-back"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Button>

        <Card className="p-6 space-y-6" data-testid="card-product">
          {/* Product Header */}
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex justify-center lg:justify-start">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.product_name || "Product"}
                  className="w-40 h-40 rounded-lg object-cover border"
                  data-testid="img-product"
                />
              ) : (
                <div className="w-40 h-40 rounded-lg bg-gray-200 flex items-center justify-center border">
                  <Package className="h-12 w-12 text-gray-400" />
                </div>
              )}
            </div>

            <div className="flex-1 space-y-3">
              <h1 className="text-3xl font-bold text-gray-900" data-testid="text-product-name">
                {product.product_name || "Unknown Product"}
              </h1>
              
              {product.brands && (
                <p className="text-lg text-gray-600" data-testid="text-brand">
                  {product.brands}
                </p>
              )}
              
              {product.categories && (
                <div className="flex flex-wrap gap-2">
                  {product.categories
                    .split(",")
                    .slice(0, 3)
                    .map((cat, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {cat.trim()}
                      </Badge>
                    ))}
                </div>
              )}

              {product.serving_size && (
                <p className="text-sm text-gray-600">
                  Serving size: {product.serving_size}
                </p>
              )}
            </div>
          </div>

          {/* Nutrition Facts */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold" data-testid="text-nutrition-header">
              Nutrition Facts (Per 100g)
            </h2>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="text-sm font-medium text-gray-600 mb-1">
                  Calories
                </div>
                <div className="text-2xl font-bold text-green-600" data-testid="text-calories">
                  {formatValue(nutrients.energy_100g, " kcal")}
                </div>
              </div>

              <div className="bg-gray-50 border rounded-lg p-4">
                <div className="text-sm font-medium text-gray-600 mb-1">
                  Proteins
                </div>
                <div className="text-xl font-bold" data-testid="text-proteins">
                  {formatValue(nutrients.proteins_100g)}
                </div>
              </div>

              <div className="bg-gray-50 border rounded-lg p-4">
                <div className="text-sm font-medium text-gray-600 mb-1">
                  Total Fat
                </div>
                <div className="text-xl font-bold" data-testid="text-fats">
                  {formatValue(nutrients.fat_100g)}
                </div>
              </div>

              <div className="bg-gray-50 border rounded-lg p-4">
                <div className="text-sm font-medium text-gray-600 mb-1">
                  Saturated Fat
                </div>
                <div className="text-lg font-bold" data-testid="text-saturated-fats">
                  {formatValue(nutrients.saturated_fat_100g)}
                </div>
              </div>

              <div className="bg-gray-50 border rounded-lg p-4">
                <div className="text-sm font-medium text-gray-600 mb-1">
                  Carbohydrates
                </div>
                <div className="text-xl font-bold" data-testid="text-carbs">
                  {formatValue(nutrients.carbohydrates_100g)}
                </div>
              </div>

              <div className="bg-gray-50 border rounded-lg p-4">
                <div className="text-sm font-medium text-gray-600 mb-1">
                  Sugars
                </div>
                <div className="text-lg font-bold" data-testid="text-sugars">
                  {formatValue(nutrients.sugars_100g)}
                </div>
              </div>

              <div className="bg-gray-50 border rounded-lg p-4">
                <div className="text-sm font-medium text-gray-600 mb-1">
                  Fiber
                </div>
                <div className="text-lg font-bold" data-testid="text-fiber">
                  {formatValue(nutrients.fiber_100g)}
                </div>
              </div>

              <div className="bg-gray-50 border rounded-lg p-4">
                <div className="text-sm font-medium text-gray-600 mb-1">
                  Salt
                </div>
                <div className="text-lg font-bold" data-testid="text-salt">
                  {formatValue(nutrients.salt_100g)}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              onClick={() => setLocation("/scanner")}
              className="flex-1 bg-green-600 hover:bg-green-700 gap-2"
              data-testid="button-scan-another"
            >
              <Camera className="h-4 w-4" />
              Scan Another
            </Button>
            <Button
              variant="outline"
              onClick={() => setLocation("/")}
              className="flex-1"
              data-testid="button-view-history"
            >
              View History
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
