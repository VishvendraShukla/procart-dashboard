import { useEffect, useState } from "react";
import { Plus, Pencil } from "lucide-react";
import { DataTable } from "../components/Table";
import Modal from "../components/Modal";
import type { Product } from "../types";
import ProductsApiService from "../services/ProductsApiService";
import { useNavigate } from "react-router-dom";
import { Button, Input, Textarea } from "../components/ui";

const Products = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const productApiService = new ProductsApiService(useNavigate());
  const [pageCount, setPageCount] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 10;
  const [loading, setLoading] = useState(false);
  const columns = [
    {
      header: "Name",
      accessorKey: "name",
    },
    {
      header: "SKU",
      accessorKey: "sku",
    },
    {
      header: "Price",
      accessorKey: "price",
      cell: ({ row }: { row: { original: Product } }) => (
        <span>
          {row.original.currency.symbol}
          {row.original.price.toFixed(2)}
        </span>
      ),
    },
    {
      header: "Selling Price",
      accessorKey: "calculatedPrice",
      cell: ({ row }: { row: { original: Product } }) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            !(row.original.price < row.original.calculatedPrice)
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {row.original.currency.symbol}
          {row.original.calculatedPrice.toFixed(2)}
        </span>
      ),
    },
    {
      header: "Actions",
      cell: ({ row }: { row: { original: Product } }) => (
        <Button
          variant="secondary"
          onClick={() => {
            setEditingProduct(row.original);
            setIsModalOpen(true);
          }}
          className="p-2 text-blue-600 hover:text-blue-800"
        >
          <Pencil size={16} />
        </Button>
      ),
    },
  ];

  const fetchProducts = async (page: number) => {
    try {
      setLoading(true);
      const response = await productApiService.fetchProducts(page, pageSize);
      if (response.data.elements) {
        setProducts(response.data.elements);
        setPageCount(Math.ceil(response.data.total / pageSize));
      }
    } catch (err) {}
    setLoading(false);
  };

  const handlePageChange = (newPage: number) => {
    setPageIndex(newPage);
  };

  useEffect(() => {
    fetchProducts(pageIndex);
  }, [pageIndex]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <Button
          onClick={() => {
            setEditingProduct(null);
            setIsModalOpen(true);
          }}
          variant="primary"
        >
          <Plus size={20} className="mr-2" />
          Add Product
        </Button>
      </div>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <DataTable
          data={products}
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
          setEditingProduct(null);
        }}
        title={editingProduct ? "Edit Product" : "Add Product"}
      >
        <form className="space-y-4">
          <div>
            <Input
              label="Name"
              type="text"
              defaultValue={editingProduct?.name}
            />
          </div>
          <div>
            <Input
              label="SKU"
              type="text"
              defaultValue={editingProduct?.sku}
            />
          </div>
          <div>
            <Input
              label="Price"
              type="number"
              step="0.01"
              defaultValue={editingProduct?.price}
            />
          </div>
          <div>
            <Textarea
              label="Description"
              rows={3}
              defaultValue={editingProduct?.description}
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
            >
              {editingProduct ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Products;
