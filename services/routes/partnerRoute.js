import { apiSlice } from "../apiSlice";

const partnerSlice = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    createStore: builder.mutation({
      query: ({ token, body }) => ({
        url: "/stores",
        method: "POST",
        headers: {
          authorization: `Bearer ${token}`,
        },
        body,
      }),
      invalidatesTags: ["store"],
    }),

    getPartnerStores: builder.query({
      query: (token) => ({
        url: "/stores",
        headers: {
          authorization: `Bearer ${token}`,
        },
        method: "GET",
      }),
      providesTags: ["store"],
    }),

    getStoreCreationPreset: builder.query({
  query: (token) => ({
    url: "/stores/creation-preset",
    method: "GET",
    headers: {
      authorization: `Bearer ${token}`,
    },
  }),
  providesTags: ["store"],
}),


    getSingleStore: builder.query({
      query: ({ token, id }) => ({
        url: `/stores/${id}`,
        headers: {
          authorization: `Bearer ${token}`,
        },
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "store", id }],
    }),

    updateStore: builder.mutation({
      query: ({ token, id, body }) => ({
        url: `/stores/${id}`,
        method: "PATCH",
        headers: {
          authorization: `Bearer ${token}`,
        },
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "store", id },
        "store",
      ],
    }),

    deleteStore: builder.mutation({
      query: ({ token, id }) => ({
        url: `/stores/${id}`,
        method: "DELETE",
        headers: {
          authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: ["store"],
    }),

    updateStoreTimezone: builder.mutation({
      query: ({ token, body }) => ({
        url: "/stores",
        method: "PATCH",
        headers: {
          authorization: `Bearer ${token}`,
        },
        body,
      }),
      invalidatesTags: (result, error, { storeId }) => [
        { type: "store", id: storeId },
        "store",
      ],
    }),

    addRemoveMemberFromStore: builder.mutation({
      query: ({ token, storeId, body }) => ({
        url: `/stores/toggle/${storeId}`,
        method: "PUT",
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body,
      }),
      invalidatesTags: (result, error, { storeId }) => [
        { type: "store", id: storeId },
        "store",
      ],
    }),

      addTeamMember: builder.mutation({
      query: ({ token,  body }) => ({
        url: `/team`,
        method: "POST",
        headers: {
          authorization: `Bearer ${token}`,
        },
        body,
      }),
     invalidatesTags: ["team"],
    }),
 

    deleteStoreConfig: builder.mutation({
      query: ({ token, storeId, body }) => ({
        url: `/stores/config/${storeId}`,
        method: "DELETE",
        headers: {
          authorization: `Bearer ${token}`,
        },
        body,
      }),
      invalidatesTags: ["store"],
    }),

    getStoreConfig: builder.query({
      query: ({ token, storeId }) => ({
        url: `/stores/config/${storeId}`,
        headers: {
          authorization: `Bearer ${token}`,
        },
        method: "GET",
      }),
      providesTags: (result, error, { storeId }) => [
        { type: "store", id: storeId },
      ],
    }),

    getTeamMembers: builder.query({
      query: ({ token, page = 1, pageSize = 10 }) => ({
        url: `/team/all?page=${page}&pageSize=${pageSize}`,
        method: "GET",
        headers: {
          authorization: `Bearer ${token}`,
        },
      }),
      providesTags: ["team"],
    }),

    getCustomersByStore: builder.query({
      query: ({ token, storeId }) => ({
        url: `/stores/${storeId}/customers`,
        headers: {
          authorization: `Bearer ${token}`,
        },
        method: "GET",
      }),
      keepUnusedDataFor: 0,
    }),

    getPartnerSalesOrder: builder.query({
      query: ({
        token,
        page = 1,
        pageSize = 10,
        optional = "all",
        ...params
      }) => ({
        url: `/sales-order`,
        method: "GET",
        headers: {
          authorization: `Bearer ${token}`,
        },
        params: {
          page,
          pageSize,
          optional,
          ...params,
        },
      }),
    }),

    getTotalSales: builder.query({
      query: (token) => ({
        url: "/partners/total-sales",
        method: "GET",
        headers: {
          authorization: `Bearer ${token}`,
        },
      }),
      providesTags: ["sales"],
    }),

    getAverageSales: builder.query({
      query: (token) => ({
        url: "/partners/average-sales",
        method: "GET",
        headers: {
          authorization: `Bearer ${token}`,
        },
      }),
      providesTags: ["sales"],
    }),

    partnerPOSPaymentWithPoints: builder.mutation({
      query: ({ token, body }) => ({
        url: "/points/point-payment",
        method: "POST",
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body,
      }),
    }),
  }),
});

export const {
  useCreateStoreMutation,
  useGetPartnerStoresQuery,
  useGetSingleStoreQuery,
  useUpdateStoreMutation,
  useDeleteStoreMutation,
  useUpdateStoreTimezoneMutation,
  useAddRemoveMemberFromStoreMutation,
  useDeleteStoreConfigMutation,
  useGetStoreConfigQuery,
  useGetTeamMembersQuery,
  useGetTotalSalesQuery,
  useGetAverageSalesQuery,
  useGetPartnerSalesOrderQuery,
  usePartnerPOSPaymentWithPointsMutation,
  useGetStoreCreationPresetQuery,
  useAddTeamMemberMutation
} = partnerSlice;
