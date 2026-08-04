import { createRoute, lazyRouteComponent } from "@tanstack/react-router";
import { rootRoute } from "@/app/router";

export const mainRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: lazyRouteComponent(() => import("./main-page"), "MainPage"),
});
