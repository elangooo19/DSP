import { Navigate } from 'react-router-dom';

/**
 * CustomerLogin now redirects to the single unified login page with role=customer.
 * Using replace prevents creating multiple login pages in browser back-history.
 */
export default function CustomerLogin() {
  return <Navigate to="/customer" replace />;
}
