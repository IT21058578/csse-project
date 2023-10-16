import { PropsWithChildren, useEffect } from "react"
import { Navigate, Outlet } from "react-router-dom"
import { getItem } from "../Utils/Generals"
import RoutePaths from "../config";
import { UserDocument } from "../types";
import { useAppSelector } from '../hooks/redux-hooks'
import { useState } from "react";

const isLogged = getItem(RoutePaths.token);
const user = !isLogged ? null : JSON.parse(getItem("user") || "");

const PrivateRoute = ({type = 0, children} : PropsWithChildren<{type : number}>) => {
    
    const isLogged = getItem(RoutePaths.token);
    const [data, setData] = useState(user);

    const admin = data.isAuthorized;

    if (!isLogged) {
        return <Navigate to={RoutePaths.login} replace />;
    }

    if (type === 1 && admin===true) {

        return <Navigate to={RoutePaths.admin} replace />;
    }

    return <Outlet />;
}

export default PrivateRoute;