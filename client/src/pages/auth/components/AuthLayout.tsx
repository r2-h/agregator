import type { ReactNode } from "react";
import { Card, CardContent, CardHeader } from "@/shared/ui/card";
import { cn } from "@/shared/utils/cn";

export function AuthLayout({
  children,
  header,
  className,
}: {
  children: ReactNode;
  header: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "bg-background flex min-h-svh w-full flex-col items-center justify-center gap-6 p-6",
        className,
      )}
    >
      <Card className="flex w-full max-w-sm flex-col gap-6">
        <CardHeader>{header}</CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </div>
  );
}
