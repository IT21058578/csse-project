import React, { useState } from "react";
import Spinner from "../Spinner";
import { useGetAllitemrequestsQuery } from "../../store/apiquery/ItemRequestApiSlice";
import { Item, ItemRequest, Site, Supplier, User } from "../../types";
import { getItem } from "../../Utils/Generals";
import RoutePaths from "../../config";
import { useGetAllUsersQuery } from "../../store/apiquery/usersApiSlice";
import { useGetAllsuppliersQuery } from "../../store/apiquery/SuppliersApiSlice";
import { useGetAllitemsQuery } from "../../store/apiquery/ItemApiSlice";
import { useGetAllsitesQuery } from "../../store/apiquery/SitesApiSlice";

const DashMain = () => {
  const isLogged = getItem(RoutePaths.token);
  const users = !isLogged ? null : JSON.parse(getItem("user") || "");
  const [dataUser, setData] = useState(users);

  const { data: orders } = useGetAllitemrequestsQuery("api/procurements");
  const { data: user } = useGetAllUsersQuery("api/users");
  const { data: suppliers } = useGetAllsuppliersQuery("api/suppliers");
  const { data: items } = useGetAllitemsQuery("api/items");
  const { data: sites } = useGetAllsitesQuery("api/sites");

  const filteredOrders = orders?.content?.filter(
    (order: ItemRequest) => order?.companyId == users.companyId
  );

  const filteredOrdersByStatusA = orders?.content?.filter(
    (order: ItemRequest) => order?.status === "APPROVED"
  );

  const filteredOrdersByStatusD = orders?.content?.filter(
    (order: ItemRequest) => order?.status === "DISAPPROVED"
  );

  const filteredOrdersByStatusP = orders?.content?.filter(
    (order: ItemRequest) => order?.status === "PARTIALLY_APPROVED"
  );

  const filteredUsers = user?.content?.filter(
    (user: User) => user?.companyId == users.companyId
  );

  const filteredSuppliers = suppliers?.content?.filter(
    (supplier: Supplier) => supplier?.companyId == users.companyId
  );

  const filteredItems = items?.content?.filter(
    (item: Item) => item?.companyId == users.companyId
  );

  const filteredSites = sites?.content?.filter(
    (site: Site) => site?.companyId == users.companyId
  );

  return (
    <div className="dash-user pt-2">
      <h4 className="text-dark fw-bold">Dashboard</h4>
      <div className="resume d-grid grid-4 gap-3 fw-bold mt-3">
        <div className="r-card d-flex flex-column align-items-center gap-3 border border-1 bg-secondary p-3">
          <h1>{filteredOrders?.length}</h1>
          <h4 className="align-self-center">Total Orders</h4>
        </div>
        <div className="r-card d-flex flex-column align-items-center gap-3 border border-1 bg-secondary p-3">
          <h1>{filteredOrdersByStatusA?.length}</h1>
          <h4 className="align-self-center">Total Approved Orders</h4>
        </div>
        <div className="r-card d-flex flex-column align-items-center gap-3 border border-1 bg-secondary p-3">
          <h1>{filteredOrdersByStatusD?.length}</h1>
          <h4 className="align-self-center">Total Disapptoved Orders</h4>
        </div>
        <div className="r-card d-flex flex-column align-items-center gap-3 border border-1 bg-secondary p-3">
          <h1>{filteredUsers?.length}</h1>
          <h4 className="align-self-center">Total Employees</h4>
        </div>
        <div className="r-card d-flex flex-column align-items-center gap-3 border border-1 bg-secondary p-3">
          <h1>{filteredSuppliers?.length}</h1>
          <h4 className="align-self-center">Total Suppliers</h4>
        </div>
        <div className="r-card d-flex flex-column align-items-center gap-3 border border-1 bg-secondary p-3">
          <h1>{filteredItems?.length}</h1>
          <h4 className="align-self-center">Total Items</h4>
        </div>
        <div className="r-card d-flex flex-column align-items-center gap-3 border border-1 bg-secondary p-3">
          <h1>{filteredSites?.length}</h1>
          <h4 className="align-self-center">Total Sites</h4>
        </div>
        <div className="r-card d-flex flex-column align-items-center gap-3 border border-1 bg-secondary p-3">
          <h1>{filteredOrdersByStatusP?.length}</h1>
          <h4 className="align-self-center">Total partially approved orders</h4>
        </div>
      </div>
      <div className="user-dashboard p-3 border border-3 text-black mt-5">
        <p className="opacity-75">
          From your admin dashboard you can view your company detaails, manage
          your account and others, and edit your password and account details
        </p>
      </div>
    </div>
  );
};

export default DashMain;
