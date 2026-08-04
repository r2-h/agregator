export function formatDate(ISOstring: string | null, type: "short" | "long" = "short") {
  if (!ISOstring) return "";

  switch (type) {
    case "short":
      return new Date(ISOstring).toLocaleString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    case "long":
      return new Date(ISOstring).toLocaleString("ru-RU", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
  }
}
