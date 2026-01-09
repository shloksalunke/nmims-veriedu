import { Link } from "react-router-dom";

interface PortalHeaderProps {
  showLogout?: boolean;
  userType?: string;
  onLogout?: () => void;
}

const PortalHeader = ({ showLogout, userType, onLogout }: PortalHeaderProps) => {
  return (
    <header className="w-full border-b border-border bg-white">
      {/* TOP UNIVERSITY BAR */}
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* LEFT: LOGO + TITLE */}
        <div className="flex items-center gap-4">
          {/* NMIMS LOGO */}
          <img
            src="/nmims-logo.jpeg"
            alt="NMIMS University"
            className="h-14 w-auto"
          />

          {/* TITLE */}
          <div>
            <h1 className="text-lg font-bold text-foreground">
              SVKM’s NMIMS
            </h1>
            <p className="text-sm text-muted-foreground">
              Deemed-to-be University
            </p>
          </div>
        </div>

        {/* RIGHT: USER INFO + ACTIONS */}
        <div className="flex items-center gap-4">
          {userType && (
            <span className="text-xs font-medium bg-muted px-3 py-1 rounded">
              {userType}
            </span>
          )}

          <Link
            to="/"
            className="text-sm text-primary hover:underline"
          >
            Home
          </Link>

          {showLogout && (
            <button
              onClick={onLogout}
              className="text-sm text-destructive hover:underline"
            >
              Logout
            </button>
          )}
        </div>
      </div>

      {/* SECONDARY BAR (PORTAL NAME) */}
      <div className="bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-6 py-2">
          <p className="text-sm font-medium text-center">
            Online Education Verification Portal
          </p>
        </div>
      </div>
    </header>
  );
};

export default PortalHeader;
