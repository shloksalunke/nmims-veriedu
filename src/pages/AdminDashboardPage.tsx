import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import PortalHeader from "@/components/PortalHeader";
import PortalFooter from "@/components/PortalFooter";
import { loadVerificationRequests, saveVerificationRequests } from "@/lib/verificationStorage";

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const [verificationRequests, setVerificationRequests] = useState<any[]>([]);

  useEffect(() => {
    // Load verification requests from localStorage
    const allRequests = loadVerificationRequests();
    setVerificationRequests(allRequests);
  }, []);

  const handleLogout = () => {
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
    navigate("/");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "REJECTED":
      case "PAYMENT_REJECTED":
        return "bg-red-100 text-red-800";
      case "PAYMENT_APPROVED":
        return "bg-indigo-100 text-indigo-800";
      case "IN_PROCESS":
        return "bg-yellow-100 text-yellow-800";
      case "PENDING_PAYMENT_APPROVAL":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "PENDING_PAYMENT_APPROVAL":
        return "Awaiting Payment";
      case "PAYMENT_APPROVED":
        return "Payment Approved";
      case "PAYMENT_REJECTED":
        return "Rejected";
      case "IN_PROCESS":
        return "In Review";
      case "COMPLETED":
        return "Completed";
      default:
        return status || "Pending";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const approvePayment = (id: string) => {
    const updatedRequests = verificationRequests.map((req) => {
      if (req.id === id) {
        return { ...req, status: "PAYMENT_APPROVED", applicationStatus: "Payment Approved" };
      }
      return req;
    });
    setVerificationRequests(updatedRequests);
    saveVerificationRequests(updatedRequests);
    
    toast({
      title: "Payment Approved",
      description: `Payment approved for ${verificationRequests.find(r => r.id === id)?.firstName}. Invoice will be sent to user.`,
    });
  };

  const rejectPayment = (id: string) => {
    const updatedRequests = verificationRequests.map((req) => {
      if (req.id === id) {
        return { ...req, status: "PAYMENT_REJECTED", applicationStatus: "Rejected" };
      }
      return req;
    });
    setVerificationRequests(updatedRequests);
    saveVerificationRequests(updatedRequests);
    
    toast({
      title: "Payment Rejected",
      description: "Payment rejected. Request status updated to Rejected.",
      variant: "destructive",
    });
  };

  // Get payment pending requests
  const paymentPendingRequests = verificationRequests.filter((r) => r.status === "PENDING_PAYMENT_APPROVAL");
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PortalHeader
        showLogout
        userType="University Admin"
        onLogout={handleLogout}
      />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
        {/* PAYMENT APPROVAL QUEUE */}
        {paymentPendingRequests.length > 0 && (
          <div className="mb-12">
            <div className="bg-orange-50 border-l-4 border-orange-400 p-4 mb-4">
              <h2 className="text-xl font-bold text-orange-900 mb-1">⚠️ Payment Approval Queue</h2>
              <p className="text-sm text-orange-700">{paymentPendingRequests.length} requests pending payment verification</p>
            </div>

            <div className="overflow-x-auto border rounded-lg bg-white">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-orange-100">
                    <th className="border px-4 py-2 text-left text-sm font-semibold">SR. NO.</th>
                    <th className="border px-4 py-2 text-left text-sm font-semibold">Name</th>
                    <th className="border px-4 py-2 text-left text-sm font-semibold">Student No.</th>
                    <th className="border px-4 py-2 text-left text-sm font-semibold">Amount Paid</th>
                    <th className="border px-4 py-2 text-left text-sm font-semibold">Request Type</th>
                    <th className="border px-4 py-2 text-left text-sm font-semibold">Paid Date</th>
                    <th className="border px-4 py-2 text-left text-sm font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentPendingRequests.map((req, index) => (
                    <tr key={req.id} className="border-b hover:bg-orange-50">
                      <td className="border px-4 py-3 text-sm font-medium">{String(index + 1).padStart(3, "0")}</td>
                      <td className="border px-4 py-3 text-sm">{req.firstName} {req.lastName}</td>
                      <td className="border px-4 py-3 text-sm">{req.studentNumber}</td>
                      <td className="border px-4 py-3 text-sm font-bold text-green-700">Rs. {req.amountPayable}/-</td>
                      <td className="border px-4 py-3 text-sm">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                          {req.requestType}
                        </span>
                      </td>
                      <td className="border px-4 py-3 text-sm">{formatDate(req.createdAt)}</td>
                      <td className="border px-4 py-3 text-sm space-x-2">
                        <button
                          onClick={() => approvePayment(req.id)}
                          className="bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600 font-medium"
                        >
                          ✓ Approve
                        </button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600 font-medium">
                              ✕ Reject
                            </button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Reject Payment?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Rejecting this payment will mark the verification request as "Rejected" on both admin and user dashboards. User will need to resubmit.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <div className="flex gap-3">
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => rejectPayment(req.id)}
                                className="bg-red-500 hover:bg-red-600 text-white"
                              >
                                Yes, Reject Payment
                              </AlertDialogAction>
                            </div>
                          </AlertDialogContent>
                        </AlertDialog>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <h1 className="text-2xl font-bold mb-8">Document Verification</h1>

        {/* Main Table */}
        <div className="overflow-x-auto border rounded-lg">
          <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-blue-100">
                    <th className="border px-4 py-2 text-left text-sm font-semibold">SR. NO.</th>
                    <th className="border px-4 py-2 text-left text-sm font-semibold">Date of Application</th>
                    <th className="border px-4 py-2 text-left text-sm font-semibold">First Name</th>
                    <th className="border px-4 py-2 text-left text-sm font-semibold">Last Name</th>
                    <th className="border px-4 py-2 text-left text-sm font-semibold">Student SAP / Registration Number</th>
                    <th className="border px-4 py-2 text-left text-sm font-semibold">Name of School</th>
                    <th className="border px-4 py-2 text-left text-sm font-semibold">Campus Name</th>
                    <th className="border px-4 py-2 text-left text-sm font-semibold">Programme Name</th>
                    <th className="border px-4 py-2 text-left text-sm font-semibold">Year of Passing</th>
                    <th className="border px-4 py-2 text-left text-sm font-semibold">Stream</th>
                    <th className="border px-4 py-2 text-left text-sm font-semibold">Semester</th>
                    <th className="border px-4 py-2 text-left text-sm font-semibold">Document</th>
                    <th className="border px-4 py-2 text-left text-sm font-semibold">Total Payment Received</th>
                    <th className="border px-4 py-2 text-left text-sm font-semibold">Bank Details</th>
                    <th className="border px-4 py-2 text-left text-sm font-semibold">Transaction ID</th>
                    <th className="border px-4 py-2 text-left text-sm font-semibold">Application Status</th>
                    <th className="border px-4 py-2 text-left text-sm font-semibold">Status</th>
                    <th className="border px-4 py-2 text-left text-sm font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {verificationRequests.map((req, index) => (
                    <tr key={req.id} className="border-b hover:bg-gray-50">
                      <td className="border px-4 py-3 text-sm">{String(index + 1).padStart(3, "0")}</td>
                      <td className="border px-4 py-3 text-sm">{formatDate(req.createdAt)}</td>
                      <td className="border px-4 py-3 text-sm">{req.firstName || "-"}</td>
                      <td className="border px-4 py-3 text-sm">{req.lastName || "-"}</td>
                      <td className="border px-4 py-3 text-sm">{req.studentNumber || "-"}</td>
                      <td className="border px-4 py-3 text-sm">{req.schoolName || "-"}</td>
                      <td className="border px-4 py-3 text-sm">{req.campusName || "-"}</td>
                      <td className="border px-4 py-3 text-sm">{req.programName || "-"}</td>
                      <td className="border px-4 py-3 text-sm">{req.yearOfPassing || "-"}</td>
                      <td className="border px-4 py-3 text-sm">{req.stream || "-"}</td>
                      <td className="border px-4 py-3 text-sm">{req.semester || "-"}</td>
                      <td className="border px-4 py-3 text-sm">
                        {req.degreeCertificateFile || req.marksheetFile || req.documentFile ? "Degree/Marksheet" : "-"}
                      </td>
                      <td className="border px-4 py-3 text-sm">Rs. {req.totalPaymentReceived ?? 0}/-</td>
                      <td className="border px-4 py-3 text-sm">{req.bankDetails || "-"}</td>
                      <td className="border px-4 py-3 text-sm">{req.transactionId || "-"}</td>
                      <td className="border px-4 py-3 text-sm">{req.applicationStatus || "Pending"}</td>
                      <td className="border px-4 py-3 text-sm">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge(req.status)}`}>
                          {getStatusDisplay(req.status)}
                        </span>
                      </td>
                      <td className="border px-4 py-3 text-sm">
                        <button
                          onClick={() => navigate(`/admin/verification/${req.id}`)}
                          className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600"
                        >
                      View/Process
                    </button>
                  </td>
                </tr>
              ))}

              {verificationRequests.length === 0 && (
                <tr>
                  <td colSpan={18} className="border px-4 py-8 text-center text-gray-500">
                    No verification requests found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      <PortalFooter />
    </div>
  );
};

export default AdminDashboardPage;
