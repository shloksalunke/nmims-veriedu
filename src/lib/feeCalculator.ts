export function calculateFee(
  yearOfPassing: number,
  requestType: "REGULAR" | "URGENT",
  role: "STUDENT" | "THIRD_PARTY" | "GOVT"
) {
  if (role === "GOVT") return 0;

  const currentYear = new Date().getFullYear();
  const diff = currentYear - yearOfPassing;

  if (requestType === "URGENT") return 8260;

  if (diff <= 3) return 2360;
  if (diff <= 5) return 3540;
  if (diff <= 10) return 4720;
  return 5900;
}
