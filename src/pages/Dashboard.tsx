import {
  Package,
  DollarSign,
  Users,
  ShoppingCart,
  LucideIcon,
  HelpCircle,
} from "lucide-react";
import DashboardApiService from "../services/DashboardApiService";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { AuditLog, DashboardCardData } from "../types";
import AuditLogsApiService from "../services/AuditLogsApiService";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";

type IconName = "Package" | "DollarSign" | "Users" | "ShoppingCart" | "default";
const iconMap: Record<IconName, LucideIcon> = {
  Package: Package,
  DollarSign: DollarSign,
  Users: Users,
  ShoppingCart: ShoppingCart,
  default: HelpCircle,
};

const getIconByName = (iconName: string): LucideIcon => {
  return iconMap[iconName as IconName] || iconMap.default;
};

const formatTimeAgo = (timeString: number | string | Date) => {
  const date = new Date(timeString);
  return formatDistanceToNow(date, { addSuffix: true });
};

const StatCard = ({ id, title, value, icon: Icon, color }: any) => (
  <div className="bg-white rounded-lg shadow p-6" key={id}>
    <div className="flex items-center">
      <div className={`p-3 rounded-full ${color} text-white mr-4`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <h3 className="text-2xl font-bold">{value}</h3>
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const apiService = new DashboardApiService(useNavigate());
  const auditApiService = new AuditLogsApiService(useNavigate());
  const [dashboardCardData, setDashboardCardData] = useState<
    DashboardCardData[]
  >([]);

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  const fetchDashboardCardData = async () => {
    const response = await apiService.retrieveDashboardCardData();
    setDashboardCardData(response.data);
    console.log(response.data);
  };

  const fetchAuditLogs = async () => {
    const response = await auditApiService.fetchRecentLogs();
    setAuditLogs(response.data.elements);
  };

  useEffect(() => {
    fetchDashboardCardData();
    fetchAuditLogs();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardCardData.map((data, index) => (
          <StatCard
            key={index}
            title={data.title}
            value={data.value}
            icon={getIconByName(data.icon)}
            color={data.color}
          />
        ))}
      </div>

      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {auditLogs.map((i) => (
            <div
              key={i.id}
              className="flex items-center py-3 border-b last:border-0"
            >
              <div className="w-2 h-2 rounded-full bg-blue-500 mr-4"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-600">{i.actionDescription}</p>
                <p className="text-sm text-gray-600">
                  Performed By: {i.performedBy}
                </p>
                <p className="text-xs text-gray-400">
                  {formatTimeAgo(i.createdAt)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
