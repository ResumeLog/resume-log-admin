const dateFormat = new Intl.DateTimeFormat("en", { dateStyle: "medium" });

/** "Nov 21, 2026", in the viewer's time zone. */
export function formatDate(iso: string): string {
  return dateFormat.format(new Date(iso));
}
