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
  }),
});

export const {
  useGetNotificationsQuery,
  useGetUserCardQuery,
  useGetPartnersCustomerQuery,
  useGetPartnerSalePointsQuery,
  useGetPointsEarnedByCustomerQuery,
  useGetQrCodeQuery,
  useScanQrCodeMutation,
} = authSlice;
