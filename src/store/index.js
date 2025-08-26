import { configureStore } from "@reduxjs/toolkit";
import sidebarSlice from "./sidebarSlice";
import menuSlice from "./menuSlice";
import dashboardSlice from "./dashboardSlice";
import restaurantSlice from "./restaurantSlice";
import packageSlice from "./packageSlice";
import managerSlice from "./managerSlice";
import reportSlice from "./reportSlice";
import { apiSlice } from "./apiSlice/apiSlice";
import { setupListeners } from "@reduxjs/toolkit/query";

const store = configureStore({
  reducer: {
    sidebar: sidebarSlice,
    menu: menuSlice,
    dash: dashboardSlice,
    restaurant: restaurantSlice,
    package: packageSlice,
    manager: managerSlice,
    report: reportSlice,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});
setupListeners(store.dispatch);

export default store;
