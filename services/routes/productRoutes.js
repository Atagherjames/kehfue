import { apiSlice } from "../apiSlice";

const authSlice = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: (token) => ({
        url: `/customer/products`,
        method: "GET",
        headers: {
          authorization: `Bearer ${token}`,
        },
      }),
      providesTags: ["product"],
    }),
    getCartItem: builder.query({
      query: ({ token }) => ({
        url: `/customer/cart`,
        method: "GET",
        headers: {
          authorization: `Bearer ${token}`,
        },
      }),
      providesTags: ["product"],
    }),
    addToCart: builder.mutation({
      query: ({ token, id }) => ({
        url: `/customer/cart/add/${id}`,
        method: "PATCH",
        headers: {
          authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: ["product"],
    }),
    removeFromCart: builder.mutation({
      query: ({ token, id }) => ({
        url: `/customer/cart/remove/${id}`,
        method: "DELETE",
        headers: {
          authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: ["product"],
    }),
    cartCheckout: builder.mutation({
      query: ({ token, body }) => ({
        url: `/customer/cart/checkout/`,
        method: "PATCH",
        headers: {
          authorization: `Bearer ${token}`,
        },
        body,
      }),
      invalidatesTags: ["product"],
    }),
    makePayment: builder.mutation({
      query: ({ token, body }) => ({
        url: `/payment/purchase`,
        method: "POST",
        headers: {
          authorization: `Bearer ${token}`,
        },
        body,
      }),
      invalidatesTags: ["product"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetCartItemQuery,
  useAddToCartMutation,
  useRemoveFromCartMutation,
  useCartCheckoutMutation,
  useMakePaymentMutation,
} = authSlice;
