import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { authStore } from "@/app/store";
import type { GetEventsByIdResponse } from "@/shared/api";
import { deleteEventsByIdMutation, getEventsOptions } from "@/shared/api/@tanstack/react-query.gen";
import { Button } from "@/shared/ui/button";
import { CardFooter } from "@/shared/ui/card";
import { JoinEvent } from "./join-event";

type Props = { event: GetEventsByIdResponse };

export function Footer({ event }: Props) {
  const isOwner = event?.ownerId === authStore.useStore((state) => state.user?.id);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const mutation = useMutation(deleteEventsByIdMutation());

  const onRemove = () =>
    mutation.mutate(
      { path: { id: event.id } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getEventsOptions().queryKey });
          navigate({ to: "/events" });
        },
      },
    );

  return (
    <CardFooter className="flex flex-wrap gap-2 border-t">
      {isOwner ? (
        <>
          <p className="mr-auto text-sm text-muted-foreground">Вы организатор</p>
          <Button
            variant="outline"
            nativeButton={false}
            size="sm"
            render={
              <Link to="/events/$id/edit" params={{ id: event.id }}>
                Редактировать
              </Link>
            }
          />

          <Button variant="destructive" size="sm" disabled={mutation.isPending} onClick={onRemove}>
            Удалить
          </Button>
        </>
      ) : (
        <JoinEvent eventId={event.id} />
      )}
    </CardFooter>
  );
}
