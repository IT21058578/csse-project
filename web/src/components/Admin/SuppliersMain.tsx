import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import Spinner from "../Spinner";
import { ToastContainer, toast } from "react-toastify";
import { Supplier } from "../../types";
import { useGetAllsuppliersQuery , 
         useCreatesupplierMutation ,
         useDeletesupplierMutation , 
         useUpdatesupplierMutation } from "../../store/apiquery/SuppliersApiSlice";  

const Updatesupplier = ({ supplier }: { supplier: Supplier }) => {

  const [updateData, setUpdateData] = useState(supplier);
  const [updatesupplier, udpateResult] = useUpdatesupplierMutation();
  const supplierId = supplier?._id;

  const [formData, setFormData] = useState({
    name: updateData.name,
    companyId: updateData.companyId,
    email: updateData.email,
    mobiles: updateData.mobiles,
    accountNumbers: updateData.accountNumbers,
    items: updateData.items,
  });

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
      const result = await updatesupplier({ supplierId, formData });

      if ("data" in result && result.data) {
        console.log("supplier Updated successfully");
        toast.success("supplier Updated successfully");
        setFormData({
            name: '',
            companyId: '',
            email: '',
            mobiles: [],
            accountNumbers: [],
            items: {},
        });
      } else if ("error" in result && result.error) {
        console.error("supplier creation failed", result.error);
        toast.error("supplier creation failed");
      }
    } catch (error) {
      console.error("supplier creation failed`", error);
      toast.error("supplier creation failed");
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
          <span>Email</span>
          <input
            type="text"
            name="email"
            className="form-control w-100 rounded-0 p-2"
            value={formData.email}
            onChange={handleUpdateValue}
          />
        </label>
        <label>
          <span>Mobiles</span>
          <input
            type="text"
            name="countInStock"
            className="form-control w-100 rounded-0 p-2"
            value={formData.mobiles}
            onChange={handleUpdateValue}
          />
        </label>
        <label>
          <span>Account Numbers</span>
          <input
            type="text"
            name="brand"
            className="form-control w-100 rounded-0 p-2"
            value={formData.accountNumbers}
            onChange={handleUpdateValue}
          />
        </label>
      </div>
      {/* <label>
        <span>Items</span>
        <textarea
          name="type"
          cols={100}
          rows={10}
          value={formData.items}
          className="w-100 p-2 border"
          placeholder="Description"
          onChange={handleUpdateValue}
        ></textarea>
      </label> */}

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
            UPDATE supplier
          </button>
        )}
      </div>
    </form>
  );
};

const AddOrEditsupplier = ({ supplier }: { supplier: null | Supplier }) => {


  const [createsupplier, result] = useCreatesupplierMutation();

  const [formData, setFormData] = useState({
    name: '',
    companyId: '',
    email: '',
    mobiles: [],
    accountNumbers: [],
    items: [{ itemId: '', rate: '' }],
  });

  const handleValue = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { itemId: '', rate: '' }],
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await createsupplier({ formData });

      if ("data" in result && result.data) {
        console.log("supplier created successfully");
        toast.success("supplier created successfully");
        setFormData({
          name: '',
          companyId: '',
          email: '',
          mobiles: [],
          accountNumbers: [],
          items: [{ itemId: '', rate: '' }],
        });
      } else if ("error" in result && result.error) {
        console.error("supplier creation failed", result.error);
        toast.error("supplier creation failed");
      }
    } catch (error) {
      console.error("supplier creation failed`", error);
      toast.error("supplier creation failed");
    }
  };

  if (!supplier) {
    return (
      <form
        action=""
        method="post"
        className="checkout-service p-3 .form-supplier"
        onSubmit={handleSubmit}
      >
        <div className="d-flex gap-2">
          <label className="w-50">
            <span>Company Id</span>
            <input
              type="text"
              name="companyId"
              value={formData.companyId}
              className="form-control w-100 rounded-0 p-2"
              placeholder="supplier Name"
              onChange={handleValue}
            />
          </label>
        </div>
        <div className="d-grid grid-4 gap-2 mt-3">
          <label>
            <span>Name</span>
            <input
              type="text"
              step={0.1}
              name="name"
              value={formData.name}
              className="form-control w-100 rounded-0 p-2"
              placeholder="supplier Price"
              onChange={handleValue}
            />
          </label>
          <label>
            <span>Email</span>
            <input
              type="text"
              step={0.1}
              name="email"
              value={formData.email}
              className="form-control w-100 rounded-0 p-2"
              placeholder="Color"
              onChange={handleValue}
            />
          </label>
          <label>
            <span>Mobiles</span>
            <input
              type="text"
              name="mobiles"
              value={formData.mobiles}
              className="form-control w-100 rounded-0 p-2"
              placeholder="Quantity"
              onChange={handleValue}
            />
          </label>
          <label>
            <span>Account Numbers</span>
            <input
              type="text"
              name="accountNumbers"
              value={formData.accountNumbers}
              className="form-control w-100 rounded-0 p-2"
              placeholder="Brand"
              onChange={handleValue}
            />
          </label>

          <label>
            <span>Account Numbers</span>
            {formData.items.map((item, index) => (
              <div key={index}>
                <input
                  type="text"
                  name="itemId"
                  placeholder="Item ID"
                  value={item.itemId || ''}
                  onChange={handleValue}
                />
                <input
                  type="number"
                  step="0.01"
                  name="rate"
                  placeholder="Item Rate"
                  value={item.rate || ''}
                  onChange={handleValue}
                />
              </div>
            ))};
           </label>

           <button type="button" onClick={handleAddItem}>+ Add Item</button>


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
            <button
              className="fd-btn w-25 text-center border-0"
            >
              SAVE NOW
            </button>
          )}
        </div>
      </form>
    );
  }

  return <Updatesupplier supplier={supplier} />;
};

const ListOfsuppliers = ({
  setsupplier,
  setPage,
}: {
  setsupplier: Function;
  setPage: Function;
}) => {
  const {
    isLoading,
    data: suppliersList,
    isSuccess,
    isError,
  } = useGetAllsuppliersQuery("api/suppliers");
  const [deletesupplier, deletedResult] = useDeletesupplierMutation();

  const parsesupplier = (supplier: Supplier) => {
    setsupplier(supplier);
    setPage("add");
  };

  const deleteItem = (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Are you sure to delete this supplier ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((r) => {
      if (r.isConfirmed) {
        deletesupplier(id);
      }
    });
  };

  // search bar coding 
  const [searchInput, setSearchInput] = useState<string>('');

  let content: React.ReactNode;

  // Filter suppliers based on the search input
    const filteredsuppliers = suppliersList?.content.filter((supplier: Supplier) =>{
      const suppliername = supplier.name?.toLowerCase();
      const search = searchInput.toLowerCase();
  
      return (
        suppliername?.includes(search) 
      );
    });

  content =
    isLoading || isError
      ? null
      : isSuccess
      ? filteredsuppliers.map((supplier: Supplier) => {
          // ? sortsuppliers.map((supplier: supplierType) => {

          return (
            <tr className="p-3" key={supplier._id}>
              <td className="fw-bold">{supplier.name}</td>
              <td>{supplier.companyId}</td>
              <td>{supplier.email}</td>
              <td>{supplier.mobiles}</td>
              <td>{supplier.accountNumbers}</td>
              <td>
                  {Object.keys(supplier.items).map((itemId) => (
                    <div key={itemId}>
                      Item ID: {itemId}, Rate: {supplier.items[itemId].rate}
                    </div>
                  ))}
              </td>
              <td className="fw-bold d-flex gap-2 justify-content-center">
                <a
                  href="#"
                  className="p-2 rounded-2 fd-bg-primary"
                  onClick={(e) => parsesupplier(supplier)}
                  title="View supplier"
                >
                  <i className="bi bi-eye"></i>
                </a>
                <a
                  href="#"
                  className="p-2 rounded-2 bg-secondary"
                  onClick={(e) => parsesupplier(supplier)}
                  title="Edit"
                >
                  <i className="bi bi-pen"></i>
                </a>
                <a
                  href="#"
                  className="p-2 rounded-2 bg-danger"
                  title="Delete"
                  onClick={(e) => {
                    e.preventDefault();
                    deleteItem(supplier._id);
                  }}
                >
                  <i className="bi bi-trash"></i>
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
        placeholder="Search suppliers"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
      />
    </div>
    <div className="table-responsive">
      <table className="table table-default text-center table-bordered">
        <thead>
          <tr className="fd-bg-primary text-white">
            <th scope="col" className="p-3">
              NAME
            </th>
            <th scope="col" className="p-3">
              COMPANY ID
            </th>
            <th scope="col" className="p-3">
              EMAIL
            </th>
            <th scope="col" className="p-3">
              MOBILES
            </th>
            <th scope="col" className="p-3">
              ACCOUNT NUMBERS
            </th>
            <th scope="col" className="p-3">
              ITEMS
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

const SupplierMain = () => {
  const [page, setPage] = useState("list");
  const [currentsupplier, setCurrentsupplier] = useState(null);

  const changeToList = () => {
    setPage("add");
    setCurrentsupplier(null);
  };
  const changeToAdd = () => {
    setPage("list");
  };

  useEffect(() => setPage("list"), []);

  return (
    <div className="text-black">
      <h4 className="fw-bold">suppliers</h4>
      <div className="add-supplier my-3 d-flex justify-content-end">
        {page === "list" ? (
          <a
            href="#"
            className="fd-btn bg-secondary w-25 text-center rounded-3"
            onClick={changeToList}
          >
            ADD supplier
          </a>
        ) : (
          <a
            href="#"
            className="fd-btn bg-secondary w-25 text-center rounded-3"
            onClick={changeToAdd}
          >
            supplierS LIST
          </a>
        )}
      </div>
      <div className="subPartMain">
        {page === "list" ? (
          <ListOfsuppliers setsupplier={setCurrentsupplier} setPage={setPage} />
        ) : (
          <AddOrEditsupplier supplier={currentsupplier} />
        )}
      </div>
    </div>
  );
};

export default SupplierMain;
