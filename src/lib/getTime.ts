// Fungsi untuk mendapatkan hours
function getHours(time: string | undefined | null): number {
  if (!time) return 0;
  const [hours] = time.split(":");
  return parseInt(hours, 10) || 0;
}

// Fungsi untuk mendapatkan minutes
function getMinutes(time: string | undefined | null): number {
  if (!time) return 0;
  const [, minutes] = time.split(":");
  return parseInt(minutes, 10) || 0;
}

// Fungsi untuk mendapatkan seconds
function getSeconds(time: string | undefined | null): number {
  if (!time) return 0;
  const [, , seconds] = time.split(":");
  return parseInt(seconds, 10) || 0;
}

export { getHours, getMinutes, getSeconds };
