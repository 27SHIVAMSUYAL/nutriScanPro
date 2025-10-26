import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import Scanner from "@/pages/scanner";
import ProductPage from "@/pages/product";
import NotFound from "@/pages/not-found";
import BMIPage from "@/pages/bmi";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/scanner" component={Scanner} />
          <Route path="/product/:barcode" component={ProductPage} />
          <Route path="/bmi" component={BMIPage} />
          <Route component={NotFound} />
        </Switch>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
