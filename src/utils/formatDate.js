export const formatDate = (dateString) => {
  const options = { year: "numeric", month: "short", day: "numeric" }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}
