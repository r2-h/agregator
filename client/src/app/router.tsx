import { loginRoute } from "@/pages/auth/login/login-route";
import { registerRoute } from "@/pages/auth/register/register-route";
import { chatRoute } from "@/pages/events-layout/chat/chat-route";
import { createNewRoute } from "@/pages/events-layout/create-event/create-event-route";
import { eventRoute } from "@/pages/events-layout/event/event-route";
import { eventsLayoutRoute } from "@/pages/events-layout/events-layout-route";
import { eventsRoute } from "@/pages/events-layout/events/events-route";
import { joinedRoute } from "@/pages/events-layout/joined/joined-route";
import { myRoute } from "@/pages/events-layout/my/my-route";
import { updateEventRoute } from "@/pages/events-layout/update-event/update-event-route";
import { mainRoute } from "@/pages/main/main-route";
import {
  createRootRoute,
  createRoute,
  createRouter,
  Link,
  Outlet,
  redirect,
} from "@tanstack/react-router";
import { authStore } from "./store";

export const rootRoute = createRootRoute({
  component: () => (
    <>
      <div className="p-2 gap-2 w-full flex fixed top-0 justify-center z-1 pointer-events-none">
        <Link to="/" className="[&.active]:font-bold pointer-events-auto">
          Home
        </Link>
        <Link to="/login" className="[&.active]:font-bold pointer-events-auto">
          Login
        </Link>
        <Link to="/register" className="[&.active]:font-bold pointer-events-auto">
          Register
        </Link>
        <Link to="/events" className="[&.active]:font-bold pointer-events-auto">
          Events
        </Link>
      </div>

      <Outlet />
    </>
  ),
});

export const protectedRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "protected",
  beforeLoad: () => {
    if (!authStore.getState().accessToken) throw redirect({ to: "/login" });
  },
});

const routeTree = rootRoute.addChildren([
  mainRoute,
  loginRoute,
  registerRoute,
  protectedRoute.addChildren([
    eventsLayoutRoute.addChildren([
      myRoute,
      joinedRoute,
      createNewRoute,
      eventsRoute,
      eventRoute,
      updateEventRoute,
      chatRoute,
    ]),
  ]),
]);

export const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  scrollRestoration: true,
  defaultNotFoundComponent: () => <p>Not Found</p>,
});
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }

  // interface HistoryState {
  //   //  типизация данных передаваемых в роутер при навигации от одной странице к другой
  //   event?: GetEventsResponse[number];
  // }
}
