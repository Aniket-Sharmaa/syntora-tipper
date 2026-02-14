import { useState } from "react";
import { User } from "@/app/page";
import Layout from "@/app/App";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Calendar as CalendarIcon, Calculator, Download, Save, Plus, X, TrendingUp, DollarSign, Clock } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";

interface SalaryCalculationProps {
  currentUser: User | null;
  navigateTo: (page: string) => void;
  onLogout: () => void;
}

interface Employee {
  id: string;
  name: string;
  department: string;
  baseSalary: number;
  selected: boolean;
}

interface OvertimeDate {
  id: string;
  date: Date;
  hours: number;
  type: "overtime" | "special";
}

interface SalaryEntry {
  employeeId: string;
  employeeName: string;
  timeIn: string;
  timeOut: string;
  normalHours: number;
  overtimeHours: number;
  specialHours: number;
  normalSalary: number;
  overtimeSalary: number;
  specialSalary: number;
  totalSalary: number;
  overtimeDates: OvertimeDate[];
}

export default function SalaryCalculation({ currentUser, navigateTo, onLogout }: SalaryCalculationProps) {
  const [employees, setEmployees] = useState<Employee[]>([
    { id: "EMP001", name: "John Doe", department: "Operations", baseSalary: 45000, selected: false },
    { id: "EMP002", name: "Jane Smith", department: "Management", baseSalary: 55000, selected: false },
    { id: "EMP003", name: "Mike Johnson", department: "Technical", baseSalary: 48000, selected: false },
    { id: "EMP004", name: "Sarah Williams", department: "Support", baseSalary: 42000, selected: false },
  ]);

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [salaryType, setSalaryType] = useState<string>("normal");
  const [timeIn, setTimeIn] = useState<string>("09:00");
  const [timeOut, setTimeOut] = useState<string>("18:00");
  const [salaryEntries, setSalaryEntries] = useState<SalaryEntry[]>([]);
  const [overtimeDates, setOvertimeDates] = useState<OvertimeDate[]>([]);
  const [newOvertimeDate, setNewOvertimeDate] = useState<Date>(new Date());
  const [newOvertimeHours, setNewOvertimeHours] = useState<string>("");
  const [newOvertimeType, setNewOvertimeType] = useState<"overtime" | "special">("overtime");

  const hourlyRates = {
    normal: 150,
    overtime: 225, // 1.5x
    special: 300, // 2x
  };

  const toggleEmployee = (id: string) => {
    setEmployees(employees.map((emp) => 
      emp.id === id ? { ...emp, selected: !emp.selected } : emp
    ));
  };

  const selectAll = () => {
    const allSelected = employees.every((emp) => emp.selected);
    setEmployees(employees.map((emp) => ({ ...emp, selected: !allSelected })));
  };

  const addOvertimeDate = () => {
    if (!newOvertimeHours || Number(newOvertimeHours) <= 0) {
      toast.error("Please enter valid overtime hours");
      return;
    }

    const newDate: OvertimeDate = {
      id: `OT${Date.now()}`,
      date: newOvertimeDate,
      hours: Number(newOvertimeHours),
      type: newOvertimeType,
    };

    setOvertimeDates([...overtimeDates, newDate]);
    setNewOvertimeHours("");
    toast.success("Overtime date added successfully");
  };

  const removeOvertimeDate = (id: string) => {
    setOvertimeDates(overtimeDates.filter((date) => date.id !== id));
    toast.success("Overtime date removed");
  };

  const calculateSalary = () => {
    const selectedEmployees = employees.filter((emp) => emp.selected);
    
    if (selectedEmployees.length === 0) {
      toast.error("Please select at least one employee");
      return;
    }

    if (!timeIn || !timeOut) {
      toast.error("Please set time in and time out");
      return;
    }

    const [inHour, inMin] = timeIn.split(":").map(Number);
    const [outHour, outMin] = timeOut.split(":").map(Number);
    
    const totalMinutes = (outHour * 60 + outMin) - (inHour * 60 + inMin);
    const totalHours = totalMinutes / 60;

    const newEntries: SalaryEntry[] = selectedEmployees.map((emp) => {
      let normalHours = 0;
      let overtimeHours = 0;
      let specialHours = 0;

      // Calculate normal working hours
      if (salaryType === "normal") {
        normalHours = Math.min(totalHours, 8);
        overtimeHours = Math.max(0, totalHours - 8);
      } else if (salaryType === "overtime") {
        overtimeHours = totalHours;
      } else {
        specialHours = totalHours;
      }

      // Add overtime dates hours
      overtimeDates.forEach((otDate) => {
        if (otDate.type === "overtime") {
          overtimeHours += otDate.hours;
        } else {
          specialHours += otDate.hours;
        }
      });

      const normalSalary = normalHours * hourlyRates.normal;
      const overtimeSalary = overtimeHours * hourlyRates.overtime;
      const specialSalary = specialHours * hourlyRates.special;
      const totalSalary = normalSalary + overtimeSalary + specialSalary;

      return {
        employeeId: emp.id,
        employeeName: emp.name,
        timeIn,
        timeOut,
        normalHours: Number(normalHours.toFixed(2)),
        overtimeHours: Number(overtimeHours.toFixed(2)),
        specialHours: Number(specialHours.toFixed(2)),
        normalSalary: Number(normalSalary.toFixed(2)),
        overtimeSalary: Number(overtimeSalary.toFixed(2)),
        specialSalary: Number(specialSalary.toFixed(2)),
        totalSalary: Number(totalSalary.toFixed(2)),
        overtimeDates: [...overtimeDates],
      };
    });

    setSalaryEntries(newEntries);
    toast.success("Salary calculated successfully");
  };

  const saveSalaries = () => {
    if (salaryEntries.length === 0) {
      toast.error("No salary entries to save");
      return;
    }
    toast.success("Salary entries saved successfully");
  };

  const totalPayout = salaryEntries.reduce((sum, entry) => sum + entry.totalSalary, 0);
  const totalNormalHours = salaryEntries.reduce((sum, entry) => sum + entry.normalHours, 0);
  const totalOvertimeHours = salaryEntries.reduce((sum, entry) => sum + entry.overtimeHours, 0);
  const totalSpecialHours = salaryEntries.reduce((sum, entry) => sum + entry.specialHours, 0);

  return (
    <Layout currentUser={currentUser} navigateTo={navigateTo} onLogout={onLogout} currentPage="salary">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-3xl font-bold text-gray-900">Salary Calculation</h2>
          <p className="text-gray-500 mt-1">Calculate and manage employee salaries and overtime</p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-white border-2 border-purple-200 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-700">Total Payout</p>
                  <p className="text-3xl font-bold text-purple-900 mt-2">₹{totalPayout.toLocaleString()}</p>
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
                  <p className="text-sm font-medium text-blue-700">Normal Hours</p>
                  <p className="text-3xl font-bold text-blue-900 mt-2">{totalNormalHours.toFixed(1)}h</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Clock className="h-8 w-8 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border-2 border-amber-200 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-amber-700">Overtime Hours</p>
                  <p className="text-3xl font-bold text-amber-900 mt-2">{totalOvertimeHours.toFixed(1)}h</p>
                </div>
                <div className="p-3 bg-amber-100 rounded-xl">
                  <TrendingUp className="h-8 w-8 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border-2 border-emerald-200 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-emerald-700">Special Hours</p>
                  <p className="text-3xl font-bold text-emerald-900 mt-2">{totalSpecialHours.toFixed(1)}h</p>
                </div>
                <div className="p-3 bg-emerald-100 rounded-xl">
                  <Clock className="h-8 w-8 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Calculation Parameters */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Employee Selection */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Select Employees</CardTitle>
                  <CardDescription>Choose employees for salary calculation</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={selectAll}>
                  {employees.every((emp) => emp.selected) ? "Deselect All" : "Select All"}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {employees.map((emp) => (
                  <div
                    key={emp.id}
                    className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all cursor-pointer ${
                      emp.selected ? "border-[#337ab7] bg-blue-50" : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => toggleEmployee(emp.id)}
                  >
                    <div className="flex items-center gap-3">
                      <Checkbox checked={emp.selected} onCheckedChange={() => toggleEmployee(emp.id)} />
                      <div>
                        <p className="font-semibold text-gray-900">{emp.name}</p>
                        <p className="text-sm text-gray-500">{emp.department} • ₹{emp.baseSalary.toLocaleString()}/month</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">{emp.id}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Time and Type Settings */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 border-b">
              <CardTitle>Calculation Parameters</CardTitle>
              <CardDescription>Set work hours and salary type</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <Label>Work Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(selectedDate, "PPP")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => date && setSelectedDate(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="timeIn">Time In</Label>
                  <Input
                    id="timeIn"
                    type="time"
                    value={timeIn}
                    onChange={(e) => setTimeIn(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timeOut">Time Out</Label>
                  <Input
                    id="timeOut"
                    type="time"
                    value={timeOut}
                    onChange={(e) => setTimeOut(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Salary Type</Label>
                <Select value={salaryType} onValueChange={setSalaryType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal Day (₹{hourlyRates.normal}/hr)</SelectItem>
                    <SelectItem value="overtime">Overtime (₹{hourlyRates.overtime}/hr - 1.5x)</SelectItem>
                    <SelectItem value="special">Special Day (₹{hourlyRates.special}/hr - 2x)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 text-sm mb-2">Hourly Rates</h4>
                <div className="space-y-1 text-sm text-blue-700">
                  <p>Normal: ₹{hourlyRates.normal}/hour</p>
                  <p>Overtime: ₹{hourlyRates.overtime}/hour (1.5x)</p>
                  <p>Special: ₹{hourlyRates.special}/hour (2x)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Overtime/Special Day Dates */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 border-b">
            <CardTitle>Overtime / Special Day Dates</CardTitle>
            <CardDescription>Add multiple overtime or special day dates for additional hours</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Add Overtime Date Form */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="space-y-2">
                  <Label className="text-sm">Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal text-sm">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(newOvertimeDate, "MMM dd, yyyy")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={newOvertimeDate}
                        onSelect={(date) => date && setNewOvertimeDate(date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="otHours" className="text-sm">Hours</Label>
                  <Input
                    id="otHours"
                    type="number"
                    placeholder="e.g., 4"
                    value={newOvertimeHours}
                    onChange={(e) => setNewOvertimeHours(e.target.value)}
                    className="text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Type</Label>
                  <Select value={newOvertimeType} onValueChange={(value: 'overtime' | 'special') => setNewOvertimeType(value)}>
                    <SelectTrigger className="text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="overtime">Overtime (1.5x)</SelectItem>
                      <SelectItem value="special">Special Day (2x)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button onClick={addOvertimeDate} className="w-full bg-[#337ab7] hover:bg-[#2868a0]">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Date
                  </Button>
                </div>
              </div>

              {/* List of Overtime Dates */}
              {overtimeDates.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Added Overtime/Special Dates</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {overtimeDates.map((otDate) => (
                      <div
                        key={otDate.id}
                        className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg"
                      >
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{format(otDate.date, "MMM dd, yyyy")}</p>
                          <p className="text-xs text-gray-600">
                            {otDate.hours}h • {otDate.type === "overtime" ? "Overtime (1.5x)" : "Special (2x)"}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeOvertimeDate(otDate.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4">
          <Button onClick={calculateSalary} size="lg" className="bg-[#337ab7] hover:bg-[#2868a0] shadow-lg">
            <Calculator className="h-5 w-5 mr-2" />
            Calculate Salaries
          </Button>
          {salaryEntries.length > 0 && (
            <>
              <Button onClick={saveSalaries} size="lg" variant="outline" className="shadow-lg">
                <Save className="h-5 w-5 mr-2" />
                Save Salaries
              </Button>
              <Button size="lg" variant="outline" className="shadow-lg">
                <Download className="h-5 w-5 mr-2" />
                Export Report
              </Button>
            </>
          )}
        </div>

        {/* Salary Results Table */}
        {salaryEntries.length > 0 && (
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 border-b">
              <CardTitle>Calculated Salaries</CardTitle>
              <CardDescription>Breakdown of salary calculations for selected employees</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-semibold">Employee</TableHead>
                      <TableHead className="font-semibold">Time In/Out</TableHead>
                      <TableHead className="font-semibold">Normal Hrs</TableHead>
                      <TableHead className="font-semibold">OT Hrs</TableHead>
                      <TableHead className="font-semibold">Special Hrs</TableHead>
                      <TableHead className="font-semibold">Normal Pay</TableHead>
                      <TableHead className="font-semibold">OT Pay</TableHead>
                      <TableHead className="font-semibold">Special Pay</TableHead>
                      <TableHead className="font-semibold">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {salaryEntries.map((entry) => (
                      <TableRow key={entry.employeeId} className="hover:bg-blue-50/50 transition-colors">
                        <TableCell className="font-medium text-gray-900">{entry.employeeName}</TableCell>
                        <TableCell className="text-gray-600">{entry.timeIn} - {entry.timeOut}</TableCell>
                        <TableCell className="text-gray-900">{entry.normalHours}h</TableCell>
                        <TableCell className="text-amber-700 font-medium">{entry.overtimeHours}h</TableCell>
                        <TableCell className="text-emerald-700 font-medium">{entry.specialHours}h</TableCell>
                        <TableCell className="text-gray-900">₹{entry.normalSalary.toLocaleString()}</TableCell>
                        <TableCell className="text-amber-700 font-medium">₹{entry.overtimeSalary.toLocaleString()}</TableCell>
                        <TableCell className="text-emerald-700 font-medium">₹{entry.specialSalary.toLocaleString()}</TableCell>
                        <TableCell className="font-bold text-[#337ab7]">₹{entry.totalSalary.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="bg-blue-50 font-semibold">
                      <TableCell colSpan={2} className="text-gray-900">TOTAL</TableCell>
                      <TableCell className="text-gray-900">{totalNormalHours.toFixed(1)}h</TableCell>
                      <TableCell className="text-amber-700">{totalOvertimeHours.toFixed(1)}h</TableCell>
                      <TableCell className="text-emerald-700">{totalSpecialHours.toFixed(1)}h</TableCell>
                      <TableCell colSpan={3}></TableCell>
                      <TableCell className="font-bold text-[#337ab7] text-lg">₹{totalPayout.toLocaleString()}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
