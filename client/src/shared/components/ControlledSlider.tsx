import type { DirtyEventFields } from "@/pages/events-layout/components/event-form/use-dirty-values";
import { useState } from "react";
import { Slider } from "../ui/slider";

type Props = {
  isPending: boolean;
  defaultValue: number | undefined;
  handleDirty: (key: keyof DirtyEventFields, value: unknown) => void;
};

export function ControlledSlider({ isPending, defaultValue, handleDirty }: Props) {
  const [capacity, setCapacity] = useState(defaultValue ?? 1);

  return (
    <>
      <span className="text-sm text-muted-foreground tabular-nums">{capacity}</span>
      <Slider
        value={capacity}
        onValueChange={(value) => {
          setCapacity(Array.isArray(value) ? value[0] : value);
          handleDirty("capacity", value);
        }}
        min={1}
        max={300}
        step={1}
        disabled={isPending}
      />
      <input type="hidden" name="capacity" value={capacity} />
    </>
  );
}
