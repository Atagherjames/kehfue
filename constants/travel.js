 /* ------------------------------ RE-USE HELPERS ------------------------------ */
export const formatTime = (dateTime) => {
  const date = new Date(dateTime);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

export const formatDuration = (minutes) => {
  const totalMinutes = parseInt(minutes, 10);
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
};

export const formatPrice = (amount) => `₦${Number(amount).toFixed(2).replace(/\.00$/, "")}`;
export const formatPointsPrice = (amount) => `${formatPrice(amount)}`;

export function formatCurrency(amount, currency = "NGN", locale = "en-NG") {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(amount)); 
}
