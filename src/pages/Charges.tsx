import { useEffect, useState } from "react";
import { Plus, Pencil } from "lucide-react";
import { DataTable } from "../components/Table";
import Modal from "../components/Modal";
import type { Charge } from "../types";
import ChargesApiService from "../services/ChargesApiService";
import { useNavigate } from "react-router-dom";

const Charges = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCharge, setEditingCharge] = useState<Charge | null>(null);
  const [charges, setCharges] = useState<Charge[]>([]);
  const chargeApiService = new ChargesApiService(useNavigate());
  const [loading, setLoading] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 10;
  const columns = [
    {
      header: "Name",
      accessorKey: "displayName",
    },
    {
      header: "Type",
      accessorKey: "chargeType",
    },
    {
      header: "Charge Applies On",
      accessorKey: "chargeAppliesOn",
    },
    {
      header: "Amount",
      accessorKey: "amount",
      cell: ({ row }: { row: { original: Charge } }) => (
        <span>
          {row.original.chargeAmountType === "PERCENTAGE"
            ? `${row.original.amount}%`
            : `$${row.original.amount.toFixed(2)}`}
        </span>
      ),
    },
    {
      header: "Actions",
      cell: ({ row }: { row: { original: Charge } }) => (
        <button
          onClick={() => {
            setEditingCharge(row.original);
            setIsModalOpen(true);
          }}
          className="p-2 text-blue-600 hover:text-blue-800"
        >
          <Pencil size={16} />
        </button>
      ),
    },
  ];

  const fetchCharges = async (page: number) => {
    try {
      setLoading(true);
      const response = await chargeApiService.fetchCharges(page, pageSize);
      if (response.data.elements) {
        setCharges(response.data.elements);
        setPageCount(Math.ceil(response.data.total / pageSize));
      }
    } catch (err) {}
    setLoading(false);
  };

  const handlePageChange = (newPage: number) => {
    setPageIndex(newPage);
  };

  useEffect(() => {
    fetchCharges(pageIndex);
  }, [pageIndex]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Charges</h1>
        <button
          onClick={() => {
            setEditingCharge(null);
            setIsModalOpen(true);
          }}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={20} className="mr-2" />
          Add Charge
        </button>
      </div>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <DataTable
          data={charges}
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
          setEditingCharge(null);
        }}
        title={editingCharge ? "Edit Charge" : "Add Charge"}
      >
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              defaultValue={editingCharge?.displayName}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Type
            </label>
            <select
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              defaultValue={editingCharge?.chargeType}
            >
              <option value="TAX">Tax</option>
              <option value="SHIPPING">Shipping</option>
              <option value="DISCOUNT">Discount</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Amount
            </label>
            <input
              type="number"
              step="0.01"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              defaultValue={editingCharge?.amount}
            />
          </div>
          {/* <div className="flex items-center">
            <input
              type="checkbox"
              id="is_percentage"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              defaultChecked={editingCharge?.chargeType}
            />
            <label
              htmlFor="is_percentage"
              className="ml-2 block text-sm text-gray-700"
            >
              Is Percentage?
            </label>
          </div> */}
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
              {editingCharge ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Charges;
