import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { BASE_URL } from "../config";
import { logoutFromStore } from "../states/reducer/authReducer";
import { RootState, store } from "../states/store/store";
import { API_ENDPOINTS, API_METHODS } from "./endpoints";

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

export const referralServices = createApi({
  reducerPath: "referralServices",
  baseQuery: baseQueryWithReauth,
  refetchOnReconnect: true,
  endpoints: builder => ({
    getReferrals: builder.query({
      query: () => {
        return {
          url: API_ENDPOINTS.get_referral_link,
          method: API_METHODS.GET,
        };
      },
    }),
    getReferralStats: builder.query({
      query: ({ filter }) => {
        return {
          url: `${API_ENDPOINTS.get_referral_stats}?filter=${filter}`,
          method: API_METHODS.GET,
        };
      },
    }),
    getMyReferrals: builder.query({
      query: () => {
        return {
          url: API_ENDPOINTS.get_my_referrals,
          method: API_METHODS.GET,
        };
      },
    }),
  }),
});

export const {
  useGetReferralsQuery,
  useGetReferralStatsQuery,
  useGetMyReferralsQuery,
} = referralServices;
