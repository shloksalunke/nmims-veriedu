import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileDown } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import PortalHeader from "@/components/PortalHeader";
import PortalFooter from "@/components/PortalFooter";

const dummyReports = [
  {
    studentName: "Rahul Sharma",
    program: "B.Tech Computer Science",
    specialization: "Data Science",
    yearOfPassing: "2023",
    cgpa: "8.5",
    institute: "STME Mumbai",
    requestedBy: "Student",
    applicationDate: "2024-01-15",
    completionDate: "2024-01-22",
    status: "Completed",
  },
  {
    studentName: "Priya Patel",
    program: "MBA",
    specialization: "Finance",
    yearOfPassing: "2024",
    cgpa: "9.0",
    institute: "SBM Bangalore",
    requestedBy: "Third Party",
    applicationDate: "2024-01-16",
    completionDate: "-",
    status: "In Process",
  },
  {
    studentName: "Amit Kumar",
    program: "B.Com",
    specialization: "Accounting",
    yearOfPassing: "2022",
    cgpa: "7.8",
    institute: "SOC Hyderabad",
    requestedBy: "Government",
    applicationDate: "2024-01-17",
    completionDate: "2024-01-20",
    status: "Completed",
  },
  {
    studentName: "Sneha Reddy",
    program: "M.Sc",
    specialization: "Physics",
    yearOfPassing: "2023",
    cgpa: "8.2",
    institute: "SOS Mumbai",
    requestedBy: "Third Party",
    applicationDate: "2024-01-18",
    completionDate: "-",
    status: "Pending",
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
    toast({
      title: "Export Started",
      description: "Excel report is being generated (simulation)",
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
                  <th>Student Name</th>
                  <th>Program</th>
                  <th>Specialization</th>
                  <th>Year of Passing</th>
                  <th>CGPA</th>
                  <th>Institute</th>
                  <th>Requested By</th>
                  <th>Application Date</th>
                  <th>Completion Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report, index) => (
                  <tr key={index}>
                    <td className="font-medium">{report.studentName}</td>
                    <td>{report.program}</td>
                    <td>{report.specialization}</td>
                    <td>{report.yearOfPassing}</td>
                    <td>{report.cgpa}</td>
                    <td>{report.institute}</td>
                    <td>{report.requestedBy}</td>
                    <td>{report.applicationDate}</td>
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
