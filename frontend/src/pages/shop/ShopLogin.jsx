import { Navigate } from 'react-router-dom';

/**
 * ShopLogin now redirects to the single unified login page with role=shop.
 * Using replace prevents creating multiple login pages in browser back-history.
 */
export default function ShopLogin() {
  return <Navigate to="/login?role=shop" replace />;
}
