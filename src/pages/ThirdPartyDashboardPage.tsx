import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Download } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import PortalHeader from "@/components/PortalHeader";
import PortalFooter from "@/components/PortalFooter";

const dummyApplications = [
  {
    id: "APP-2024-001",
    studentName: "Rahul Sharma",
    studentNumber: "STU20210001",
    passingYear: "2023",
    program: "B.Tech Computer Science",
    stream: "Data Science",
    semester: "8",
    document: "Degree Certificate",
    status: "Completed",
    requestedDate: "2024-01-15",
  },
  {
    id: "APP-2024-002",
    studentName: "Priya Patel",
    studentNumber: "STU20200045",
    passingYear: "2024",
    program: "MBA",
    stream: "Finance",
    semester: "4",
    document: "Grade Sheet",
    status: "In Process",
    requestedDate: "2024-01-18",
  },
  {
    id: "APP-2024-003",
    studentName: "Amit Kumar",
    studentNumber: "STU20190078",
    passingYear: "2022",
    program: "B.Com",
    stream: "Accounting",
    semester: "6",
    document: "Degree Certificate",
    status: "Pending",
    requestedDate: "2024-01-20",
  },
];

const ThirdPartyDashboardPage = () => {
  const navigate = useNavigate();
  const [applications] = useState(dummyApplications);

  const handleLogout = () => {
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
    navigate("/");
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "Completed": return "status-completed";
      case "In Process": return "status-inprocess";
      default: return "status-pending";
    }
  };

  const handleDownloadInvoice = (appId: string) => {
    toast({
      title: "Invoice Downloaded",
      description: `Invoice for ${appId} has been downloaded (simulation)`,
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PortalHeader 
        showLogout 
        userType="Third Party" 
        onLogout={handleLogout} 
      />
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="page-title mb-0">Third Party Dashboard</h2>
            <p className="text-sm text-muted-foreground">
              Welcome, ABC Consulting Pvt. Ltd.
            </p>
          </div>
          <button 
            onClick={() => navigate("/third-party/apply")}
            className="btn-primary"
          >
            + Apply for Verification
          </button>
        </div>

        <div className="form-section p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="portal-table">
              <thead>
                <tr>
                  <th>Application ID</th>
                  <th>Student Name</th>
                  <th>Student Number</th>
                  <th>Passing Year</th>
                  <th>Program</th>
                  <th>Stream</th>
                  <th>Semester</th>
                  <th>Document</th>
                  <th>Status</th>
                  <th>Requested Date</th>
                  <th>Invoice</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id}>
                    <td className="font-medium">{app.id}</td>
                    <td>{app.studentName}</td>
                    <td>{app.studentNumber}</td>
                    <td>{app.passingYear}</td>
                    <td>{app.program}</td>
                    <td>{app.stream}</td>
                    <td>{app.semester}</td>
                    <td>{app.document}</td>
                    <td>
                      <span className={getStatusClass(app.status)}>
                        {app.status}
                      </span>
                    </td>
                    <td>{app.requestedDate}</td>
                    <td>
                      <button
                        onClick={() => handleDownloadInvoice(app.id)}
                        className="text-primary hover:underline inline-flex items-center gap-1"
                      >
                        <Download size={14} />
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 text-sm text-muted-foreground">
          Showing {applications.length} applications
        </div>
      </main>

      <PortalFooter />
    </div>
  );
};

export default ThirdPartyDashboardPage;
