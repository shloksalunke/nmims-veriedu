import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import PortalHeader from "@/components/PortalHeader";
import PortalFooter from "@/components/PortalFooter";
import { loadVerificationRequests } from "@/lib/verificationStorage";

const UserDashboardPage = () => {
  const navigate = useNavigate();
  const [userRequests, setUserRequests] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    // Get current user from sessionStorage or localStorage
    const user = JSON.parse(sessionStorage.getItem("currentUser") || localStorage.getItem("currentUser") || "{}");
    setCurrentUser(user);

    // Load all verification requests and filter by current user
    const allRequests = loadVerificationRequests();
    
    // Filter requests based on user (by email or student number)
    const filtered = allRequests.filter((req: any) => {
      return req.receiverEmail === user.email || 
             req.studentNumber === user.studentNumber || 
             req.firstName === user.firstName;
    });

    setUserRequests(filtered);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("currentUser");
    localStorage.removeItem("currentUser");
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
    navigate("/");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "REJECTED":
      case "PAYMENT_REJECTED":
        return "bg-red-100 text-red-800";
      case "PAYMENT_APPROVED":
        return "bg-indigo-100 text-indigo-800";
      case "IN_PROCESS":
        return "bg-yellow-100 text-yellow-800";
      case "PENDING_PAYMENT_APPROVAL":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "PENDING_PAYMENT_APPROVAL":
        return "Payment Pending";
      case "PAYMENT_APPROVED":
        return "Payment Approved";
      case "PAYMENT_REJECTED":
        return "Rejected";
      case "IN_PROCESS":
        return "In Review";
      case "COMPLETED":
        return "Completed";
      default:
        return status || "Pending";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Generate dummy invoice PDF
  const generateInvoice = (request: any) => {
    const invoiceNumber = `INV-${request.id.substring(0, 8).toUpperCase()}`;
    const date = new Date(request.createdAt).toLocaleDateString("en-IN");

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Invoice - ${invoiceNumber}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            color: #333;
            padding: 20px;
            line-height: 1.6;
          }
          .invoice-container {
            max-width: 800px;
            margin: 0 auto;
            border: 1px solid #ddd;
            padding: 20px;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #333;
            padding-bottom: 20px;
            margin-bottom: 20px;
          }
          .logo-section h1 {
            margin: 0;
            font-size: 24px;
          }
          .logo-section p {
            margin: 5px 0;
            font-size: 12px;
            color: #666;
          }
          .invoice-title {
            text-align: right;
          }
          .invoice-title h2 {
            margin: 0;
            font-size: 28px;
            color: #0066cc;
          }
          .invoice-number {
            text-align: right;
            margin: 10px 0;
          }
          .invoice-number p {
            margin: 5px 0;
            font-size: 12px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
          }
          table td {
            padding: 10px;
            border: 1px solid #ddd;
          }
          .label {
            font-weight: bold;
            width: 30%;
            background-color: #f5f5f5;
          }
          .amount-table {
            margin-top: 30px;
          }
          .amount-table tr td {
            padding: 8px;
            border: 1px solid #ddd;
          }
          .amount-label {
            text-align: right;
            font-weight: bold;
            width: 50%;
          }
          .amount-value {
            text-align: right;
            width: 50%;
            font-weight: bold;
          }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            font-size: 11px;
            color: #666;
          }
          .thank-you {
            text-align: center;
            margin: 20px 0;
            font-size: 14px;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          <div class="header">
            <div class="logo-section">
              <h1>NMIMS</h1>
              <p>Deemed-to-be University</p>
            </div>
            <div class="invoice-title">
              <h2>INVOICE</h2>
              <div class="invoice-number">
                <p><strong>Invoice No.:</strong> ${invoiceNumber}</p>
                <p><strong>Date:</strong> ${date}</p>
              </div>
            </div>
          </div>

          <table>
            <tr>
              <td class="label">Bill To:</td>
              <td>${request.firstName} ${request.lastName}</td>
            </tr>
            <tr>
              <td class="label">Student Number:</td>
              <td>${request.studentNumber}</td>
            </tr>
            <tr>
              <td class="label">Email:</td>
              <td>${request.receiverEmail || "N/A"}</td>
            </tr>
            <tr>
              <td class="label">Program:</td>
              <td>${request.programName}</td>
            </tr>
            <tr>
              <td class="label">Passing Year:</td>
              <td>${request.yearOfPassing}</td>
            </tr>
          </table>

          <h3 style="margin-top: 30px; margin-bottom: 10px;">Service Details</h3>
          <table>
            <tr style="background-color: #f5f5f5;">
              <td style="font-weight: bold; width: 50%;">Description</td>
              <td style="font-weight: bold; width: 25%;">Quantity</td>
              <td style="font-weight: bold; width: 25%; text-align: right;">Amount</td>
            </tr>
            <tr>
              <td>Education Verification (${request.requestType})</td>
              <td style="text-align: center;">1</td>
              <td style="text-align: right;">Rs. ${request.baseAmount}/-</td>
            </tr>
          </table>

          <table class="amount-table">
            <tr>
              <td class="amount-label">Subtotal:</td>
              <td class="amount-value">Rs. ${request.baseAmount}/-</td>
            </tr>
            <tr>
              <td class="amount-label">GST (18%):</td>
              <td class="amount-value">Rs. ${request.amountPayable - request.baseAmount}/-</td>
            </tr>
            <tr style="background-color: #e8f0ff;">
              <td class="amount-label" style="padding: 15px;">Total Amount Payable:</td>
              <td class="amount-value" style="padding: 15px; font-size: 16px;">Rs. ${request.amountPayable}/-</td>
            </tr>
          </table>

          <div class="thank-you">
            Thank you for your business!
          </div>

          <div class="footer">
            <p><strong>NMIMS University</strong></p>
            <p>V.L. Mehta Road, Vile Parle (W), Mumbai - 400 056, India</p>
            <p>Tel: (+91-22) 42351313 | Fax: (+91-22) 26154313 | Email: enquiry@nmims.edu | Web: www.nmims.edu</p>
            <p style="margin-top: 15px; text-align: center; border-top: 1px solid #ddd; padding-top: 10px;">
              This is a computer-generated invoice. No signature required.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Create and download PDF
    const printWindow = window.open("", "", "height=400,width=800");
    if (!printWindow) {
      toast({
        title: "Error",
        description: "Unable to generate invoice. Please check your browser settings.",
        variant: "destructive",
      });
      return;
    }

    try {
      const blob = new Blob([html], { type: "text/html" });
      const blobUrl = URL.createObjectURL(blob);
      printWindow.location.href = blobUrl;

      setTimeout(() => {
        try {
          printWindow.document.title = `Invoice-${invoiceNumber}`;
          printWindow.print();
        } catch (err) {
          console.error("Print error:", err);
        }
      }, 500);
    } catch (err) {
      console.error("Invoice generation error:", err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PortalHeader
        showLogout
        userType={currentUser?.userType || "User"}
        onLogout={handleLogout}
      />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
        {/* Header with title and button */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">Document Verification</h1>
          <button
            onClick={() => navigate("/verify-document")}
            className="bg-blue-500 text-white px-6 py-2 rounded font-medium hover:bg-blue-600"
          >
            Apply for Verification
          </button>
        </div>

        {/* Main Table */}
        <div className="overflow-x-auto border rounded-lg">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-blue-100">
                <th className="border px-4 py-2 text-left text-sm font-semibold">Application Id</th>
                <th className="border px-4 py-2 text-left text-sm font-semibold">Name</th>
                <th className="border px-4 py-2 text-left text-sm font-semibold">Student No.</th>
                <th className="border px-4 py-2 text-left text-sm font-semibold">Passing Year</th>
                <th className="border px-4 py-2 text-left text-sm font-semibold">Program</th>
                <th className="border px-4 py-2 text-left text-sm font-semibold">Stream</th>
                <th className="border px-4 py-2 text-left text-sm font-semibold">Semester</th>
                <th className="border px-4 py-2 text-left text-sm font-semibold">Document</th>
                <th className="border px-4 py-2 text-left text-sm font-semibold">Status</th>
                <th className="border px-4 py-2 text-left text-sm font-semibold">Requested Date</th>
                <th className="border px-4 py-2 text-left text-sm font-semibold">Verified Doc</th>
                <th className="border px-4 py-2 text-left text-sm font-semibold">Download Invoice</th>
              </tr>
            </thead>
            <tbody>
              {userRequests.length > 0 ? (
                userRequests.map((req, index) => (
                  <tr key={req.id} className="border-b hover:bg-gray-50">
                    <td className="border px-4 py-3 text-sm">{String(index + 1).padStart(3, "0")}</td>
                    <td className="border px-4 py-3 text-sm font-medium">{req.firstName} {req.lastName}</td>
                    <td className="border px-4 py-3 text-sm">{req.studentNumber}</td>
                    <td className="border px-4 py-3 text-sm">{req.yearOfPassing}</td>
                    <td className="border px-4 py-3 text-sm">{req.programName}</td>
                    <td className="border px-4 py-3 text-sm">{req.stream}</td>
                    <td className="border px-4 py-3 text-sm">{req.semester}</td>
                    <td className="border px-4 py-3 text-sm">
                      {req.degreeCertificateFile || req.marksheetFile || req.documentFile ? "Grade Sheet/Degree" : "-"}
                    </td>
                    <td className="border px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge(req.status)}`}>
                        {getStatusDisplay(req.status)}
                      </span>
                    </td>
                    <td className="border px-4 py-3 text-sm">{formatDate(req.createdAt)}</td>
                    <td className="border px-4 py-3 text-sm">
                      {req.approvedDocument ? (
                        <a
                          href={req.approvedDocument.dataUrl}
                          download={req.approvedDocument.name}
                          className="text-green-600 underline hover:text-green-800 font-medium text-xs"
                          title={`Download: ${req.approvedDocument.name}`}
                        >
                          ✓ Confirmation
                        </a>
                      ) : req.rejectionDocument ? (
                        <a
                          href={req.rejectionDocument.dataUrl}
                          download={req.rejectionDocument.name}
                          className="text-red-600 underline hover:text-red-800 font-medium text-xs"
                          title={`Download: ${req.rejectionDocument.name}`}
                        >
                          ✗ Rejection
                        </a>
                      ) : (
                        <span className="text-gray-400 text-xs">Pending</span>
                      )}
                    </td>
                    <td className="border px-4 py-3 text-sm">
                      <button
                        onClick={() => generateInvoice(req)}
                        className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600"
                      >
                        Download
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={12} className="border px-4 py-8 text-center text-gray-500">
                    No verification requests found. Click "Apply for Verification" to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      <PortalFooter />
    </div>
  );
};

export default UserDashboardPage;
