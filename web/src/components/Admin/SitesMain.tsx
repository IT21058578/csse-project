import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import Spinner from "../Spinner";
import { ToastContainer, toast } from "react-toastify";
import { Site, User } from "../../types";
import {
  useGetAllsitesQuery,
  useCreatesiteMutation,
  useUpdatesiteMutation,
} from "../../store/apiquery/SitesApiSlice";
import { getItem } from "../../Utils/Generals";
import RoutePaths from "../../config";
import { useGetAllUsersQuery } from "../../store/apiquery/usersApiSlice";

const Updatesite = ({ site }: { site: Site }) => {
  const [updateData, setUpdateData] = useState(site);
  const [updatesite, udpateResult] = useUpdatesiteMutation();
  const imageTag = useRef<HTMLImageElement>(null);
  const siteId = site?._id;

  const {
    isLoading,
    data: SiteMangerList,
    isError,
  } = useGetAllUsersQuery("users/search");

  const isLogged = getItem(RoutePaths.token);
  const users = !isLogged ? null : JSON.parse(getItem("user") || "");

  const [dataUser, setData] = useState(users);

  const siteAdmins = SiteMangerList?.content.filter((user: any) => {
    return (
      user.roles.includes("SITE_ADMIN") && user.companyId === dataUser.companyId
    );
  });

  const [formData, setFormData] = useState({
    name: updateData.name,
    companyId: updateData.companyId,
    address: updateData.address,
    mobiles: updateData.mobiles,
    siteManagerIds: updateData.siteManagerIds,
  });

  const handleUserSelection = (userId: string) => {
    setFormData((prevFormData: any) => {
      if (prevFormData.siteManagerIds.includes(userId)) {
        return {
          ...prevFormData,
          siteManagerIds: prevFormData.siteManagerIds.filter(
            (id: string) => id !== userId
          ),
        };
      } else {
        return {
          ...prevFormData,
          siteManagerIds: [...prevFormData.siteManagerIds, userId],
        };
      }
    });
  };

  const handleUpdateValue = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await updatesite({ siteId, formData });

      if ("data" in result && result.data) {
        console.log("site Updated successfully");
        toast.success("site Updated successfully");
        setFormData({
          name: "",
          companyId: "",
          address: "",
          mobiles: [],
          siteManagerIds: [],
        });
      } else if ("error" in result && result.error) {
        console.error("site creation failed", result.error);
        toast.error("site creation failed");
      }
    } catch (error) {
      console.error("site creation failed`", error);
      toast.error("site creation failed");
    }
  };

  return (
    <form
      action=""
      method="patch"
      className="checkout-service p-3"
      onSubmit={handleSubmit}
    >
      <input type="hidden" name="id" value={updateData._id} />
      <div className="d-flex gap-2">
        <label className="w-50">
          <span>Name</span>
          <input
            type="text"
            name="name"
            className="form-control w-100 rounded-0 p-2"
            value={formData.name}
            onChange={handleUpdateValue}
          />
        </label>
      </div>
      <div className="d-grid grid-4 gap-2 mt-3">
        <label>
          <span>Company ID</span>
          <input
            type="text"
            name="companyId"
            className="form-control w-100 rounded-0 p-2"
            value={formData.companyId}
            onChange={handleUpdateValue}
          />
        </label>
        <label>
          <span>Address</span>
          <input
            type="text"
            name="address"
            className="form-control w-100 rounded-0 p-2"
            value={formData.address}
            onChange={handleUpdateValue}
          />
        </label>
        {/* <label>
          <span>Site Managers</span>
          <input
            type="text"
            name="siteManagerIds"
            className="form-control w-100 rounded-0 p-2"
            value={formData.siteManagerIds}
            onChange={handleUpdateValue}
          />
        </label>
      </div>
      <label>
        <span>Mobiles</span>
        <textarea
          name="mobiles"
          cols={100}
          rows={10}
          value={formData.mobiles}
          className="w-100 p-2 border"
          placeholder="mobiles"
          onChange={handleUpdateValue}
        ></textarea>
      </label> */}
        <label>
          <span>Site Managers</span>
          <div className="form-control w-100 rounded-0 p-2">
            {isLoading ? (
              <p>Loading users...</p>
            ) : isError ? (
              <p>Error loading users</p>
            ) : (
              siteAdmins?.map((user: User) => (
                <label key={user._id}>
                  <input
                    type="checkbox"
                    value={user._id}
                    checked={formData.siteManagerIds.includes(user._id)}
                    onChange={() => handleUserSelection(user._id)}
                  />
                  {user.firstName}
                </label>
              ))
            )}
          </div>
        </label>
      </div>
      <div className="my-4">
        <label>
          <span>Mobiles</span>
        </label>
        <textarea
          name="mobiles"
          cols={100}
          rows={10}
          value={formData.mobiles.join(",")}
          className="w-100 p-2 border"
          placeholder="mobiles"
          onChange={handleUpdateValue}
        ></textarea>
      </div>
      <div className="mt-4">
        <ToastContainer />
      </div>
      <div className="mt-3">
        {udpateResult.isLoading ? (
          <button className="fd-btn w-25 text-center border-0">
            <span
              className="spinner-grow spinner-grow-sm"
              role="status"
              aria-hidden="true"
            ></span>
            Loading...
          </button>
        ) : (
          <button className="fd-btn w-25 text-center border-0" type="submit">
            UPDATE SITE
          </button>
        )}
      </div>
    </form>
  );
};

const AddOrEditsite = ({ site }: { site: null | Site }) => {
  const [createsite, result] = useCreatesiteMutation();
  const isLogged = getItem(RoutePaths.token);
  const users = !isLogged ? null : JSON.parse(getItem("user") || "");
  const [dataUser, setData] = useState(users);

  const {
    isLoading,
    data: SiteMangerList,
    isError,
  } = useGetAllUsersQuery("users/search");

  const siteAdmins = SiteMangerList?.content.filter((user: any) => {
    return (
      user.roles.includes("SITE_ADMIN") && user.companyId === dataUser.companyId
    );
  });

  const [formData, setFormData] = useState({
    name: "",
    companyId: dataUser.companyId,
    address: "",
    mobiles: [""],
    siteManagerIds: [] as string[],
  });

  const handleUserSelection = (userId: string) => {
    setFormData((prevFormData: any) => {
      if (prevFormData.siteManagerIds.includes(userId)) {
        return {
          ...prevFormData,
          siteManagerIds: prevFormData.siteManagerIds.filter(
            (id: string) => id !== userId
          ),
        };
      } else {
        return {
          ...prevFormData,
          siteManagerIds: [...prevFormData.siteManagerIds, userId],
        };
      }
    });
  };

  const handleValue = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === "mobiles") {
      const mobilesArray = value.split(",").map((mobile) => mobile.trim());
      setFormData({ ...formData, [name]: mobilesArray });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await createsite(formData);

      if ("data" in result && result.data) {
        console.log("site created successfully");
        toast.success("site created successfully");
        setFormData({
          name: "",
          companyId: "",
          address: "",
          mobiles: [""],
          siteManagerIds: [""],
        });
      } else if ("error" in result && result.error) {
        console.error("site creation failed", result.error);
        toast.error("site creation failed");
      }
    } catch (error) {
      console.error("site creation failed`", error);
      toast.error("site creation failed");
    }
  };

  if (!site) {
    return (
      <form
        action=""
        method="post"
        className="checkout-service p-3 .form-site"
        onSubmit={handleSubmit}
      >
        <div className="d-flex gap-2">
          <label className="w-50">
            <span>Name</span>
            <input
              type="text"
              name="name"
              value={formData.name}
              className="form-control w-100 rounded-0 p-2"
              placeholder="site Name"
              onChange={handleValue}
            />
          </label>
        </div>
        <div className="d-grid grid-4 gap-2 mt-3">
          <label>
            <span>Company ID</span>
            <input
              type="text"
              step={0.1}
              name="price"
              value={formData.companyId}
              className="form-control w-100 rounded-0 p-2"
              placeholder="Company ID"
              onChange={handleValue}
            />
          </label>
          <label>
            <span>Address</span>
            <input
              type="text"
              step={0.1}
              name="address"
              value={formData.address}
              className="form-control w-100 rounded-0 p-2"
              placeholder="Address"
              onChange={handleValue}
            />
          </label>
          {/* <label>
            <span>Site Managers</span>
            <input
              type="text"
              name="siteManagerIds"
              value={formData.siteManagerIds}
              className="form-control w-100 rounded-0 p-2"
              placeholder="Site Managers"
              onChange={handleValue}
            />
          </label> */}
          <label>
            <span>Site Managers</span>
            <div className="form-control w-100 rounded-0 p-2">
              {isLoading ? (
                <p>Loading users...</p>
              ) : isError ? (
                <p>Error loading users</p>
              ) : (
                siteAdmins?.map((user: User) => (
                  <label key={user._id}>
                    <input
                      type="checkbox"
                      value={user._id}
                      checked={formData.siteManagerIds.includes(user._id)}
                      onChange={() => handleUserSelection(user._id)}
                    />
                    {user.firstName}
                  </label>
                ))
              )}
            </div>
          </label>
        </div>
        <div className="my-4">
          <label>
            <span>Mobiles</span>
          </label>
          <textarea
            name="mobiles"
            cols={100}
            rows={10}
            value={formData.mobiles.join(",")}
            className="w-100 p-2 border"
            placeholder="mobiles"
            onChange={handleValue}
          ></textarea>
        </div>
        <div className="mt-3">
          <ToastContainer />
        </div>
        <div className="mt-3">
          {result.isLoading ? (
            <button className="fd-btn w-25 text-center border-0">
              <span
                className="spinner-grow spinner-grow-sm"
                role="status"
                aria-hidden="true"
              ></span>
              Loading...
            </button>
          ) : (
            <button className="fd-btn w-25 text-center border-0">
              SAVE NOW
            </button>
          )}
        </div>
      </form>
    );
  }

  return <Updatesite site={site} />;
};

const ListOfsites = ({
  setsite,
  setPage,
}: {
  setsite: Function;
  setPage: Function;
}) => {
  const {
    isLoading,
    data: sitesList,
    isSuccess,
    isError,
  } = useGetAllsitesQuery("api/sites");

  const parsesite = (site: Site) => {
    setsite(site);
    setPage("add");
  };

  // search bar coding
  const [searchInput, setSearchInput] = useState<string>("");

  let content: React.ReactNode;

  // Filter sites based on the search input
  const filteredsites = sitesList?.content.filter((site: Site) => {
    const sitename = site.name?.toLowerCase();
    const search = searchInput.toLowerCase();

    return sitename?.includes(search);
  });

  content =
    isLoading || isError
      ? null
      : isSuccess
      ? filteredsites.map((site: Site) => {
          // ? sortsites.map((site: siteType) => {

          return (
            <tr className="p-3" key={site._id}>
              <td className="fw-bold">{site.name}</td>
              <td>{site.companyId}</td>
              <td>{site.address}</td>
              <td>{site.mobiles}</td>
              <td>{site.siteManagerIds}</td>
              <td className="fw-bold d-flex gap-2 justify-content-center">
                <a
                  href="#"
                  className="p-2 rounded-2 fd-bg-primary"
                  onClick={(e) => parsesite(site)}
                  title="View site"
                >
                  <i className="bi bi-eye"></i>
                </a>
                <a
                  href="#"
                  className="p-2 rounded-2 bg-secondary"
                  onClick={(e) => parsesite(site)}
                  title="Edit"
                >
                  <i className="bi bi-pen"></i>
                </a>
              </td>
            </tr>
          );
        })
      : null;

  return !isLoading ? (
    <div>
      {/* Add a search input field */}
      <div className="mb-3">
        <input
          type="text"
          placeholder="Search sites"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </div>
      <div className="table-responsive">
        <table className="table table-default text-center table-bordered">
          <thead>
            <tr className="fd-bg-primary text-white">
              <th scope="col" className="p-3">
                SITE NAME
              </th>
              <th scope="col" className="p-3">
                COMPANY ID
              </th>
              <th scope="col" className="p-3">
                ADDRESS
              </th>
              <th scope="col" className="p-3">
                MOBILES
              </th>
              <th scope="col" className="p-3">
                SITE MANAGERS ID'S
              </th>
              <th scope="col" className="p-3">
                ACTIONS
              </th>
            </tr>
          </thead>
          <tbody>{content}</tbody>
        </table>
      </div>
    </div>
  ) : (
    <Spinner />
  );
};

const SiteMain = () => {
  const [page, setPage] = useState("list");
  const [currentsite, setCurrentsite] = useState(null);

  const changeToList = () => {
    setPage("add");
    setCurrentsite(null);
  };
  const changeToAdd = () => {
    setPage("list");
  };

  useEffect(() => setPage("list"), []);

  return (
    <div className="text-black">
      <h4 className="fw-bold">sites</h4>
      <div className="add-site my-3 d-flex justify-content-end">
        {page === "list" ? (
          <a
            href="#"
            className="fd-btn bg-secondary w-25 text-center rounded-3"
            onClick={changeToList}
          >
            ADD SITE
          </a>
        ) : (
          <a
            href="#"
            className="fd-btn bg-secondary w-25 text-center rounded-3"
            onClick={changeToAdd}
          >
            SITES LIST
          </a>
        )}
      </div>
      <div className="subPartMain">
        {page === "list" ? (
          <ListOfsites setsite={setCurrentsite} setPage={setPage} />
        ) : (
          <AddOrEditsite site={currentsite} />
        )}
      </div>
    </div>
  );
};

export default SiteMain;
