import type { PostEventsData } from "@/shared/api";
import { getEventsByIdOptions, patchEventsByIdMutation } from "@/shared/api/@tanstack/react-query.gen";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { type SubmitEvent } from "react";
import { EventForm } from "../components/event-form/event-form";
import { updateEventRoute } from "./update-event-route";

export function UpdateEventPage() {
  const router = useRouter();
  const { id } = updateEventRoute.useParams();
  const { data: responseEvent } = useQuery(getEventsByIdOptions({ path: { id } }));

  const mutation = useMutation(patchEventsByIdMutation({ credentials: "include" }));

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const body = {
      title: String(formData.get("title") ?? "").trim(),
      description: String(formData.get("description") ?? "").trim(),
      address: String(formData.get("address") ?? "").trim(),
      startsAt: formData.get("startsAt"),
      capacity: Number(formData.get("capacity")),
    } satisfies PostEventsData["body"];

    mutation.mutate(
      { body, path: { id } },
      { onSuccess: (data) => router.navigate({ to: "/events/$id", params: { id: data.id } }) },
    );
  };

  return (
    <EventForm
      handleSubmit={handleSubmit}
      isPending={mutation.isPending}
      formType="update"
      responseEvent={responseEvent}
    />
  );
}
