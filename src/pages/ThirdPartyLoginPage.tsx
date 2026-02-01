import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import PortalHeader from "@/components/PortalHeader";
import PortalFooter from "@/components/PortalFooter";

const ThirdPartyLoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      // Store user info
      const userData = {
        email,
        userType: "Third Party",
        companyName: "Company",
      };
      sessionStorage.setItem("currentUser", JSON.stringify(userData));
      localStorage.setItem("currentUser", JSON.stringify(userData));
      
      toast({
        title: "Login Successful",
        description: "Welcome to the Document Verification Portal",
      });
      navigate("/user-dashboard");
    } else {
      toast({
        title: "Login Failed",
        description: "Please enter valid credentials",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PortalHeader />

      {/* MAIN CONTENT */}
      <main className="flex-1 flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-12">

          {/* LEFT SECTION - LOGO */}
          <div className="flex flex-col justify-center items-start">
            <img
              src="/nmims-logo1.jpeg"
              alt="NMIMS Logo"
              className="w-60 md:w-80 mb-6"
            />
          </div>

          {/* RIGHT SECTION - THIRD PARTY LOGIN */}
          <div className="flex justify-center">
            <div className="w-full max-w-md form-section">
              <h2 className="text-xl font-semibold text-center text-foreground mb-6">
                Third Party Login
              </h2>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="company@example.com"
                  />
                </div>

                <div>
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>

                <button type="submit" className="w-full btn-primary">
                  Login
                </button>
              </form>

              <div className="mt-6 text-center">
                <Link
                  to="/third-party/register"
                  className="text-sm text-primary hover:underline"
                >
                  New Third Party Registration →
                </Link>
              </div>

              <div className="mt-4 text-center">
                <Link
                  to="/"
                  className="text-sm text-muted-foreground hover:underline"
                >
                  ← Back to Home
                </Link>
              </div>
            </div>
          </div>

        </div>
      </main>

      <PortalFooter />
    </div>
  );
};

export default ThirdPartyLoginPage;
