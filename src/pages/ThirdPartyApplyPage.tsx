import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import PortalHeader from "@/components/PortalHeader";
import PortalFooter from "@/components/PortalFooter";
import RazorpayModal from "@/components/RazorpayModal";
import { verificationRequests } from "@/lib/mockDb";
import { nanoid } from "nanoid";

/* ==========================
   STATIC DATA
========================== */
const programs = [
  "B.Tech Computer Science",
  "B.Tech Information Technology",
  "MBA",
  "BBA",
  "B.Com",
  "M.Com",
  "B.Sc",
  "M.Sc",
  "B.Pharm",
  "M.Pharm",
];

const schools = [
  "School of Technology Management & Engineering",
  "School of Business Management",
  "School of Commerce",
  "School of Science",
  "School of Pharmacy & Technology Management",
];

const years = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i);

/* ==========================
   FEE CALCULATION LOGIC
========================== */
const calculateFee = (
  yearOfPassing: string,
  feeType: "regular" | "urgent",
  isGovt: boolean = false
) => {
  if (isGovt || !yearOfPassing) {
    return { base: 0, gst: 0, total: 0 };
  }

  // Urgent = flat fee
  if (feeType === "urgent") {
    const base = 7000;
    const gst = base * 0.18;
    return { base, gst, total: base + gst };
  }

  // Regular fee based on age
  const currentYear = new Date().getFullYear();
  const age = currentYear - Number(yearOfPassing);

  let base = 0;
  if (age <= 3) base = 2000;
  else if (age <= 5) base = 3000;
  else if (age <= 10) base = 4000;
  else base = 5000;

  const gst = base * 0.18;
  return { base, gst, total: base + gst };
};

/* ==========================
   COMPONENT
========================== */
const ThirdPartyApplyPage = () => {
  const navigate = useNavigate();

  const [recordType, setRecordType] = useState<"new" | "old" | null>(null);
  const [feeType, setFeeType] = useState<"regular" | "urgent">("regular");
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    studentNumber: "",
    programName: "",
    schoolName: "",
    yearOfPassing: "",
    cgpa: "",
  });

  const { base, gst, total } = calculateFee(
    formData.yearOfPassing,
    feeType,
    false // Govt case later
  );

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleProceedPayment = () => {
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.studentNumber ||
      !formData.programName ||
      !formData.schoolName ||
      !formData.yearOfPassing
    ) {
      toast({
        title: "Missing Information",
        description: "Please fill all mandatory fields.",
        variant: "destructive",
      });
      return;
    }

    const request = {
      id: nanoid(),
      studentName: `${formData.firstName} ${formData.lastName}`,
      studentNumber: formData.studentNumber,
      role: "THIRD_PARTY",
      yearOfPassing: formData.yearOfPassing,
      requestType:
        feeType === "urgent"
          ? "Urgent Verification"
          : "Regular Verification",
      feeAmount: Math.round(total),
      paymentStatus: "PAYMENT_PENDING",
      verificationStatus: "OPEN",
      createdAt: new Date().toISOString(),
    };

    verificationRequests.push(request);
    setShowPaymentModal(true);
  };

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PortalHeader
        showLogout
        userType="Third Party"
        onLogout={handleLogout}
      />

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-8">
        <p className="breadcrumb">
          Dashboard → Apply for Verification
        </p>

        <h2 className="page-title">
          Education Verification Request
        </h2>

        {/* RECORD TYPE */}
        <div className="form-section">
          <h3 className="font-semibold mb-4">
            Select Record Type
          </h3>

          <div className="flex gap-6">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={recordType === "new"}
                onChange={() => setRecordType("new")}
              />
              <span>New Record</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={recordType === "old"}
                onChange={() => setRecordType("old")}
              />
              <span>Old Record</span>
            </label>
          </div>
        </div>

        {recordType && (
          <>
            {/* STUDENT DETAILS */}
            <div className="form-section">
              <h3 className="font-semibold mb-4">
                Student Information
              </h3>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">First Name *</label>
                  <input
                    className="form-input"
                    value={formData.firstName}
                    onChange={(e) =>
                      handleChange("firstName", e.target.value)
                    }
                  />
                </div>

                <div>
                  <label className="form-label">Last Name *</label>
                  <input
                    className="form-input"
                    value={formData.lastName}
                    onChange={(e) =>
                      handleChange("lastName", e.target.value)
                    }
                  />
                </div>

                <div>
                  <label className="form-label">Student Number *</label>
                  <input
                    className="form-input"
                    value={formData.studentNumber}
                    onChange={(e) =>
                      handleChange("studentNumber", e.target.value)
                    }
                  />
                </div>

                <div>
                  <label className="form-label">Program *</label>
                  <select
                    className="form-select"
                    value={formData.programName}
                    onChange={(e) =>
                      handleChange("programName", e.target.value)
                    }
                  >
                    <option value="">Select</option>
                    {programs.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label">School *</label>
                  <select
                    className="form-select"
                    value={formData.schoolName}
                    onChange={(e) =>
                      handleChange("schoolName", e.target.value)
                    }
                  >
                    <option value="">Select</option>
                    {schools.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label">Year of Passing *</label>
                  <select
                    className="form-select"
                    value={formData.yearOfPassing}
                    onChange={(e) =>
                      handleChange("yearOfPassing", e.target.value)
                    }
                  >
                    <option value="">Select</option>
                    {years.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* FEE SECTION */}
            <div className="form-section">
              <h3 className="font-semibold mb-4">
                Fee & Payment
              </h3>

              <div className="flex gap-6 mb-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={feeType === "regular"}
                    onChange={() => setFeeType("regular")}
                  />
                  <span>Regular</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={feeType === "urgent"}
                    onChange={() => setFeeType("urgent")}
                  />
                  <span>Urgent</span>
                </label>
              </div>

              <div className="bg-muted p-4 border border-border">
                <div className="flex justify-between text-sm">
                  <span>Base Fee</span>
                  <span>₹{base}</span>
                </div>

                <div className="flex justify-between text-sm mt-1">
                  <span>GST (18%)</span>
                  <span>₹{gst.toFixed(2)}</span>
                </div>

                <div className="flex justify-between font-semibold mt-2 border-t pt-2">
                  <span>Total Payable</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={handleProceedPayment}
                className="btn-primary"
              >
                Proceed to Payment
              </button>

              <button
                onClick={() => navigate("/third-party/dashboard")}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </main>

      <PortalFooter />

      {showPaymentModal && (
        <RazorpayModal
          open={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          request={
            verificationRequests[
              verificationRequests.length - 1
            ]
          }
        />
      )}
    </div>
  );
};

export default ThirdPartyApplyPage;
