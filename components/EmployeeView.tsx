import { useState } from "react";
import { User } from "@/app/page";
import Layout from "@/app/App";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  DollarSign,
  Download,
  Calendar as CalendarIcon,
  Search
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface EmployeeViewProps {
  currentUser: User | null;
  navigateTo: (page: string) => void;
  onLogout: () => void;
  employeeId: string;
}

interface Project {
  id: string;
  name: string;
  date: Date;
  description: string;
  status: "upcoming" | "current" | "completed";
  pdf?: string;
}

export default function EmployeeView({ currentUser, navigateTo, onLogout, employeeId }: EmployeeViewProps) {
  // Mock employee data
  const employee = {
    id: employeeId,
    name: "John Doe",
    email: "john.doe@syntora.com",
    phone: "+91 9876543210",
    department: "Operations",
    position: "Senior Operator",
    salary: 45000,
    status: "active",
    joinDate: new Date(2025, 0, 15),
    address: "123 Main Street, Mumbai, Maharashtra 400001",
    documents: {
      dl: true,
      gaugat: true,
      multi: true,
      permit: false,
    },
  };

  const [projects, setProjects] = useState<Project[]>([
    {
      id: "PROJ001",
      name: "Highway Construction Phase 1",
      date: new Date(2026, 2, 15),
      description: "Major highway construction project",
      status: "upcoming",
      pdf: "#",
    },
    {
      id: "PROJ002",
      name: "Bridge Repair Project",
      date: new Date(2026, 1, 10),
      description: "Ongoing bridge maintenance and repairs",
      status: "current",
      pdf: "#",
    },
    {
      id: "PROJ003",
      name: "Road Maintenance Q4",
      date: new Date(2025, 11, 20),
      description: "Completed road maintenance work",
      status: "completed",
      pdf: "#",
    },
    {
      id: "PROJ004",
      name: "Material Transportation",
      date: new Date(2026, 1, 5),
      description: "Ongoing material delivery operations",
      status: "current",
      pdf: "#",
    },
    {
      id: "PROJ005",
      name: "Site Preparation",
      date: new Date(2025, 10, 15),
      description: "Site preparation and leveling completed",
      status: "completed",
      pdf: "#",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

 const getStatusBadge = (status: Project["status"]) => {
  const config = {
    upcoming: {
      variant: "outline" as const,
      label: "Upcoming",
      className: "border-blue-500 text-blue-600",
    },
    current: {
      variant: "default" as const,
      label: "Current",
      className: "bg-green-500",
    },
    completed: {
      variant: "secondary" as const,
      label: "Completed",
      className: "", // ✅ FIX
    },
  };

  const { variant, label, className } = config[status];

  return (
    <Badge variant={variant} className={className}>
      {label}
    </Badge>
  );
};

  const upcomingProjects = projects.filter((p) => 
    p.status === "upcoming" && 
    (p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
     p.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const currentProjects = projects.filter((p) => 
    p.status === "current" && 
    (p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
     p.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const completedProjects = projects.filter((p) => 
    p.status === "completed" && 
    (p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
     p.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Layout currentUser={currentUser} navigateTo={navigateTo} onLogout={onLogout}>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigateTo("employees")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Employee Profile</h1>
            <p className="text-gray-500 mt-1">View detailed employee information and project history</p>
          </div>
        </div>

        {/* Employee Info Card */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col items-center md:items-start gap-4">
                <Avatar className="h-32 w-32">
                  <AvatarFallback className="text-3xl bg-[#337ab7] text-white">
                    {getInitials(employee.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex gap-2">
                  {employee.documents.dl && (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      DL
                    </Badge>
                  )}
                  {employee.documents.gaugat && (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      Gaugat
                    </Badge>
                  )}
                  {employee.documents.multi && (
                    <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                      Multi
                    </Badge>
                  )}
                  {employee.documents.permit && (
                    <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                      Permit
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{employee.name}</h2>
                  <p className="text-gray-500">{employee.position}</p>
                  <Badge className="mt-2 bg-[#337ab7]">{employee.status}</Badge>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">{employee.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">{employee.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Briefcase className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">{employee.department}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <DollarSign className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">₹{employee.salary.toLocaleString()}/month</span>
                  </div>
                </div>

                <div className="md:col-span-2 space-y-3">
                  <div className="flex items-start gap-3 text-sm">
                    <MapPin className="h-4 w-4 text-gray-400 mt-1" />
                    <span className="text-gray-600">{employee.address}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <CalendarIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">
                      Joined: {format(employee.joinDate, "MMMM dd, yyyy")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Projects Tabs */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Project History</CardTitle>
                <CardDescription>View employee&apos;s project assignments and history</CardDescription>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="current" className="w-full">
              <TabsList className="grid w-full md:w-auto grid-cols-3 mb-6">
                <TabsTrigger value="upcoming">
                  Upcoming ({upcomingProjects.length})
                </TabsTrigger>
                <TabsTrigger value="current">
                  Current ({currentProjects.length})
                </TabsTrigger>
                <TabsTrigger value="history">
                  History ({completedProjects.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="upcoming">
                <div className="space-y-4">
                  {upcomingProjects.map((project) => (
                    <Card key={project.id} className="border-2">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-gray-900">{project.name}</h3>
                              {getStatusBadge(project.status)}
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{project.description}</p>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <CalendarIcon className="h-3 w-3" />
                              <span>Scheduled: {format(project.date, "MMM dd, yyyy")}</span>
                            </div>
                          </div>
                          {project.pdf && (
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4 mr-1" />
                              PDF
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {upcomingProjects.length === 0 && (
                    <div className="text-center py-12">
                      <p className="text-gray-500">No upcoming projects</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="current">
                <div className="space-y-4">
                  {currentProjects.map((project) => (
                    <Card key={project.id} className="border-2 border-green-200">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-gray-900">{project.name}</h3>
                              {getStatusBadge(project.status)}
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{project.description}</p>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <CalendarIcon className="h-3 w-3" />
                              <span>Started: {format(project.date, "MMM dd, yyyy")}</span>
                            </div>
                          </div>
                          {project.pdf && (
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4 mr-1" />
                              PDF
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {currentProjects.length === 0 && (
                    <div className="text-center py-12">
                      <p className="text-gray-500">No current projects</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="history">
                <div className="rounded-lg border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead>Project ID</TableHead>
                        <TableHead>Project Name</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>PDF</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {completedProjects.map((project) => (
                        <TableRow key={project.id}>
                          <TableCell className="font-medium">{project.id}</TableCell>
                          <TableCell className="font-medium">{project.name}</TableCell>
                          <TableCell>{format(project.date, "MMM dd, yyyy")}</TableCell>
                          <TableCell className="max-w-md truncate">{project.description}</TableCell>
                          <TableCell>{getStatusBadge(project.status)}</TableCell>
                          <TableCell>
                            {project.pdf ? (
                              <Button variant="ghost" size="sm">
                                <Download className="h-4 w-4" />
                              </Button>
                            ) : (
                              <span className="text-gray-400 text-sm">No PDF</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                {completedProjects.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No completed projects</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
