import { rootRoute } from "@/app/router";
import { createRoute } from "@tanstack/react-router";
import { RegisterPage } from "./RegisterPage";

export const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/register",
  component: RegisterPage,
});
