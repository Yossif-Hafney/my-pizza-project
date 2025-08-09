const intl = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export default function useCurrency(value) {
  return intl.format(value);
}
export function priceConvertor(value) {
  return intl.format(value);
}
