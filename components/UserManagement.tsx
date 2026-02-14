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
    import { Search, Plus, Edit, Trash2, Shield, User as UserIcon, Users, TrendingUp } from "lucide-react";
    import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
    import { format } from "date-fns";

    interface UserManagementProps {
    currentUser: User | null;
    navigateTo: (page: string) => void;
    onLogout: () => void;
    }

    interface SystemUser {
    id: string;
    name: string;
    phone: string;
    email: string;
    type: "super-admin" | "admin" | "employee";
    dateAdded: Date;
    status: "active" | "inactive";
    }

    export default function UserManagement({ currentUser, navigateTo, onLogout }: UserManagementProps) {
    const [users, setUsers] = useState<SystemUser[]>([
        {
        id: "USR001",
        name: "Admin User",
        phone: "+91 9876543210",
        email: "admin@syntora.com",
        type: "admin",
        dateAdded: new Date(2026, 0, 1),
        status: "active",
        },
        {
        id: "USR002",
        name: "Super Admin",
        phone: "+91 9876543211",
        email: "superadmin@syntora.com",
        type: "super-admin",
        dateAdded: new Date(2026, 0, 1),
        status: "active",
        },
        {
        id: "USR003",
        name: "Employee User",
        phone: "+91 9876543212",
        email: "employee@syntora.com",
        type: "employee",
        dateAdded: new Date(2026, 0, 15),
        status: "active",
        },
        {
        id: "USR004",
        name: "Test Admin",
        phone: "+91 9876543213",
        email: "testadmin@syntora.com",
        type: "admin",
        dateAdded: new Date(2026, 1, 1),
        status: "inactive",
        },
    ]);

    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState("all");
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<SystemUser | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        type: "employee" as SystemUser["type"],
        status: "active" as SystemUser["status"],
    });

    const filteredUsers = users.filter((user) => {
        const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === "all" || user.type === filterType;
        return matchesSearch && matchesType;
    });

    const handleAddUser = () => {
        if (!formData.name || !formData.phone || !formData.email) {
        toast.error("Please fill all required fields");
        return;
        }

        const newUser: SystemUser = {
        id: `USR${String(users.length + 1).padStart(3, "0")}`,
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        type: formData.type,
        dateAdded: new Date(),
        status: formData.status,
        };

        setUsers([...users, newUser]);
        toast.success("User added successfully");
        setIsAddDialogOpen(false);
        setFormData({ name: "", phone: "", email: "", type: "employee", status: "active" });
    };

    const handleEditUser = () => {
        if (!formData.name || !formData.phone || !formData.email) {
        toast.error("Please fill all required fields");
        return;
        }

        if (!editingUser) return;

        const updatedUsers = users.map((user) =>
        user.id === editingUser.id
            ? {
                ...user,
                name: formData.name,
                phone: formData.phone,
                email: formData.email,
                type: formData.type,
                status: formData.status,
            }
            : user
        );

        setUsers(updatedUsers);
        toast.success("User updated successfully");
        setIsEditDialogOpen(false);
        setEditingUser(null);
        setFormData({ name: "", phone: "", email: "", type: "employee", status: "active" });
    };

    const openEditDialog = (user: SystemUser) => {
        setEditingUser(user);
        setFormData({
        name: user.name,
        phone: user.phone,
        email: user.email,
        type: user.type,
        status: user.status,
        });
        setIsEditDialogOpen(true);
    };

    const handleDeleteUser = (id: string) => {
        setUsers(users.filter((user) => user.id !== id));
        toast.success("User deleted successfully");
    };

    const getTypeBadge = (type: string) => {
        const config = {
        "super-admin": { className: "bg-purple-100 text-purple-700 border-purple-300", label: "Super Admin" },
        admin: { className: "bg-blue-100 text-blue-700 border-blue-300", label: "Admin" },
        employee: { className: "bg-emerald-100 text-emerald-700 border-emerald-300", label: "Employee" },
        };
        const style = config[type as keyof typeof config] || config.employee;
        return <Badge className={`${style.className} border`}>{style.label}</Badge>;
    };

    const getStatusBadge = (status: string) => {
        const config = {
        active: { className: "bg-emerald-100 text-emerald-700 border-emerald-300", label: "Active" },
        inactive: { className: "bg-gray-100 text-gray-700 border-gray-300", label: "Inactive" },
        };
        const style = config[status as keyof typeof config] || config.active;
        return <Badge className={`${style.className} border`}>{style.label}</Badge>;
    };

    const totalUsers = users.length;
    const activeUsers = users.filter((u) => u.status === "active").length;
    const adminUsers = users.filter((u) => u.type === "admin" || u.type === "super-admin").length;
    type UserType = SystemUser["type"];
type UserStatus = SystemUser["status"];
    return (
        <Layout currentUser={currentUser} navigateTo={navigateTo} onLogout={onLogout} currentPage="users">
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div>
                <h2 className="text-3xl font-bold text-gray-900">User Management</h2>
                <p className="text-gray-500 mt-1">Manage system users and access control</p>
            </div>
            <Sheet open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <SheetTrigger asChild>
                    <Button className="bg-[#337ab7] hover:bg-[#2868a0] shadow-md">
                    <Plus className="h-4 w-4 mr-2" />
                    Add User
                    </Button>
                </SheetTrigger>
                <SheetContent className="overflow-y-auto">
                    <SheetHeader>
                    <SheetTitle>Add New User</SheetTitle>
                    <SheetDescription>
                        Create a new system user with appropriate permissions.
                    </SheetDescription>
                    </SheetHeader>
                    <div className="grid gap-4 px-6 py-6">
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
                        <Label htmlFor="type">User Type *</Label>
                        
                        <Select value={formData.type} onValueChange={(value: UserType) => setFormData({ ...formData, type: value })}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="employee">Employee</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="super-admin">Super Admin</SelectItem>
                        </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="status">Status *</Label>
                        <Select value={formData.status} onValueChange={(value: UserStatus) => setFormData({ ...formData, status: value })}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                        </Select>
                    </div>
                    </div>
                    <SheetFooter>
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleAddUser} className="bg-[#337ab7] hover:bg-[#2868a0]">
                        Add User
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
                    <p className="text-sm font-medium text-blue-700">Total Users</p>
                    <p className="text-3xl font-bold text-blue-900 mt-2">{totalUsers}</p>
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
                    <p className="text-sm font-medium text-emerald-700">Active Users</p>
                    <p className="text-3xl font-bold text-emerald-900 mt-2">{activeUsers}</p>
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
                    <p className="text-sm font-medium text-purple-700">Admin Users</p>
                    <p className="text-3xl font-bold text-purple-900 mt-2">{adminUsers}</p>
                    </div>
                    <div className="p-3 bg-purple-100 rounded-xl">
                    <Shield className="h-8 w-8 text-purple-600" />
                    </div>
                </div>
                </CardContent>
            </Card>
            </div>

            {/* Search and Filters */}
            <Card className="border-0 shadow-md">
            <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                    placeholder="Search users by name, email, or ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                    />
                </div>
                <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger>
                    <SelectValue placeholder="Filter by user type" />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="all">All User Types</SelectItem>
                    <SelectItem value="super-admin">Super Admin</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="employee">Employee</SelectItem>
                    </SelectContent>
                </Select>
                </div>
            </CardContent>
            </Card>

            {/* Users Display */}
            <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-purple-50 border-b">
                <CardTitle>User List</CardTitle>
                <CardDescription>Complete list of all system users</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
                <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                    <TableRow className="bg-gray-50">
                        <TableHead className="font-semibold">ID</TableHead>
                        <TableHead className="font-semibold">Name</TableHead>
                        <TableHead className="font-semibold">Contact</TableHead>
                        <TableHead className="font-semibold">User Type</TableHead>
                        <TableHead className="font-semibold">Status</TableHead>
                        <TableHead className="font-semibold">Date Added</TableHead>
                        <TableHead className="font-semibold text-center">Actions</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {filteredUsers.length === 0 ? (
                        <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                            No users found
                        </TableCell>
                        </TableRow>
                    ) : (
                        filteredUsers.map((user) => (
                        <TableRow key={user.id} className="hover:bg-purple-50/50 transition-colors">
                            <TableCell className="font-medium text-[#337ab7]">{user.id}</TableCell>
                            <TableCell className="font-medium text-gray-900">{user.name}</TableCell>
                            <TableCell>
                            <div>
                                <p className="text-sm text-gray-900">{user.phone}</p>
                                <p className="text-sm text-gray-500">{user.email}</p>
                            </div>
                            </TableCell>
                            <TableCell>{getTypeBadge(user.type)}</TableCell>
                            <TableCell>{getStatusBadge(user.status)}</TableCell>
                            <TableCell className="text-gray-600">{format(user.dateAdded, "PP")}</TableCell>
                            <TableCell>
                            <div className="flex items-center justify-center gap-2">
                                <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openEditDialog(user)}
                                className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                                >
                                <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteUser(user.id)}
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

            {/* Edit User Sheet */}
            <Sheet open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <SheetContent className="overflow-y-auto">
                <SheetHeader>
                <SheetTitle>Edit User</SheetTitle>
                <SheetDescription>
                    Update user information. Changes will be saved immediately.
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
                    <Label htmlFor="edit-type">User Type *</Label>
                    <Select value={formData.type} onValueChange={(value: UserType) => setFormData({ ...formData, type: value })}>
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="employee">Employee</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="super-admin">Super Admin</SelectItem>
                    </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="edit-status">Status *</Label>
                    <Select value={formData.status} onValueChange={(value: UserStatus) => setFormData({ ...formData, status: value })}>
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                    </Select>
                </div>
                </div>
                <SheetFooter>
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                    Cancel
                </Button>
                <Button onClick={handleEditUser} className="bg-[#337ab7] hover:bg-[#2868a0]">
                    Save Changes
                </Button>
                </SheetFooter>
            </SheetContent>
            </Sheet>
        </div>
        </Layout>
    );
    }
