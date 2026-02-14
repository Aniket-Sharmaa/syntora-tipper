import { useState } from "react";
import { User } from "@/app/page";
import Layout from "@/app/App";
import MapView from "@/app/MapView";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "@/components/ui/sheet";
import { toast } from "sonner";
import { Search, Plus, Edit, Trash2, MapPin, Navigation, Map, TrendingUp, Building } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface AddressManagementProps {
  currentUser: User | null;
  navigateTo: (page: string) => void;
  onLogout: () => void;
}

interface Address {
  id: string;
  title: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  category: "office" | "site" | "warehouse" | "other";
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export default function AddressManagement({ currentUser, navigateTo, onLogout }: AddressManagementProps) {
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: "ADDR001",
      title: "Main Office",
      addressLine1: "Plot No. 45, Sector 18",
      addressLine2: "Industrial Area, Phase 2",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001",
      country: "India",
      category: "office",
      coordinates: { lat: 19.0760, lng: 72.8777 },
    },
    {
      id: "ADDR002",
      title: "Highway Construction Site",
      addressLine1: "Km 25, Mumbai-Pune Highway",
      addressLine2: "Near Lonavala Toll Plaza",
      city: "Lonavala",
      state: "Maharashtra",
      pincode: "410401",
      country: "India",
      category: "site",
      coordinates: { lat: 18.7536, lng: 73.4127 },
    },
    {
      id: "ADDR003",
      title: "Materials Warehouse",
      addressLine1: "Building 12, MIDC Complex",
      addressLine2: "Turbhe Industrial Area",
      city: "Navi Mumbai",
      state: "Maharashtra",
      pincode: "400705",
      country: "India",
      category: "warehouse",
      coordinates: { lat: 19.0688, lng: 73.0207 },
    },
    {
      id: "ADDR004",
      title: "Bridge Repair Site",
      addressLine1: "Bandra-Worli Sea Link",
      addressLine2: "Near Worli Junction",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400030",
      country: "India",
      category: "site",
      coordinates: { lat: 19.0330, lng: 72.8197 },
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [selectedAddressId, setSelectedAddressId] = useState<string | undefined>(undefined);
  const [formData, setFormData] = useState({
    title: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
    category: "other" as Address["category"],
  });

  const filteredAddresses = addresses.filter((addr) => {
    const matchesSearch =
      addr.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      addr.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      addr.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || addr.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddAddress = () => {
    if (!formData.title || !formData.addressLine1 || !formData.city || !formData.state || !formData.pincode) {
      toast.error("Please fill all required fields");
      return;
    }

    const newAddress: Address = {
      id: `ADDR${String(addresses.length + 1).padStart(3, "0")}`,
      title: formData.title,
      addressLine1: formData.addressLine1,
      addressLine2: formData.addressLine2,
      city: formData.city,
      state: formData.state,
      pincode: formData.pincode,
      country: formData.country,
      category: formData.category,
      coordinates: {
        lat: 19.0760 + Math.random() * 0.5,
        lng: 72.8777 + Math.random() * 0.5,
      },
    };

    setAddresses([...addresses, newAddress]);
    toast.success("Address added successfully");
    setIsAddDialogOpen(false);
    setFormData({
      title: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      pincode: "",
      country: "India",
      category: "other",
    });
  };

  const handleEditAddress = () => {
    if (!formData.title || !formData.addressLine1 || !formData.city || !formData.state || !formData.pincode) {
      toast.error("Please fill all required fields");
      return;
    }

    if (!editingAddress) return;

    const updatedAddresses = addresses.map((addr) =>
      addr.id === editingAddress.id
        ? {
            ...addr,
            title: formData.title,
            addressLine1: formData.addressLine1,
            addressLine2: formData.addressLine2,
            city: formData.city,
            state: formData.state,
            pincode: formData.pincode,
            country: formData.country,
            category: formData.category,
          }
        : addr
    );

    setAddresses(updatedAddresses);
    toast.success("Address updated successfully");
    setIsEditDialogOpen(false);
    setEditingAddress(null);
    setFormData({
      title: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      pincode: "",
      country: "India",
      category: "other",
    });
  };

  const openEditDialog = (address: Address) => {
    setEditingAddress(address);
    setFormData({
      title: address.title,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      country: address.country,
      category: address.category,
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteAddress = (id: string) => {
    setAddresses(addresses.filter((addr) => addr.id !== id));
    toast.success("Address deleted successfully");
  };

  const handleNavigate = (addressId: string) => {
    const address = addresses.find(a => a.id === addressId);
    if (address) {
      toast.success(`Navigation started to ${address.title}`);
    }
  };

  const getCategoryBadge = (category: string) => {
    const config = {
      office: { className: "bg-blue-100 text-blue-700 border-blue-300", label: "Office" },
      site: { className: "bg-orange-100 text-orange-700 border-orange-300", label: "Site" },
      warehouse: { className: "bg-purple-100 text-purple-700 border-purple-300", label: "Warehouse" },
      other: { className: "bg-gray-100 text-gray-700 border-gray-300", label: "Other" },
    };
    const style = config[category as keyof typeof config] || config.other;
    return <Badge className={`${style.className} border`}>{style.label}</Badge>;
  };

  const totalAddresses = addresses.length;
  const officeAddresses = addresses.filter((a) => a.category === "office").length;
  const siteAddresses = addresses.filter((a) => a.category === "site").length;

  return (
    <Layout currentUser={currentUser} navigateTo={navigateTo} onLogout={onLogout} currentPage="addresses">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Address Management</h2>
            <p className="text-gray-500 mt-1">Manage and track all location addresses</p>
          </div>
          <div className="flex gap-3">
            {viewMode === "map" && (
              <Button 
                variant="outline"
                onClick={() => setViewMode("list")}
                className="border-[#337ab7] text-[#337ab7] hover:bg-[#337ab7] hover:text-white"
              >
                ← Back to List
              </Button>
            )}
            {viewMode !== "map" && (
              <Button
                variant="outline"
                onClick={() => setViewMode("map")}
                className="border-[#337ab7] text-[#337ab7] hover:bg-[#337ab7] hover:text-white"
              >
                <Map className="h-4 w-4 mr-2" />
                View Map
              </Button>
            )}
            <Sheet open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <SheetTrigger asChild>
                <Button className="bg-[#337ab7] hover:bg-[#2868a0] shadow-md">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Address
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Add New Address</SheetTitle>
                  <SheetDescription>
                    Enter address details to add a new location.
                  </SheetDescription>
                </SheetHeader>
                <div className="grid gap-4 px-6 py-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g., Main Office"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="addressLine1">Address Line 1 *</Label>
                    <Input
                      id="addressLine1"
                      value={formData.addressLine1}
                      onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                      placeholder="Street address"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="addressLine2">Address Line 2</Label>
                    <Input
                      id="addressLine2"
                      value={formData.addressLine2}
                      onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
                      placeholder="Apartment, suite, etc."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        placeholder="City"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        placeholder="State"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="pincode">Pincode *</Label>
                      <Input
                        id="pincode"
                        value={formData.pincode}
                        onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                        placeholder="Pincode"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Country *</Label>
                      <Input
                        id="country"
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        placeholder="Country"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select value={formData.category} onValueChange={(value: Address['category']) => setFormData({ ...formData, category: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="office">Office</SelectItem>
                        <SelectItem value="site">Site</SelectItem>
                        <SelectItem value="warehouse">Warehouse</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <SheetFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddAddress} className="bg-[#337ab7] hover:bg-[#2868a0]">
                    Add Address
                  </Button>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white border-2 border-blue-200 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700">Total Addresses</p>
                  <p className="text-3xl font-bold text-blue-900 mt-2">{totalAddresses}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-xl">
                  <MapPin className="h-8 w-8 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border-2 border-purple-200 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-700">Office Locations</p>
                  <p className="text-3xl font-bold text-purple-900 mt-2">{officeAddresses}</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-xl">
                  <Building className="h-8 w-8 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border-2 border-orange-200 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-700">Site Locations</p>
                  <p className="text-3xl font-bold text-orange-900 mt-2">{siteAddresses}</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-xl">
                  <TrendingUp className="h-8 w-8 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Map View */}
        {viewMode === "map" && (
          <MapView
            addresses={filteredAddresses}
            selectedAddress={selectedAddressId}
            onNavigate={handleNavigate}
          />
        )}

        {/* Search and Filters */}
        {viewMode !== "map" && (
          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search addresses by title, city, or ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="office">Office</SelectItem>
                    <SelectItem value="site">Site</SelectItem>
                    <SelectItem value="warehouse">Warehouse</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Addresses List */}
        {viewMode !== "map" && (
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 border-b">
              <CardTitle>Address List</CardTitle>
              <CardDescription>Complete list of all addresses</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-semibold">ID</TableHead>
                      <TableHead className="font-semibold">Title</TableHead>
                      <TableHead className="font-semibold">Address</TableHead>
                      <TableHead className="font-semibold">City</TableHead>
                      <TableHead className="font-semibold">State</TableHead>
                      <TableHead className="font-semibold">Category</TableHead>
                      <TableHead className="font-semibold text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAddresses.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                          No addresses found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredAddresses.map((address) => (
                        <TableRow key={address.id} className="hover:bg-blue-50/50 transition-colors">
                          <TableCell className="font-medium text-[#337ab7]">{address.id}</TableCell>
                          <TableCell className="font-medium text-gray-900">{address.title}</TableCell>
                          <TableCell className="text-gray-600 max-w-xs truncate">
                            {address.addressLine1}, {address.addressLine2}
                          </TableCell>
                          <TableCell className="text-gray-600">{address.city}</TableCell>
                          <TableCell className="text-gray-600">{address.state}</TableCell>
                          <TableCell>{getCategoryBadge(address.category)}</TableCell>
                          <TableCell>
                            <div className="flex items-center justify-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedAddressId(address.id);
                                  setViewMode("map");
                                }}
                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                              >
                                <MapPin className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openEditDialog(address)}
                                className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteAddress(address.id)}
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
        )}

        {/* Edit Address Sheet */}
        <Sheet open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <SheetContent className="overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Edit Address</SheetTitle>
              <SheetDescription>
                Update address information. Changes will be saved immediately.
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 px-6 py-6">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Title *</Label>
                <Input
                  id="edit-title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Main Office"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-addressLine1">Address Line 1 *</Label>
                <Input
                  id="edit-addressLine1"
                  value={formData.addressLine1}
                  onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                  placeholder="Street address"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-addressLine2">Address Line 2</Label>
                <Input
                  id="edit-addressLine2"
                  value={formData.addressLine2}
                  onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
                  placeholder="Apartment, suite, etc."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-city">City *</Label>
                  <Input
                    id="edit-city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="City"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-state">State *</Label>
                  <Input
                    id="edit-state"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    placeholder="State"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-pincode">Pincode *</Label>
                  <Input
                    id="edit-pincode"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    placeholder="Pincode"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-country">Country *</Label>
                  <Input
                    id="edit-country"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    placeholder="Country"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-category">Category *</Label>
                <Select value={formData.category} onValueChange={(value: Address['category']) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="office">Office</SelectItem>
                    <SelectItem value="site">Site</SelectItem>
                    <SelectItem value="warehouse">Warehouse</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <SheetFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditAddress} className="bg-[#337ab7] hover:bg-[#2868a0]">
                Save Changes
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </Layout>
  );
}
