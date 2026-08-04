import { Link } from "@tanstack/react-router";
import { authStore } from "@/app/store";
import type { GetEventsResponse } from "@/shared/api";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/shared/ui/card";
import { formatDate } from "@/shared/utils/format-date";

export function EventsCard({ event }: { event: GetEventsResponse[number] }) {
  const isOwner = event.ownerId === authStore.useStore((state) => state.user?.id);

  const date = formatDate(event.startsAt);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-base">
          <Link className="hove:text-primary hover:underline" to="/events/$id" params={{ id: event.id }}>
            {event.title}
          </Link>
        </CardTitle>

        <CardDescription>
          <p>{`${date} - ${event.address}`}</p>
          <p>До {event.capacity} чел.</p>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="line-clamp-3 text-muted-foreground">{event.description || "-"}</p>
      </CardContent>

      <CardFooter className="mt-auto justify-between border-t-foreground/10">
        <Button
          type="button"
          variant="outline"
          nativeButton={false}
          size="sm"
          render={
            <Link to="/events/$id" params={{ id: event.id }}>
              Подробнее
            </Link>
          }
        />
        {isOwner && <span>Вы организатор</span>}
        {event.joinedAt && <span>Вы участвуете </span>}
      </CardFooter>
    </Card>
  );
}
