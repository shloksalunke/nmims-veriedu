import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle,
  Clock,
  CreditCard,
  FileText,
} from "lucide-react";
import PortalHeader from "@/components/PortalHeader";
import PortalFooter from "@/components/PortalFooter";
import RazorpayModal from "@/components/RazorpayModal";
import { verificationRequests } from "@/lib/mockDb";

const VerificationSuccessPage = () => {
  const navigate = useNavigate();
  const [showPayment, setShowPayment] = useState(false);

  // Latest submitted request (simulation)
  const request =
    verificationRequests[verificationRequests.length - 1];

  if (!request) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">
          No verification request found.
        </p>
      </div>
    );
  }

  const isGovt = request.role === "GOVT";

  /* ==========================
     STAGE DETERMINATION
     ========================== */
  let stageTitle = "";
  let stageDescription = "";
  let showPayNow = false;
  let showDownload = false;

  if (isGovt) {
    stageTitle = "Under Academic Verification";
    stageDescription =
      "This is a government request. No fee payment is required. The request has been forwarded directly to the Examination Department.";
  } else if (request.paymentStatus === "PAYMENT_PENDING") {
    stageTitle = "Payment Pending";
    stageDescription =
      "Verification fees are applicable. Please complete the payment to proceed further.";
    showPayNow = true;
  } else if (request.paymentStatus === "PAID_PENDING_ACCOUNTS") {
    stageTitle = "Payment Under Accounts Validation";
    stageDescription =
      "Payment has been received and is currently under validation by the Accounts Department.";
  } else if (request.paymentStatus === "PAID_APPROVED") {
    stageTitle = "Under Academic Verification";
    stageDescription =
      "Payment has been approved. The request is now under verification by the Examination Department.";
  }

  if (request.verificationStatus === "COMPLETED") {
    stageTitle = "Verification Completed";
    stageDescription =
      "Education Verification has been successfully completed. You may now download the verification report and invoice.";
    showDownload = true;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PortalHeader />

      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-12">
        <div className="form-section text-center">
          <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />

          <h2 className="text-2xl font-semibold mb-2">
            {stageTitle}
          </h2>

          <p className="text-muted-foreground mb-6">
            {stageDescription}
          </p>

          {/* REQUEST DETAILS */}
          <div className="bg-muted p-6 border border-border text-left">
            <h3 className="font-semibold mb-4">
              Request Details
            </h3>

            <table className="w-full text-sm">
              <tbody>
                <tr>
                  <td className="py-2 text-muted-foreground">
                    Application ID
                  </td>
                  <td className="py-2 font-medium">
                    {request.id}
                  </td>
                </tr>

                <tr>
                  <td className="py-2 text-muted-foreground">
                    Applicant Type
                  </td>
                  <td className="py-2 font-medium">
                    {request.role.replace("_", " ")}
                  </td>
                </tr>

                <tr>
                  <td className="py-2 text-muted-foreground">
                    Fee Amount
                  </td>
                  <td className="py-2 font-medium">
                    {request.feeAmount === 0
                      ? "N/A (Government Request)"
                      : `₹${request.feeAmount}`}
                  </td>
                </tr>

                <tr>
                  <td className="py-2 text-muted-foreground">
                    Current Status
                  </td>
                  <td className="py-2">
                    <span className="status-pending flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {stageTitle}
                    </span>
                  </td>
                </tr>

                <tr>
                  <td className="py-2 text-muted-foreground">
                    Submitted On
                  </td>
                  <td className="py-2">
                    {new Date().toLocaleDateString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* ACTIONS */}
          <div className="mt-8 flex justify-center gap-4 flex-wrap">
            {showPayNow && (
              <button
                onClick={() => setShowPayment(true)}
                className="btn-primary flex items-center gap-2"
              >
                <CreditCard className="w-4 h-4" />
                Proceed to Payment
              </button>
            )}

            {showDownload && (
              <>
                <button
                  onClick={() => window.print()}
                  className="btn-primary flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  Download Verification Report
                </button>

                <button
                  onClick={() => window.print()}
                  className="btn-secondary"
                >
                  Download Invoice
                </button>
              </>
            )}

            <button
              onClick={() => navigate("/")}
              className="btn-secondary"
            >
              Return to Home
            </button>
          </div>

          {/* NOTE */}
          <div className="note-box mt-8 text-left">
            <p className="font-medium">
              Important Note
            </p>
            <p className="text-sm mt-1">
              Verification reports are generated only after successful fee
              payment and approval by the Accounts Department, followed by
              verification by the Examination Department.
            </p>
          </div>
        </div>
      </main>

      <PortalFooter />

      {/* PAYMENT MODAL */}
      <RazorpayModal
        open={showPayment}
        onClose={() => setShowPayment(false)}
        request={request}
      />
    </div>
  );
};

export default VerificationSuccessPage;
