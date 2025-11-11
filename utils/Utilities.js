export const convertTime = (isoTime) => {
  const date = new Date(isoTime);
  const options = {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  };

  return date.toLocaleDateString(undefined, options);
};


