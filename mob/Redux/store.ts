import { configureStore } from "@reduxjs/toolkit"
import { approvalApiSlice } from "./API/ApprovalsApiSlice"
import { authApiSlice } from "./API/AuthApiSlice"
import { companieApiSlice } from "./API/CompaniesApiSlice"
import { deliverieApiSlice } from "./API/DeliveriesApiSlice"
import { invoiceApiSlice } from "./API/InvoiceApiSlice"
import { itemApiSlice } from "./API/ItemApiSlice"
import { itemrequestApiSlice } from "./API/ItemRequestApiSlice"
import { siteApiSlice } from "./API/SitesApiSlice"
import { supplierApiSlice } from "./API/SuppliersApiSlice"
import { usersApiSlice } from "./API/usersApiSlice"
import { userSlice } from "./slices/userSlice"

export const store = configureStore({
  reducer : {
      [authApiSlice.reducerPath] : authApiSlice.reducer,
      [usersApiSlice.reducerPath] : usersApiSlice.reducer,
      [companieApiSlice.reducerPath] : companieApiSlice.reducer,
      [approvalApiSlice.reducerPath] : approvalApiSlice.reducer,
      [deliverieApiSlice.reducerPath] : deliverieApiSlice.reducer,
      [itemApiSlice.reducerPath] : itemApiSlice.reducer,
      [itemrequestApiSlice.reducerPath] : itemrequestApiSlice.reducer,
      [siteApiSlice.reducerPath] : siteApiSlice.reducer,
      [supplierApiSlice.reducerPath] : supplierApiSlice.reducer,
      [invoiceApiSlice.reducerPath] : invoiceApiSlice.reducer,
      user : userSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware()
      .concat(
          authApiSlice.middleware,
          usersApiSlice.middleware,
          companieApiSlice.middleware,
          approvalApiSlice.middleware,
          deliverieApiSlice.middleware,
          itemApiSlice.middleware,
          itemrequestApiSlice.middleware,
          siteApiSlice.middleware,
          supplierApiSlice.middleware,
          invoiceApiSlice.middleware,
      ),
})

// Infer the RootState and AppDispatch types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch