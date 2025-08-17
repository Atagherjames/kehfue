import { apiSlice } from "../apiSlice";

const authSlice = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getPartnerProducts: builder.query({
      query: (token) => ({
        url: "/partners/all-products",
        headers: {
          authorization: `Bearer ${token}`,
        },
        method: "GET",
      }),
      providesTags: ["product"],
    }),

    editProduct: builder.mutation({
      query: ({ token, id, body }) => ({
        url: `/partners/product/update/${id}`,
        headers: {
          authorization: `Bearer ${token}`,
        },
        method: "PUT",
        body,
      }),
      invalidatesTags: ["product"],
    }),
    publishProduct: builder.mutation({
      query: ({ token, body }) => ({
        url: `/partners/product/publish`,
        headers: {
          authorization: `Bearer ${token}`,
        },
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["product"],
    }),
    deleteProduct: builder.mutation({
      query: ({ token, id }) => ({
        url: `/partners/product/delete/${id}`,
        headers: {
          authorization: `Bearer ${token}`,
        },
        method: "DELETE",
      }),
      invalidatesTags: ["product"],
    }),
  }),
});

export const {
  useGetPartnerProductsQuery,
  useEditProductMutation,
  usePublishProductMutation,
  useDeleteProductMutation,
} = authSlice;
