import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../config";
import { API_ENDPOINTS, API_METHODS } from "../endpoints";

export const affiliateAuthServices = createApi({
  reducerPath: "affiliateAuthServices",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),
  endpoints: builder => ({
    affiliateUserLogin: builder.mutation({
      query: data => {
        return {
          url: API_ENDPOINTS.affiliate_login,
          method: API_METHODS.POST,
          body: data,
        };
      },
    }),
  }),
});

export const { useAffiliateUserLoginMutation } = affiliateAuthServices;
