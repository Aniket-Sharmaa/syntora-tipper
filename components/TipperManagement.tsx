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
import { Search, Plus, Edit, Trash2, Upload, Download, Calendar as CalendarIcon, Truck, TrendingUp, DollarSign, MapPin } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";

interface TipperManagementProps {
  currentUser: User | null;
  navigateTo: (page: string) => void;
  onLogout: () => void;
}

interface TipperEntry {
  id: string;
  project: string;
  address: string;
  noTrip: string;
  description: string;
  pdf?: string;
  cost: number;
  date: Date;
}

export default function TipperManagement({ currentUser, navigateTo, onLogout }: TipperManagementProps) {
  const [tippers, setTippers] = useState<TipperEntry[]>([
    {
      id: "TIP001",
      project: "Highway Construction Phase 1",
      address: "Mumbai-Pune Highway, Sector 12",
      noTrip: "HC-001-50",
      description: "Gravel and sand transportation - 50 trips",
      cost: 125000,
      date: new Date(2026, 1, 1),
      pdf: "#",
    },
    {
      id: "TIP002",
      project: "Bridge Repair Project",
      address: "Bridge Site, Bandra West",
      noTrip: "BR-005-30",
      description: "Cement and construction material - 30 trips",
      cost: 85000,
      date: new Date(2026, 1, 5),
      pdf: "#",
    },
    {
      id: "TIP003",
      project: "Road Maintenance",
      address: "Link Road, Andheri East",
      noTrip: "RM-012-25",
      description: "Asphalt and road repair materials - 25 trips",
      cost: 62000,
      date: new Date(2026, 1, 10),
      pdf: "#",
    },
    {
      id: "TIP004",
      project: "Building Construction",
      address: "Worli Construction Site",
      noTrip: "BC-008-40",
      description: "Steel and construction debris removal - 40 trips",
      cost: 98000,
      date: new Date(2026, 1, 12),
      pdf: "#",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingTipper, setEditingTipper] = useState<TipperEntry | null>(null);
  const [formData, setFormData] = useState({
    project: "",
    address: "",
    noTrip: "",
    description: "",
    cost: "",
    date: new Date(),
  });

  const filteredTippers = tippers.filter((tip) =>
    tip.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tip.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tip.noTrip.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tip.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddTipper = () => {
    if (!formData.project || !formData.address || !formData.noTrip || !formData.description || !formData.cost) {
      toast.error("Please fill all required fields");
      return;
    }

    const newTipper: TipperEntry = {
      id: `TIP${String(tippers.length + 1).padStart(3, "0")}`,
      project: formData.project,
      address: formData.address,
      noTrip: formData.noTrip,
      description: formData.description,
      cost: Number(formData.cost),
      date: formData.date,
      pdf: "#",
    };

    setTippers([...tippers, newTipper]);
    toast.success("Tipper entry added successfully");
    setIsAddDialogOpen(false);
    setFormData({ project: "", address: "", noTrip: "", description: "", cost: "", date: new Date() });
  };

  const handleEditTipper = () => {
    if (!formData.project || !formData.address || !formData.noTrip || !formData.description || !formData.cost) {
      toast.error("Please fill all required fields");
      return;
    }

    if (!editingTipper) return;

    const updatedTippers = tippers.map((tip) =>
      tip.id === editingTipper.id
        ? {
            ...tip,
            project: formData.project,
            address: formData.address,
            noTrip: formData.noTrip,
            description: formData.description,
            cost: Number(formData.cost),
            date: formData.date,
          }
        : tip
    );

    setTippers(updatedTippers);
    toast.success("Tipper entry updated successfully");
    setIsEditDialogOpen(false);
    setEditingTipper(null);
    setFormData({ project: "", address: "", noTrip: "", description: "", cost: "", date: new Date() });
  };

  const openEditDialog = (tipper: TipperEntry) => {
    setEditingTipper(tipper);
    setFormData({
      project: tipper.project,
      address: tipper.address,
      noTrip: tipper.noTrip,
      description: tipper.description,
      cost: String(tipper.cost),
      date: tipper.date,
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteTipper = (id: string) => {
    setTippers(tippers.filter((tip) => tip.id !== id));
    toast.success("Tipper entry deleted successfully");
  };

  const totalTrips = tippers.length;
  const totalCost = tippers.reduce((sum, tip) => sum + tip.cost, 0);
  const avgCost = tippers.length > 0 ? totalCost / tippers.length : 0;

  return (
    <Layout currentUser={currentUser} navigateTo={navigateTo} onLogout={onLogout} currentPage="tippers">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Tipper Management</h2>
            <p className="text-gray-500 mt-1">Track tipper trips and transportation</p>
          </div>
          <Sheet open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <SheetTrigger asChild>
                <Button className="bg-[#337ab7] hover:bg-[#2868a0] shadow-md">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Tipper Entry
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Add New Tipper Entry</SheetTitle>
                  <SheetDescription>
                    Enter tipper trip details to track transportation.
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
                    <Label htmlFor="address">Address *</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Enter delivery address"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="noTrip">Number of Trips *</Label>
                    <Input
                      id="noTrip"
                      value={formData.noTrip}
                      onChange={(e) => setFormData({ ...formData, noTrip: e.target.value })}
                      placeholder="e.g., HC-001-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Enter trip description"
                      rows={4}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cost">Cost (₹) *</Label>
                    <Input
                      id="cost"
                      type="number"
                      value={formData.cost}
                      onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                      placeholder="Enter total cost"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Trip Date *</Label>
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
                </div>
                <SheetFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddTipper} className="bg-[#337ab7] hover:bg-[#2868a0]">
                    Add Entry
                  </Button>
                </SheetFooter>
              </SheetContent>
            </Sheet>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white border-2 border-orange-200 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-700">Total Trips</p>
                  <p className="text-3xl font-bold text-orange-900 mt-2">{totalTrips}</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-xl">
                  <Truck className="h-8 w-8 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border-2 border-purple-200 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-700">Total Cost</p>
                  <p className="text-3xl font-bold text-purple-900 mt-2">₹{totalCost.toLocaleString()}</p>
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
                  <p className="text-sm font-medium text-blue-700">Average Cost</p>
                  <p className="text-3xl font-bold text-blue-900 mt-2">₹{Math.round(avgCost).toLocaleString()}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-xl">
                  <TrendingUp className="h-8 w-8 text-blue-600" />
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
                placeholder="Search tipper entries by project, address, or trip number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Tippers Display */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-orange-50 border-b">
            <CardTitle>Tipper List</CardTitle>
            <CardDescription>Complete list of all tipper entries</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold">ID</TableHead>
                    <TableHead className="font-semibold">Project</TableHead>
                    <TableHead className="font-semibold">Address</TableHead>
                    <TableHead className="font-semibold">Trip No.</TableHead>
                    <TableHead className="font-semibold">Date</TableHead>
                    <TableHead className="font-semibold">Cost</TableHead>
                    <TableHead className="font-semibold text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTippers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                        No tipper entries found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTippers.map((tipper) => (
                      <TableRow key={tipper.id} className="hover:bg-orange-50/50 transition-colors">
                        <TableCell className="font-medium text-[#337ab7]">{tipper.id}</TableCell>
                        <TableCell className="font-medium text-gray-900">{tipper.project}</TableCell>
                        <TableCell className="text-gray-600 max-w-xs truncate">{tipper.address}</TableCell>
                        <TableCell className="text-gray-600">{tipper.noTrip}</TableCell>
                        <TableCell className="text-gray-600">{format(tipper.date, "PP")}</TableCell>
                        <TableCell className="font-semibold text-gray-900">₹{tipper.cost.toLocaleString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditDialog(tipper)}
                              className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteTipper(tipper.id)}
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

        {/* Edit Tipper Sheet */}
        <Sheet open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <SheetContent className="overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Edit Tipper Entry</SheetTitle>
              <SheetDescription>
                Update tipper information. Changes will be saved immediately.
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
                <Label htmlFor="edit-address">Address *</Label>
                <Input
                  id="edit-address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Enter delivery address"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-noTrip">Number of Trips *</Label>
                <Input
                  id="edit-noTrip"
                  value={formData.noTrip}
                  onChange={(e) => setFormData({ ...formData, noTrip: e.target.value })}
                  placeholder="e.g., HC-001-50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description *</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter trip description"
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-cost">Cost (₹) *</Label>
                <Input
                  id="edit-cost"
                  type="number"
                  value={formData.cost}
                  onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                  placeholder="Enter total cost"
                />
              </div>
              <div className="space-y-2">
                <Label>Trip Date *</Label>
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
            </div>
            <SheetFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditTipper} className="bg-[#337ab7] hover:bg-[#2868a0]">
                Save Changes
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </Layout>
  );
}
