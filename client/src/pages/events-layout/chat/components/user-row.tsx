import type { ChatUser } from "@/entities/chat/store";
import { Avatar, AvatarFallback } from "@/shared/ui/avatar";
import { cn } from "@/shared/utils/cn";
import { getInitials } from "../helpers";

type Props = {
  user: ChatUser;
  isActive: boolean;
  isOnline: boolean;
  onSelect: () => void;
};

export function UserRow({ user, isActive, isOnline, onSelect }: Props) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors",
        isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted",
      )}
    >
      <div className="relative">
        <Avatar size="default">
          <AvatarFallback className={cn(isActive && "bg-primary-foreground/15 text-primary-foreground")}>
            {getInitials(user.name)}
          </AvatarFallback>
        </Avatar>
        <span
          className={cn(
            "absolute right-0 bottom-0 size-2.5 rounded-full ring-2",
            isActive ? "ring-primary" : "ring-background",
            isOnline ? "bg-emerald-500" : "bg-muted-foreground/40",
          )}
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{user.name}</p>
        <p
          className={cn(
            "truncate text-xs",
            isActive ? "text-primary-foreground/70" : "text-muted-foreground",
          )}
        >
          {user.email}
        </p>
      </div>
    </button>
  );
}
