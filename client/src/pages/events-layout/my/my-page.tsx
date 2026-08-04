import { useQuery } from "@tanstack/react-query";
import { getMeOptions } from "@/shared/api/@tanstack/react-query.gen";
import { EventsList } from "../components/events-list";

export function MyPage() {
  const { data, isLoading } = useQuery(getMeOptions());

  return (
    <>
      <EventsList data={data} isLoading={isLoading} />
    </>
  );
}
