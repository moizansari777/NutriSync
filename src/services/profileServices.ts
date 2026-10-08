import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { BASE_URL } from "../config";
import { logoutFromStore, setCanUseAI } from "../states/reducer/authReducer";
import { RootState, store } from "../states/store/store";
import { API_ENDPOINTS, API_METHODS } from "./endpoints";
import { API_TIMEOUT } from "../constant";

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

export const profileServices = createApi({
  reducerPath: "profileServices",
  baseQuery: baseQueryWithReauth,
  refetchOnReconnect: true,
  endpoints: builder => ({
    updatePassword: builder.mutation({
      query: data => {
        return {
          url: API_ENDPOINTS.update_password,
          method: API_METHODS.POST,
          body: data,
        };
      },
    }),
    updateUserInfo: builder.mutation({
      query: data => {
        return {
          url: API_ENDPOINTS.account,
          method: API_METHODS.PATCH,
          body: data,
        };
      },
    }),
    updateFCMToken: builder.mutation({
      query: data => {
        return {
          url: API_ENDPOINTS.devices,
          method: API_METHODS.POST,
          body: data,
        };
      },
    }),
    updateUserGoals: builder.mutation({
      query: data => {
        return {
          url: API_ENDPOINTS.update_goal,
          method: API_METHODS.PATCH,
          body: data,
        };
      },
    }),
    updateUserPersonalDetails: builder.mutation({
      query: data => {
        return {
          url: API_ENDPOINTS.update_personal_details,
          method: API_METHODS.PATCH,
          body: data,
        };
      },
    }),
    deleteAccount: builder.mutation({
      query: () => {
        return {
          url: API_ENDPOINTS.delete_account,
          method: API_METHODS.DELETE,
        };
      },
    }),
    getAccountData: builder.query({
      query: () => {
        return {
          url: API_ENDPOINTS.get_account,
          method: API_METHODS.GET,
        };
      },
      keepUnusedDataFor: 0,
    }),

    getCanUseAI: builder.query({
      query: () => ({
        url: API_ENDPOINTS.can_use_ai,
        method: API_METHODS.GET,
        timeout: API_TIMEOUT,
      }),
      keepUnusedDataFor: 0,
    }),

    getCanUseAIWidthDispatch: builder.query({
      query: () => ({
        url: API_ENDPOINTS.can_use_ai,
        method: API_METHODS.GET,
        timeout: API_TIMEOUT,
      }),
      keepUnusedDataFor: 0,

      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (arg?.shouldDispatch) {
            if (
              arg?.canUseAI !== undefined &&
              arg?.canUseAI !== data?.can_use_ai
            ) {
              dispatch(setCanUseAI(data?.can_use_ai));
            }
          }
        } catch {}
      },
    }),

    verifyByPassword: builder.mutation({
      query: data => {
        return {
          url: API_ENDPOINTS.verify_by_password,
          method: API_METHODS.POST,
          body: data,
        };
      },
    }),
    saveTimezone: builder.mutation({
      query: data => {
        return {
          url: API_ENDPOINTS.timezone,
          method: API_METHODS.PATCH,
          body: data,
        };
      },
    }),
    sendFeedbackAPI: builder.mutation({
      query: data => {
        return {
          url: API_ENDPOINTS.feedbacks,
          method: API_METHODS.POST,
          body: data,
        };
      },
    }),
    saveDotDetailedPoint: builder.mutation({
      query: data => {
        return {
          url: API_ENDPOINTS.chat_response_style,
          method: API_METHODS.PATCH,
          body: data,
        };
      },
    }),
  }),
});

export const {
  useUpdatePasswordMutation,
  useUpdateUserInfoMutation,
  useUpdateFCMTokenMutation,
  useUpdateUserGoalsMutation,
  useUpdateUserPersonalDetailsMutation,
  useDeleteAccountMutation,
  useGetAccountDataQuery,
  useLazyGetAccountDataQuery,
  useVerifyByPasswordMutation,
  useSaveTimezoneMutation,
  useGetCanUseAIQuery,
  useLazyGetCanUseAIQuery,
  useLazyGetCanUseAIWidthDispatchQuery,
  useSendFeedbackAPIMutation,
  useSaveDotDetailedPointMutation,
} = profileServices;
