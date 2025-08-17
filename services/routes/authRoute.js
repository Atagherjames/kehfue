import { apiSlice } from "../apiSlice";

const authSlice = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    userRegister: builder.mutation({
      query: (body) => ({
        url: "/auth/register",
        method: "POST",
        body,
      }),
    }),
    getVerificationCode: builder.mutation({
      query: (email) => ({
        url: "/auth/account-ver-otp",
       
        method: "POST",
          body:  {email} ,
      }),
    }),
    verifyOtp: builder.mutation({
      query: ({ payload, token }) => ({
        url: "/auth/verify-account",
        headers: {
          authorization: `Bearer ${token}`,
        },
        method: "POST",
        body: payload,
      }),
    }),
    userLogin: builder.mutation({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
    }),
    partnerLogin: builder.mutation({
      query: (body) => ({
        url: "/partners/auth/login",
        method: "POST",
        body,
      }),
    }),
    forgetPassword: builder.mutation({
      query: (body) => ({
        url: "/auth/password-reset-otp",
        method: "POST",
        body,
      }),
    }),
    changePassword: builder.mutation({
      query: (body) => ({
        url: "/auth/reset-password",
        method: "PATCH",
        body,
      }),
    }),
    getUser: builder.query({
      query: (token) => ({
        url: "/auth/get-user",
        headers: {
          authorization: `Bearer ${token}`,
        },
        method: "GET",
      }),
      providesTags: ["user"],
    }),
    updateProfile: builder.mutation({
      query: ({ token, body }) => ({
        url: "/auth/update-profile",
        headers: {
          authorization: `Bearer ${token}`,
        },
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["user"],
    }),
    getTranactions: builder.query({
      query: (token) => ({
        url: "/payment/transactions",
        headers: {
          authorization: `Bearer ${token}`,
        },
        method: "GET",
      }),
      providesTags: ["user"],
    }),
    logout: builder.mutation({
      query: (token) => ({
        url: "/auth/logout",
        headers: {
          authorization: `Bearer ${token}`,
        },
        method: "POST",
      }),
      invalidateTags: ["user", "offers", "vtu", "product", "campaign"],
    }),
  }),
});

export const {
  useUserRegisterMutation,
  useUserLoginMutation,
  useGetVerificationCodeMutation,
  useVerifyOtpMutation,
  useGetUserQuery,
  useForgetPasswordMutation,
  useChangePasswordMutation,
  useGetTranactionsQuery,
  usePartnerLoginMutation,
  useLogoutMutation,
  useUpdateProfileMutation,
} = authSlice;
