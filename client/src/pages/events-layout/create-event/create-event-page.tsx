import {
  getEventsQueryKey,
  getMeQueryKey,
  postEventsMutation
} from "@/shared/api/@tanstack/react-query.gen";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { type SubmitEvent } from "react";
import { EventForm } from "../components/event-form/event-form";

export function CreateEventPage() {
  const router = useRouter();
  const mutation = useMutation(postEventsMutation({ credentials: "include" }));
  const queryClient = useQueryClient();

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const body = {
      title: String(formData.get("title") ?? "").trim(),
      description: String(formData.get("description") ?? "").trim(),
      address: String(formData.get("address") ?? "").trim(),
      startsAt: formData.get("startedAt"),
      capacity: Number(formData.get("capacity")),
    };

    mutation.mutate(
      { body },
      {
        onSuccess: (data) => {
          queryClient.invalidateQueries({ queryKey: getEventsQueryKey() });
          queryClient.invalidateQueries({ queryKey: getMeQueryKey() });
          router.navigate({ to: "/events/$id", params: { id: data.id } });
        },
      },
    );
  };

  return <EventForm handleSubmit={handleSubmit} isPending={mutation.isPending} formType="create" />;
}
