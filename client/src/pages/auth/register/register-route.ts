import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "@/app/router";
import { RegisterPage } from "./RegisterPage";

export const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/register",
  component: RegisterPage,
});
