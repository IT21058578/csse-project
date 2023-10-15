import { configureStore } from "@reduxjs/toolkit";
import { authApiSlice } from "./src/store/apiquery/AuthApiSlice";
import { usersApiSlice } from "./src/store/apiquery/usersApiSlice";
import { userSlice } from "./src/store/userSlice";
import { companieApiSlice } from "./src/store/apiquery/CompaniesApiSlice";
import { approvalApiSlice } from "./src/store/apiquery/ApprovalsApiSlice";
import { deliverieApiSlice } from "./src/store/apiquery/DeliveriesApiSlice";
import { itemApiSlice } from "./src/store/apiquery/ItemApiSlice";
import { itemrequestApiSlice } from "./src/store/apiquery/ItemRequestApiSlice";
import { siteApiSlice } from "./src/store/apiquery/SitesApiSlice";
import { supplierApiSlice } from "./src/store/apiquery/SuppliersApiSlice";
import { invoiceApiSlice } from "./src/store/apiquery/InvoiceApiSlice";

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

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch