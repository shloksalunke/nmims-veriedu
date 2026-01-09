import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import PortalHeader from "@/components/PortalHeader";
import PortalFooter from "@/components/PortalFooter";

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({ title: "Missing Email", description: "Please enter your email address", variant: "destructive" });
      return;
    }

    // Simulate sending a reset email
    toast({ title: "Reset Email Sent", description: `A password reset link was sent to ${email}` });
    // Navigate back to landing or login page
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PortalHeader />

      <main className="flex-1 max-w-md mx-auto w-full px-6 py-12">
        <h2 className="page-title">Reset Password</h2>

        <div className="form-section">
          <p className="text-sm text-muted-foreground mb-4">
            Enter your registered email address and we'll send a password reset link.
          </p>

          <form onSubmit={handleSubmit}>
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div className="mt-6 flex gap-3">
              <button type="submit" className="btn-primary">
                Send Reset Link
              </button>
              <button type="button" onClick={() => navigate(-1)} className="btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </main>

      <PortalFooter />
    </div>
  );
};

export default ResetPasswordPage;
