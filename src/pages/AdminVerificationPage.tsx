import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import PortalHeader from "@/components/PortalHeader";
import PortalFooter from "@/components/PortalFooter";
import { verificationRequests, syncRequests } from "@/lib/mockDb";

const AdminVerificationPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const request = verificationRequests.find((r) => r.id === id);

  const [action, setAction] = useState<
    "approved" | "not-approved" | "forward" | null
  >(null);
  const [cgpa, setCgpa] = useState("");
  const [degree, setDegree] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [studyPeriod, setStudyPeriod] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [forwardEmail, setForwardEmail] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  if (!request) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">
          Verification request not found.
        </p>
      </div>
    );
  }

  const paymentBlocked =
    request.role !== "GOVT" && request.paymentStatus !== "PAID_APPROVED";

  const isFinalized = request.verificationStatus === "COMPLETED";

  const handleLogout = () => {
    navigate("/");
  };

  // initialize admin-editable fields from request when available
  useEffect(() => {
    if (!request) return;
    if (!degree) setDegree(request.requestType || "");
    if (!specialization) setSpecialization("");
    if (!studyPeriod) setStudyPeriod("");
    if (!cgpa) setCgpa("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [request]);

  const handleSubmit = () => {
    if (action === "approved") {
      if (!uploadedFile) {
        toast({
          title: "Document Required",
          description:
            "Please upload the signed verification letter before approval.",
          variant: "destructive",
        });
        return;
      }

      request.verificationStatus = "COMPLETED";
      syncRequests();

      toast({
        title: "Verification Completed",
        description:
          "Education Verification Confirmation has been generated and dispatched.",
      });
    }

    if (action === "not-approved") {
      request.verificationStatus = "REJECTED";

      toast({
        title: "Verification Rejected",
        description: "Rejection notification has been sent to the applicant.",
      });
    }

    if (action === "forward") {
      request.verificationStatus = "IN_PROCESS";

      toast({
        title: "Forwarded for Review",
        description: `Request forwarded to ${forwardEmail}`,
      });
    }

    navigate("/admin/dashboard");
  };

  const handlePreview = () => {
    if (!request) return;

    // Prepare letter fields
    const letter = {
      candidateName: request.studentName,
      degree: degree || request.requestType || "",
      studentNumber: request.studentNumber,
      cgpa: cgpa || "",
      passingYear: request.yearOfPassing,
      specialization: specialization || "",
      studyPeriod: studyPeriod || "",
    };

    const logoUrl = window.location.origin + '/nmims-logo.jpeg';

    const html = `
      <!doctype html>
      <html>
      <head>
        <meta charset="utf-8" />
        <title>Education Verification Confirmation</title>
        <style>
          body { font-family: Arial, Helvetica, sans-serif; color: #111827; padding: 40px; }
          .header { display:flex; align-items:center; gap:20px; }
          .logo { width:120px; }
          h1 { text-align:center; font-size:18px; margin:8px 0; }
          table { width:100%; border-collapse: collapse; margin-top:20px; }
          td, th { border:1px solid #111827; padding:8px; text-align:left; }
          .small { font-size:12px; }
          .center { text-align:center; }
          .signature { margin-top:40px; text-align:right; }
        </style>
      </head>
      <body>
          <div class="header">
          <img src="${logoUrl}" class="logo" alt="NMIMS Logo"/>
          <div>
            <div style="font-weight:700;">SVKM'S</div>
            <div style="font-size:20px; font-weight:700;">NMIMS</div>
            <div class="small">Deemed-to-be UNIVERSITY</div>
          </div>
        </div>

        <h1>EDUCATIONAL VERIFICATION CONFIRMATION</h1>

        <table>
          <tr>
            <th style="width:10%">Sr. No.</th>
            <th style="width:45%">Details</th>
            <th style="width:45%">Information / Remarks</th>
          </tr>
          <tr>
            <td class="center">1</td>
            <td>Candidate's Name</td>
            <td>${letter.candidateName}</td>
          </tr>
          <tr>
            <td class="center">2</td>
            <td>Degree / Qualification Obtained</td>
            <td>${letter.degree}</td>
          </tr>
          <tr>
            <td class="center">3</td>
            <td>Student Number</td>
            <td>${letter.studentNumber}</td>
          </tr>
          <tr>
            <td class="center">4</td>
            <td>CGPA</td>
            <td>${letter.cgpa}</td>
          </tr>
          <tr>
            <td class="center">5</td>
            <td>Passing year</td>
            <td>${letter.passingYear}</td>
          </tr>
          <tr>
            <td class="center">6</td>
            <td>Specialization</td>
            <td>${letter.specialization}</td>
          </tr>
          <tr>
            <td class="center">7</td>
            <td>Study period</td>
            <td>${letter.studyPeriod}</td>
          </tr>
        </table>

        <div class="signature">
          <div style="font-weight:700;">Controller of Examinations</div>
          <div class="small">SVKM's Narsee Monjee Institute of Management Studies</div>
        </div>

        <script>
          // auto-focus for print
          window.onload = function() { window.focus(); };
        </script>
      </body>
      </html>
    `;

    // Try to open a new window and navigate it to a blob URL containing the HTML.
    // Blob URL approach is more robust than document.write in some browsers.
    const previewWindow = window.open('', '_blank');
    if (!previewWindow) {
      toast({ title: 'Preview blocked', description: 'Popup blocked by browser. Please allow popups.' });
      return;
    }

    try {
      const blob = new Blob([html], { type: 'text/html' });
      const blobUrl = URL.createObjectURL(blob);
      // Navigate the new window to the blob URL
      previewWindow.location.href = blobUrl;

      // Ensure focus. Some browsers need a short timeout.
      setTimeout(() => {
        try {
          previewWindow.focus();
        } catch {}
        // Revoke the object URL after some time to free memory
        setTimeout(() => URL.revokeObjectURL(blobUrl), 2000);
      }, 50);
    } catch (err) {
      // Fallback to document.write if blob/navigation fails
      try {
        previewWindow.document.open();
        previewWindow.document.write(html);
        previewWindow.document.close();
      } catch (err2) {
        toast({ title: 'Preview failed', description: 'Unable to open preview. Check browser settings.' });
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PortalHeader
        showLogout
        userType="Examination Department"
        onLogout={handleLogout}
      />

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-8">
        <p className="breadcrumb">
          Dashboard → Examination → Verification → {id}
        </p>

        <h2 className="page-title">Education Verification Processing</h2>

        {/* PAYMENT BLOCK */}
        {paymentBlocked && (
          <div className="mb-6 p-4 border border-red-300 bg-red-50 text-red-700 text-sm">
            Verification report cannot be generated.
            <br />
            Payment has not yet been approved by the Accounts Department.
          </div>
        )}

        {/* FINALIZED INFO */}
        {isFinalized && (
          <div className="mb-6 p-4 border border-green-300 bg-green-50 text-green-700 text-sm">
            This verification request has already been completed and closed.
          </div>
        )}

        {/* STUDENT DETAILS */}
        <div className="form-section">
          <h3 className="font-semibold mb-4">Student Details</h3>

          <div className="grid md:grid-cols-2 gap-4">
            <Detail label="Student Name" value={request.studentName} />
            <Detail label="Student Number" value={request.studentNumber} />
            <Detail label="Year of Passing" value={request.yearOfPassing} />
            <Detail label="Request Type" value={request.requestType} />
            <Detail label="Requested By" value={request.role} />

            <div>
              <label className="form-label">CGPA</label>
              <input
                className="form-input"
                value={cgpa}
                onChange={(e) => setCgpa(e.target.value)}
                disabled={isFinalized}
              />
            </div>
            <div>
              <label className="form-label">Degree / Qualification</label>
              <input
                className="form-input"
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                disabled={isFinalized}
              />
            </div>

            <div>
              <label className="form-label">Specialization</label>
              <input
                className="form-input"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                disabled={isFinalized}
              />
            </div>

            <div>
              <label className="form-label">Study Period</label>
              <input
                className="form-input"
                value={studyPeriod}
                onChange={(e) => setStudyPeriod(e.target.value)}
                disabled={isFinalized}
              />
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={handlePreview}
              className="btn-secondary"
              disabled={paymentBlocked}
            >
              Preview Verification Letter
            </button>
          </div>

          {request.attachments && request.attachments.length > 0 && (
            <div className="mt-6">
              <label className="form-label">Submitted Attachments</label>
              <ul className="list-disc ml-5 mt-2">
                {request.attachments.map((att, idx) => (
                  <li key={idx} className="mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-sm">{att.name}</span>
                      <a
                        href={att.dataUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary text-sm hover:underline"
                      >
                        Open
                      </a>
                      <a
                        href={att.dataUrl}
                        download={att.name}
                        className="text-sm text-muted-foreground hover:underline"
                      >
                        Download
                      </a>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* ACTION SECTION */}
        {!isFinalized && (
          <div className="form-section">
            <h3 className="font-semibold mb-4">Verification Action</h3>

            <div className="space-y-3">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  disabled={paymentBlocked}
                  checked={action === "approved"}
                  onChange={() => setAction("approved")}
                />
                <span className="text-sm">
                  Approve & Upload Verification Letter
                </span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={action === "not-approved"}
                  onChange={() => setAction("not-approved")}
                />
                <span className="text-sm">Reject Request</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={action === "forward"}
                  onChange={() => setAction("forward")}
                />
                <span className="text-sm">Forward for Internal Review</span>
              </label>
            </div>

            {action === "approved" && !paymentBlocked && (
              <div className="mt-4 p-4 bg-muted border border-border">
                <label className="form-label">
                  Upload Signed Verification Letter (PDF) *
                </label>
                <input
                  type="file"
                  accept=".pdf"
                  className="form-input"
                  onChange={(e) =>
                    setUploadedFile(e.target.files?.[0] || null)
                  }
                />
              </div>
            )}

            {action === "not-approved" && (
              <div className="mt-4 p-4 bg-muted border border-border">
                <label className="form-label">Rejection Reason *</label>
                <textarea
                  className="form-input min-h-[100px]"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                />
              </div>
            )}

            {action === "forward" && (
              <div className="mt-4 p-4 bg-muted border border-border">
                <label className="form-label">Forward To (Email) *</label>
                <input
                  type="email"
                  className="form-input"
                  value={forwardEmail}
                  onChange={(e) => setForwardEmail(e.target.value)}
                />
              </div>
            )}
          </div>
        )}

        {/* FOOTER ACTIONS */}
        {!isFinalized && (
          <div className="flex gap-4 mt-6">
            <button
              onClick={handleSubmit}
              disabled={
                !action ||
                (action === "approved" && paymentBlocked) ||
                (action === "approved" && !uploadedFile) ||
                (action === "not-approved" && !rejectionReason) ||
                (action === "forward" && !forwardEmail)
              }
              className="btn-primary disabled:opacity-50"
            >
              Submit Decision
            </button>

            <button
              onClick={() => navigate("/admin/dashboard")}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        )}
      </main>

      <PortalFooter />
    </div>
  );
};

const Detail = ({ label, value }: { label: string; value: any }) => (
  <div>
    <label className="form-label">{label}</label>
    <p className="text-sm font-medium">{value}</p>
  </div>
);

export default AdminVerificationPage;
