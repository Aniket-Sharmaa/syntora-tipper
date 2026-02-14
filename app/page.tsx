'use client';
import { useState } from "react";
import LoginPage from "@/components/LoginPage";
import Dashboard from "@/components/Dashboard";
import EmployeeManagement from "@/components/EmployeeManagement";
import ExpenseManagement from "@/components/ExpenseManagement";
import PaymentManagement from "@/components/PaymentManagement";
import SalaryCalculation from "@/components/SalaryCalculation";
import HistoryHub from "@/components/HistoryHub";
import TipperManagement from "@/components/TipperManagement";
import UserManagement from "@/components/UserManagement";
import AddressManagement from "@/components/AddressManagement";
import EmployeeView from "@/components/EmployeeView";
import { Toaster } from "sonner";

export type UserRole = "super-admin" | "admin" | "employee";

export interface User {
  id: string;
  username: string;
  role: UserRole;
}

function App() {
  const [currentPage, setCurrentPage] = useState<string>("login");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setCurrentPage("dashboard");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage("login");
    setSelectedEmployeeId(null);
  };

  const navigateTo = (page: string) => {
    setCurrentPage(page);
  };

  const viewEmployee = (employeeId: string) => {
    setSelectedEmployeeId(employeeId);
    setCurrentPage("employee-view");
  };

  if (currentPage === "login") {
    return <LoginPage onLogin={handleLogin} />;
  }

  const pageProps = {
    currentUser,
    navigateTo,
    onLogout: handleLogout,
    viewEmployee,
  };

  return (
    <>
      {currentPage === "dashboard" && <Dashboard {...pageProps} />}
      {currentPage === "employees" && <EmployeeManagement {...pageProps} />}
      {currentPage === "expenses" && <ExpenseManagement {...pageProps} />}
      {currentPage === "payments" && <PaymentManagement {...pageProps} />}
      {currentPage === "salary" && <SalaryCalculation {...pageProps} />}
      {currentPage === "history" && <HistoryHub {...pageProps} />}
      {currentPage === "tipper" && <TipperManagement {...pageProps} />}
      {currentPage === "users" && <UserManagement {...pageProps} />}
      {currentPage === "address" && <AddressManagement {...pageProps} />}
      {currentPage === "employee-view" && selectedEmployeeId && (
        <EmployeeView {...pageProps} employeeId={selectedEmployeeId} />
      )}
      <Toaster position="top-right" richColors />
    </>
  );
}

export default App;
