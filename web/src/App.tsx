import { Route, Routes } from "react-router-dom"
import ForgotPassword from "./views/ForgotPassword"
import Login from "./views/Login"
import SignUp from "./views/SignUp"
import PageNotFound from "./views/PageNotFound"
import AdminPanel from "./views/Admin/AdminPanel"
import DashMain from "./components/Admin/DashMain"
import RoutePaths from "./config"
import CompanyMain from "./components/Admin/CompaniesMain"
import SiteMain from "./components/Admin/SitesMain"
import PrivateRoute from "./components/PrivateRoute"
import RedirectIfAuthenticate from "./components/RedirectIfAuthenticate"

function App() {

  return (
    <Routes>
      <Route element={<RedirectIfAuthenticate />} >
        <Route path={RoutePaths.login} element={<Login />}></Route>
        <Route path={RoutePaths.signup} element={<SignUp />}></Route>
      </Route>
      <Route path={RoutePaths.passwordReset} element={<ForgotPassword />}></Route>

      {/* USERS ROUTES */}

      <Route element={<PrivateRoute type={0}/>}>

      </Route>

      {/* ADMINS ROUTES */}

      <Route element={<PrivateRoute type={0} />} >
        <Route path={RoutePaths.admin} element={<AdminPanel  currentComponent={<DashMain />} />}></Route>
        <Route path={RoutePaths.adminCompanies} element={<AdminPanel  currentComponent={<CompanyMain />} />}></Route>
        <Route path={RoutePaths.adminSites} element={<AdminPanel  currentComponent={<SiteMain />} />}></Route>
        <Route path={RoutePaths.adminItems} element={<AdminPanel  currentComponent={<CategoryMain />} />}></Route>
        <Route path={RoutePaths.adminSuppliers} element={<AdminPanel  currentComponent={<ReviewMain />} />}></Route>
        <Route path={RoutePaths.adminItems} element={<AdminPanel  currentComponent={<CustomersMain />} />}></Route>
        <Route path={RoutePaths.adminAccount} element={<AdminPanel  currentComponent={<AdminAccount />} />}></Route>
      </Route>

      <Route path="*" element={<PageNotFound />}></Route>

    </Routes>
    
  )
}

export default App
