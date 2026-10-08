import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../config";
import { API_ENDPOINTS, API_METHODS } from "./endpoints";

export const authService = createApi({
  reducerPath: "authService",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),
  endpoints: builder => ({
    userLogin: builder.mutation({
      query: data => {
        return {
          url: API_ENDPOINTS.signin,
          method: API_METHODS.POST,
          body: data,
        };
      },
    }),
    userSignup: builder.mutation({
      query: data => {
        return {
          url: API_ENDPOINTS.signup,
          method: API_METHODS.POST,
          body: data,
        };
      },
    }),
    forgotPassword: builder.mutation({
      query: data => {
        return {
          url: API_ENDPOINTS.forgot_password,
          method: API_METHODS.POST,
          body: data,
        };
      },
    }),
    verifyOTP: builder.mutation({
      query: data => {
        return {
          url: API_ENDPOINTS.verify_otp,
          method: API_METHODS.POST,
          body: data,
        };
      },
    }),
    resetPassword: builder.mutation({
      query: data => {
        return {
          url: API_ENDPOINTS.reset_password,
          method: API_METHODS.POST,
          body: data,
        };
      },
    }),
    resendOTP: builder.mutation({
      query: data => {
        return {
          url: API_ENDPOINTS.resend_otp,
          method: API_METHODS.POST,
          body: data,
        };
      },
    }),
  }),
});

export const {
  useUserLoginMutation,
  useUserSignupMutation,
  useForgotPasswordMutation,
  useVerifyOTPMutation,
  useResetPasswordMutation,
  useResendOTPMutation,
} = authService;
