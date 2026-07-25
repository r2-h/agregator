import { getMeJoinedOptions } from "@/shared/api/@tanstack/react-query.gen";
import { useQuery } from "@tanstack/react-query";
import { EventsList } from "../components/events-list";

export function JoinedPage() {
  const { data, isLoading } = useQuery(getMeJoinedOptions());

  return (
    <>
      <EventsList
        data={data?.map((obj) => ({ ...obj.event, joinedAt: obj.joinedAt }))}
        isLoading={isLoading}
      />
    </>
  );
}
