import { apiSlice } from "../apiSlice";

const authSlice = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getNotifications: builder.query({
      query: (token) => ({
        url: "/notification?sortField=createdAt&sortOrder=DESC",
        headers: {
          authorization: `Bearer ${token}`,
        },
        method: "GET",
      }),
      providesTags: ["user"],
    }),

    getUserCard: builder.query({
      query: ({ token, id }) => ({
        url: `/loyalty/get/${id}`,
        headers: {
          authorization: `Bearer ${token}`,
        },
        method: "GET",
      }),
      providesTags: ["user"],
    }),

    getQrCode: builder.query({
      query: (token) => ({
        url: `/loyalty/qr-code`,
        headers: {
          authorization: `Bearer ${token}`,
        },
        method: "GET",
      }),
      providesTags: ["user"],
    }),

   pin: builder.mutation({
  query: ({ token, pin }) => ({
    url: "/loyalty/create-pin",
    method: "POST",
    headers: {
      authorization: `Bearer ${token}`,
    },
    body:{ "pin": pin },
  }),
  invalidatesTags: ["user"],
}),

scanQrCode: builder.mutation({
      query: ({ token, url }) => ({
        url: url,
        headers: {
          authorization: `Bearer ${token}`,
        },
        method: "GET",
      }),
      providesTags: ["user"],
    }),

    getPartnersCustomer: builder.query({
      query: ({ token, page = 1, pageSize = 10 }) => ({
        url: `/stores/config?page=${page}&pageSize=${pageSize}`,
        headers: {
          authorization: `Bearer ${token}`,
        },
        method: "GET",
      }),
      providesTags: ["user"],
    }),

    getPartnerSalePoints: builder.query({
      query: (token) => ({
        url: "/partners/total-points-from-sales",
        headers: {
          authorization: `Bearer ${token}`,
        },
        method: "GET",
      }),
      providesTags: ["user"],
    }),

    getPointsEarnedByCustomer: builder.query({
      query: (token) => ({
        url: "/partners/points-earned-by-partner-customers",
        headers: {
          authorization: `Bearer ${token}`,
        },
        method: "GET",
      }),
      providesTags: ["user"],
    }),

    getUserLocations: builder.query({
      query: (token) => ({
        url: "/customer/location",
        headers: {
          authorization: `Bearer ${token}`,
        },
        method: "GET",
      }),
      providesTags: ["location"],
    }),

  getDeliveryEstimate: builder.mutation({
  query: ({ token, deliveryLocationId, deliveryLocation }) => {
    const body = deliveryLocationId
      ? { deliveryLocationId }
      : { deliveryLocation };

    return {
      url: "/customer/delivery-estimate",
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    };
  },
  invalidatesTags: ["location"],
}),

    removeUserLocation: builder.mutation({
      query: ({ token, locationId }) => ({
        url: `/customer/location/${locationId}`,
        headers: {
          authorization: `Bearer ${token}`,
        },
        method: "PATCH",
      }),
      invalidatesTags: ["location"],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useGetUserCardQuery,
  usePinMutation,
  useGetPartnersCustomerQuery,
  useGetPartnerSalePointsQuery,
  useGetPointsEarnedByCustomerQuery,
  useGetQrCodeQuery,
  useScanQrCodeMutation,
  useGetUserLocationsQuery,
  useGetDeliveryEstimateMutation,
  useRemoveUserLocationMutation,
} = authSlice;
