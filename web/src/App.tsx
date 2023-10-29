import { Route, Routes } from "react-router-dom";
import ForgotPassword from "./views/ForgotPassword";
import Login from "./views/Login";
import SignUp from "./views/SignUp";
import PageNotFound from "./views/PageNotFound";
import AdminPanel from "./views/Admin/AdminPanel";
import DashMain from "./components/Admin/DashMain";
import RoutePaths from "./config";
import CompanyMain from "./components/Admin/CompaniesMain";
import SiteMain from "./components/Admin/SitesMain";
import PrivateRoute from "./components/PrivateRoute";
import RedirectIfAuthenticate from "./components/RedirectIfAuthenticate";
import ItemMain from "./components/Admin/ItemsMain";
import SupplierMain from "./components/Admin/SuppliersMain";
import AdminAccount from "./components/Admin/AdminAccount";
import DeliverieMain from "./components/Admin/DeliveriesMain";
import InvoiceMain from "./components/Admin/InvoicesMain";
import OrdersMain from "./components/Admin/OrdersMain";
import UserMain from "./components/Admin/UsersMain";
import CompanyAdminPanel from "./views/Admin/CompanyAdminPanal";
import ApprovedOrdersMain from "./components/Admin/ApprovedOrders";
import PartialyApprovedOrdersMain from "./components/Admin/PartialyApprovedOrders";
import DisApprovedOrdersMain from "./components/Admin/DisapprovedOrders";

function App() {
  return (
    <Routes>
      <Route element={<RedirectIfAuthenticate />}>
        <Route path={RoutePaths.login} element={<Login />}></Route>
        {/* <Route path={RoutePaths.signup} element={<SignUp />}></Route> */}
      </Route>
      <Route
        path={RoutePaths.passwordReset}
        element={<ForgotPassword />}
      ></Route>

      {/* COMPANY ADMINS ROUTES */}

      <Route element={<PrivateRoute type={0} />}>
        <Route
          path={RoutePaths.sadmin}
          element={<AdminPanel currentComponent={<DashMain />} />}
        ></Route>
        <Route
          path={RoutePaths.sadminCompanies}
          element={<AdminPanel currentComponent={<CompanyMain />} />}
        ></Route>
        <Route
          path={RoutePaths.sadminUsers}
          element={<AdminPanel currentComponent={<UserMain />} />}
        ></Route>
        <Route
          path={RoutePaths.sadminAccount}
          element={<AdminPanel currentComponent={<AdminAccount />} />}
        ></Route>
      </Route>

      {/* SYSTEM ADMINS ROUTES */}

      <Route element={<PrivateRoute type={0} />}>
        <Route
          path={RoutePaths.companyAdmin}
          element={<CompanyAdminPanel currentComponent={<DashMain />} />}
        ></Route>
        <Route
          path={RoutePaths.adminSites}
          element={<CompanyAdminPanel currentComponent={<SiteMain />} />}
        ></Route>
        <Route
          path={RoutePaths.adminItems}
          element={<CompanyAdminPanel currentComponent={<ItemMain />} />}
        ></Route>
        <Route
          path={RoutePaths.adminAccount}
          element={<CompanyAdminPanel currentComponent={<AdminAccount />} />}
        ></Route>
        <Route
          path={RoutePaths.adminOrders}
          element={<CompanyAdminPanel currentComponent={<OrdersMain />} />}
        ></Route>
        <Route
          path={RoutePaths.adminApprovedOrders}
          element={
            <CompanyAdminPanel currentComponent={<ApprovedOrdersMain />} />
          }
        ></Route>
        <Route
          path={RoutePaths.adminDApprovedOrders}
          element={
            <CompanyAdminPanel currentComponent={<DisApprovedOrdersMain />} />
          }
        ></Route>
        <Route
          path={RoutePaths.adminPApprovedOrders}
          element={
            <CompanyAdminPanel
              currentComponent={<PartialyApprovedOrdersMain />}
            />
          }
        ></Route>
        <Route
          path={RoutePaths.adminSuppliers}
          element={<CompanyAdminPanel currentComponent={<SupplierMain />} />}
        ></Route>
        <Route
          path={RoutePaths.adminInvoices}
          element={<CompanyAdminPanel currentComponent={<InvoiceMain />} />}
        ></Route>
        <Route
          path={RoutePaths.adminDeliveries}
          element={<CompanyAdminPanel currentComponent={<DeliverieMain />} />}
        ></Route>
        <Route
          path={RoutePaths.adminUsers}
          element={<CompanyAdminPanel currentComponent={<UserMain />} />}
        ></Route>
      </Route>

      <Route path="*" element={<PageNotFound />}></Route>
    </Routes>
  );
}

export default App;
