import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "@/shared/ui/toast";
import "./index.css";
import { TooltipProvider } from "@/shared/ui/tooltip";
import { authRefresh, clientInterceptors } from "./bootstrap";
import { router } from "./router";

const queryClient = new QueryClient({ defaultOptions: { queries: { staleTime: 3 * 60 * 1000 } } });

async function init() {
  clientInterceptors();
  await authRefresh();

  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <RouterProvider router={router} />
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </StrictMode>,
  );
}

init();
