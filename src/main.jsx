import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router";
import Dashboard from "./pages/Dashboard.jsx";
import Login from "./pages/Login.jsx";
import Layout from "./layout/Layout.jsx";
import { Provider } from "react-redux";
import store from "./store/index.js";
import Profile from "./pages/Profile.jsx";
import Category from "./pages/Category.jsx";
import ProtectRoute from "./components/protectRoute.jsx";
import Branches from "./pages/Branches.jsx";
import BranchDetails from "./pages/BranchDetails.jsx";
import EditBranchDetails from "./pages/EditBranchDetails.jsx";
import AddBranch from "./pages/Addbranch.jsx";
import Menu from "./pages/Menu.jsx";
import FoodDetails from "./pages/FoodDetails.jsx";
import Managers from "./pages/Managers.jsx";
import AddManager from "./pages/AddManager.jsx";
import ManagerDetails from "./pages/ManagerDetails.jsx";
import EditManager from "./pages/EditManager.jsx";
import ReportsPage from "./pages/Reports.jsx";
import NotFoundPage from "./pages/Not-found.jsx";
import ErrorPage from "./pages/ErrorPage.jsx";

const routes = createBrowserRouter([
  {
    path: "login",
    element: <Login />,
  },
  {
    path: "/",
    element: (
      <ProtectRoute>
        <Layout />
      </ProtectRoute>
    ),

    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "branches",
        element: <Branches />,
      },
      {
        path: "branches/edit/:branchID",
        element: <EditBranchDetails />,
      },
      {
        path: "branches/:branchID",
        element: <BranchDetails />,
      },
      {
        path: "menu",
        element: <Menu />,
      },
      {
        path: "menu/:branchID/:category/:categoryID",
        element: <Category />,
      },
      {
        path: "menu/:branchID/:category/:categoryID/:food",
        element: <FoodDetails />,
      },
      {
        path: "branches/:branchID/edit-branch",
        element: <EditBranchDetails />,
      },
      {
        path: "branches/add-branch",
        element: <AddBranch />,
      },
      {
        path: "managers",
        element: <Managers />,
        children: [
          {
            index: true,
            element: <Managers />,
          },
          {
            path: "add-manager",
            element: <AddManager />,
          },
        ],
      },
      {
        path: "managers/:managerID",
        element: <ManagerDetails />,
        children: [
          {
            index: true,
            element: <ManagerDetails />,
          },
          {
            path: "edit-manager",
            element: <EditManager />,
          },
        ],
      },
      {
        path: "reports",
        element: <ReportsPage />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={routes} />
  </Provider>
);
