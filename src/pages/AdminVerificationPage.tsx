import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import PortalHeader from "@/components/PortalHeader";
import PortalFooter from "@/components/PortalFooter";

const AdminVerificationPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [request, setRequest] = useState<any>(null);
  const [action, setAction] = useState<"approved" | "not-approved" | "forward" | null>(null);
  const [forwardEmails, setForwardEmails] = useState<string>("");
  const [rejectionReason, setRejectionReason] = useState<string>("");

  useEffect(() => {
    // Load from localStorage
    const allRequests = JSON.parse(localStorage.getItem("verificationRequests") || "[]");
    const foundRequest = allRequests.find((r: any) => r.id === id);
    setRequest(foundRequest);
  }, [id]);

  const handleLogout = () => {
    navigate("/");
  };

  // Generate verification confirmation document
  const generateConfirmationDocument = (req: any, approved: boolean, reason?: string) => {
    const docDate = new Date().toLocaleDateString("en-IN");
    const currentYear = new Date().getFullYear();

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>${approved ? "Verification Confirmation" : "Verification Rejection"}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            color: #333;
            padding: 40px;
            line-height: 1.6;
          }
          .container {
            max-width: 800px;
            margin: 0 auto;
            border: 1px solid #ccc;
            padding: 30px;
          }
          .header {
            text-align: center;
            border-bottom: 2px solid #333;
            margin-bottom: 30px;
            padding-bottom: 20px;
          }
          .header-logo {
            font-size: 28px;
            font-weight: bold;
            color: #d32f2f;
          }
          .header-subtitle {
            font-size: 14px;
            color: #666;
            margin-top: 5px;
          }
          .doc-title {
            text-align: center;
            font-size: 18px;
            font-weight: bold;
            margin: 20px 0;
            color: ${approved ? "#28a745" : "#dc3545"};
          }
          .doc-ref {
            text-align: right;
            font-size: 11px;
            color: #666;
            margin-bottom: 15px;
          }
          .details-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
          }
          .details-table td {
            border: 1px solid #ccc;
            padding: 12px;
            font-size: 14px;
          }
          .details-table td:first-child {
            background-color: #f5f5f5;
            font-weight: bold;
            width: 35%;
          }
          .status-section {
            margin: 30px 0;
            padding: 15px;
            background-color: ${approved ? "#d4edda" : "#f8d7da"};
            border-left: 4px solid ${approved ? "#28a745" : "#dc3545"};
          }
          .status-title {
            font-weight: bold;
            color: ${approved ? "#28a745" : "#dc3545"};
            font-size: 16px;
            margin-bottom: 10px;
          }
          .status-text {
            font-size: 14px;
            color: #333;
          }
          .signature-section {
            margin-top: 40px;
            display: flex;
            justify-content: space-between;
          }
          .signature-block {
            text-align: center;
            width: 45%;
          }
          .sig-line {
            border-top: 1px solid #333;
            margin-top: 50px;
            padding-top: 5px;
          }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #ccc;
            text-align: center;
            font-size: 11px;
            color: #666;
          }
          .footer-text {
            margin: 3px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="header-logo">SVKM'S NMIMS UNIVERSITY</div>
            <div class="header-subtitle">Education Verification Department</div>
          </div>

          <div class="doc-ref">Document Ref: ${req.id.substring(0, 8).toUpperCase()}-${currentYear}</div>

          <div class="doc-title">
            ${approved ? "✓ EDUCATIONAL VERIFICATION CONFIRMATION" : "✗ VERIFICATION REQUEST - REJECTION"}
          </div>

          <table class="details-table">
            <tr>
              <td>Candidate's Name</td>
              <td>${req.firstName} ${req.lastName}</td>
            </tr>
            <tr>
              <td>Degree / Qualification Obtained</td>
              <td>${req.programName}</td>
            </tr>
            <tr>
              <td>Student Number</td>
              <td>${req.studentNumber}</td>
            </tr>
            <tr>
              <td>CGPA</td>
              <td>${req.cgpa}</td>
            </tr>
            <tr>
              <td>Passing Year</td>
              <td>${req.yearOfPassing}</td>
            </tr>
            <tr>
              <td>Specialization / Stream</td>
              <td>${req.stream}</td>
            </tr>
            <tr>
              <td>Study Period</td>
              <td>${req.semester} Semester</td>
            </tr>
          </table>

          <div class="status-section">
            <div class="status-title">
              ${approved ? "✓ VERIFICATION STATUS: APPROVED" : "✗ VERIFICATION STATUS: REJECTED"}
            </div>
            <div class="status-text">
              ${
                approved
                  ? "This is to certify that the educational qualification and academic record of the above mentioned candidate have been verified and confirmed as authentic."
                  : `Reason for Rejection: ${reason || "Does not meet verification criteria"}`
              }
            </div>
          </div>

          <div class="signature-section">
            <div class="signature-block">
              <div class="sig-line">
                <strong>Signature</strong><br>
                <small>Verification Officer</small><br>
                <small>Date: ${docDate}</small>
              </div>
            </div>
            <div class="signature-block">
              <div class="sig-line">
                <strong>Stamp & Seal</strong><br>
                <small>NMIMS University</small><br>
                <small>Date: ${docDate}</small>
              </div>
            </div>
          </div>

          <div class="footer">
            <div class="footer-text"><strong>SVKM's Narsee Monjee Institute of Management Studies</strong></div>
            <div class="footer-text">Deemed to be UNIVERSITY</div>
            <div class="footer-text">V.L. Mehta Road, Vile Parle (W), Mumbai - 400 056, India</div>
            <div class="footer-text">Tel: (91-22) 42355555 | Fax: (91-22) 26114512 | Email: enquiry@nmims.edu</div>
          </div>
        </div>
      </body>
      </html>
    `;

    return html;
  };

  // Convert HTML to data URL
  const htmlToDataUrl = (html: string): Promise<string> => {
    return new Promise((resolve) => {
      const blob = new Blob([html], { type: "text/html" });
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.readAsDataURL(blob);
    });
  };

  const handleSubmit = async () => {
    if (!request) return;

    if (!action) {
      toast({
        title: "Missing Action",
        description: "Please select an action.",
        variant: "destructive",
      });
      return;
    }

    // Update the request status
    const allRequests = JSON.parse(localStorage.getItem("verificationRequests") || "[]");
    const index = allRequests.findIndex((r: any) => r.id === id);

    if (index !== -1) {
      if (action === "approved") {
        // Generate confirmation document automatically
        const confirmationHtml = generateConfirmationDocument(request, true);
        
        const reader = new FileReader();
        const blob = new Blob([confirmationHtml], { type: "text/html" });
        reader.onload = () => {
          allRequests[index].status = "COMPLETED";
          allRequests[index].approvedDocument = {
            name: `Verification_Confirmation_${request.studentNumber}.html`,
            dataUrl: reader.result,
          };
          allRequests[index].verificationDate = new Date().toISOString();
          localStorage.setItem("verificationRequests", JSON.stringify(allRequests));

          toast({
            title: "✓ Verification Approved",
            description: `Confirmation document generated! Email sent to ${request.receiverEmail}`,
          });

          navigate("/admin/dashboard");
        };
        reader.readAsDataURL(blob);
      } else if (action === "not-approved") {
        // Check if rejection reason provided
        if (!rejectionReason.trim()) {
          toast({
            title: "Missing Rejection Reason",
            description: "Please provide a reason for rejection.",
            variant: "destructive",
          });
          return;
        }

        // Generate rejection document automatically
        const rejectionHtml = generateConfirmationDocument(request, false, rejectionReason);
        
        const reader = new FileReader();
        const blob = new Blob([rejectionHtml], { type: "text/html" });
        reader.onload = () => {
          allRequests[index].status = "REJECTED";
          allRequests[index].rejectionDocument = {
            name: `Verification_Rejection_${request.studentNumber}.html`,
            dataUrl: reader.result,
          };
          allRequests[index].rejectionReason = rejectionReason;
          allRequests[index].rejectionDate = new Date().toISOString();
          localStorage.setItem("verificationRequests", JSON.stringify(allRequests));

          toast({
            title: "✗ Verification Rejected",
            description: `Rejection document generated! Email sent to ${request.receiverEmail}`,
          });

          navigate("/admin/dashboard");
        };
        reader.readAsDataURL(blob);
      } else if (action === "forward") {
        // Validate forward emails
        if (!forwardEmails.trim()) {
          toast({
            title: "Missing Reviewer Emails",
            description: "Please enter at least one email address to forward the request.",
            variant: "destructive",
          });
          return;
        }

        // Parse emails
        const emailList = forwardEmails
          .split(";")
          .map((email) => email.trim())
          .filter((email) => email.length > 0);

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const invalidEmails = emailList.filter((email) => !emailRegex.test(email));

        if (invalidEmails.length > 0) {
          toast({
            title: "Invalid Email Format",
            description: `Invalid emails: ${invalidEmails.join(", ")}`,
            variant: "destructive",
          });
          return;
        }

        allRequests[index].status = "IN_PROCESS";
        allRequests[index].forwardedTo = emailList;
        allRequests[index].forwardedDate = new Date().toISOString();
        localStorage.setItem("verificationRequests", JSON.stringify(allRequests));

        toast({
          title: "Forwarded for Review",
          description: `Request forwarded to ${emailList.length} reviewer(s): ${emailList.join(", ")}`,
        });

        navigate("/admin/dashboard");
      }
    }
  };

  if (!request) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading request...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PortalHeader
        showLogout
        userType="Examination Department"
        onLogout={handleLogout}
      />

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-8">
        <h1 className="text-xl font-bold mb-8">Document Approval</h1>

        {/* Document Request Details Table */}
        <div className="border rounded-lg mb-8 overflow-hidden">
          <table className="w-full border-collapse">
            <tbody>
              <tr className="border-b">
                <td className="border-r p-4 font-medium bg-gray-50 w-1/3">
                  Document request details:
                </td>
                <td className="p-4">Education Verification Confirmation</td>
              </tr>
              <tr className="border-b">
                <td className="border-r p-4 font-medium">Name:</td>
                <td className="p-4">{request.firstName} {request.lastName}</td>
              </tr>
              <tr className="border-b">
                <td className="border-r p-4 font-medium">Passing Year / Department:</td>
                <td className="p-4">
                  {request.yearOfPassing} / {request.programName}
                </td>
              </tr>
              <tr className="border-b">
                <td className="border-r p-4 font-medium">Student ID:</td>
                <td className="p-4">{request.studentNumber}</td>
              </tr>
              <tr className="border-b">
                <td className="border-r p-4 font-medium">CGPA:</td>
                <td className="p-4">{request.cgpa}</td>
              </tr>
              <tr>
                <td className="border-r p-4 font-medium">Receiver Number / Email:</td>
                <td className="p-4">
                  {/* Display receiver info if available, otherwise user info */}
                  <div>{request.receiverNumber || "N/A"}</div>
                  <div>{request.receiverEmail || "N/A"}</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* View Document Button */}
        {request.documentFile && (
          <a
            href={request.documentFile.dataUrl}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 underline mb-6 block hover:text-blue-800"
          >
            View supporting Doc
          </a>
        )}

        {/* Approval Options */}
        <div className="border rounded-lg p-6 mb-8 bg-gray-50">
          <div className="space-y-3">
            <div className="flex items-center">
              <input
                type="radio"
                id="approved"
                name="approval"
                value="approved"
                checked={action === "approved"}
                onChange={() => setAction("approved")}
                className="mr-3"
              />
              <label htmlFor="approved" className="cursor-pointer font-medium">
                ✓ Approved - Generate Confirmation Document
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="not_approved"
                name="approval"
                value="not_approved"
                checked={action === "not-approved"}
                onChange={() => setAction("not-approved")}
                className="mr-3"
              />
              <label htmlFor="not_approved" className="cursor-pointer font-medium">
                ✗ Not Approved - Generate Rejection Document
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="forward"
                name="approval"
                value="forward"
                checked={action === "forward"}
                onChange={() => setAction("forward")}
                className="mr-3"
              />
              <label htmlFor="forward" className="cursor-pointer font-medium">
                Forward for review
              </label>
            </div>
          </div>
        </div>

        {/* File Upload Section - REMOVED, Document Auto-Generated */}

        {/* Rejection Reason Section */}
        {action === "not-approved" && (
          <div className="border rounded-lg p-6 bg-red-50 mb-8">
            <label className="block font-medium mb-3">Reason for Rejection:</label>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter reason for rejection (will appear on rejection document)..."
              className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              rows={4}
            />
            <p className="text-xs text-gray-600 mt-2">
              💡 This reason will be included in the rejection document sent to the student.
            </p>
          </div>
        )}

        {/* Forward Email Section */}
        {action === "forward" && (
          <div className="border rounded-lg p-6 bg-blue-50 mb-8">
            <label className="block font-medium mb-2">Email addresses (semicolon separated if multiple):</label>
            <textarea
              value={forwardEmails}
              onChange={(e) => setForwardEmails(e.target.value)}
              placeholder="reviewer1@nmims.edu; reviewer2@nmims.edu; reviewer3@nmims.edu"
              className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
            <p className="text-xs text-gray-600 mt-2">
              💡 Enter multiple email addresses separated by semicolons (;)
            </p>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-center pb-8">
          <button
            onClick={handleSubmit}
            className="bg-orange-500 text-white px-12 py-2 rounded font-medium hover:bg-orange-600"
          >
            Submit
          </button>
        </div>

        {/* Note at bottom */}
        <p className="text-center text-sm text-gray-700 mt-6">
          ✓ Confirmation/Rejection documents are automatically generated with student details
        </p>
        <p className="text-center text-sm text-gray-600 mt-2">
          📧 Student will receive approval/rejection document on their registered email ID
        </p>
      </main>

      <PortalFooter />
    </div>
  );
};

export default AdminVerificationPage;
