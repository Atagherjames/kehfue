import { apiSlice } from "../apiSlice";

const authSlice = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    purchaseAirtime: builder.mutation({
      query: ({token, body}) => ({
        url: "/vtu/airtime-purchase",
        headers: {
          authorization: `Bearer ${token}`,
        },
        method: "POST",
        body
      }),
    }),
    checkout: builder.mutation({
      query: ({token, id}) => ({
        url: `/vtu/payment-checkout/${id}`,
        headers: {
          authorization: `Bearer ${token}`,
        },
        method: "PATCH",
      }),
    }),
    placeOrder: builder.mutation({
      query: ({token, id}) => ({
        url: `/vtu/place-order/${id}`,
        headers: {
          authorization: `Bearer ${token}`,
        },
        method: "PATCH",
      }),
    }),


    purchaseData: builder.mutation({
      query: ({token, body}) => ({
        url: "/vtu/data-purchase",
        headers: {
          authorization: `Bearer ${token}`,
        },
        method: "POST",
        body
      }),
    }),
    confirmPayment: builder.mutation({
      query: ({token, body}) => ({
        url: "/payment/confirm",
        headers: {
          authorization: `Bearer ${token}`,
        },
        method: "PATCH",
        body
      }),
    }),
    
    getPhoneNetwork: builder.query({
      query: ({token, number}) => ({
        url: `/vtu/topup-network/${number}`,
        headers: {
          authorization: `Bearer ${token}`,
        },
        method: "GET",
      }),
    }),
    
    getNewDataPlans: builder.mutation({
      query: ({token, number}) => ({
        url: `/vtu/data-plans/${number}`,
        headers: {
          authorization: `Bearer ${token}`,
        },
        method: "GET",
      }),
    }),


    getTvPlans: builder.query({
      query: (token) => ({
        url: "/vtu/get-subscription-plans",
        headers: {
          authorization: `Bearer ${token}`,
        },
        method: "GET",
      }),
    }),
    verfyIuc: builder.mutation({
      query: ({token, body}) => ({
        url: "/vtu/verify-iuc",
        headers: {
          authorization: `Bearer ${token}`,
        },
        method: "PATCH",
        body
      }),
    }),
    purchaseCable: builder.mutation({
      query: ({token, body}) => ({
        url: "/vtu/cable-subscription",
        headers: {
          authorization: `Bearer ${token}`,
        },
        method: "POST",
        body
      }),
    }),

    getDisco: builder.query({
      query: (token) => ({
        url: "/vtu/get-biller/electricity",
        headers: {
          authorization: `Bearer ${token}`,
        },
        method: "GET",
      }),
    }),
   verfyMeterNo: builder.mutation({
  query: ({ token, body }) => ({
    url: "/vtu/verify",  
    headers: {
      authorization: `Bearer ${token}`,
    },
    method: "POST",
    body
  }),
}),
    purchaseElectricity: builder.mutation({
      query: ({token, body}) => ({
        url: "/vtu/electricity-bill-purchase",
        headers: {
          authorization: `Bearer ${token}`,
        },
        method: "POST",
        body
      }),
    }),
    getBillerPackage: builder.mutation({
      query: ({token, body}) => ({
        url: "/vtu/packages",
        headers: {
          authorization: `Bearer ${token}`,
        },
        method: "POST",
        body
      }),
    }),
    purchaseBill: builder.mutation({
      query: ({token, body}) => ({
        url: "/vtu/purchase-bill",
        headers: {
          authorization: `Bearer ${token}`,
        },
        method: "POST",
        body
      }),
    }),
    getCableBiller: builder.query({
      query: (token) => ({
        url: "/vtu/get-biller/cableTv",
        headers: {
          authorization: `Bearer ${token}`,
        },
        method: "GET",
      }),
    }),

    initiateVpayPurchase: builder.mutation({
  query: ({ token, body }) => ({
    url: "/payment/initiate-vpay-purchase",
    headers: {
      authorization: `Bearer ${token}`,
    },
    method: "POST",
    body,
  }),
}),

getDataPlans: builder.query({
  query: ({token, number}) => ({
    url: `/vtu/data-plans/${number}`,
    headers: {
      authorization: `Bearer ${token}`,
    },
    method: "GET",
  }),
}),


  }),
});

// console.log(authSlice)

export const {
    usePurchaseAirtimeMutation,
    usePlaceOrderMutation,
    useCheckoutMutation,
    usePurchaseDataMutation,
    useGetDataPlansQuery,
    useGetTvPlansQuery,
    useConfirmPaymentMutation,
    useVerfyIucMutation,
    usePurchaseCableMutation,
    useGetDiscoQuery,
    useVerfyMeterNoMutation,
    usePurchaseElectricityMutation,
    useGetNewDataPlansMutation,
    useGetBillerPackageMutation,
    usePurchaseBillMutation,
    useGetCableBillerQuery,
    useInitiateVpayPurchaseMutation,
} = authSlice;
