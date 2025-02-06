import { useState, useEffect } from "react";
import { Plus, Pencil } from "lucide-react";
import { DataTable } from "../components/Table";
import Modal from "../components/Modal";
import type { Currency } from "../types";
import CurrenciesApiService from "../services/CurrenciesApiService";
import { useNavigate } from "react-router-dom";

const Currencies = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCurrency, setEditingCurrency] = useState<Currency | null>(null);
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [loading, setLoading] = useState(false);
  const currencyService = new CurrenciesApiService(useNavigate());
  const [pageCount, setPageCount] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 10;
  const columns = [
    {
      header: "Code",
      accessorKey: "code",
      cell: ({ row }: { row: { original: Currency } }) => (
        <span className="font-mono">{row.original.code}</span>
      ),
    },
    {
      header: "Name",
      accessorKey: "name",
    },
    {
      header: "Symbol",
      accessorKey: "symbol",
    },
    {
      header: "Status",
      accessorKey: "deleted",
      cell: ({ row }: { row: { original: Currency } }) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            !row.original.deleted
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {!row.original.deleted ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      header: "Actions",
      cell: ({ row }: { row: { original: Currency } }) => (
        <button
          onClick={() => {
            setEditingCurrency(row.original);
            setIsModalOpen(true);
          }}
          className="p-2 text-blue-600 hover:text-blue-800"
        >
          <Pencil size={16} />
        </button>
      ),
    },
  ];

  const fetchCurrencies = async (page: number) => {
    try {
      setLoading(true);
      const response = await currencyService.fetchCurrencies(page, pageSize);
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
    fetchCurrencies(pageIndex);
  }, [pageIndex]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Currencies</h1>
        <button
          onClick={() => {
            setEditingCurrency(null);
            setIsModalOpen(true);
          }}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={20} className="mr-2" />
          Add Currency
        </button>
      </div>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <DataTable
          data={currencies}
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
          setEditingCurrency(null);
        }}
        title={editingCurrency ? "Edit Currency" : "Add Currency"}
      >
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Code
            </label>
            <input
              type="text"
              maxLength={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 uppercase"
              defaultValue={editingCurrency?.code}
              placeholder="USD"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              defaultValue={editingCurrency?.name}
              placeholder="US Dollar"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Symbol
            </label>
            <input
              type="text"
              maxLength={1}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              defaultValue={editingCurrency?.symbol}
              placeholder="$"
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_active"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              defaultChecked={editingCurrency?.deleted}
            />
            <label
              htmlFor="is_active"
              className="ml-2 block text-sm text-gray-700"
            >
              Active
            </label>
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
              {editingCurrency ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Currencies;
