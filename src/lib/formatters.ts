export function formatCPF(value: string) {
  const numericValue = value.replace(/\D/g, "");
  return numericValue
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{2})$/, "$1-$2");
}

export function formatPhone(value: string): string {
  const numericValue = value.replace(/\D/g, "");

  if (numericValue.length <= 2) return numericValue;
  if (numericValue.length <= 7)
    return `(${numericValue.slice(0, 2)}) ${numericValue.slice(2)}`;
  if (numericValue.length <= 10)
    return `(${numericValue.slice(0, 2)}) ${numericValue.slice(
      2,
      7
    )}-${numericValue.slice(7)}`;

  return `(${numericValue.slice(0, 2)}) ${numericValue.slice(
    2,
    7
  )}-${numericValue.slice(7, 11)}`;
}

export function formatToReal(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}
