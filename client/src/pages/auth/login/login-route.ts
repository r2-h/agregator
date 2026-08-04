import { createRoute, redirect } from "@tanstack/react-router";
import { rootRoute } from "@/app/router";
import { authStore } from "@/app/store";
import { LoginPage } from "./LoginPage";

export const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
  beforeLoad: () => {
    if (authStore.getState().accessToken) throw redirect({ to: "/" });
  },
});
