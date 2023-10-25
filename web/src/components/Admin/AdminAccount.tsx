import { useState } from "react";
import RoutePaths from "../../config";
import { getItem } from "../../Utils/Generals";

const isLogged = getItem(RoutePaths.token);
const user = !isLogged ? null : JSON.parse(getItem("user") || "");

const AdminAccount = () => {
  const [data, setData] = useState(user);

  return (
    <div className="container">
      <div className="card border-0 shadow-lg">
        <h3 className="card-header bg-primary text-white">Account Details</h3>
        <div className="card-body">
          <div className="row">
            <div className="col-6">
              <div className="mb-3">
                <label className="form-label text-primary">First Name</label>
                <div className="form-control-plaintext">{data.firstName}</div>
              </div>
            </div>
            <div className="col-6">
              <div className="mb-3">
                <label className="form-label text-primary">Last Name</label>
                <div className="form-control-plaintext">{data.lastName}</div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-6">
              <div className="mb-3">
                <label className="form-label text-primary">Email</label>
                <div className="form-control-plaintext">{data.email}</div>
              </div>
            </div>
            <div className="col-6">
              <div className="mb-3">
                <label className="form-label text-primary">Role</label>
                <div className="form-control-plaintext">{data.roles}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="card-footer"></div>
      </div>
    </div>
  );
};

export default AdminAccount;
