import type { PatchEventsByIdData, PostEventsData } from "@/shared/api";
import { useState } from "react";

export type DirtyEventFields = {
  [Key in keyof PostEventsData["body"]]: boolean;
};

export function useDirtyValues(defaultValues: PatchEventsByIdData["body"]) {
  const [dirtyFields, setDirtyFields] = useState<DirtyEventFields>({
    address: false,
    capacity: false,
    description: false,
    startsAt: false,
    title: false,
  });

  const handleDirty = (key: keyof DirtyEventFields, value: unknown) => {
    setDirtyFields({ ...dirtyFields, [key]: value !== defaultValues[key] });
  };

  const isDirty = Object.values(dirtyFields).some((el) => el === true);

  return { isDirty, handleDirty };
}
