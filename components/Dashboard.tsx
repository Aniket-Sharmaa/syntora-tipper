import { User } from "@/app/page";
import Layout from "@/app/App";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Users, 
  Briefcase, 
  TrendingUp, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight,
  Calendar,
  Activity
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface DashboardProps {
  currentUser: User | null;
  navigateTo: (page: string) => void;
  onLogout: () => void;
}

// Mock data for charts
const monthlyRevenue = [
  { month: "Jan", revenue: 45000, expenses: 32000 },
  { month: "Feb", revenue: 52000, expenses: 38000 },
  { month: "Mar", revenue: 48000, expenses: 35000 },
  { month: "Apr", revenue: 61000, expenses: 42000 },
  { month: "May", revenue: 55000, expenses: 39000 },
  { month: "Jun", revenue: 67000, expenses: 45000 },
];

const projectStatus = [
  { name: "Completed", value: 45, color: "#10b981" },
  { name: "In Progress", value: 30, color: "#337ab7" },
  { name: "Pending", value: 15, color: "#f59e0b" },
  { name: "Cancelled", value: 10, color: "#ef4444" },
];

const employeePerformance = [
  { name: "Week 1", active: 28, total: 30 },
  { name: "Week 2", active: 29, total: 30 },
  { name: "Week 3", active: 27, total: 30 },
  { name: "Week 4", active: 30, total: 30 },
];

const salaryDistribution = [
  { department: "Operations", amount: 45000 },
  { department: "Management", amount: 35000 },
  { department: "Support", amount: 25000 },
  { department: "Technical", amount: 40000 },
];

export default function Dashboard({ currentUser, navigateTo, onLogout }: DashboardProps) {
  const stats = [
    {
      title: "Total Employees",
      value: "30",
      change: "+3",
      trend: "up",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Active Projects",
      value: "20",
      change: "+5",
      trend: "up",
      icon: Briefcase,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Total Trips",
      value: "1,710",
      change: "+127",
      trend: "up",
      icon: Activity,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Project Value",
      value: "₹60,000",
      change: "-2%",
      trend: "down",
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Revenue Received",
      value: "₹28,000",
      change: "+12%",
      trend: "up",
      icon: DollarSign,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      title: "Remaining",
      value: "₹71,000",
      change: "Pending",
      trend: "neutral",
      icon: Calendar,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
  ];

  return (
    <Layout currentUser={currentUser} navigateTo={navigateTo} onLogout={onLogout} currentPage="dashboard">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back, {currentUser?.username}! Here&apos;s what&apos;s happening today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                      <div className="flex items-baseline gap-2">
                        <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                        <span
                          className={`inline-flex items-center text-sm font-medium ${
                            stat.trend === "up"
                              ? "text-green-600"
                              : stat.trend === "down"
                              ? "text-red-600"
                              : "text-gray-600"
                          }`}
                        >
                          {stat.trend === "up" && <ArrowUpRight className="h-4 w-4" />}
                          {stat.trend === "down" && <ArrowDownRight className="h-4 w-4" />}
                          {stat.change}
                        </span>
                      </div>
                    </div>
                    <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue vs Expenses */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Revenue vs Expenses</CardTitle>
              <CardDescription>Monthly comparison for the last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={monthlyRevenue}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#337ab7" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#337ab7" stopOpacity={0.1} />
                    </linearGradient>
                    <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#337ab7"
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                  <Area
                    type="monotone"
                    dataKey="expenses"
                    stroke="#ef4444"
                    fillOpacity={1}
                    fill="url(#colorExpenses)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Project Status */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Project Status Distribution</CardTitle>
              <CardDescription>Current status of all projects</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={projectStatus}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {projectStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Employee Performance */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Employee Attendance</CardTitle>
              <CardDescription>Weekly active employees tracking</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={employeePerformance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="active" fill="#337ab7" name="Active" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="total" fill="#e5e7eb" name="Total" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Salary Distribution */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Salary Distribution by Department</CardTitle>
              <CardDescription>Monthly salary allocation</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salaryDistribution} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis type="number" stroke="#6b7280" />
                  <YAxis dataKey="department" type="category" stroke="#6b7280" width={100} />
                  <Tooltip />
                  <Bar dataKey="amount" fill="#337ab7" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Frequently used features</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button
                onClick={() => navigateTo("employees")}
                className="p-4 border-2 border-gray-200 rounded-lg hover:border-[#337ab7] hover:bg-blue-50 transition-all group"
              >
                <Users className="h-8 w-8 text-gray-400 group-hover:text-[#337ab7] mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-700">Add Employee</p>
              </button>
              <button
                onClick={() => navigateTo("expenses")}
                className="p-4 border-2 border-gray-200 rounded-lg hover:border-[#337ab7] hover:bg-blue-50 transition-all group"
              >
                <DollarSign className="h-8 w-8 text-gray-400 group-hover:text-[#337ab7] mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-700">Add Expense</p>
              </button>
              <button
                onClick={() => navigateTo("payments")}
                className="p-4 border-2 border-gray-200 rounded-lg hover:border-[#337ab7] hover:bg-blue-50 transition-all group"
              >
                <TrendingUp className="h-8 w-8 text-gray-400 group-hover:text-[#337ab7] mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-700">Add Payment</p>
              </button>
              <button
                onClick={() => navigateTo("salary")}
                className="p-4 border-2 border-gray-200 rounded-lg hover:border-[#337ab7] hover:bg-blue-50 transition-all group"
              >
                <Activity className="h-8 w-8 text-gray-400 group-hover:text-[#337ab7] mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-700">Calculate Salary</p>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
