import { Route, Routes } from "react-router-dom";
import RoutePaths from "./config";
import Splash from "./Screens/Splash";
import SignInSide from "./Screens/SignInSide";
import Dashboard from "./Screens/Dashboard";
import Notification from "./Screens/Notification";
import Profile from "./Screens/profile";

function App() {
  return (
    <Routes>
      <Route path={RoutePaths.home} element={<Splash />}></Route>
      <Route path={RoutePaths.signin} element={<SignInSide />}></Route>
      <Route path={RoutePaths.dashboard} element={<Dashboard />}></Route>
      <Route path={RoutePaths.notification} element={<Notification />}></Route>
      <Route path={RoutePaths.profile} element={<Profile />}></Route>
    </Routes>
  );
}

export default App;
