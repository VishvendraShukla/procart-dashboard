import { Routes, Route } from "react-router-dom";
import { lazy } from "react";
import { Toaster } from "react-hot-toast";

const Sidebar = lazy(() => import("../components/Sidebar"));
const Dashboard = lazy(() => import("./Dashboard"));
const Products = lazy(() => import("./Products"));
const Charges = lazy(() => import("./Charges"));
const Currencies = lazy(() => import("./Currencies"));
const Inventory = lazy(() => import("./Inventory"));
const AuditLogs = lazy(() => import("./AuditLogs"));
const Users = lazy(() => import("./Users"));
const Configuration = lazy(() => import("./Configuration"));

const Home = () => (
  <div className="flex min-h-screen bg-gray-100">
    <Sidebar />
    <div className="flex-1 p-8">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/products" element={<Products />} />
        <Route path="/charges" element={<Charges />} />
        <Route path="/currencies" element={<Currencies />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/audit-logs" element={<AuditLogs />} />
        <Route path="/users" element={<Users />} />
        <Route path="/configurations" element={<Configuration />} />
      </Routes>
    </div>
    <Toaster position="top-right" />
  </div>
);

export default Home;
