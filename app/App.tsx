'use client';
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Users, 
  Receipt, 
  CreditCard, 
  Calculator, 
  History, 
  Truck, 
  UserPlus, 
  MapPin,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  Settings,
  HelpCircle,
  ChevronDown
} from "lucide-react";
import { User } from "./page";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Image from "next/image";

interface LayoutProps {
  children: ReactNode;
  currentUser: User | null;
  navigateTo: (page: string) => void;
  onLogout: () => void;
  currentPage?: string;
}

export default function Layout({ children, currentUser, navigateTo, onLogout, currentPage }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", page: "dashboard", roles: ["super-admin", "admin", "employee"] },
    { icon: Users, label: "Employees", page: "employees", roles: ["super-admin", "admin"] },
    { icon: Receipt, label: "Expenses", page: "expenses", roles: ["super-admin", "admin"] },
    { icon: CreditCard, label: "Payments", page: "payments", roles: ["super-admin", "admin"] },
    { icon: Calculator, label: "Salary", page: "salary", roles: ["super-admin", "admin"] },
    { icon: History, label: "History Hub", page: "history", roles: ["super-admin", "admin"] },
    { icon: Truck, label: "Tipper", page: "tipper", roles: ["super-admin", "admin"] },
    { icon: UserPlus, label: "Add User", page: "users", roles: ["super-admin"] },
    { icon: MapPin, label: "Add Address", page: "address", roles: ["super-admin", "admin"] },
  ];

  const filteredMenuItems = menuItems.filter(item => 
    currentUser && item.roles.includes(currentUser.role)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Enhanced Top Navigation Bar */}
      <div className="bg-white border-b border-gray-200 px-4 lg:px-6 py-3.5 flex items-center justify-between sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-3 lg:gap-6 flex-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden hover:bg-gray-100"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          
          {/* Logo and Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#337ab7] to-[#2868a0] flex items-center justify-center shadow-lg">
                <Image
            src="/syntora.png"
            alt="Syntora Logo"
            width={40}
            height={40}
            className="object-contain drop-shadow-2xl"
          />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-gray-900">Syntora-Tipper</h1>
              <p className="text-xs text-gray-500">Management System</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search employees, expenses, payments..."
                className="pl-10 pr-4 py-2 w-full border-gray-300 focus:border-[#337ab7] focus:ring-[#337ab7]"
              />
            </div>
          </div>
        </div>
        
        {/* Right side actions */}
        <div className="flex items-center gap-2 lg:gap-4">
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative hover:bg-gray-100">
            <Bell className="h-5 w-5 text-gray-600" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs">
              3
            </Badge>
          </Button>

          {/* Settings */}
          <Button variant="ghost" size="icon" className="hidden lg:flex hover:bg-gray-100">
            <Settings className="h-5 w-5 text-gray-600" />
          </Button>

          {/* Help */}
          <Button variant="ghost" size="icon" className="hidden lg:flex hover:bg-gray-100">
            <HelpCircle className="h-5 w-5 text-gray-600" />
          </Button>

          {/* User Profile */}
          <div className="flex items-center gap-3 pl-3 border-l border-gray-300">
            <div className="text-right hidden lg:block">
              <p className="text-sm font-semibold text-gray-900">{currentUser?.username}</p>
              <p className="text-xs text-gray-500 capitalize">{currentUser?.role.replace('-', ' ')}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#337ab7] to-[#5a9bd5] flex items-center justify-center text-white font-semibold shadow-md">
                {currentUser?.username.charAt(0).toUpperCase()}
              </div>
              <ChevronDown className="h-4 w-4 text-gray-500 hidden sm:block" />
            </div>
          </div>

          <Button 
            variant="outline" 
            size="sm" 
            onClick={onLogout}
            className="border-gray-300 hover:bg-red-50 hover:text-red-600 hover:border-red-300"
          >
            <LogOut className="h-4 w-4 lg:mr-2" />
            <span className="hidden lg:inline">Logout</span>
          </Button>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar - White and smaller */}
        <aside
          className={`${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } fixed lg:sticky top-[73px] left-0 z-40 h-[calc(100vh-73px)] w-64 bg-white border-r border-gray-200 transition-transform duration-300 lg:translate-x-0 shadow-lg lg:shadow-none flex flex-col`}
        >
          {/* Navigation Menu */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {filteredMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.page;
              return (
                <Button
                  key={item.page}
                  variant={isActive ? "default" : "ghost"}
                  className={`w-full justify-start text-sm py-5 ${
                    isActive 
                      ? "bg-[#337ab7] text-white hover:bg-[#2868a0] shadow-md" 
                      : "text-gray-700 hover:text-[#337ab7] hover:bg-blue-50"
                  }`}
                  onClick={() => {
                    navigateTo(item.page);
                    if (window.innerWidth < 1024) {
                      setSidebarOpen(false);
                    }
                  }}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.label}
                </Button>
              );
            })}
          </nav>

          {/* Bottom CTA Section */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="bg-gradient-to-br from-[#337ab7] to-[#2868a0] rounded-lg p-4 mb-3">
              <h3 className="text-white font-semibold text-sm mb-1">Need Help?</h3>
              <p className="text-blue-100 text-xs mb-3">Contact support for assistance</p>
              <Button 
                size="sm" 
                className="w-full bg-white text-[#337ab7] hover:bg-gray-100 font-semibold"
              >
                <HelpCircle className="h-4 w-4 mr-2" />
                Get Support
              </Button>
            </div>
            
            {/* User Info in Sidebar */}
            {/* <div className="flex items-center gap-3 p-3 rounded-lg bg-white border border-gray-200">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#337ab7] to-[#5a9bd5] flex items-center justify-center text-white font-semibold">
                {currentUser?.username.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{currentUser?.username}</p>
                <p className="text-xs text-gray-500 capitalize truncate">{currentUser?.role.replace('-', ' ')}</p>
              </div>
            </div> */}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
