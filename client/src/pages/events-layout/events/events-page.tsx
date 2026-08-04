import { useQuery } from "@tanstack/react-query";
import { getEventsOptions } from "@/shared/api/@tanstack/react-query.gen";
import { EventsList } from "../components/events-list";

export function EventsPage() {
  const { data, isLoading } = useQuery(getEventsOptions());

  return (
    <>
      <EventsList data={data} isLoading={isLoading} />
    </>
  );
}
