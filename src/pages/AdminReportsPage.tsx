import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileDown } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import PortalHeader from "@/components/PortalHeader";
import PortalFooter from "@/components/PortalFooter";

const dummyReports = [
  {
    firstName: "Rahul",
    lastName: "Sharma",
    studentNumber: "STU20210001",
    schoolName: "School of Technology Management & Engineering",
    campusName: "Mumbai",
    programName: "B.Tech Computer Science",
    yearOfPassing: "2023",
    cgpa: "8.5",
    institute: "STME Mumbai",
    requestedBy: "Student",
    applicationDate: "2024-01-15",
    completionDate: "2024-01-22",
    status: "Completed",
    totalPaymentReceived: 2360,
    bankDetails: "Payment Gateway",
    transactionId: "TXN-RAHUL2024",
    applicationStatus: "Completed",
  },
  {
    firstName: "Priya",
    lastName: "Patel",
    studentNumber: "STU20200045",
    schoolName: "School of Business Management",
    campusName: "Bengaluru",
    programName: "MBA",
    yearOfPassing: "2024",
    cgpa: "9.0",
    institute: "SBM Bangalore",
    requestedBy: "Third Party",
    applicationDate: "2024-01-16",
    completionDate: "-",
    status: "In Process",
    totalPaymentReceived: 3540,
    bankDetails: "Payment Gateway",
    transactionId: "TXN-PRIYA2024",
    applicationStatus: "In Review",
  },
  {
    firstName: "Amit",
    lastName: "Kumar",
    studentNumber: "STU20190078",
    schoolName: "School of Commerce",
    campusName: "Hyderabad",
    programName: "B.Com",
    yearOfPassing: "2022",
    cgpa: "7.8",
    institute: "SOC Hyderabad",
    requestedBy: "Government",
    applicationDate: "2024-01-17",
    completionDate: "2024-01-20",
    status: "Completed",
    totalPaymentReceived: 4720,
    bankDetails: "Payment Gateway",
    transactionId: "TXN-AMIT2024",
    applicationStatus: "Completed",
  },
  {
    firstName: "Sneha",
    lastName: "Reddy",
    studentNumber: "STU20180012",
    schoolName: "School of Science",
    campusName: "Navi Mumbai",
    programName: "M.Sc",
    yearOfPassing: "2023",
    cgpa: "8.2",
    institute: "SOS Mumbai",
    requestedBy: "Third Party",
    applicationDate: "2024-01-18",
    completionDate: "-",
    status: "Pending",
    totalPaymentReceived: 0,
    bankDetails: "-",
    transactionId: "-",
    applicationStatus: "Pending",
  },
];

const AdminReportsPage = () => {
  const navigate = useNavigate();
  const [reports] = useState(dummyReports);

  const handleLogout = () => {
    navigate("/");
  };

  const handleExportPDF = () => {
    toast({
      title: "Export Started",
      description: "PDF report is being generated (simulation)",
    });
  };

  const handleExportExcel = () => {
    const headers = [
      "Date of Application",
      "First Name",
      "Last Name",
      "Student SAP / Registration Number",
      "Name of School",
      "Campus Name",
      "Programme Name",
      "Year of Passing",
      "CGPA",
      "Institute",
      "Requested By",
      "Total Payment Received",
      "Bank Details",
      "Transaction ID",
      "Application Status",
      "Completion Date",
      "Status",
    ];
    const rows = reports.map((report) => [
      report.applicationDate,
      report.firstName,
      report.lastName,
      report.studentNumber,
      report.schoolName,
      report.campusName,
      report.programName,
      report.yearOfPassing,
      report.cgpa,
      report.institute,
      report.requestedBy,
      report.totalPaymentReceived,
      report.bankDetails,
      report.transactionId,
      report.applicationStatus,
      report.completionDate,
      report.status,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "verification-reports.csv";
    link.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Export Started",
      description: "Excel report is being generated with updated fields.",
    });
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "Completed": return "status-completed";
      case "In Process": return "status-inprocess";
      default: return "status-pending";
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PortalHeader 
        showLogout 
        userType="University Staff" 
        onLogout={handleLogout} 
      />
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="page-title mb-0">Verification Reports</h2>
            <p className="text-sm text-muted-foreground">
              Complete verification history and statistics
            </p>
          </div>
          <div className="flex gap-3">
            <button onClick={handleExportPDF} className="btn-secondary inline-flex items-center gap-2">
              <FileDown size={16} />
              Export as PDF
            </button>
            <button onClick={handleExportExcel} className="btn-secondary inline-flex items-center gap-2">
              <FileDown size={16} />
              Export as Excel
            </button>
          </div>
        </div>

        <div className="form-section p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="portal-table text-xs">
              <thead>
                <tr>
                  <th>Date of Application</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Student SAP / Registration Number</th>
                  <th>Name of School</th>
                  <th>Campus Name</th>
                  <th>Programme Name</th>
                  <th>Year of Passing</th>
                  <th>CGPA</th>
                  <th>Institute</th>
                  <th>Requested By</th>
                  <th>Total Payment Received</th>
                  <th>Bank Details</th>
                  <th>Transaction ID</th>
                  <th>Application Status</th>
                  <th>Completion Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report, index) => (
                  <tr key={index}>
                    <td className="font-medium">{report.applicationDate}</td>
                    <td>{report.firstName}</td>
                    <td>{report.lastName}</td>
                    <td>{report.studentNumber}</td>
                    <td>{report.schoolName}</td>
                    <td>{report.campusName}</td>
                    <td>{report.programName}</td>
                    <td>{report.yearOfPassing}</td>
                    <td>{report.cgpa}</td>
                    <td>{report.institute}</td>
                    <td>{report.requestedBy}</td>
                    <td>Rs. {report.totalPaymentReceived}/-</td>
                    <td>{report.bankDetails}</td>
                    <td>{report.transactionId}</td>
                    <td>{report.applicationStatus}</td>
                    <td>{report.completionDate}</td>
                    <td>
                      <span className={getStatusClass(report.status)}>
                        {report.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            Total Records: {reports.length}
          </div>
          <button 
            onClick={() => navigate("/admin/dashboard")}
            className="btn-secondary"
          >
            Back to Dashboard
          </button>
        </div>
      </main>

      <PortalFooter />
    </div>
  );
};

export default AdminReportsPage;
