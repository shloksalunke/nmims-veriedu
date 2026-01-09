import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import PortalHeader from "@/components/PortalHeader";
import PortalFooter from "@/components/PortalFooter";
import { verificationRequests, syncRequests } from "@/lib/mockDb";


const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const [, forceRefresh] = useState(0);

  const handleLogout = () => {
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
    navigate("/");
  };

  const approvePayment = (id: string) => {
    const req = verificationRequests.find((r) => r.id === id);
    if (!req) return;
    
    req.paymentStatus = "PAID_APPROVED";
    
    // 🔑 persist to localStorage
    syncRequests();
    
    toast({
      title: "Payment Approved",
      description:
        "Payment has been validated by Accounts and forwarded to Examination Department.",
    });
  
    forceRefresh((v) => v + 1);
  };


  const paymentBadge = (status: string) => {
    if (status === "PAID_APPROVED") return "status-completed";
    if (status === "PAID_PENDING_ACCOUNTS") return "status-inprocess";
    return "status-pending";
  };

  const verificationBadge = (status: string) => {
    if (status === "COMPLETED") return "status-completed";
    if (status === "IN_PROCESS") return "status-inprocess";
    return "status-pending";
  };

  /* ==========================
     FILTERED VIEWS
     ========================== */
  const accountsQueue = verificationRequests.filter(
    (r) =>
      r.role !== "GOVT" &&
      (r.paymentStatus === "PAYMENT_PENDING" ||
        r.paymentStatus === "PAID_PENDING_ACCOUNTS")
  );

  const examinationQueue = verificationRequests.filter(
    (r) =>
      r.role === "GOVT" || r.paymentStatus === "PAID_APPROVED"
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PortalHeader
        showLogout
        userType="University Admin"
        onLogout={handleLogout}
      />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
        <h2 className="page-title">Admin Dashboard</h2>

        {/* ==========================
           ACCOUNTS DEPARTMENT
           ========================== */}
        <div className="form-section">
          <h3 className="font-semibold mb-4">
            Accounts Department – Payment Validation
          </h3>

          <table className="portal-table">
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Fee Amount</th>
                <th>Payment Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {accountsQueue.map((req) => (
                <tr key={req.id}>
                  <td>{req.studentName}</td>
                  <td>₹{req.feeAmount}</td>
                  <td>
                    <span className={paymentBadge(req.paymentStatus)}>
                      {req.paymentStatus.replaceAll("_", " ")}
                    </span>
                  </td>
                  <td>
                    {req.paymentStatus === "PAID_PENDING_ACCOUNTS" ? (
                      <button
                        onClick={() => approvePayment(req.id)}
                        className="btn-primary text-xs"
                      >
                        Approve Payment
                      </button>
                    ) : (
                      <span className="text-muted-foreground text-xs">
                        Awaiting Payment
                      </span>
                    )}
                  </td>
                </tr>
              ))}

              {accountsQueue.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-4 text-sm">
                    No pending payments
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ==========================
           EXAMINATION DEPARTMENT
           ========================== */}
        <div className="form-section">
          <h3 className="font-semibold mb-4">
            Examination Department – Verification Processing
          </h3>

          <table className="portal-table">
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Year</th>
                <th>Requested By</th>
                <th>Verification Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {examinationQueue.map((req) => (
                <tr key={req.id}>
                  <td>{req.studentName}</td>
                  <td>{req.yearOfPassing}</td>
                  <td>{req.role}</td>
                  <td>
                    <span className={verificationBadge(req.verificationStatus)}>
                      {req.verificationStatus.replaceAll("_", " ")}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() =>
                        navigate(`/admin/verification/${req.id}`)
                      }
                      className="btn-secondary text-xs"
                    >
                      Open Request
                    </button>
                  </td>
                </tr>
              ))}

              {examinationQueue.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-sm">
                    No requests available for verification
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
