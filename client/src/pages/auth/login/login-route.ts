import { rootRoute } from "@/app/router";
import { createRoute, redirect } from "@tanstack/react-router";
import { LoginPage } from "./LoginPage";
import { authStore } from "@/app/store";

export const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
  beforeLoad: () => {
    if (authStore.getState().accessToken) throw redirect({ to: "/" });
  },
});
