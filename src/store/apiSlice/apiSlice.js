import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",

  baseQuery: fetchBaseQuery({
    baseUrl: "http://127.0.0.1:8000/api/",
    prepareHeaders: (header) => {
      const token = localStorage.getItem("authToken");
      if (token) {
        header.set("Authorization", `Bearer ${token}`);
      }
      header.set("Accept", "application/json");
      return header;
    },
  }),
  tagTypes: ["branches", "packages", "discount", "managers", "manager"],
  endpoints: (build) => ({
    // Auth
    logIn: build.mutation({
      query: (userInfo) => ({
        url: "login",
        method: "POST",
        body: {
          ...userInfo,
        },
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          if (data && data.access_token) {
            localStorage.setItem("authToken", data.access_token);
            dispatch(apiSlice.endpoints.branchInfo.initiate());
          }
        } catch (error) {
          console.error("Login onQueryStarted error:", error);
        }
      },
    }),
    logOut: build.mutation({
      query: () => ({
        url: "logout",
        method: "POST",
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          await queryFulfilled;
          localStorage.removeItem("authToken");
          dispatch(apiSlice.util.resetApiState());
        } catch (error) {
          console.error("Logout failed:", error);
          localStorage.removeItem("authToken");
          localStorage.removeItem("branchID");
          dispatch(apiSlice.util.resetApiState());
        }
      },
    }),

    // Dashboard
    summary: build.query({
      query: () => `owner/Summary`,
    }),
    monthlyRevenu: build.query({
      query: () => `owner/RevenueByMonth`,
    }),
    branchesPerformance: build.query({
      query: () => `owner/OrdersCountbranches`,
    }),
    totalSellingItems: build.query({
      query: () => `owner/branch-statistics`,
    }),
    branchStatistics: build.query({
      query: (branchID) => `owner/branch/${branchID}/statistics`,
    }),

    // Profile
    branchInfo: build.query({
      query: () => "owner/my-restaurant",

      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data && data.restaurant) {
            localStorage.setItem(
              "branchID",
              data.restaurant.basic_info.id_restaurant
            );
          }
        } catch (error) {
          console.log(error);
        }
      },
    }),

    //branches
    branches: build.query({
      query: () => `owner/branches`,
      providesTags: ["branches"],
    }),
    branchDetails: build.query({
      query: (branchID) => `branches/management/${branchID}`,
    }),
    addBranch: build.mutation({
      query: (branchInfo) => ({
        url: "branches/management",
        method: "POST",
        body: {
          ...branchInfo,
        },
      }),
      invalidatesTags: ["branches"],
    }),
    updateBranch: build.mutation({
      query: ({ branchID, body }) => ({
        url: `branches/management/${branchID}`,
        method: "PUT",
        body: {
          ...body,
        },
      }),
      invalidatesTags: ["branches"],
    }),
    deleteBranch: build.mutation({
      query: (branchID) => ({
        url: `branches/management/${branchID}`,
        method: "DELETE",
      }),
      invalidatesTags: ["branches"],
    }),

    // menu
    categories: build.query({
      query: () => "owner/CategoriesToBranch",
    }),
    packages: build.query({
      query: (categoryID) => `owner/PackagesByCategory/${categoryID}`,
      providesTags: ["packages"],
    }),
    showPackaeg: build.query({
      query: (branchID) => `owner/packages/mangement/${branchID}`,
    }),
    deletePackage: build.mutation({
      query: (packageID) => ({
        url: `branches/management/${packageID}`,
        method: "DELETE",
      }),
      invalidatesTags: ["packages"],
    }),
    packagesWithDiscount: build.query({
      query: () => `package-discounts/management`,
      providesTags: ["discount"],
    }),
    addDiscount: build.mutation({
      query: (discount) => ({
        url: "package-discounts/management",
        method: "POST",
        body: {
          ...discount,
        },
      }),
      invalidatesTags: ["discount"],
    }),
    deleteDiscount: build.mutation({
      query: (discountID) => ({
        url: `package-discounts/${discountID}/management`,
        method: "DELETE",
      }),
      invalidatesTags: ["discount"],
    }),

    //Managers
    managers: build.query({
      query: () => `users/all/Manager`,
      providesTags: ["managers"],
    }),
    managerDetails: build.query({
      query: (managerID) => `users/${managerID}`,
      providesTags: ["manager"],
    }),
    deleteManager: build.mutation({
      query: (managerID) => ({
        url: `users/${managerID}`,
        method: "DELETE",
      }),
      invalidatesTags: ["managers"],
    }),
    addManager: build.mutation({
      query: ({ payload }) => ({
        url: "users",
        method: "POST",
        body: {
          ...payload,
        },
      }),
      invalidatesTags: ["managers"],
    }),
    editManager: build.mutation({
      query: ({ managerID, payload }) => ({
        url: `users/${managerID}`,
        method: "PUT",
        body: {
          ...payload,
        },
      }),
      invalidatesTags: ["manager"],
    }),
    searchManagerByName: build.query({
      query: (managerName) => `users/all/Manager??name=${managerName}`,
    }),
    searchManagerByStatus: build.query({
      query: (managerStatus) => `users/all/Manager??status=${managerStatus}`,
    }),
    searchManagerByDate: build.query({
      query: (date) => `users/all/Manager??date=${date}`,
    }),

    //reports
    reports: build.query({
      query: () => "api/report",
    }),

    // packagesWithDiscount: build.query({
    //   query: () => `package-discounts/management`,
    //   providesTags: ["discount"],
    // }),
    // popularThisWeek: build.query({
    //   query: (branchID) => `orders/Popular-food-week/${branchID}`,
    // }),
    // bestSeller: build.query({
    //   query: (branchID) => `orders/best-sell/${branchID}`,
    // }),
    // promo: build.query({
    //   query: () => `descount/manage/all`,
    // }),
    // addpackage: build.mutation({
    //   query: (packageInfo) => ({
    //     url: `packagesmangement`,
    //     method: "POST",
    //     body: {
    //       ...packageInfo,
    //     },
    //   }),
    // }),
    // deletepackage: build.mutation({
    //   query: (packageID) => ({
    //     url: `packagesmangement/${packageID}`,
    //     method: "DELETE",
    //   }),
    //   invalidatesTags: ["category"],
    // }),
    // getPackage: build.query({
    //   query: (pacakgeID) => `packagesmangement/${pacakgeID}`,
    //   providesTags: ["updatePackage"],
    // }),
    // updatepackage: build.mutation({
    //   query: (updatedPackage) => ({
    //     url: `packagesmangement/${updatedPackage.id}`,
    //     method: "PUT",
    //     body: {
    //       ...updatedPackage,
    //     },
    //   }),
    //   invalidatesTags: ["updatePackage"],
    // }),
    // getOccasion: build.query({
    //   query: () => "occasion-types",
    // }),
    // addDiscount: build.mutation({
    //   query: (discount) => ({
    //     url: "package-discounts/management",
    //     method: "POST",
    //     body: {
    //       ...discount,
    //     },
    //   }),
    //   invalidatesTags: ["discount", "updatePackage", "category"],
    // }),
    // deleteDiscount: build.mutation({
    //   query: (discountID) => ({
    //     url: `package-discounts/${discountID}/management`,
    //     method: "DELETE",
    //   }),
    //   invalidatesTags: ["discount", "updatePackage", "category"],
    // }),
    // branchServices: build.query({
    //   query: () => `service-types`,
    // }),

    // // Customers
    // customers: build.query({
    //   query: ({ branchID, search, date, status }) => {
    //     const params = new URLSearchParams();
    //     if (search) params.append("name", search);
    //     if (date) params.append("date", date);
    //     if (status) params.append("status", status);

    //     return `${
    //       (search === undefined &&
    //         date === undefined &&
    //         status === undefined) ||
    //       status === "all"
    //         ? `all_customer/${branchID}`
    //         : `branches/${branchID}/customers/${
    //             search ? "search" : date ? "verified" : status ? "status" : ""
    //           }?${params.toString()}`
    //     }`;
    //   },
    // }),
    // customerDetails: build.query({
    //   query: (customerID) => `branches/${customerID}/customer`,
    // }),
    // customerOrders: build.query({
    //   query: ({ customerID, orderStatus }) => {
    //     return `manager/customers/${customerID}/orders/${orderStatus}`;
    //   },
    // }),
    // coupon: build.mutation({
    //   query: (coupon) => ({
    //     url: "coupons/create",
    //     method: "POST",
    //     body: {
    //       ...coupon,
    //     },
    //   }),
    // }),

    // // Delivery
    // delivery: build.query({
    //   query: ({ search, date, status }) => {
    //     const params = new URLSearchParams();
    //     if (search) params.append("name", search);
    //     if (date) params.append("date", date);
    //     if (status) params.append("status", status);

    //     return `${
    //       search === undefined &&
    //       date === undefined &&
    //       (status === undefined || status === "all")
    //         ? `delivery-people/manage`
    //         : `delivery/manage?${params.toString()}`
    //     }`;
    //   },
    //   providesTags: ["Delivery"],
    // }),
    // addDeliveryEmployee: build.mutation({
    //   query: (DEInfo) => ({
    //     url: "delivery-people/manage",
    //     method: "POST",
    //     body: {
    //       ...DEInfo,
    //     },
    //   }),
    //   invalidatesTags: ["Delivery"],
    // }),
    // deliveryDetails: build.query({
    //   query: (deliveryID) => ({
    //     url: `delivery-people/manage/${deliveryID}`,
    //   }),
    //   providesTags: ["updateDelivery"],
    // }),
    // deleteDeliveryEmployee: build.mutation({
    //   query: (deliveryID) => ({
    //     url: `delivery-people/manage/${deliveryID}`,
    //     method: "DELETE",
    //   }),
    //   invalidatesTags: ["Delivery"],
    // }),
    // deliveryOrders: build.query({
    //   query: (deliveryID) => `manager/delivery-person/${deliveryID}/orders`,
    // }),
    // editDeliveryEmployee: build.mutation({
    //   query: ({ deliveryEmployee, payload }) => ({
    //     url: `delivery-people/manage/${deliveryEmployee}`,
    //     method: "PUT",
    //     body: {
    //       ...payload,
    //     },
    //   }),
    //   invalidatesTags: ["updateDelivery"],
    // }),
    // orderHistory: build.query({
    //   query: () => `order/manange/allorder`,
    // }),
    // orderStatusSearch: build.query({
    //   query: (status) => `order/manange/${status}`,
    // }),

    // //Report
    // report: build.mutation({
    //   query: (report) => ({
    //     url: "/report",
    //     method: "POST",
    //     body: {
    //       ...report,
    //     },
    //   }),
    // }),

    // //reviews
    // reviews: build.query({
    //   query: () => "reviews/manage",
    // }),
  }),
});

export const {
  useLogInMutation,
  useLogOutMutation,
  useBranchInfoQuery,
  useSummaryQuery,
  useMonthlyRevenuQuery,
  useBranchesPerformanceQuery,
  useBranchesQuery,
  useTotalSellingItemsQuery,
  useBranchStatisticsQuery,
  useBranchDetailsQuery,
  useAddBranchMutation,
  useUpdateBranchMutation,
  useCategoriesQuery,
  useShowPackaegQuery,
  usePackagesQuery,
  useDeletePackageMutation,
  usePackagesWithDiscountQuery,
  useAddDiscountMutation,
  useDeleteDiscountMutation,
  useManagersQuery,
  useManagerDetailsQuery,
  useDeleteManagerMutation,
  useEditManagerMutation,
  useAddManagerMutation,
  useSearchManagerByNameQuery,
  useSearchManagerByStatusQuery,
  useSearchManagerByDateQuery,
  useDeleteBranchMutation,
  useReportsQuery,
  // useCustomersQuery,
  // useReportMutation,
  // usePopularThisWeekQuery,
  // useBestSellerQuery,
  // usePromoQuery,
  // useCouponMutation,
  // useDeliveryQuery,
  // useCustomerDetailsQuery,
  // useCustomerOrdersQuery,
  // useAddDeliveryEmployeeMutation,
  // useDeliveryDetailsQuery,
  // useDeleteDeliveryEmployeeMutation,
  // useAddpackageMutation,
  // useGetPackageQuery,
  // useGetOccasionQuery,
  // useDeletepackageMutation,
  // useAddDiscountMutation,
  // useUpdatepackageMutation,
  // useDeleteDiscountMutation,
  // usePackagesWithDiscountQuery,
  // useReviewsQuery,
  // useDeliveryOrdersQuery,
  // useEditDeliveryEmployeeMutation,
  // useBranchServicesQuery,
  // useOrderHistoryQuery,
  // useOrderStatusSearchQuery,
} = apiSlice;
