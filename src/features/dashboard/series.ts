/**
 * Chart series colors. Each entity keeps its color everywhere (monthly is always
 * blue). Blue is the brand `--color-blue-700`; the orange is a darker step than
 * `--color-orange-500` so it holds 3:1 against the white surface. The pair passes
 * the dataviz palette validator (CVD ΔE ≥ 31, normal ΔE 36.8).
 */
export const SERIES = {
  users: { label: "Users", color: "var(--color-blue-700)" },
  monthly: { label: "Monthly", color: "var(--color-blue-700)" },
  yearly: { label: "Yearly", color: "#d9620f" },
} as const;
