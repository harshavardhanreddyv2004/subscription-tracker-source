export const formatCurrency = (value, currency = "USD") =>
  new Intl.NumberFormat(currency === "INR" ? "en-IN" : "en-US", {
    style: "currency",
    currency: currency,
    maximumFractionDigits: 2,
    minimumFractionDigits: 0
  }).format(Number(value || 0));

export const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
