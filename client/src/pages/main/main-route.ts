import { rootRoute } from "@/app/router";
import { createRoute, lazyRouteComponent } from "@tanstack/react-router";

export const mainRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: lazyRouteComponent(() => import("./main-page"), "MainPage"),
});
