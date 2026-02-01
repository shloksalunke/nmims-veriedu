import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import PortalHeader from "@/components/PortalHeader";
import PortalFooter from "@/components/PortalFooter";
import { nanoid } from "nanoid";

const VerifyDocumentPage = () => {
  const navigate = useNavigate();

  const [studentNumber, setStudentNumber] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [programName, setProgramName] = useState("");
  const [stream, setStream] = useState("");
  const [semester, setSemester] = useState("");
  const [yearOfPassing, setYearOfPassing] = useState("");
  const [cgpa, setCgpa] = useState("");
  const [requestType, setRequestType] = useState<"Regular" | "Urgent">("Regular");
  const [amountPayable, setAmountPayable] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleStudentNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStudentNumber(e.target.value);
    // In a real scenario, this would fetch student data automatically
  };

  const handleProceedToPayment = async () => {
    if (!studentNumber || !firstName || !lastName || !schoolName || !programName || !stream || !semester || !yearOfPassing || !cgpa || !uploadedFile) {
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

    const fileDataUrl = await readFileAsDataUrl(uploadedFile);

    const verificationRequest = {
      id: nanoid(),
      studentNumber,
      firstName,
      lastName,
      schoolName,
      programName,
      stream,
      semester,
      yearOfPassing,
      cgpa,
      requestType,
      amountPayable,
      documentFile: {
        name: uploadedFile.name,
        type: uploadedFile.type,
        dataUrl: fileDataUrl,
      },
      createdAt: new Date().toISOString(),
      status: "PENDING",
    };

    // Store in localStorage
    const allRequests = JSON.parse(localStorage.getItem("verificationRequests") || "[]");
    allRequests.push(verificationRequest);
    localStorage.setItem("verificationRequests", JSON.stringify(allRequests));

    toast({
      title: "Proceeding to Payment",
      description: "Your verification request is being processed.",
    });

    // Navigate to payment or success page
    navigate("/verification-success");
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
              <input
                type="text"
                placeholder="Program Name"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>

          {/* Row 2: Program Name, Stream, Semester */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Program Name<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Program Name"
                value={programName}
                onChange={(e) => setProgramName(e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
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
          </div>

          {/* Row 3: Year of Passing, CGPA, Request Type */}
          <div className="grid grid-cols-3 gap-4">
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
                <option value="2020">2020</option>
                <option value="2021">2021</option>
                <option value="2022">2022</option>
                <option value="2023">2023</option>
                <option value="2024">2024</option>
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

          {/* Row 4: Amount Payable */}
          <div>
            <label className="block text-sm font-medium mb-1">Amount Payable</label>
            <div className="flex items-end gap-4">
              <input
                type="text"
                value={amountPayable}
                onChange={(e) => setAmountPayable(e.target.value)}
                className="w-48 border rounded px-3 py-2"
              />
              <span className="text-sm text-gray-600">(including 18% GST)</span>
            </div>
          </div>

          {/* Upload Document */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Upload Document<span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-3">
              <label className="bg-yellow-100 border border-yellow-300 rounded px-4 py-2 cursor-pointer hover:bg-yellow-50">
                Choose file
                <input
                  type="file"
                  accept="application/pdf,image/*"
                  onChange={(e) => setUploadedFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
              </label>
              <span className="text-sm text-gray-600">
                {uploadedFile ? uploadedFile.name : "No file chosen"}
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

      <PortalFooter />
    </div>
  );
};

export default VerifyDocumentPage;
