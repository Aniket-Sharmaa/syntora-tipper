import { useState } from "react";
import { User } from "@/app/page";
import { useMemo } from "react";
import Layout from "@/app/App";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Search, Filter, Download, Eye, Calendar as CalendarIcon, Activity, TrendingUp } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";

interface HistoryHubProps {
  currentUser: User | null;
  navigateTo: (page: string) => void;
  onLogout: () => void;
}

interface HistoryEntry {
  id: string;
  employeeId: string;
  employeeName: string;
  action: string;
  date: Date;
  details: string;
  type: "employee" | "expense" | "payment" | "salary" | "tipper";
  additionalInfo?: {
    oldValue?: string;
    newValue?: string;
    amount?: number;
    project?: string;
    department?: string;
  };
}

export default function HistoryHub({ currentUser, navigateTo, onLogout }: HistoryHubProps) {
  const [historyEntries, setHistoryEntries] = useState<HistoryEntry[]>([
    {
      id: "HIST001",
      employeeId: "EMP001",
      employeeName: "John Doe",
      action: "Added",
      date: new Date(2026, 1, 1),
      details: "New employee added to Operations department",
      type: "employee",
      additionalInfo: {
        department: "Operations",
        newValue: "Active",
      },
    },
    {
      id: "HIST002",
      employeeId: "EMP002",
      employeeName: "Jane Smith",
      action: "Updated",
      date: new Date(2026, 1, 3),
      details: "Salary updated from ₹50,000 to ₹55,000",
      type: "employee",
      additionalInfo: {
        oldValue: "₹50,000",
        newValue: "₹55,000",
        department: "Management",
      },
    },
    {
      id: "HIST003",
      employeeId: "SYS",
      employeeName: "System",
      action: "Created",
      date: new Date(2026, 1, 5),
      details: "Expense entry created for Highway Construction",
      type: "expense",
      additionalInfo: {
        amount: 125000,
        project: "Highway Construction Phase 1",
      },
    },
    {
      id: "HIST004",
      employeeId: "EMP003",
      employeeName: "Mike Johnson",
      action: "Status Changed",
      date: new Date(2026, 1, 7),
      details: "Status changed from Active to On-Leave",
      type: "employee",
      additionalInfo: {
        oldValue: "Active",
        newValue: "On-Leave",
        department: "Technical",
      },
    },
    {
      id: "HIST005",
      employeeId: "SYS",
      employeeName: "System",
      action: "Payment Received",
      date: new Date(2026, 1, 10),
      details: "Payment of ₹90,000 received for Project PAY001",
      type: "payment",
      additionalInfo: {
        amount: 90000,
        project: "Highway Construction Phase 1",
      },
    },
    {
      id: "HIST006",
      employeeId: "SYS",
      employeeName: "System",
      action: "Calculated",
      date: new Date(2026, 1, 12),
      details: "Salary calculated for 5 employees with overtime",
      type: "salary",
      additionalInfo: {
        amount: 275000,
      },
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterAction, setFilterAction] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<Date | undefined>();
  const [viewingEntry, setViewingEntry] = useState<HistoryEntry | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const filteredEntries = historyEntries.filter((entry) => {
    const matchesSearch = 
      entry.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === "all" || entry.type === filterType;
    const matchesAction = filterAction === "all" || entry.action === filterAction;
    const matchesDate = !dateFilter || format(entry.date, "yyyy-MM-dd") === format(dateFilter, "yyyy-MM-dd");
    
    return matchesSearch && matchesType && matchesAction && matchesDate;
  });

  const openViewDialog = (entry: HistoryEntry) => {
    setViewingEntry(entry);
    setIsViewDialogOpen(true);
  };

  const getTypeBadge = (type: string) => {
    const config = {
      employee: { className: "bg-blue-100 text-blue-700 border-blue-300", label: "Employee" },
      expense: { className: "bg-orange-100 text-orange-700 border-orange-300", label: "Expense" },
      payment: { className: "bg-emerald-100 text-emerald-700 border-emerald-300", label: "Payment" },
      salary: { className: "bg-purple-100 text-purple-700 border-purple-300", label: "Salary" },
      tipper: { className: "bg-amber-100 text-amber-700 border-amber-300", label: "Tipper" },
    };
    const style = config[type as keyof typeof config] || config.employee;
    return <Badge className={`${style.className} border`}>{style.label}</Badge>;
  };

  const getActionBadge = (action: string) => {
    const config = {
      "Added": { className: "bg-green-100 text-green-700 border-green-300" },
      "Updated": { className: "bg-blue-100 text-blue-700 border-blue-300" },
      "Deleted": { className: "bg-red-100 text-red-700 border-red-300" },
      "Created": { className: "bg-purple-100 text-purple-700 border-purple-300" },
      "Status Changed": { className: "bg-amber-100 text-amber-700 border-amber-300" },
      "Payment Received": { className: "bg-emerald-100 text-emerald-700 border-emerald-300" },
      "Calculated": { className: "bg-indigo-100 text-indigo-700 border-indigo-300" },
    };
    const style = config[action as keyof typeof config] || { className: "bg-gray-100 text-gray-700 border-gray-300" };
    return <Badge className={`${style.className} border`}>{action}</Badge>;
  };

const totalEntries = historyEntries.length;

const [now] = useState(() => Date.now());

const recentEntries = useMemo(() => {
  return historyEntries.filter((e) => {
    const daysDiff = (now - e.date.getTime()) / (1000 * 60 * 60 * 24);
    return daysDiff <= 7;
  }).length;
}, [historyEntries, now]);
  return (
    <Layout currentUser={currentUser} navigateTo={navigateTo} onLogout={onLogout} currentPage="history">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-3xl font-bold text-gray-900">History Hub</h2>
          <p className="text-gray-500 mt-1">Track all system activities and changes</p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white border-2 border-blue-200 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700">Total Activities</p>
                  <p className="text-3xl font-bold text-blue-900 mt-2">{totalEntries}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Activity className="h-8 w-8 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border-2 border-emerald-200 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-emerald-700">This Week</p>
                  <p className="text-3xl font-bold text-emerald-900 mt-2">{recentEntries}</p>
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
                  <p className="text-sm font-medium text-purple-700">Filtered Results</p>
                  <p className="text-3xl font-bold text-purple-900 mt-2">{filteredEntries.length}</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-xl">
                  <Filter className="h-8 w-8 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search history..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="employee">Employee</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                  <SelectItem value="payment">Payment</SelectItem>
                  <SelectItem value="salary">Salary</SelectItem>
                  <SelectItem value="tipper">Tipper</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterAction} onValueChange={setFilterAction}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  <SelectItem value="Added">Added</SelectItem>
                  <SelectItem value="Updated">Updated</SelectItem>
                  <SelectItem value="Deleted">Deleted</SelectItem>
                  <SelectItem value="Created">Created</SelectItem>
                  <SelectItem value="Status Changed">Status Changed</SelectItem>
                  <SelectItem value="Payment Received">Payment Received</SelectItem>
                  <SelectItem value="Calculated">Calculated</SelectItem>
                </SelectContent>
              </Select>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateFilter ? format(dateFilter, "MMM dd, yyyy") : "Filter by date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dateFilter}
                    onSelect={setDateFilter}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchTerm("");
                  setFilterType("all");
                  setFilterAction("all");
                  setDateFilter(undefined);
                }}
              >
                Clear Filters
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export History
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* History Table */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-linear-to-r from-slate-50 to-blue-50 border-b">
            <CardTitle>Activity History</CardTitle>
            <CardDescription>Complete record of all system activities</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold">ID</TableHead>
                    <TableHead className="font-semibold">Date & Time</TableHead>
                    <TableHead className="font-semibold">User/Employee</TableHead>
                    <TableHead className="font-semibold">Action</TableHead>
                    <TableHead className="font-semibold">Type</TableHead>
                    <TableHead className="font-semibold">Details</TableHead>
                    <TableHead className="font-semibold text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEntries.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                        No history entries found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredEntries.map((entry) => (
                      <TableRow key={entry.id} className="hover:bg-blue-50/50 transition-colors">
                        <TableCell className="font-medium text-[#337ab7]">{entry.id}</TableCell>
                        <TableCell className="text-gray-600">
                          <div>
                            <p className="font-medium">{format(entry.date, "MMM dd, yyyy")}</p>
                            <p className="text-xs text-gray-500">{format(entry.date, "hh:mm a")}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-gray-900">{entry.employeeName}</p>
                            <p className="text-xs text-gray-500">{entry.employeeId}</p>
                          </div>
                        </TableCell>
                        <TableCell>{getActionBadge(entry.action)}</TableCell>
                        <TableCell>{getTypeBadge(entry.type)}</TableCell>
                        <TableCell className="max-w-xs">
                          <div className="truncate text-gray-700" title={entry.details}>
                            {entry.details}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openViewDialog(entry)}
                              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
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

        {/* View Details Sheet */}
        <Sheet open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <SheetContent className="overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Activity Details</SheetTitle>
              <SheetDescription>
                Complete information about this activity
              </SheetDescription>
            </SheetHeader>
            {viewingEntry && (
              <div className="space-y-6 px-6 py-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b">
                    <h3 className="font-semibold text-gray-900">Basic Information</h3>
                    {getTypeBadge(viewingEntry.type)}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Activity ID</p>
                      <p className="font-medium text-gray-900">{viewingEntry.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Action</p>
                      <div className="mt-1">{getActionBadge(viewingEntry.action)}</div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Date</p>
                      <p className="font-medium text-gray-900">{format(viewingEntry.date, "MMMM dd, yyyy")}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Time</p>
                      <p className="font-medium text-gray-900">{format(viewingEntry.date, "hh:mm:ss a")}</p>
                    </div>
                  </div>
                </div>

                {/* User Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 pb-3 border-b">User Information</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="font-medium text-gray-900">{viewingEntry.employeeName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Employee/User ID</p>
                      <p className="font-medium text-gray-900">{viewingEntry.employeeId}</p>
                    </div>
                  </div>
                </div>

                {/* Activity Details */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 pb-3 border-b">Activity Details</h3>
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <p className="text-sm text-gray-700">{viewingEntry.details}</p>
                  </div>
                </div>

                {/* Additional Information */}
                {viewingEntry.additionalInfo && (
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900 pb-3 border-b">Additional Information</h3>
                    <div className="space-y-3">
                      {viewingEntry.additionalInfo.oldValue && (
                        <div className="bg-red-50 rounded-lg p-3 border border-red-200">
                          <p className="text-xs font-medium text-red-700 mb-1">Old Value</p>
                          <p className="text-sm text-red-900">{viewingEntry.additionalInfo.oldValue}</p>
                        </div>
                      )}
                      {viewingEntry.additionalInfo.newValue && (
                        <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                          <p className="text-xs font-medium text-green-700 mb-1">New Value</p>
                          <p className="text-sm text-green-900">{viewingEntry.additionalInfo.newValue}</p>
                        </div>
                      )}
                      {viewingEntry.additionalInfo.amount && (
                        <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                          <p className="text-xs font-medium text-blue-700 mb-1">Amount</p>
                          <p className="text-lg font-bold text-blue-900">₹{viewingEntry.additionalInfo.amount.toLocaleString()}</p>
                        </div>
                      )}
                      {viewingEntry.additionalInfo.project && (
                        <div>
                          <p className="text-sm text-gray-500">Project</p>
                          <p className="font-medium text-gray-900">{viewingEntry.additionalInfo.project}</p>
                        </div>
                      )}
                      {viewingEntry.additionalInfo.department && (
                        <div>
                          <p className="text-sm text-gray-500">Department</p>
                          <p className="font-medium text-gray-900">{viewingEntry.additionalInfo.department}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </SheetContent>
        </Sheet>
      </div>
    </Layout>
  );
}
