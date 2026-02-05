const STORAGE_KEY = "verificationRequests";

const splitName = (fullName: string | undefined) => {
  if (!fullName) {
    return { firstName: "", lastName: "" };
  }
  const [firstName, ...rest] = fullName.split(" ").filter(Boolean);
  return { firstName: firstName || "", lastName: rest.join(" ") };
};

const normalizeRequest = (request: any) => {
  const createdAt = request.createdAt || request.applicationDate || new Date().toISOString();
  const nameParts = splitName(request.studentName);
  const amountPayable = Number(request.amountPayable ?? request.feeAmount ?? 0);
  const totalPaymentReceived = Number(
    request.totalPaymentReceived ?? request.totalPayment ?? amountPayable
  );
  const documentFile = request.documentFile || request.degreeCertificateFile || null;

  return {
    ...request,
    createdAt,
    firstName: request.firstName ?? nameParts.firstName,
    lastName: request.lastName ?? nameParts.lastName,
    studentNumber: request.studentNumber ?? request.studentSapNumber ?? "",
    schoolName: request.schoolName ?? "",
    campusName: request.campusName ?? "",
    programName: request.programName ?? request.program ?? "",
    yearOfPassing: request.yearOfPassing ?? request.passingYear ?? "",
    bankDetails: request.bankDetails ?? "",
    transactionId: request.transactionId ?? "",
    totalPaymentReceived,
    applicationStatus: request.applicationStatus ?? "Pending",
    degreeCertificateFile: request.degreeCertificateFile ?? documentFile,
    marksheetFile: request.marksheetFile ?? null,
    documentFile,
  };
};

export const loadVerificationRequests = () => {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    const normalized = raw.map(normalizeRequest);
    if (JSON.stringify(raw) !== JSON.stringify(normalized)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    }
    return normalized;
  } catch {
    return [];
  }
};

export const saveVerificationRequests = (requests: any[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
};
