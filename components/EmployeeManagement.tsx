import { useState } from "react";
import { User } from "@/app/page";
import Layout from "@/app/App";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  FileText, 
  Upload,
  Download,
  Filter,
  Users,
  TrendingUp,
  DollarSign
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
type EmployeeStatus = "active" | "inactive" | "on-leave";
interface EmployeeManagementProps {
  currentUser: User | null;
  navigateTo: (page: string) => void;
  onLogout: () => void;
  viewEmployee: (id: string) => void;
}

interface Employee {
  id: string;
  name: string;
  department: string;
  phone: string;
  email: string;
  salary: number;
  status:  EmployeeStatus;
  documents: {
    resume?: string;
    id_proof?: string;
  };
}

export default function EmployeeManagement({ currentUser, navigateTo, onLogout, viewEmployee }: EmployeeManagementProps) {
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: "EMP001",
      name: "John Doe",
      department: "Operations",
      phone: "+91 9876543210",
      email: "john.doe@example.com",
      salary: 45000,
      status: "active",
      documents: { resume: "#", id_proof: "#" },
    },
    {
      id: "EMP002",
      name: "Jane Smith",
      department: "Management",
      phone: "+91 9876543211",
      email: "jane.smith@example.com",
      salary: 55000,
      status: "active",
      documents: { resume: "#", id_proof: "#" },
    },
    {
      id: "EMP003",
      name: "Mike Johnson",
      department: "Technical",
      phone: "+91 9876543212",
      email: "mike.johnson@example.com",
      salary: 48000,
      status: "on-leave",
      documents: { resume: "#" },
    },
    {
      id: "EMP004",
      name: "Sarah Williams",
      department: "Support",
      phone: "+91 9876543213",
      email: "sarah.w@example.com",
      salary: 42000,
      status: "active",
      documents: { resume: "#", id_proof: "#" },
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterDept, setFilterDept] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    department: "",
    phone: "",
    email: "",
    salary: "",
   status: "active" as EmployeeStatus,
  });

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch = 
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = filterDept === "all" || emp.department === filterDept;
    const matchesStatus = filterStatus === "all" || emp.status === filterStatus;
    return matchesSearch && matchesDept && matchesStatus;
  });

  const handleAddEmployee = () => {
    if (!formData.name || !formData.department || !formData.phone || !formData.email || !formData.salary) {
      toast.error("Please fill all required fields");
      return;
    }

    const newEmployee: Employee = {
      id: `EMP${String(employees.length + 1).padStart(3, "0")}`,
      name: formData.name,
      department: formData.department,
      phone: formData.phone,
      email: formData.email,
      salary: Number(formData.salary),
      status: formData.status,
      documents: {},
    };

    setEmployees([...employees, newEmployee]);
    toast.success("Employee added successfully");
    setIsAddDialogOpen(false);
    setFormData({ name: "", department: "", phone: "", email: "", salary: "", status: "active" });
  };

  const handleEditEmployee = () => {
    if (!formData.name || !formData.department || !formData.phone || !formData.email || !formData.salary) {
      toast.error("Please fill all required fields");
      return;
    }

    if (!editingEmployee) return;

    const updatedEmployees = employees.map((emp) =>
      emp.id === editingEmployee.id
        ? {
            ...emp,
            name: formData.name,
            department: formData.department,
            phone: formData.phone,
            email: formData.email,
            salary: Number(formData.salary),
            status: formData.status,
          }
        : emp
    );

    setEmployees(updatedEmployees);
    toast.success("Employee updated successfully");
    setIsEditDialogOpen(false);
    setEditingEmployee(null);
    setFormData({ name: "", department: "", phone: "", email: "", salary: "", status: "active" });
  };

  const openEditDialog = (employee: Employee) => {
    setEditingEmployee(employee);
    setFormData({
      name: employee.name,
      department: employee.department,
      phone: employee.phone,
      email: employee.email,
      salary: String(employee.salary),
      status: employee.status,
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteEmployee = (id: string) => {
    setEmployees(employees.filter((emp) => emp.id !== id));
    toast.success("Employee deleted successfully");
  };

 const getStatusBadge = (status: EmployeeStatus) => {
    const config = {
      active: { className: "bg-emerald-100 text-emerald-700 border-emerald-300", label: "Active" },
      inactive: { className: "bg-gray-100 text-gray-700 border-gray-300", label: "Inactive" },
      "on-leave": { className: "bg-amber-100 text-amber-700 border-amber-300", label: "On Leave" },
    };
    const style = config[status as keyof typeof config] || config.active;
    return <Badge className={`${style.className} border`}>{style.label}</Badge>;
  };

  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(emp => emp.status === "active").length;
  const totalSalary = employees.reduce((sum, emp) => sum + emp.salary, 0);

  return (
    <Layout currentUser={currentUser} navigateTo={navigateTo} onLogout={onLogout} currentPage="employees">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Employee Management</h2>
            <p className="text-gray-500 mt-1">Manage employee records and information</p>
          </div>
          <Sheet open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <SheetTrigger asChild>
              <Button className="bg-[#337ab7] hover:bg-[#2868a0] shadow-md">
                <Plus className="h-4 w-4 mr-2" />
                Add Employee
              </Button>
            </SheetTrigger>
              <SheetContent className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Add New Employee</SheetTitle>
                  <SheetDescription>
                    Enter the employee details to create a new record.
                  </SheetDescription>
                </SheetHeader>
                <div className="grid grid-cols-1 gap-4 px-6 py-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Department *</Label>
                    <Select value={formData.department} onValueChange={(value) => setFormData({ ...formData, department: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Operations">Operations</SelectItem>
                        <SelectItem value="Management">Management</SelectItem>
                        <SelectItem value="Technical">Technical</SelectItem>
                        <SelectItem value="Support">Support</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 XXXXXXXXXX"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="email@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="salary">Salary (₹) *</Label>
                    <Input
                      id="salary"
                      type="number"
                      value={formData.salary}
                      onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                      placeholder="Enter salary amount"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status *</Label>
                    <Select value={formData.status} onValueChange={(value: EmployeeStatus) => setFormData({ ...formData, status: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="on-leave">On Leave</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <SheetFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddEmployee} className="bg-[#337ab7] hover:bg-[#2868a0]">
                    Add Employee
                  </Button>
                </SheetFooter>
              </SheetContent>
            </Sheet>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white border-2 border-blue-200 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700">Total Employees</p>
                  <p className="text-3xl font-bold text-blue-900 mt-2">{totalEmployees}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border-2 border-emerald-200 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-emerald-700">Active Employees</p>
                  <p className="text-3xl font-bold text-emerald-900 mt-2">{activeEmployees}</p>
                </div>
                <div className="p-3 bg-emerald-100 rounded-xl">
                  <TrendingUp className="h-8 w-8 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border-2 border-purple-200 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-700">Total Salary</p>
                  <p className="text-3xl font-bold text-purple-900 mt-2">₹{totalSalary.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-xl">
                  <DollarSign className="h-8 w-8 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterDept} onValueChange={setFilterDept}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="Operations">Operations</SelectItem>
                  <SelectItem value="Management">Management</SelectItem>
                  <SelectItem value="Technical">Technical</SelectItem>
                  <SelectItem value="Support">Support</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="on-leave">On Leave</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Employees Display */}
        <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 border-b">
              <CardTitle>Employee List</CardTitle>
              <CardDescription>Complete list of all employees</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-semibold">ID</TableHead>
                      <TableHead className="font-semibold">Name</TableHead>
                      <TableHead className="font-semibold">Department</TableHead>
                      <TableHead className="font-semibold">Contact</TableHead>
                      <TableHead className="font-semibold">Salary</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="font-semibold text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEmployees.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                          No employees found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredEmployees.map((employee) => (
                        <TableRow key={employee.id} className="hover:bg-blue-50/50 transition-colors">
                          <TableCell className="font-medium text-[#337ab7]">{employee.id}</TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium text-gray-900">{employee.name}</p>
                              <p className="text-sm text-gray-500">{employee.email}</p>
                            </div>
                          </TableCell>
                          <TableCell className="text-gray-600">{employee.department}</TableCell>
                          <TableCell className="text-gray-600">{employee.phone}</TableCell>
                          <TableCell className="font-semibold text-gray-900">₹{employee.salary.toLocaleString()}</TableCell>
                          <TableCell>{getStatusBadge(employee.status)}</TableCell>
                          <TableCell>
                            <div className="flex items-center justify-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openEditDialog(employee)}
                                className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteEmployee(employee.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Edit Employee Sheet */}
          <Sheet open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <SheetContent className="overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Edit Employee</SheetTitle>
              <SheetDescription>
                Update employee information. Changes will be saved immediately.
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 px-6 py-6">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Full Name *</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-department">Department *</Label>
                <Select value={formData.department} onValueChange={(value) => setFormData({ ...formData, department: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Operations">Operations</SelectItem>
                    <SelectItem value="Management">Management</SelectItem>
                    <SelectItem value="Technical">Technical</SelectItem>
                    <SelectItem value="Support">Support</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-phone">Phone Number *</Label>
                <Input
                  id="edit-phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 XXXXXXXXXX"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email Address *</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-salary">Salary (₹) *</Label>
                <Input
                  id="edit-salary"
                  type="number"
                  value={formData.salary}
                  onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                  placeholder="Enter salary amount"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status *</Label>
                <Select value={formData.status} onValueChange={(value: EmployeeStatus) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="on-leave">On Leave</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <SheetFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditEmployee} className="bg-[#337ab7] hover:bg-[#2868a0]">
                Save Changes
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </Layout>
  );
}
