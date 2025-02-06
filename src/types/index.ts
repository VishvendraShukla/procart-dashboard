export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  sku: string;
  calculatedPrice: number;
  createdAt: string;
  deleted: boolean;
  updatedAt: string;
  imageUrl: string;
  quantity: number;
  currency: Currency;
  charges: Array<Charge>;
}

export interface Charge {
  id: string;
  displayName: string;
  amount: number;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
  chargeType: string;
  chargeAmountType: string;
  chargeAppliesOn: string;
  description: string;
}

export interface Currency {
  id: string;
  code: string;
  name: string;
  symbol: string;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Inventory {
  id: string;
  product: Product;
  deleted: boolean;
  totalStock: number;
  lockedStock: number;
  availableStock: number;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  role: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface AuditLog {
  action: string;
  actionDescription: string;
  createdAt: string;
  deleted: string;
  id: number;
  performedBy: string;
  updatedAt: string;
}

export interface DashboardCardData {
  title: string;
  value: string;
  icon: string;
  color: string;
}

export interface DashboardUserData {
  username: string;
  email: string;
  phone: string;
  whatsApp: string;
  hasAddress: boolean;
  address: string;
}

export interface PageResult<R> {
  elements: Array<R>;
  pageSize: number;
  total: number;
  currentPage: number;
  last: boolean;
}

export interface Configuration {
  createdAt: string;
  deleted: boolean;
  id: number;
  updatedAt: string;
  key: string;
  value: string;
}
