import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import PortalHeader from "@/components/PortalHeader";
import PortalFooter from "@/components/PortalFooter";
import { nanoid } from "nanoid";
import { loadVerificationRequests, saveVerificationRequests } from "@/lib/verificationStorage";

const SCHOOL_OPTIONS = [
  "School of Technology Management & Engineering",
  "School of Business Management",
  "School of Commerce",
  "School of Science",
  "School of Pharmacy & Technology Management",
];

const CAMPUS_OPTIONS = [
  "Mumbai",
  "Navi Mumbai",
  "Bengaluru",
  "Hyderabad",
  "Indore",
];

const PROGRAM_OPTIONS = [
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

const YEAR_OPTIONS = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i);

const MAX_UPLOAD_SIZE_MB = 5;
const MAX_UPLOAD_SIZE_BYTES = MAX_UPLOAD_SIZE_MB * 1024 * 1024;

const VerifyDocumentPage = () => {
  const navigate = useNavigate();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [submittedRequest, setSubmittedRequest] = useState<any>(null);

  // Fee calculation function
  const calculateFee = (yearOfPassing: string, requestType: "Regular" | "Urgent"): { baseAmount: number; amountPayable: number } => {
    if (!yearOfPassing || requestType === "Urgent") {
      // Urgent cases: Rs. 7000, with 18% GST = Rs. 8260
      return { baseAmount: 7000, amountPayable: 8260 };
    }

    const currentYear = new Date().getFullYear();
    const passing = parseInt(yearOfPassing);
    const yearsAgo = currentYear - passing;

    let baseAmount = 0;

    // Period based fee calculation
    if (yearsAgo <= 3) {
      baseAmount = 2000; // Rs. 2000, with 18% GST = Rs. 2360
    } else if (yearsAgo <= 5) {
      baseAmount = 3000; // Rs. 3000, with 18% GST = Rs. 3540
    } else if (yearsAgo <= 10) {
      baseAmount = 4000; // Rs. 4000, with 18% GST = Rs. 4720
    } else {
      baseAmount = 5000; // Rs. 5000, with 18% GST = Rs. 5900
    }

    const amountPayable = Math.round(baseAmount * 1.18);
    return { baseAmount, amountPayable };
  };

  const [studentNumber, setStudentNumber] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [campusName, setCampusName] = useState("");
  const [programName, setProgramName] = useState("");
  const [stream, setStream] = useState("");
  const [semester, setSemester] = useState("");
  const [yearOfPassing, setYearOfPassing] = useState("");
  const [cgpa, setCgpa] = useState("");
  const [requestType, setRequestType] = useState<"Regular" | "Urgent">("Regular");
  const [degreeCertificateFile, setDegreeCertificateFile] = useState<File | null>(null);
  const [marksheetFile, setMarksheetFile] = useState<File | null>(null);

  // Calculate amount payable automatically
  const { baseAmount, amountPayable } = useMemo(() => {
    if (yearOfPassing && requestType) {
      return calculateFee(yearOfPassing, requestType);
    }
    return { baseAmount: 0, amountPayable: 0 };
  }, [yearOfPassing, requestType]);

  const handleStudentNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStudentNumber(e.target.value);
    // In a real scenario, this would fetch student data automatically
  };

  const validatePdfFile = (file: File, label: string) => {
    if (file.type !== "application/pdf") {
      toast({
        title: "Invalid File Type",
        description: `${label} must be a PDF file.`,
        variant: "destructive",
      });
      return false;
    }

    if (file.size > MAX_UPLOAD_SIZE_BYTES) {
      toast({
        title: "File Too Large",
        description: `${label} must be smaller than ${MAX_UPLOAD_SIZE_MB} MB.`,
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleProceedToPayment = async () => {
    if (!studentNumber || !firstName || !lastName || !schoolName || !campusName || !programName || !stream || !semester || !yearOfPassing || !cgpa || !degreeCertificateFile || !marksheetFile) {
      toast({
        title: "Missing Information",
        description: "Please fill all required fields marked with *.",
        variant: "destructive",
      });
      return;
    }

    if (!requestType) {
      toast({
        title: "Missing Request Type",
        description: "Please select a request type.",
        variant: "destructive",
      });
      return;
    }

    // Read file to data URL
    const readFileAsDataUrl = (file: File): Promise<string> =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = (err) => reject(err);
        reader.readAsDataURL(file);
      });

    if (!validatePdfFile(degreeCertificateFile, "Degree Certificate") || !validatePdfFile(marksheetFile, "Marksheet")) {
      return;
    }

    const degreeCertificateDataUrl = await readFileAsDataUrl(degreeCertificateFile);
    const marksheetDataUrl = await readFileAsDataUrl(marksheetFile);

    // Get current user
    const currentUser = JSON.parse(sessionStorage.getItem("currentUser") || localStorage.getItem("currentUser") || "{}");

    const verificationRequest = {
      id: nanoid(),
      studentNumber,
      firstName,
      lastName,
      schoolName,
      campusName,
      programName,
      stream,
      semester,
      yearOfPassing,
      cgpa,
      requestType,
      baseAmount,
      amountPayable,
      totalPaymentReceived: 0,
      bankDetails: "",
      transactionId: "",
      receiverEmail: currentUser.email || "",
      receiverNumber: currentUser.phone || "",
      degreeCertificateFile: {
        name: degreeCertificateFile.name,
        type: degreeCertificateFile.type,
        dataUrl: degreeCertificateDataUrl,
      },
      marksheetFile: {
        name: marksheetFile.name,
        type: marksheetFile.type,
        dataUrl: marksheetDataUrl,
      },
      documentFile: {
        name: degreeCertificateFile.name,
        type: degreeCertificateFile.type,
        dataUrl: degreeCertificateDataUrl,
      },
      createdAt: new Date().toISOString(),
      status: "PENDING_PAYMENT_APPROVAL",
      applicationStatus: "Pending",
    };

    // Store in localStorage
    const allRequests = loadVerificationRequests();
    allRequests.push(verificationRequest);
    saveVerificationRequests(allRequests);

    // Store the request and show payment modal
    setSubmittedRequest(verificationRequest);
    setShowPaymentModal(true);

    toast({
      title: "Application Submitted",
      description: "Proceed with payment to complete your request.",
    });
  };

  const handlePaymentComplete = () => {
    setShowPaymentModal(false);
    if (submittedRequest) {
      const allRequests = loadVerificationRequests();
      const index = allRequests.findIndex((req: any) => req.id === submittedRequest.id);
      if (index !== -1) {
        allRequests[index].totalPaymentReceived = submittedRequest.amountPayable;
        allRequests[index].transactionId = allRequests[index].transactionId || `TXN-${submittedRequest.id.substring(0, 10).toUpperCase()}`;
        allRequests[index].bankDetails = allRequests[index].bankDetails || "Payment Gateway";
        allRequests[index].applicationStatus = "Payment Received";
        saveVerificationRequests(allRequests);
      }
    }
    toast({
      title: "Payment Successful",
      description: "Your verification request has been received. Redirecting to dashboard...",
    });

    // Navigate to user dashboard after payment
    setTimeout(() => {
      navigate("/user-dashboard");
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PortalHeader />

      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-8">

        <div className="space-y-6">
          {/* Row 1: Student Number, First Name, Last Name, School Name */}
          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Student Number<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter Student Number"
                value={studentNumber}
                onChange={handleStudentNumberChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Student First Name<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter Student First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Student Last Name<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter Student Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                School Name<span className="text-red-500">*</span>
              </label>
              <select
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">Select School Name</option>
                {SCHOOL_OPTIONS.map((school) => (
                  <option key={school} value={school}>
                    {school}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 2: Campus Name, Program Name, Stream */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Campus Name<span className="text-red-500">*</span>
              </label>
              <select
                value={campusName}
                onChange={(e) => setCampusName(e.target.value)}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">Select Campus</option>
                {CAMPUS_OPTIONS.map((campus) => (
                  <option key={campus} value={campus}>
                    {campus}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Program Name<span className="text-red-500">*</span>
              </label>
              <select
                value={programName}
                onChange={(e) => setProgramName(e.target.value)}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">Select Program</option>
                {PROGRAM_OPTIONS.map((program) => (
                  <option key={program} value={program}>
                    {program}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Stream<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Stream"
                value={stream}
                onChange={(e) => setStream(e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>

          {/* Row 3: Semester, Year of Passing, CGPA */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Semester<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Semester"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Year of Passing<span className="text-red-500">*</span>
              </label>
              <select
                value={yearOfPassing}
                onChange={(e) => setYearOfPassing(e.target.value)}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">Please select Year of passing</option>
                {YEAR_OPTIONS.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                CGPA<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter CGPA"
                value={cgpa}
                onChange={(e) => setCgpa(e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>

          {/* Row 4: Request Type */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Request Type<span className="text-red-500">*</span>
              </label>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="regular"
                    name="requestType"
                    value="Regular"
                    checked={requestType === "Regular"}
                    onChange={(e) => setRequestType(e.target.value as "Regular" | "Urgent")}
                    className="mr-2"
                  />
                  <label htmlFor="regular" className="text-sm cursor-pointer">
                    Regular
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="urgent"
                    name="requestType"
                    value="Urgent"
                    checked={requestType === "Urgent"}
                    onChange={(e) => setRequestType(e.target.value as "Regular" | "Urgent")}
                    className="mr-2"
                  />
                  <label htmlFor="urgent" className="text-sm cursor-pointer">
                    Urgent
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Row 5: Amount Payable */}
          <div>
            <label className="block text-sm font-medium mb-1">Amount Payable</label>
            <div className="flex items-end gap-4">
              <div className="w-48 border rounded px-3 py-2 bg-gray-50 flex items-center">
                <span className="text-sm font-medium">
                  {amountPayable > 0 ? `Rs. ${amountPayable}/-` : "--"}
                </span>
              </div>
              <span className="text-sm text-gray-600">(including 18% GST)</span>
            </div>
          </div>

          {/* Upload Degree Certificate */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Upload Degree Certificate<span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-3">
              <label className="bg-yellow-100 border border-yellow-300 rounded px-4 py-2 cursor-pointer hover:bg-yellow-50">
                Choose file
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    if (!file) {
                      setDegreeCertificateFile(null);
                      return;
                    }
                    if (validatePdfFile(file, "Degree Certificate")) {
                      setDegreeCertificateFile(file);
                    } else {
                      e.currentTarget.value = "";
                    }
                  }}
                  className="hidden"
                />
              </label>
              <span className="text-sm text-gray-600">
                {degreeCertificateFile ? degreeCertificateFile.name : "No file chosen"}
              </span>
            </div>
          </div>

          {/* Upload Marksheet */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Upload Marksheet<span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-3">
              <label className="bg-yellow-100 border border-yellow-300 rounded px-4 py-2 cursor-pointer hover:bg-yellow-50">
                Choose file
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    if (!file) {
                      setMarksheetFile(null);
                      return;
                    }
                    if (validatePdfFile(file, "Marksheet")) {
                      setMarksheetFile(file);
                    } else {
                      e.currentTarget.value = "";
                    }
                  }}
                  className="hidden"
                />
              </label>
              <span className="text-sm text-gray-600">
                {marksheetFile ? marksheetFile.name : "No file chosen"}
              </span>
            </div>
          </div>

          {/* Proceed to Payment Button */}
          <div className="flex justify-center py-4">
            <button
              onClick={handleProceedToPayment}
              className="bg-orange-500 text-white px-12 py-2 rounded font-medium hover:bg-orange-600"
            >
              Proceed to Payment
            </button>
          </div>

          {/* Bottom Note */}
          <div className="mt-8 p-4 bg-gray-50 border rounded">
            <p className="text-sm text-gray-700">
              In case of applications received from Bar Councils/ Pharma Councils, Government employers like Railways, PWD etc will skip the payment gateway And application will be automatically appear in our ID's
            </p>
          </div>
        </div>
      </main>

      {/* Payment Modal */}
      {showPaymentModal && submittedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💳</span>
              </div>
              <h2 className="text-2xl font-bold">Payment Required</h2>
            </div>

            <div className="bg-gray-50 p-4 rounded mb-6 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Base Amount:</span>
                <span className="font-medium">Rs. {submittedRequest.baseAmount}/-</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">GST (18%):</span>
                <span className="font-medium">Rs. {submittedRequest.amountPayable - submittedRequest.baseAmount}/-</span>
              </div>
              <div className="border-t pt-2 flex justify-between">
                <span className="font-semibold">Total Payable:</span>
                <span className="font-bold text-lg text-blue-600">Rs. {submittedRequest.amountPayable}/-</span>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-sm text-gray-700 mb-3">Select Payment Method:</p>
              <div className="space-y-2">
                {["Card", "UPI/QR Code", "Netbanking", "Wallet", "Pay Later"].map((method) => (
                  <label key={method} className="flex items-center p-2 border rounded cursor-pointer hover:bg-gray-50">
                    <input type="radio" name="payment" defaultChecked={method === "Card"} className="mr-3" />
                    <span className="text-sm font-medium">{method}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="flex-1 px-4 py-2 border rounded font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handlePaymentComplete}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded font-medium hover:bg-blue-600"
              >
                Pay Now
              </button>
            </div>
          </div>
        </div>
      )}

      <PortalFooter />
    </div>
  );
};

export default VerifyDocumentPage;
