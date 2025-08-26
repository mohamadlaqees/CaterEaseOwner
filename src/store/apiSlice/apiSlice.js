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
    getDeliveryRegions: build.query({
      query: (stateName) => `owner/locations/search??search=${stateName}`,
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

    reports: build.query({
      query: () => `owner/report`,
    }),
    changeReportsStatus: build.mutation({
      query: ({ reviewID, status }) => ({
        url: `owner/report/update/${reviewID}`,
        method: "POST",
        body: {
          status,
        },
      }),
    }),
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
  useChangeReportsStatusMutation,
  useGetDeliveryRegionsQuery,
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
