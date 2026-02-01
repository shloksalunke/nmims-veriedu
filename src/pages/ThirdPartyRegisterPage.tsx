import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import PortalHeader from "@/components/PortalHeader";
import PortalFooter from "@/components/PortalFooter";

const ThirdPartyRegisterPage = () => {
  const navigate = useNavigate();
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    companyName: "",
    companyEmail: "",
    phone: "",
    gstNumber: "",
    panNumber: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }
    if (!formData.agreeTerms) {
      toast({
        title: "Error",
        description: "Please agree to Terms & Conditions",
        variant: "destructive",
      });
      return;
    }
    setShowVerificationModal(true);
  };

  const handleVerifyEmail = () => {
    toast({
      title: "Email Verified",
      description: "Your account has been activated successfully",
    });
    
    // Store user info
    const userData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.companyEmail,
      phone: formData.phone,
      companyName: formData.companyName,
      userType: "Third Party",
    };
    sessionStorage.setItem("currentUser", JSON.stringify(userData));
    localStorage.setItem("currentUser", JSON.stringify(userData));
    
    navigate("/user-dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PortalHeader />
      
      <main className="flex-1 max-w-2xl mx-auto w-full px-6 py-8">
        <h2 className="page-title">Third Party Registration</h2>

        <form onSubmit={handleSubmit} className="form-section">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="form-label">First Name *</label>
              <input
                type="text"
                className="form-input"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                required
              />
            </div>
            <div>
              <label className="form-label">Last Name *</label>
              <input
                type="text"
                className="form-input"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="form-label">Company Name *</label>
              <input
                type="text"
                className="form-input"
                value={formData.companyName}
                onChange={(e) => handleInputChange("companyName", e.target.value)}
                required
              />
            </div>
            <div>
              <label className="form-label">Company Email *</label>
              <input
                type="email"
                className="form-input"
                value={formData.companyEmail}
                onChange={(e) => handleInputChange("companyEmail", e.target.value)}
                required
              />
            </div>
            <div>
              <label className="form-label">Phone Number *</label>
              <input
                type="tel"
                className="form-input"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                required
              />
            </div>
            <div>
              <label className="form-label">GST Number *</label>
              <input
                type="text"
                className="form-input"
                value={formData.gstNumber}
                onChange={(e) => handleInputChange("gstNumber", e.target.value)}
                placeholder="22AAAAA0000A1Z5"
                required
              />
            </div>
            <div>
              <label className="form-label">PAN Number *</label>
              <input
                type="text"
                className="form-input"
                value={formData.panNumber}
                onChange={(e) => handleInputChange("panNumber", e.target.value)}
                placeholder="AAAAA0000A"
                required
              />
            </div>
            <div>
              <label className="form-label">Password *</label>
              <input
                type="password"
                className="form-input"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                required
              />
            </div>
            <div>
              <label className="form-label">Confirm Password *</label>
              <input
                type="password"
                className="form-input"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.agreeTerms}
                onChange={(e) => handleInputChange("agreeTerms", e.target.checked)}
              />
              <span className="text-sm">I agree to the Terms & Conditions</span>
            </label>
          </div>

          <div className="mt-6 flex gap-4">
            <button type="submit" className="btn-primary">
              Register
            </button>
            <Link to="/third-party/login" className="btn-secondary">
              Back to Login
            </Link>
          </div>
        </form>
      </main>

      <PortalFooter />

      {showVerificationModal && (
        <div className="fixed inset-0 bg-foreground/50 flex items-center justify-center z-50">
          <div className="bg-card w-full max-w-md p-6 border border-border">
            <h3 className="text-lg font-semibold mb-4">Email Verification</h3>
            <p className="text-sm text-muted-foreground mb-4">
              A verification email has been sent to <strong>{formData.companyEmail}</strong>. 
              The link will be valid for 24 hours.
            </p>
            <div className="note-box mb-6">
              <p className="text-sm">
                <strong>Simulation:</strong> Click the button below to simulate email verification
              </p>
            </div>
            <button onClick={handleVerifyEmail} className="w-full btn-primary">
              Verify Email (Simulation)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThirdPartyRegisterPage;
