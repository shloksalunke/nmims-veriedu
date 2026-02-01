import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import PortalHeader from "@/components/PortalHeader";
import PortalFooter from "@/components/PortalFooter";

const LandingPage = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    // Dummy login - in real scenario, validate credentials
    const userData = {
      firstName: "Demo",
      lastName: "User",
      email: "demo@nmims.edu",
      phone: "9999999999",
      userType: "Student",
    };
    sessionStorage.setItem("currentUser", JSON.stringify(userData));
    localStorage.setItem("currentUser", JSON.stringify(userData));
    
    toast({
      title: "Login Successful",
      description: "Welcome to Document Verification Portal",
    });
    
    navigate("/user-dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PortalHeader />

      {/* MAIN CONTENT */}
      <main className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-12 px-8">

          {/* LEFT SECTION */}
          <div className="flex flex-col justify-center items-start">
            <img
              src="/nmims-logo1.jpeg"
              alt="NMIMS Logo"
              className="w-80 mb-6"

            />

            <a
              href="#"
              className="text-primary font-semibold underline"
            >
              USER MANUAL
            </a>
          </div>

          {/* RIGHT SECTION - LOGIN BOX */}
          <div className="flex justify-center">
            <div className="w-full max-w-md border border-primary/50 p-8">
              <h2 className="text-2xl font-semibold mb-6 text-center">
                Sign In
              </h2>

              {/* EMAIL */}
              <div className="mb-4">
                <label className="block text-sm mb-1">Email Id</label>
                <input
                  type="email"
                  placeholder="Enter your Email Id"
                  className="w-full border border-primary px-3 py-2 focus:outline-none"
                />
              </div>

              {/* PASSWORD */}
              <div className="mb-2">
                <label className="block text-sm mb-1">Password</label>
                <input
                  type="password"
                  placeholder="Enter your Password"
                  className="w-full border border-primary px-3 py-2 focus:outline-none"
                />
              </div>

              <div className="text-sm text-primary mb-6">
                <button onClick={() => navigate("/reset-password")} className="text-primary hover:underline">
                  Reset password?
                </button>
              </div>

              {/* LOGIN BUTTON */}
              <button
                className="w-full bg-primary text-primary-foreground py-2 font-medium"
                onClick={handleLogin}
              >
                Login
              </button>

              {/* OR */}
              <div className="text-center my-4 text-sm">or</div>

              {/* THIRD PARTY REGISTRATION */}
              <button
                className="w-full bg-primary text-primary-foreground py-2 font-medium"
                onClick={() => navigate("/third-party/login")}
              >
                New Third Party Registration
              </button>

              {/* NEW USER SIGNUP (text-style to match Admin link) */}
              <div className="mt-3 text-center">
                <button
                  onClick={() => navigate("/signup")}
                  className="text-sm text-primary hover:underline"
                >
                  Signup
                </button>
              </div>
              {/* ADMIN LOGIN */}
              <div className="mt-6 text-center">
                <button
                  onClick={() => navigate("/admin/login")}
                  className="text-sm text-primary hover:underline"
                >
                  University Staff / Admin Login →
                </button>
              </div>

            </div>
          </div>
        </div>
      </main>

      <PortalFooter />
    </div>
  );
};

export default LandingPage;
