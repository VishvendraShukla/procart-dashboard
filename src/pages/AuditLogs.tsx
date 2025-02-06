import { useEffect, useState } from "react";
import { DataTable } from "../components/Table";
import type { AuditLog } from "../types";
import AuditLogsApiService from "../services/AuditLogsApiService";
import { useNavigate } from "react-router-dom";

const getTextColor = (action: string) => {
  if (
    action.includes("CREATED") ||
    action.includes("ADDED") ||
    action.includes("ADD") ||
    action.includes("COMPLETE") ||
    action.includes("CREATE")
  ) {
    return "bg-green-100 text-green-800";
  } else if (action.includes("UPDATE")) {
    return "bg-blue-100 text-blue-800";
  } else {
    ("bg-red-100 text-red-800");
  }
};
const AuditLogs = () => {
  const [loading, setLoading] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const pageSize = 10;
  const auditLogsApiService = new AuditLogsApiService(useNavigate());

  const fetchLogs = async (page: number) => {
    try {
      setLoading(true);
      const response = await auditLogsApiService.fetchLogs(page, pageSize);
      if (response.data.elements) {
        setAuditLogs(response.data.elements);
        setPageCount(Math.ceil(response.data.total / pageSize));
      }
    } catch (err) {}
    setLoading(false);
  };

  const handlePageChange = (newPage: number) => {
    setPageIndex(newPage);
  };

  useEffect(() => {
    fetchLogs(pageIndex);
  }, [pageIndex]);

  const columns = [
    {
      header: "Description",
      accessorKey: "actionDescription",
    },
    {
      header: "Action",
      accessorKey: "action",
      cell: ({ row }: { row: { original: AuditLog } }) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${getTextColor(
            row.original.action
          )}`}
        >
          {row.original.action}
        </span>
      ),
    },
    {
      header: "Performed By",
      accessorKey: "performedBy",
    },
    {
      header: "Date",
      accessorKey: "created_at",
      cell: ({ row }: { row: { original: AuditLog } }) => (
        <span>{new Date(row.original.createdAt).toLocaleString()}</span>
      ),
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Audit Logs</h1>
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <DataTable
          data={auditLogs}
          columns={columns}
          pageCount={pageCount}
          pageIndex={pageIndex}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default AuditLogs;
