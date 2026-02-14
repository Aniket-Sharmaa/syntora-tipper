import { useState } from "react";
import { User } from "@/app/page";
import Layout from "@/app/App";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "@/components/ui/sheet";
import { toast } from "sonner";
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Upload,
  Download,
  Calendar as CalendarIcon,
  TrendingUp,
  Receipt,
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
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface ExpenseManagementProps {
  currentUser: User | null;
  navigateTo: (page: string) => void;
  onLogout: () => void;
}

interface Expense {
  id: string;
  project: string;
  date: Date;
  description: string;
  price: number;
  pdfUrl?: string;
}

export default function ExpenseManagement({ currentUser, navigateTo, onLogout }: ExpenseManagementProps) {
  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: "EXP001",
      project: "Highway Construction Phase 1",
      date: new Date(2026, 1, 1),
      description: "Material procurement - Cement and steel",
      price: 125000,
      pdfUrl: "#",
    },
    {
      id: "EXP002",
      project: "Bridge Repair Project",
      date: new Date(2026, 1, 5),
      description: "Labor costs for week 1",
      price: 45000,
      pdfUrl: "#",
    },
    {
      id: "EXP003",
      project: "Road Maintenance",
      date: new Date(2026, 1, 10),
      description: "Equipment rental - Excavator",
      price: 35000,
      pdfUrl: "#",
    },
    {
      id: "EXP004",
      project: "Building Construction",
      date: new Date(2026, 1, 12),
      description: "Electrical supplies and fixtures",
      price: 28000,
      pdfUrl: "#",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [formData, setFormData] = useState({
    project: "",
    date: new Date(),
    description: "",
    price: "",
  });

  const filteredExpenses = expenses.filter((exp) =>
    exp.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exp.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exp.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddExpense = () => {
    if (!formData.project || !formData.description || !formData.price) {
      toast.error("Please fill all required fields");
      return;
    }

    const newExpense: Expense = {
      id: `EXP${String(expenses.length + 1).padStart(3, "0")}`,
      project: formData.project,
      date: formData.date,
      description: formData.description,
      price: Number(formData.price),
      pdfUrl: "#",
    };

    setExpenses([...expenses, newExpense]);
    toast.success("Expense added successfully");
    setIsAddDialogOpen(false);
    setFormData({ project: "", date: new Date(), description: "", price: "" });
  };

  const handleEditExpense = () => {
    if (!formData.project || !formData.description || !formData.price) {
      toast.error("Please fill all required fields");
      return;
    }

    if (!editingExpense) return;

    const updatedExpenses = expenses.map((exp) =>
      exp.id === editingExpense.id
        ? {
            ...exp,
            project: formData.project,
            date: formData.date,
            description: formData.description,
            price: Number(formData.price),
          }
        : exp
    );

    setExpenses(updatedExpenses);
    toast.success("Expense updated successfully");
    setIsEditDialogOpen(false);
    setEditingExpense(null);
    setFormData({ project: "", date: new Date(), description: "", price: "" });
  };

  const openEditDialog = (expense: Expense) => {
    setEditingExpense(expense);
    setFormData({
      project: expense.project,
      date: expense.date,
      description: expense.description,
      price: String(expense.price),
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(expenses.filter((exp) => exp.id !== id));
    toast.success("Expense deleted successfully");
  };

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.price, 0);
  const avgExpense = expenses.length > 0 ? totalExpenses / expenses.length : 0;
  const thisMonthExpenses = expenses.filter(
    (exp) =>
      exp.date.getMonth() === new Date().getMonth() &&
      exp.date.getFullYear() === new Date().getFullYear()
  ).length;

  const chartData = expenses.slice(0, 6).map((exp) => ({
    name: exp.project.substring(0, 15) + "...",
    amount: exp.price,
  }));

  return (
    <Layout currentUser={currentUser} navigateTo={navigateTo} onLogout={onLogout} currentPage="expenses">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Expense Management</h2>
            <p className="text-gray-500 mt-1">Track and manage project expenses</p>
          </div>
          <Sheet open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <SheetTrigger asChild>
                <Button className="bg-[#337ab7] hover:bg-[#2868a0] shadow-md">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Expense
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Add New Expense</SheetTitle>
                  <SheetDescription>
                    Enter expense details to track project costs.
                  </SheetDescription>
                </SheetHeader>
                <div className="grid gap-4 px-6 py-6">
                  <div className="space-y-2">
                    <Label htmlFor="project">Project Name *</Label>
                    <Input
                      id="project"
                      value={formData.project}
                      onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                      placeholder="Enter project name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Expense Date *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {format(formData.date, "PPP")}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={formData.date}
                          onSelect={(date) => date && setFormData({ ...formData, date })}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Enter expense description"
                      rows={4}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Amount (₹) *</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="Enter amount"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pdf">Upload Receipt (Optional)</Label>
                    <Input id="pdf" type="file" accept=".pdf" />
                  </div>
                </div>
                <SheetFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddExpense} className="bg-[#337ab7] hover:bg-[#2868a0]">
                    Add Expense
                  </Button>
                </SheetFooter>
              </SheetContent>
            </Sheet>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white border-2 border-purple-200 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-700">Total Expenses</p>
                  <p className="text-3xl font-bold text-purple-900 mt-2">₹{totalExpenses.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-xl">
                  <DollarSign className="h-8 w-8 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border-2 border-blue-200 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700">Average Expense</p>
                  <p className="text-3xl font-bold text-blue-900 mt-2">₹{Math.round(avgExpense).toLocaleString()}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-xl">
                  <TrendingUp className="h-8 w-8 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border-2 border-emerald-200 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-emerald-700">This Month</p>
                  <p className="text-3xl font-bold text-emerald-900 mt-2">{thisMonthExpenses}</p>
                </div>
                <div className="p-3 bg-emerald-100 rounded-xl">
                  <Receipt className="h-8 w-8 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chart */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-purple-50 border-b">
            <CardTitle>Expense Overview</CardTitle>
            <CardDescription>Recent expense distribution by project</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Bar dataKey="amount" fill="#337ab7" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Search */}
        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search expenses by project, description, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Expenses Display */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-purple-50 border-b">
            <CardTitle>Expense List</CardTitle>
            <CardDescription>Complete list of all expenses</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold">ID</TableHead>
                    <TableHead className="font-semibold">Project</TableHead>
                    <TableHead className="font-semibold">Date</TableHead>
                    <TableHead className="font-semibold">Description</TableHead>
                    <TableHead className="font-semibold">Amount</TableHead>
                    <TableHead className="font-semibold text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredExpenses.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                        No expenses found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredExpenses.map((expense) => (
                      <TableRow key={expense.id} className="hover:bg-purple-50/50 transition-colors">
                        <TableCell className="font-medium text-[#337ab7]">{expense.id}</TableCell>
                        <TableCell className="font-medium text-gray-900">{expense.project}</TableCell>
                        <TableCell className="text-gray-600">{format(expense.date, "PP")}</TableCell>
                        <TableCell className="text-gray-600 max-w-xs truncate">{expense.description}</TableCell>
                        <TableCell className="font-semibold text-gray-900">₹{expense.price.toLocaleString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditDialog(expense)}
                              className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteExpense(expense.id)}
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

        {/* Edit Expense Sheet */}
        <Sheet open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <SheetContent className="overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Edit Expense</SheetTitle>
              <SheetDescription>
                Update expense information. Changes will be saved immediately.
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 px-6 py-6">
              <div className="space-y-2">
                <Label htmlFor="edit-project">Project Name *</Label>
                <Input
                  id="edit-project"
                  value={formData.project}
                  onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                  placeholder="Enter project name"
                />
              </div>
              <div className="space-y-2">
                <Label>Expense Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(formData.date, "PPP")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.date}
                      onSelect={(date) => date && setFormData({ ...formData, date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description *</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter expense description"
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-price">Amount (₹) *</Label>
                <Input
                  id="edit-price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="Enter amount"
                />
              </div>
            </div>
            <SheetFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditExpense} className="bg-[#337ab7] hover:bg-[#2868a0]">
                Save Changes
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </Layout>
  );
}
