export function formatTime(time: Date | string | undefined, prefix = ""): string {
  if (time instanceof Date) {
    return prefix + time.toLocaleDateString();
  } else if (typeof time === "string") {
    return prefix + new Date(time).toLocaleDateString();
  }
  return "";
}

