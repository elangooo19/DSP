import { LayoutDashboard, Users, Store, Package, Receipt, BarChart3 } from 'lucide-react';
import Layout from '../components/Layout';

const links = [
  { to: '/admin',              end: true, icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
  { to: '/admin/customers',    icon: <Users size={18} />,           label: 'Customers' },
  { to: '/admin/shops',        icon: <Store size={18} />,           label: 'Shops' },
  { to: '/admin/inventory',    icon: <Package size={18} />,         label: 'Inventory' },
  { to: '/admin/transactions', icon: <Receipt size={18} />,         label: 'Transactions' },
  { to: '/admin/reports',      icon: <BarChart3 size={18} />,       label: 'Reports' },
];

export default function AdminDashboard() {
  return <Layout links={links} roleLabel="Administrator" />;
}

