import { useEffect, useState } from "react";
import { Plus, Pencil } from "lucide-react";
import { DataTable } from "../components/Table";
import Modal from "../components/Modal";
import type { Configuration } from "../types";
import { useNavigate } from "react-router-dom";
import ConfigurationApiService from "../services/ConfigurationApiService";
import { Input } from "../components/Input";

const Configuration = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingConfiguration, setEditingConfiguration] =
    useState<Configuration | null>(null);
  const [configurations, setConfigurations] = useState<Configuration[]>([]);
  const configurationApiService = new ConfigurationApiService(useNavigate());
  const [loading, setLoading] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");
  const pageSize = 10;
  const columns = [
    {
      header: "Key",
      accessorKey: "key",
    },
    {
      header: "Value",
      accessorKey: "value",
      cell: ({ row }: { row: { original: Configuration } }) => (
        <div className="truncate max-w-[200px] overflow-hidden whitespace-nowrap">
          {row.original.value}
        </div>
      ),
    },
    {
      header: "Actions",
      cell: ({ row }: { row: { original: Configuration } }) => (
        <button
          onClick={() => {
            setEditingConfiguration(row.original);
            setIsModalOpen(true);
            setKey(row.original.key);
            setValue(row.original.value);
          }}
          className="p-2 text-blue-600 hover:text-blue-800"
        >
          <Pencil size={16} />
        </button>
      ),
    },
  ];

  const fetchConfigurations = async (page: number) => {
    try {
      setLoading(true);
      const response = await configurationApiService.fetchConfiguration(
        page,
        pageSize
      );
      if (response.data.elements) {
        setConfigurations(response.data.elements);
        setPageCount(Math.ceil(response.data.total / pageSize));
      }
    } catch (err) {}
    setLoading(false);
  };

  const handlePageChange = (newPage: number) => {
    setPageIndex(newPage);
  };

  useEffect(() => {
    fetchConfigurations(pageIndex);
  }, [pageIndex]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingConfiguration) {
        await configurationApiService.updateConfiguration({
          id: editingConfiguration.id,
          key,
          value,
          createdAt: editingConfiguration.createdAt,
          updatedAt: new Date().toISOString(),
          deleted: editingConfiguration.deleted,
        });
      } else {
        await configurationApiService.createConfiguration({
          id: 0,
          key,
          value,
          createdAt: "",
          updatedAt: "",
          deleted: false,
        });
      }

      setIsModalOpen(false);
      fetchConfigurations(pageIndex);
    } catch (err) {
      console.error("Failed to save configuration", err);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Configurations</h1>
        <button
          onClick={() => {
            setEditingConfiguration(null);
            setIsModalOpen(true);
          }}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={20} className="mr-2" />
          Add Configuration
        </button>
      </div>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <DataTable
          data={configurations}
          columns={columns}
          pageCount={pageCount}
          pageIndex={pageIndex}
          onPageChange={handlePageChange}
        />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingConfiguration(null);
        }}
        title={
          editingConfiguration ? "Edit Configuration" : "Add Configuration"
        }
      >
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Key
            </label>
            <Input
              type="text"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Value
            </label>
            <Input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              {editingConfiguration ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Configuration;
