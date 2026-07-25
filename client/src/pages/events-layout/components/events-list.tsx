import type { GetEventsResponse } from "@/shared/api";
import { EventsCard } from "./events-card";

type Props = { data?: GetEventsResponse; isLoading?: boolean };

export function EventsList({ isLoading, data }: Props) {
  return (
    <>
      <ul className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading && "Loading..."}
        {data &&
          data.map((event) => (
            <li key={event.id}>
              <EventsCard event={event} />
            </li>
          ))}
      </ul>
    </>
  );
}
