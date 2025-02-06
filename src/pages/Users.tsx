import { useEffect, useState } from "react";
import { DataTable } from "../components/Table";
import { useNavigate } from "react-router-dom";
import DashboardApiService from "../services/DashboardApiService";
import { DashboardUserData } from "../types";

const User = () => {
  const [dashboardUserData, setDashboardUserData] = useState<
    DashboardUserData[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 10;
  const dashboardApiService = new DashboardApiService(useNavigate());
  const columns = [
    {
      header: "Username",
      accessorKey: "username",
      cell: ({ row }: { row: { original: DashboardUserData } }) => (
        <span className="font-mono text-sm">{row.original.username}</span>
      ),
    },
    {
      header: "Email",
      accessorKey: "email",
      cell: ({ row }: { row: { original: DashboardUserData } }) => (
        <span className="font-mono text-sm">{row.original.email}</span>
      ),
    },
    {
      header: "Phone",
      accessorKey: "phone",
      cell: ({ row }: { row: { original: DashboardUserData } }) => (
        <span className="font-mono text-sm">{row.original.phone}</span>
      ),
    },
    {
      header: "Whatsapp",
      accessorKey: "whatsApp",
      cell: ({ row }: { row: { original: DashboardUserData } }) => (
        <span className="font-mono text-sm">{row.original.whatsApp}</span>
      ),
    },
    {
      header: "Address",
      accessorKey: "address",
      cell: ({ row }: { row: { original: DashboardUserData } }) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            row.original.hasAddress
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {row.original.hasAddress ? row.original.address : "Not Available"}
        </span>
      ),
    },
  ];

  const fetchUsers = async (page: number) => {
    try {
      setLoading(true);
      const response = await dashboardApiService.retrieveDashboardUsersData(
        page,
        pageSize
      );
      if (response.data.elements) {
        setDashboardUserData(response.data.elements);
        setPageCount(Math.ceil(response.data.total / pageSize));
      }
    } catch (err) {}
    setLoading(false);
  };

  const handlePageChange = (newPage: number) => {
    setPageIndex(newPage);
  };

  useEffect(() => {
    fetchUsers(pageIndex);
  }, [pageIndex]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
      </div>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <DataTable
          data={dashboardUserData}
          columns={columns}
          pageCount={pageCount}
          pageIndex={pageIndex}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default User;
