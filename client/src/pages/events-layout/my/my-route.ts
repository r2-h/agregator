import { createRoute, lazyRouteComponent } from "@tanstack/react-router";
import { eventsLayoutRoute } from "../events-layout-route";

export const myRoute = createRoute({
  getParentRoute: () => eventsLayoutRoute,
  path: "/my",
  component: lazyRouteComponent(() => import("./my-page"), "MyPage"),
});
