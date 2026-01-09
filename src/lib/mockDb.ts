export interface VerificationRequest {
  id: string;
  studentName: string;
  studentNumber: string;
  role: string;
  yearOfPassing: string;
  requestType: string;
  feeAmount: number;
  attachments?: Attachment[];
  paymentStatus: string;
  verificationStatus: string;
  createdAt: string;
}

export interface Attachment {
  name: string;
  type: string;
  // dataUrl contains the file as a base64 data URL (used for in-browser demo storage)
  dataUrl: string;
}

const STORAGE_KEY = "VERIFICATION_REQUESTS";

/* =========================
   LOAD FROM STORAGE
========================= */
const loadRequests = (): VerificationRequest[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

/* =========================
   SAVE TO STORAGE
========================= */
const saveRequests = (data: VerificationRequest[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

/* =========================
   IN-MEMORY STATE
========================= */
export const verificationRequests: VerificationRequest[] = loadRequests();

/* =========================
   SYNC HELPER (MANDATORY)
========================= */
export const syncRequests = () => {
  saveRequests(verificationRequests);
};

/* =========================
   SAFE HELPERS (OPTIONAL BUT RECOMMENDED)
========================= */
export const addRequest = (req: VerificationRequest) => {
  verificationRequests.push(req);
  syncRequests();
};

export const updateRequest = () => {
  syncRequests();
};
