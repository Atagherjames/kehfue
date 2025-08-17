import { apiSlice } from "../apiSlice";

const authSlice = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getOffers: builder.query({
      query: ({ token, sortOrder = "DESC", page = 1, pageSize = 5 }) => ({
        url: `/promotion/active?sortOrder=${sortOrder}&page=${page}&pageSize=${pageSize}`,
        headers: {
          authorization: `Bearer ${token}`,
        },
        method: "GET",
      }),
      providesTags: ["offers"],
    }),

    loadOffer: builder.mutation({
      query: ({ id, token }) => ({
        url: `/promotion/load-card/${id}`,
        headers: {
          authorization: `Bearer ${token}`,
        },
        method: "GET",
      }),
      invalidatesTags: ["offers"],
    }),
    generateUploadUrl: builder.mutation({
      query: ({ token, body }) => ({
        url: `/app/get-upload-url`,
        headers: {
          authorization: `Bearer ${token}`,
        },
        body,
        method: "PUT",
      }),
      invalidatesTags: ["offers"],
    }),
    createNewOffer: builder.mutation({
      query: ({ token, body }) => ({
        url: `/offers/partner/create`,
        headers: {
          authorization: `Bearer ${token}`,
        },
        body,
        method: "POST",
      }),
      invalidatesTags: ["offers"],
    }),
    getLoadedOffer: builder.query({
      query: (token) => ({
        url: `/offers/user/get-loaded-offers`,
        headers: {
          authorization: `Bearer ${token}`,
        },
        method: "GET",
      }),
      providesTags: ["offers"],
    }),
    getPartnerOffers: builder.query({
      query: (token) => ({
        url: `/offers/partner/`,
        headers: {
          authorization: `Bearer ${token}`,
        },
        method: "GET",
      }),
      providesTags: ["offers"],
    }),
    getSinglePartnerOffers: builder.query({
      query: ({ token, id }) => ({
        url: `/offers/partner/${id}`,
        headers: {
          authorization: `Bearer ${token}`,
        },
        method: "GET",
      }),
      providesTags: ["offers"],
    }),
    updateOffer: builder.mutation({
      query: ({ token, id, body }) => ({
        url: `/offers/partner/${id}`,
        headers: {
          authorization: `Bearer ${token}`,
        },
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["offers"],
    }),
    deleteOffer: builder.mutation({
      query: ({ token, id }) => ({
        url: `/offers/partner/${id}`,
        headers: {
          authorization: `Bearer ${token}`,
        },
        method: "DELETE",
      }),
      invalidatesTags: ["offers"],
    }),
    getPartnersCampaign: builder.query({
      query: ({ token, page = 1, pageSize = 5, promotionStatus }) => ({
        url: `/promotion/partner?page=${page}&pageSize=${pageSize}${
          promotionStatus ? `&promotionStatus=${promotionStatus}` : ""
        }`,
        headers: {
          authorization: `Bearer ${token}`,
        },
        method: "GET",
      }),

      providesTags: ["campaign"],
    }),
    activateCampaign: builder.mutation({
      query: ({ token, campaignId }) => ({
        url: `/promotion/activate/${campaignId}`,
        method: "PATCH",
        headers: {
          authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: ["campaign"],
    }),
    deactivateCampaign: builder.mutation({
      query: ({ token, campaignId }) => ({
        url: `/promotion/deactivate/${campaignId}`,
        method: "PATCH",
        headers: {
          authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: ["campaign"],
    }),

    updateCampaign: builder.mutation({
      query: ({ token, campaignId, body }) => ({
        url: `/promotion/update/${campaignId}`,
        method: "PUT",
        headers: {
          authorization: `Bearer ${token}`,
        },
        body,
      }),
      invalidatesTags: ["campaign"],
    }),
    deleteCampaign: builder.mutation({
      query: ({ token, id }) => ({
        url: `/promotion/delete/${id}`,
        headers: {
          authorization: `Bearer ${token}`,
        },
        method: "DELETE",
      }),
      invalidatesTags: ["campaign"],
    }),
  }),
});

export const {
  useGetOffersQuery,
  useLoadOfferMutation,
  useGetLoadedOfferQuery,
  useCreateNewOfferMutation,
  useGenerateUploadUrlMutation,
  useGetPartnerOffersQuery,
  useGetPartnersCampaignQuery,
  useUpdateOfferMutation,
  useDeleteOfferMutation,
  useGetSinglePartnerOffersQuery,
  useDeleteCampaignMutation,
  useUpdateCampaignMutation,
  useActivateCampaignMutation,
  useDeactivateCampaignMutation,
} = authSlice;
