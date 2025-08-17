import { apiSlice } from "../apiSlice";

const authSlice = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getGiftCards: builder.query({
      query: (token) => ({
        url: "/gift-card",
        headers: {
          authorization: `Bearer ${token}`,
        },
        method: "GET",
      }),
      providesTags: ["giftcard"]
    }),
    getMyGiftCards: builder.query({
      query: (token) => ({
        url: "/gift-card/mine",
        headers: {
          authorization: `Bearer ${token}`,
        },
        method: "GET",
      }),
      providesTags: ["giftcard"]
    }),
    processGiftCards: builder.mutation({
      query: ({token, body}) => ({
        url: "/gift-card/purchase",
        headers: {
          authorization: `Bearer ${token}`,
        },
        method: "POST",
        body
      }),
      invalidatesTags: ["giftcard"]
    }),
    sendGiftCardsMail: builder.mutation({
      query: ({token, body}) => ({
        url: "/gift-card/mail",
        headers: {
          authorization: `Bearer ${token}`,
        },
        method: "POST",
        body
      }),
      invalidatesTags: ["giftcard"]
    }),
    
  }),
});

// console.log(authSlice)

export const {
  useGetGiftCardsQuery,
  useGetMyGiftCardsQuery,
  useProcessGiftCardsMutation,
  useSendGiftCardsMailMutation
} = authSlice;
