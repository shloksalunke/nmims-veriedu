import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { syncRequests } from "@/lib/mockDb";


interface VerificationRequest {
  paymentStatus: string;
}

interface RazorpayModalProps {
  open: boolean;
  onClose: () => void;
  request: VerificationRequest;
}

const RazorpayModal = ({
  open,
  onClose,
  request,
}: RazorpayModalProps) => {
  const navigate = useNavigate();

  const handlePaymentSuccess = () => {
      // CLIENT RULE:
      // Payment must be validated by Accounts BEFORE verification
      request.paymentStatus = "PAID_PENDING_ACCOUNTS";

      // 🔑 persist data
      syncRequests();

      toast({
        title: "Payment Successful",
        description:
          "Payment has been received and forwarded to the Accounts Department for validation.",
      });
    
      onClose();
      navigate("/verification-success");
    };


  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[420px] p-6 rounded shadow-lg">
        <h3 className="text-lg font-semibold mb-2">
          Razorpay Secure Payment (Simulation)
        </h3>

        <p className="text-sm text-muted-foreground mb-4">
          Complete payment to proceed with Education Verification.
        </p>

        <div className="space-y-3">
          <button
            onClick={handlePaymentSuccess}
            className="btn-primary w-full"
          >
            Pay via UPI / Card / Net Banking
          </button>

          <button
            onClick={onClose}
            className="btn-secondary w-full"
          >
            Cancel
          </button>
        </div>

        <p className="text-xs text-muted-foreground mt-4">
          * This is a simulated payment gateway for academic prototype
          demonstration only.
        </p>
      </div>
    </div>
  );
};

export default RazorpayModal;
