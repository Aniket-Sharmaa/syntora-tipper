import { useState } from "react";
import { User } from "@/app/page";
import Layout from "@/app/App";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "@/components/ui/sheet";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Download,
  Calendar as CalendarIcon,
  CheckCircle2,
  Clock,
  DollarSign,
  TrendingUp,
  AlertCircle
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

interface PaymentManagementProps {
  currentUser: User | null;
  navigateTo: (page: string) => void;
  onLogout: () => void;
}

interface Payment {
  id: string;
  project: string;
  noTrip: string;
  cost: number;
  date: Date;
  pdfUrl?: string;
  value: number;
  received: number;
  remaining: number;
}

export default function PaymentManagement({ currentUser, navigateTo, onLogout }: PaymentManagementProps) {
  const [payments, setPayments] = useState<Payment[]>([
    {
      id: "PAY001",
      project: "Highway Construction Phase 1",
      noTrip: "HC-2024-001",
      cost: 150000,
      date: new Date(2026, 1, 1),
      value: 150000,
      received: 90000,
      remaining: 60000,
      pdfUrl: "#",
    },
    {
      id: "PAY002",
      project: "Bridge Repair Project",
      noTrip: "BR-2024-005",
      cost: 85000,
      date: new Date(2026, 1, 5),
      value: 85000,
      received: 85000,
      remaining: 0,
      pdfUrl: "#",
    },
    {
      id: "PAY003",
      project: "Road Maintenance",
      noTrip: "RM-2024-012",
      cost: 45000,
      date: new Date(2026, 1, 10),
      value: 45000,
      received: 20000,
      remaining: 25000,
      pdfUrl: "#",
    },
    {
      id: "PAY004",
      project: "Building Construction",
      noTrip: "BC-2024-008",
      cost: 120000,
      date: new Date(2026, 1, 12),
      value: 120000,
      received: 120000,
      remaining: 0,
      pdfUrl: "#",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);
  const [formData, setFormData] = useState({
    project: "",
    noTrip: "",
    cost: "",
    date: new Date(),
    value: "",
    received: "",
  });

  const filteredPayments = payments.filter((pay) =>
    pay.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pay.noTrip.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pay.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddPayment = () => {
    if (!formData.project || !formData.noTrip || !formData.cost || !formData.value || !formData.received) {
      toast.error("Please fill all required fields");
      return;
    }

    const value = Number(formData.value);
    const received = Number(formData.received);

    const newPayment: Payment = {
      id: `PAY${String(payments.length + 1).padStart(3, "0")}`,
      project: formData.project,
      noTrip: formData.noTrip,
      cost: Number(formData.cost),
      date: formData.date,
      value,
      received,
      remaining: value - received,
      pdfUrl: "#",
    };

    setPayments([...payments, newPayment]);
    toast.success("Payment added successfully");
    setIsAddDialogOpen(false);
    setFormData({ project: "", noTrip: "", cost: "", date: new Date(), value: "", received: "" });
  };

  const handleEditPayment = () => {
    if (!formData.project || !formData.noTrip || !formData.cost || !formData.value || !formData.received) {
      toast.error("Please fill all required fields");
      return;
    }

    if (!editingPayment) return;

    const value = Number(formData.value);
    const received = Number(formData.received);

    const updatedPayments = payments.map((pay) =>
      pay.id === editingPayment.id
        ? {
            ...pay,
            project: formData.project,
            noTrip: formData.noTrip,
            cost: Number(formData.cost),
            date: formData.date,
            value,
            received,
            remaining: value - received,
          }
        : pay
    );

    setPayments(updatedPayments);
    toast.success("Payment updated successfully");
    setIsEditDialogOpen(false);
    setEditingPayment(null);
    setFormData({ project: "", noTrip: "", cost: "", date: new Date(), value: "", received: "" });
  };

  const openEditDialog = (payment: Payment) => {
    setEditingPayment(payment);
    setFormData({
      project: payment.project,
      noTrip: payment.noTrip,
      cost: String(payment.cost),
      date: payment.date,
      value: String(payment.value),
      received: String(payment.received),
    });
    setIsEditDialogOpen(true);
  };

  const handleDeletePayment = (id: string) => {
    setPayments(payments.filter((pay) => pay.id !== id));
    toast.success("Payment deleted successfully");
  };

  const totalValue = payments.reduce((sum, pay) => sum + pay.value, 0);
  const totalReceived = payments.reduce((sum, pay) => sum + pay.received, 0);
  const totalRemaining = payments.reduce((sum, pay) => sum + pay.remaining, 0);

  return (
    <Layout currentUser={currentUser} navigateTo={navigateTo} onLogout={onLogout} currentPage="payments">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Payment Management</h2>
            <p className="text-gray-500 mt-1">Track and manage payment records</p>
          </div>
          <Sheet open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <SheetTrigger asChild>
                <Button className="bg-[#337ab7] hover:bg-[#2868a0] shadow-md">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Payment
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Add New Payment</SheetTitle>
                  <SheetDescription>
                    Enter payment details to track project finances.
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
                    <Label htmlFor="noTrip">Trip Number *</Label>
                    <Input
                      id="noTrip"
                      value={formData.noTrip}
                      onChange={(e) => setFormData({ ...formData, noTrip: e.target.value })}
                      placeholder="e.g., HC-2024-001"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cost">Cost (₹) *</Label>
                    <Input
                      id="cost"
                      type="number"
                      value={formData.cost}
                      onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                      placeholder="Enter cost"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Payment Date *</Label>
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
                    <Label htmlFor="value">Total Value (₹) *</Label>
                    <Input
                      id="value"
                      type="number"
                      value={formData.value}
                      onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                      placeholder="Enter total value"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="received">Received (₹) *</Label>
                    <Input
                      id="received"
                      type="number"
                      value={formData.received}
                      onChange={(e) => setFormData({ ...formData, received: e.target.value })}
                      placeholder="Enter received amount"
                    />
                  </div>
                </div>
                <SheetFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddPayment} className="bg-[#337ab7] hover:bg-[#2868a0]">
                    Add Payment
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
                  <p className="text-sm font-medium text-blue-700">Total Value</p>
                  <p className="text-3xl font-bold text-blue-900 mt-2">₹{totalValue.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-xl">
                  <DollarSign className="h-8 w-8 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border-2 border-emerald-200 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-emerald-700">Total Received</p>
                  <p className="text-3xl font-bold text-emerald-900 mt-2">₹{totalReceived.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-emerald-100 rounded-xl">
                  <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border-2 border-orange-200 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-700">Total Remaining</p>
                  <p className="text-3xl font-bold text-orange-900 mt-2">₹{totalRemaining.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-xl">
                  <Clock className="h-8 w-8 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search payments by project, trip number, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Payments Display */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 border-b">
            <CardTitle>Payment List</CardTitle>
            <CardDescription>Complete list of all payments</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold">ID</TableHead>
                    <TableHead className="font-semibold">Project</TableHead>
                    <TableHead className="font-semibold">Trip No.</TableHead>
                    <TableHead className="font-semibold">Date</TableHead>
                    <TableHead className="font-semibold">Value</TableHead>
                    <TableHead className="font-semibold">Received</TableHead>
                    <TableHead className="font-semibold">Remaining</TableHead>
                    <TableHead className="font-semibold">Progress</TableHead>
                    <TableHead className="font-semibold text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                        No payments found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPayments.map((payment) => {
                      const progress = (payment.received / payment.value) * 100;
                      return (
                        <TableRow key={payment.id} className="hover:bg-blue-50/50 transition-colors">
                          <TableCell className="font-medium text-[#337ab7]">{payment.id}</TableCell>
                          <TableCell className="font-medium text-gray-900">{payment.project}</TableCell>
                          <TableCell className="text-gray-600">{payment.noTrip}</TableCell>
                          <TableCell className="text-gray-600">{format(payment.date, "PP")}</TableCell>
                          <TableCell className="font-semibold text-gray-900">₹{payment.value.toLocaleString()}</TableCell>
                          <TableCell className="font-semibold text-gray-900">₹{payment.received.toLocaleString()}</TableCell>
                          <TableCell className="font-semibold text-gray-900">₹{payment.remaining.toLocaleString()}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Progress value={progress} className="w-20" />
                              <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openEditDialog(payment)}
                                className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeletePayment(payment.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Edit Payment Sheet */}
        <Sheet open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <SheetContent className="overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Edit Payment</SheetTitle>
              <SheetDescription>
                Update payment information. Changes will be saved immediately.
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
                <Label htmlFor="edit-noTrip">Trip Number *</Label>
                <Input
                  id="edit-noTrip"
                  value={formData.noTrip}
                  onChange={(e) => setFormData({ ...formData, noTrip: e.target.value })}
                  placeholder="e.g., HC-2024-001"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-cost">Cost (₹) *</Label>
                <Input
                  id="edit-cost"
                  type="number"
                  value={formData.cost}
                  onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                  placeholder="Enter cost"
                />
              </div>
              <div className="space-y-2">
                <Label>Payment Date *</Label>
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
                <Label htmlFor="edit-value">Total Value (₹) *</Label>
                <Input
                  id="edit-value"
                  type="number"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  placeholder="Enter total value"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-received">Received (₹) *</Label>
                <Input
                  id="edit-received"
                  type="number"
                  value={formData.received}
                  onChange={(e) => setFormData({ ...formData, received: e.target.value })}
                  placeholder="Enter received amount"
                />
              </div>
            </div>
            <SheetFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditPayment} className="bg-[#337ab7] hover:bg-[#2868a0]">
                Save Changes
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </Layout>
  );
}
