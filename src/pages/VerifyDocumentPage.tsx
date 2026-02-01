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

  const [studentName, setStudentName] = useState("Janhavi Shivgan");
  const [passingYear, setPassingYear] = useState("2018");
  const [department, setDepartment] = useState("BACHELOR OF ARTS (Hons.) Liberal Arts (JYOTI DALAL School of Liberal Arts)");
  const [studentId, setStudentId] = useState("82012000001");
  const [cgpa, setCgpa] = useState("3.70");
  const [receiverNumber, setReceiverNumber] = useState("7999754380");
  const [receiverEmail, setReceiverEmail] = useState("janhavi.shivgan@nmims.edu");
  const [approvalStatus, setApprovalStatus] = useState<"approved" | "not_approved" | "forward">("approved");
  const [correctionFile, setCorrectionFile] = useState<File | null>(null);
  const [supportingFile, setSupportingFile] = useState<File | null>(null);

  const handleSubmit = async () => {
    if (!studentName || !studentId) {
      toast({
        title: "Missing Information",
        description: "Please fill all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Read files to data URLs so admin can open them
    const readFileAsDataUrl = (file: File): Promise<string> =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = (err) => reject(err);
        reader.readAsDataURL(file);
      });

    const attachmentsPayload = [];
    if (correctionFile) {
      attachmentsPayload.push({
        name: correctionFile.name,
        type: correctionFile.type,
        dataUrl: await readFileAsDataUrl(correctionFile),
      });
    }
    if (supportingFile) {
      attachmentsPayload.push({
        name: supportingFile.name,
        type: supportingFile.type,
        dataUrl: await readFileAsDataUrl(supportingFile),
      });
    }

    const verificationData = {
      id: nanoid(),
      studentName,
      studentId,
      passingYear,
      department,
      cgpa,
      receiverNumber,
      receiverEmail,
      approvalStatus,
      attachments: attachmentsPayload,
      verifiedAt: new Date().toISOString(),
      verificationStatus: "VERIFIED",
    };

    // Store in localStorage for tracking
    const allVerifications = JSON.parse(localStorage.getItem("verifications") || "[]");
    allVerifications.push(verificationData);
    localStorage.setItem("verifications", JSON.stringify(allVerifications));

    toast({
      title: "Verification Submitted",
      description: "Document verification has been submitted successfully.",
    });

    navigate("/verification-success");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PortalHeader />

      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-8">
        <h1 className="text-2xl font-bold mb-8">Document Approval</h1>

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
                <td className="p-4">
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="w-full border rounded px-2 py-1"
                  />
                </td>
              </tr>
              <tr className="border-b">
                <td className="border-r p-4 font-medium">Passing Year / Department:</td>
                <td className="p-4">
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={passingYear}
                      onChange={(e) => setPassingYear(e.target.value)}
                      placeholder="Year"
                      className="w-full border rounded px-2 py-1"
                    />
                    <input
                      type="text"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      placeholder="Department"
                      className="w-full border rounded px-2 py-1"
                    />
                  </div>
                </td>
              </tr>
              <tr className="border-b">
                <td className="border-r p-4 font-medium">Student ID:</td>
                <td className="p-4">
                  <input
                    type="text"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    className="w-full border rounded px-2 py-1"
                  />
                </td>
              </tr>
              <tr className="border-b">
                <td className="border-r p-4 font-medium">CGPA:</td>
                <td className="p-4">
                  <input
                    type="text"
                    value={cgpa}
                    onChange={(e) => setCgpa(e.target.value)}
                    className="w-full border rounded px-2 py-1"
                  />
                </td>
              </tr>
              <tr>
                <td className="border-r p-4 font-medium">Receiver Number / Email:</td>
                <td className="p-4">
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={receiverNumber}
                      onChange={(e) => setReceiverNumber(e.target.value)}
                      placeholder="Phone Number"
                      className="w-full border rounded px-2 py-1"
                    />
                    <input
                      type="email"
                      value={receiverEmail}
                      onChange={(e) => setReceiverEmail(e.target.value)}
                      placeholder="Email"
                      className="w-full border rounded px-2 py-1"
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* View Supporting Doc */}
        <button className="text-blue-600 underline mb-6 hover:text-blue-800">
          View supporting Doc
        </button>

        {/* Approval Options */}
        <div className="border rounded-lg p-6 mb-8 bg-gray-50">
          <div className="space-y-3">
            <div className="flex items-center">
              <input
                type="radio"
                id="approved"
                name="approval"
                value="approved"
                checked={approvalStatus === "approved"}
                onChange={(e) => setApprovalStatus(e.target.value as "approved" | "not_approved" | "forward")}
                className="mr-3"
              />
              <label htmlFor="approved" className="cursor-pointer">
                Approved with Corrected Document
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="not_approved"
                name="approval"
                value="not_approved"
                checked={approvalStatus === "not_approved"}
                onChange={(e) => setApprovalStatus(e.target.value as "approved" | "not_approved" | "forward")}
                className="mr-3"
              />
              <label htmlFor="not_approved" className="cursor-pointer">
                Not Approved
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="forward"
                name="approval"
                value="forward"
                checked={approvalStatus === "forward"}
                onChange={(e) => setApprovalStatus(e.target.value as "approved" | "not_approved" | "forward")}
                className="mr-3"
              />
              <label htmlFor="forward" className="cursor-pointer">
                Forward for review
              </label>
            </div>
          </div>
        </div>

        {/* File Upload Section */}
        <div className="border rounded-lg p-6 bg-gray-50 mb-8">
          <div className="mb-4">
            <label className="block font-medium mb-2">
              Upload Corrected Document (if applicable)
            </label>
            <div className="flex items-center gap-2">
              <label className="border rounded px-4 py-2 cursor-pointer bg-white hover:bg-gray-50">
                Choose file
                <input
                  type="file"
                  accept="application/pdf,image/*"
                  onChange={(e) => setCorrectionFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
              </label>
              <span className="text-sm text-gray-600">
                {correctionFile ? correctionFile.name : "No file chosen"}
              </span>
            </div>
          </div>

          <div>
            <label className="block font-medium mb-2">
              Upload Supporting Documents
            </label>
            <div className="flex items-center gap-2">
              <label className="border rounded px-4 py-2 cursor-pointer bg-white hover:bg-gray-50">
                Choose file
                <input
                  type="file"
                  accept="application/pdf,image/*"
                  onChange={(e) => setSupportingFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
              </label>
              <span className="text-sm text-gray-600">
                {supportingFile ? supportingFile.name : "No file chosen"}
              </span>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-8 py-2 rounded font-medium hover:bg-blue-600"
          >
            Submit
          </button>
        </div>

        {/* Note */}
        <p className="text-center text-sm text-gray-600 mt-8">
          Student will receive mail on their registered email ID
        </p>
      </main>

      <PortalFooter />
    </div>
  );
};

export default VerifyDocumentPage;
