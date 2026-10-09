import { LayoutDashboard, IdCard, ShoppingCart, Package, BarChart3, XCircle } from 'lucide-react';
import Layout from '../components/Layout';

const links = [
  { to: '/shop',          end: true, icon: <LayoutDashboard size={18} />, label: 'Dashboard'       },
  { to: '/shop/verify',              icon: <IdCard size={18} />,          label: 'Verify Customer'  },
  { to: '/shop/sell',                icon: <ShoppingCart size={18} />,    label: 'Sell'             },
  { to: '/shop/stock',               icon: <Package size={18} />,         label: 'Stock'            },
  { to: '/shop/sales',               icon: <BarChart3 size={18} />,       label: 'Sales'            },
  { to: '/shop/rejected',            icon: <XCircle size={18} />,         label: 'Rejected Sales'   },
];

export default function ShopDashboard() {
  return <Layout links={links} roleLabel="Government Wine Shop" />;
}

