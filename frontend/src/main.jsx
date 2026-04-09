import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';

// 1. Import Layouts
import MerchantLayout from './layouts/MerchantLayout';

// 2. Import Screens
import LoginScreen from './screens/LoginScreen';
import StoreRegistrationScreen from './screens/StoreRegistrationScreen';
import CreateDealScreen from './screens/deals/CreateDealScreen';
import DealDashboard from './screens/deals/DealDashboard';
// 🚀 ADDED: Import the new Manage Deal Screen
import ManageDealScreen from './screens/deals/ManageDealScreen';

// 3. Centralized Route Configuration (Highly Scalable)
const router = createBrowserRouter([
  {
    path: "/",
    element: <MerchantLayout />,
    // Future Best Practice: We will add an errorElement here to catch crashes gracefully
    children: [
      {
        index: true, // This makes LoginScreen the default component for "/"
        element: <LoginScreen />
      },
      {
        path: "register-store",
        element: <StoreRegistrationScreen />
      },
      {
        path: "dashboard",
        element: <DealDashboard />
      },
      {
        path: "post-deal",
        element: <CreateDealScreen />
      },
      // 🚀 ADDED: The dynamic Manage Deal route
      {
        path: "manage-deal/:dealId",
        element: <ManageDealScreen />
      }
    ]
  }
]);

// 4. Render the Application Engine
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);