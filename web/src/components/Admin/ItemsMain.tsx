import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import Spinner from "../Spinner";
import { ToastContainer, toast } from "react-toastify";
import { Item } from "../../types";
import {
  useGetAllitemsQuery,
  useCreateitemMutation,
  useUpdateitemMutation,
} from "../../store/apiquery/ItemApiSlice";
import { getItem } from "../../Utils/Generals";
import RoutePaths from "../../config";

const Updateitem = ({ item }: { item: Item }) => {
  const [updateData, setUpdateData] = useState(item);
  const [updateitem, udpateResult] = useUpdateitemMutation();
  const imageTag = useRef<HTMLImageElement>(null);
  const itemId = item?._id;

  const [formData, setFormData] = useState({
    name: updateData.name,
    companyId: updateData.companyId,
    imageUrls: updateData.imageUrls,
  });

  const handleUpdateValue = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    if (name === "imageUrls") {
      const imagesArray = value.split(",").map((urls) => urls.trim());
      setFormData({ ...formData, [name]: imagesArray });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await updateitem({ itemId, formData });

      if ("data" in result && result.data) {
        console.log("item Updated successfully");
        toast.success("item Updated successfully");
        setFormData({
          name: "",
          companyId: "",
          imageUrls: [],
        });
      } else if ("error" in result && result.error) {
        console.error("item creation failed", result.error);
        toast.error("item creation failed");
      }
    } catch (error) {
      console.error("item creation failed`", error);
      toast.error("item creation failed");
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
          <span>Item Name</span>
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
      </div>
      <label>
        <span>Image Urls</span>
        <textarea
          name="imageUrls"
          cols={100}
          rows={10}
          value={formData.imageUrls.join(",")}
          className="w-100 p-2 border"
          placeholder="Image Urls"
          onChange={handleUpdateValue}
        ></textarea>
      </label>
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
            UPDATE item
          </button>
        )}
      </div>
    </form>
  );
};

const AddOrEdititem = ({ item }: { item: null | Item }) => {
  const [createitem, result] = useCreateitemMutation();
  const isLogged = getItem(RoutePaths.token);
  const users = !isLogged ? null : JSON.parse(getItem("user") || "");
  const [dataUser, setData] = useState(users);

  const [formData, setFormData] = useState({
    name: "",
    companyId: dataUser.companyId,
    imageUrls: [] as string[],
  });

  const handleValue = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === "imageUrls") {
      const imagesArray = value.split(",").map((urls) => urls.trim());
      setFormData({ ...formData, [name]: imagesArray });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await createitem(formData);

      if ("data" in result && result.data) {
        console.log("item created successfully");
        toast.success("item created successfully");
        setFormData({
          name: "",
          companyId: "",
          imageUrls: [],
        });
      } else if ("error" in result && result.error) {
        console.error("item creation failed", result.error);
        toast.error("item creation failed");
      }
    } catch (error) {
      console.error("item creation failed`", error);
      toast.error("item creation failed");
    }
  };

  if (!item) {
    return (
      <form
        action=""
        method="post"
        className="checkout-service p-3 .form-item"
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
              placeholder="item Name"
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
        </div>
        <div className="my-4">
          <label>
            <span>Image Urls</span>
          </label>
          <textarea
            name="imageUrls"
            cols={100}
            rows={10}
            value={formData.imageUrls.join(",")}
            className="w-100 p-2 border"
            placeholder="Image Urls"
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

  return <Updateitem item={item} />;
};

const ListOfitems = ({
  setitem,
  setPage,
}: {
  setitem: Function;
  setPage: Function;
}) => {
  const {
    isLoading,
    data: itemsList,
    isSuccess,
    isError,
  } = useGetAllitemsQuery("api/items");

  const parseitem = (item: Item) => {
    setitem(item);
    setPage("add");
  };

  // search bar coding
  const [searchInput, setSearchInput] = useState<string>("");

  let content: React.ReactNode;

  // Filter items based on the search input
  const filtereditems = itemsList?.content.filter((item: Item) => {
    const itemname = item.name?.toLowerCase();
    const search = searchInput.toLowerCase();

    return itemname?.includes(search);
  });

  content =
    isLoading || isError
      ? null
      : isSuccess
      ? filtereditems.map((item: Item) => {
          return (
            <tr className="p-3" key={item._id}>
              <td scope="row w-25">
                <img
                  src={item.imageUrls[0]}
                  alt={item.name}
                  style={{ width: "50px", height: "50px" }}
                />
              </td>
              <td className="fw-bold">{item.name}</td>
              <td>{item.companyId}</td>
              <td className="fw-bold d-flex gap-2 justify-content-center">
                <a
                  href="#"
                  className="p-2 rounded-2 fd-bg-primary"
                  onClick={(e) => parseitem(item)}
                  title="View item"
                >
                  <i className="bi bi-eye"></i>
                </a>
                <a
                  href="#"
                  className="p-2 rounded-2 bg-secondary"
                  onClick={(e) => parseitem(item)}
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
          placeholder="Search items"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </div>
      <div className="table-responsive">
        <table className="table table-default text-center table-bordered">
          <thead>
            <tr className="fd-bg-primary text-white">
              <th scope="col" className="p-3">
                ITEM IMAGE
              </th>
              <th scope="col" className="p-3">
                ITEM NAME
              </th>
              <th scope="col" className="p-3">
                COMPANY ID
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

const ItemMain = () => {
  const [page, setPage] = useState("list");
  const [currentitem, setCurrentitem] = useState(null);

  const changeToList = () => {
    setPage("add");
    setCurrentitem(null);
  };
  const changeToAdd = () => {
    setPage("list");
  };

  useEffect(() => setPage("list"), []);

  return (
    <div className="text-black">
      <h4 className="fw-bold">items</h4>
      <div className="add-item my-3 d-flex justify-content-end">
        {page === "list" ? (
          <a
            href="#"
            className="fd-btn bg-secondary w-25 text-center rounded-3"
            onClick={changeToList}
          >
            ADD ITEM
          </a>
        ) : (
          <a
            href="#"
            className="fd-btn bg-secondary w-25 text-center rounded-3"
            onClick={changeToAdd}
          >
            ITEMS LIST
          </a>
        )}
      </div>
      <div className="subPartMain">
        {page === "list" ? (
          <ListOfitems setitem={setCurrentitem} setPage={setPage} />
        ) : (
          <AddOrEdititem item={currentitem} />
        )}
      </div>
    </div>
  );
};

export default ItemMain;
