import { useEffect, useState } from "react";
import { Plus, Pencil } from "lucide-react";
import { DataTable } from "../components/Table";
import Modal from "../components/Modal";
import type { Inventory } from "../types";
import InventoryApiService from "../services/InventoryApiService";
import { useNavigate } from "react-router-dom";

const Inventory = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInventory, setEditingInventory] = useState<Inventory | null>(
    null
  );
  const [inventories, setCurrencies] = useState<Inventory[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 10;
  const invertoryService = new InventoryApiService(useNavigate());
  const columns = [
    {
      header: "Product SKU",
      accessorKey: "product.sku",
      cell: ({ row }: { row: { original: Inventory } }) => (
        <span className="font-mono text-sm">{row.original.product.sku}</span>
      ),
    },
    {
      header: "Available Stock",
      accessorKey: "availableStock",
      cell: ({ row }: { row: { original: Inventory } }) => (
        <span
          className={`${
            row.original.availableStock <= 10 ? "text-red-600 font-medium" : ""
          }`}
        >
          {row.original.availableStock}
        </span>
      ),
    },
    {
      header: "Locked Stock",
      accessorKey: "lockedStock",
      cell: ({ row }: { row: { original: Inventory } }) => (
        <span className="font-mono text-sm">{row.original.lockedStock}</span>
      ),
    },
    {
      header: "Last Updated",
      accessorKey: "updatedAt",
      cell: ({ row }: { row: { original: Inventory } }) => (
        <span className="text-gray-600">
          {new Date(row.original.updatedAt).toLocaleString()}
        </span>
      ),
    },
    {
      header: "Actions",
      cell: ({ row }: { row: { original: Inventory } }) => (
        <button
          onClick={() => {
            setEditingInventory(row.original);
            setIsModalOpen(true);
          }}
          className="p-2 text-blue-600 hover:text-blue-800"
        >
          <Pencil size={16} />
        </button>
      ),
    },
  ];

  const fetchInventoryRecords = async (page: number) => {
    try {
      setLoading(true);
      const response = await invertoryService.fetchInventoryRecords(
        page,
        pageSize
      );
      if (response.data.elements) {
        setCurrencies(response.data.elements);
        setPageCount(Math.ceil(response.data.total / pageSize));
      }
    } catch (err) {}
    setLoading(false);
  };

  const handlePageChange = (newPage: number) => {
    setPageIndex(newPage);
  };

  useEffect(() => {
    fetchInventoryRecords(pageIndex);
  }, [pageIndex]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
        <button
          onClick={() => {
            setEditingInventory(null);
            setIsModalOpen(true);
          }}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={20} className="mr-2" />
          Add Inventory
        </button>
      </div>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <DataTable
          data={inventories}
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
          setEditingInventory(null);
        }}
        title={editingInventory ? "Edit Inventory" : "Add Inventory"}
      >
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Quantity
            </label>
            <input
              type="number"
              min="0"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              defaultValue={editingInventory?.availableStock}
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
              {editingInventory ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Inventory;
