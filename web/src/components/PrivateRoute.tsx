import { PropsWithChildren, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getItem } from "../Utils/Generals";
import RoutePaths from "../config";
import { UserDocument } from "../types";
import { useAppSelector } from "../hooks/redux-hooks";
import { useState } from "react";

const isLogged = getItem(RoutePaths.token);
const user = !isLogged ? null : JSON.parse(getItem("user") || "");

const PrivateRoute = ({
  type = 0,
  children,
}: PropsWithChildren<{ type: number }>) => {
  const isLogged = getItem(RoutePaths.token);
  const [data, setData] = useState(user);

  useEffect(() => {
    if (!isLogged || !user) {
      <Navigate to={RoutePaths.login} replace />;
    }
  }, [isLogged, user]);

  console.log("role", data.roles[0]);

  if (type === 1) {
    if (data.isAuthorized && data.roles[0] === "SYSTEM_ADMIN") {
      return <Navigate to={RoutePaths.sadmin} replace />;
    } else if (data.isAuthorized) {
      return <Navigate to={RoutePaths.companyAdmin} replace />;
    }
  }

  return <Outlet />;
};

export default PrivateRoute;
