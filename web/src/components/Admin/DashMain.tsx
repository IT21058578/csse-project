import React from "react";
// import { useGetStartisticsQuery } from "../../store/apiquery/usersApiSlice";
import Spinner from "../Spinner";

const DashMain = () => {
  // const { data: starts, isLoading } = useGetStartisticsQuery("api/users");
  // const {data: products } = useGetAllProductsQuery("api/products");
  // const {data: reviews  } = useGetAllReviewQuery("api/reviews");
  // const {data: users } = useGetAllUsersQuery("api/users");
  // const {data: orders } = useGetAllOrderQuery("api/orders");

  return (
    <div className="dash-user pt-2">
      <h4 className="text-dark fw-bold">Dashboard</h4>
      <div className="resume d-grid grid-4 gap-3 fw-bold mt-3">
        <div className="r-card d-flex flex-column align-items-center gap-3 border border-1 bg-secondary p-3">
          {/* <h1>{products?.metadata.totalDocuments}</h1> */}
          <h4 className="align-self-center">Total Orders</h4>
        </div>
        <div className="r-card d-flex flex-column align-items-center gap-3 border border-1 bg-secondary p-3">
          {/* <h1>{reviews?.metadata.totalDocuments}</h1> */}
          <h4 className="align-self-center">Total Approved Orders</h4>
        </div>
        <div className="r-card d-flex flex-column align-items-center gap-3 border border-1 bg-secondary p-3">
          {/* <h1>{users?.metadata.totalDocuments}</h1> */}
          <h4 className="align-self-center">Total Disapptoved Orders</h4>
        </div>
        <div className="r-card d-flex flex-column align-items-center gap-3 border border-1 bg-secondary p-3">
          {/* <h1>{orders?.metadata.totalDocuments}</h1> */}
          <h4 className="align-self-center">Total Employees</h4>
        </div>
        <div className="r-card d-flex flex-column align-items-center gap-3 border border-1 bg-secondary p-3">
          {/* <h1>{products?.metadata.totalDocuments}</h1> */}
          <h4 className="align-self-center">Total Sppliers</h4>
        </div>
        <div className="r-card d-flex flex-column align-items-center gap-3 border border-1 bg-secondary p-3">
          {/* <h1>{reviews?.metadata.totalDocuments}</h1> */}
          <h4 className="align-self-center">Total Items</h4>
        </div>
        <div className="r-card d-flex flex-column align-items-center gap-3 border border-1 bg-secondary p-3">
          {/* <h1>{users?.metadata.totalDocuments}</h1> */}
          <h4 className="align-self-center">Total Sites</h4>
        </div>
        <div className="r-card d-flex flex-column align-items-center gap-3 border border-1 bg-secondary p-3">
          {/* <h1>{orders?.metadata.totalDocuments}</h1> */}
          <h4 className="align-self-center">Total partially approved orders</h4>
        </div>
      </div>
      <div className="user-dashboard p-3 border border-3 text-black mt-5">
        <p className="opacity-75">
          From your admin dashboard you can view your popular products, manage
          your account and others, and edit your password and account details
        </p>
      </div>
    </div>
  );
};

export default DashMain;
