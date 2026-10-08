import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { BASE_URL } from "../../config";
import { logoutFromStore } from "../../states/reducer/authReducer";
import { RootState, store } from "../../states/store/store";
import { API_ENDPOINTS, API_METHODS } from "../endpoints";

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers, api) => {
    const state = api.getState() as RootState;
    const userData = state.authReducer.userData;
    if (userData) {
      headers.set("authorization", `Bearer ${userData?.token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  if (!result?.meta?.response?.ok && result?.meta?.response?.status === 401) {
    store.dispatch(logoutFromStore());
  }
  return result;
};

export const affiliateServices = createApi({
  reducerPath: "affiliateServices",
  baseQuery: baseQueryWithReauth,
  refetchOnReconnect: true,
  endpoints: builder => ({
    getAffiliateReferralLink: builder.query({
      query: () => {
        return {
          url: API_ENDPOINTS.affiliate_referral_link,
          method: API_METHODS.GET,
        };
      },
    }),
    getAffiliateReferralStats: builder.query({
      query: ({ filter }) => {
        return {
          url: `${API_ENDPOINTS.affiliate_referral_stats}?filter=${filter}`,
          method: API_METHODS.GET,
        };
      },
    }),
    getAffiliateMyReferral: builder.query({
      query: () => {
        return {
          url: API_ENDPOINTS.affiliate_my_referrals,
          method: API_METHODS.GET,
        };
      },
    }),
    updateAffiliatePartner: builder.mutation({
      query: data => {
        return {
          url: API_ENDPOINTS.update_affiliate_partner,
          method: API_METHODS.PATCH,
          body: data,
        };
      },
    }),
  }),
});

export const {
  useGetAffiliateMyReferralQuery,
  useGetAffiliateReferralLinkQuery,
  useGetAffiliateReferralStatsQuery,
  useUpdateAffiliatePartnerMutation,
} = affiliateServices;
