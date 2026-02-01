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
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  useEffect(() => {
    // Load from localStorage
    const allRequests = JSON.parse(localStorage.getItem("verificationRequests") || "[]");
    const foundRequest = allRequests.find((r: any) => r.id === id);
    setRequest(foundRequest);
  }, [id]);

  const handleLogout = () => {
    navigate("/");
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
        if (!uploadedFile) {
          toast({
            title: "Document Required",
            description: "Please upload a document for approval.",
            variant: "destructive",
          });
          return;
        }

        const reader = new FileReader();
        reader.onload = () => {
          allRequests[index].status = "COMPLETED";
          allRequests[index].approvedDocument = {
            name: uploadedFile.name,
            dataUrl: reader.result,
          };
          localStorage.setItem("verificationRequests", JSON.stringify(allRequests));

          toast({
            title: "Verification Approved",
            description: "Document has been approved and applicant will be notified.",
          });

          navigate("/admin/dashboard");
        };
        reader.readAsDataURL(uploadedFile);
      } else if (action === "not-approved") {
        allRequests[index].status = "REJECTED";
        localStorage.setItem("verificationRequests", JSON.stringify(allRequests));

        toast({
          title: "Verification Rejected",
          description: "Applicant has been notified of rejection.",
        });

        navigate("/admin/dashboard");
      } else if (action === "forward") {
        allRequests[index].status = "IN_PROCESS";
        localStorage.setItem("verificationRequests", JSON.stringify(allRequests));

        toast({
          title: "Forwarded for Review",
          description: "Request has been forwarded for further review.",
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
                Approved with Corrected Document
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
                Not Approved
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

        {/* File Upload Section */}
        {action === "approved" && (
          <div className="border rounded-lg p-6 bg-gray-50 mb-8">
            <label className="block font-medium mb-3">Upload Corrected Document</label>
            <div className="flex items-center gap-3">
              <label className="bg-yellow-100 border border-yellow-300 rounded px-4 py-2 cursor-pointer hover:bg-yellow-50">
                Choose file
                <input
                  type="file"
                  accept="application/pdf,image/*"
                  onChange={(e) => setUploadedFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
              </label>
              <span className="text-sm text-gray-600">
                {uploadedFile ? uploadedFile.name : "No file chosen"}
              </span>
            </div>
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
          Student will receive mail on their registered email ID
        </p>
      </main>

      <PortalFooter />
    </div>
  );
};

export default AdminVerificationPage;
