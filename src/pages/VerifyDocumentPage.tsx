import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import PortalHeader from "@/components/PortalHeader";
import PortalFooter from "@/components/PortalFooter";
import { verificationRequests } from "@/lib/mockDb";
import { calculateFee } from "@/lib/feeCalculator";
import { nanoid } from "nanoid";
import { syncRequests } from "@/lib/mockDb";

const VerifyDocumentPage = () => {
  const navigate = useNavigate();

  const [studentName, setStudentName] = useState("");
  const [studentNumber, setStudentNumber] = useState("");
  const [year, setYear] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [requestType] = useState<"REGULAR" | "URGENT">("REGULAR");
  const [role, setRole] =
    useState<"STUDENT" | "GOVT" | "THIRD_PARTY">("STUDENT");

  const handleSubmit = async () => {
    if (!studentName || !studentNumber || !year) {
      toast({
        title: "Missing Information",
        description: "Please fill all required fields.",
        variant: "destructive",
      });
      return;
    }

    const fee = calculateFee(Number(year), requestType, role);

    // Read files to data URLs so admin can open them (stored in localStorage)
    const readFileAsDataUrl = (file: File): Promise<string> =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = (err) => reject(err);
        reader.readAsDataURL(file);
      });

    const attachmentsPayload = await Promise.all(
      attachments.map(async (f) => ({
        name: f.name,
        type: f.type,
        dataUrl: await readFileAsDataUrl(f),
      }))
    );

    const request = {
      id: nanoid(),
      studentName,
      studentNumber,
      role,
      yearOfPassing: year,
      requestType,
      feeAmount: fee,
  attachments: attachmentsPayload,
      paymentStatus:
        role === "GOVT" ? "PAID_APPROVED" : "PAYMENT_PENDING",
      verificationStatus: "OPEN",
      createdAt: new Date().toISOString(),
    } as const;

    verificationRequests.push(request as any);
    syncRequests();

    toast({
      title: "Application Submitted",
      description:
        "Your application has been submitted. Acknowledgement generated.",
    });

    // 📌 As per PDF: first acknowledgement, NOT direct payment
    navigate("/verification-success");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PortalHeader />

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-8">
        <p className="breadcrumb">
          Home → Education Verification → Application Form
        </p>

        <h2 className="page-title">
          Education Verification Application
        </h2>

        <div className="form-section">
          <label className="form-label">Student Name *</label>
          <input
            className="form-input"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
          />

          <label className="form-label mt-4">
            Student Number / PRN *
          </label>
          <input
            className="form-input"
            value={studentNumber}
            onChange={(e) => setStudentNumber(e.target.value)}
          />

          <label className="form-label mt-4">
            Year of Passing *
          </label>
          <input
            className="form-input"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />

          <label className="form-label mt-4">
            Requester Type *
          </label>
          <select
            className="form-select"
            value={role}
            onChange={(e) =>
              setRole(e.target.value as "STUDENT" | "GOVT" | "THIRD_PARTY")
            }
          >
            <option value="STUDENT">Student / Alumni</option>
            <option value="THIRD_PARTY">Third Party (Employer / Agency)</option>
            <option value="GOVT">Government Department</option>
          </select>

          {/* UPLOAD: Degree / Marksheet */}
          <label className="form-label mt-4">Upload Degree / Marksheet</label>
          <input
            type="file"
            accept="application/pdf,image/*"
            multiple
            className="form-input"
            onChange={(e) => {
              const files = e.target.files ? Array.from(e.target.files) : [];
              setAttachments(files);
            }}
          />

          {attachments.length > 0 && (
            <div className="mt-2 text-sm text-muted-foreground">
              <p className="font-medium">Selected files:</p>
              <ul className="list-disc ml-5 mt-1">
                {attachments.map((f, idx) => (
                  <li key={idx}>{f.name}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="note-box mt-6">
            Verification fees are applicable based on the nature of request and
            year of passing. Payment (if applicable) will be collected after
            application submission.
          </div>

          <button
            onClick={handleSubmit}
            className="btn-primary mt-6"
          >
            Submit Application
          </button>
        </div>
      </main>

      <PortalFooter />
    </div>
  );
};

export default VerifyDocumentPage;
