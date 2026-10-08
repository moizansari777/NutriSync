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
import { API_TIMEOUT } from "../constant";

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  timeout: API_TIMEOUT,
  prepareHeaders: (headers, api) => {
    const state = api.getState() as RootState;
    const userData = state.authReducer.userData;
    if (userData) {
      headers.set("authorization", `Bearer ${userData?.token}`);
    }
    return headers;
  },
  responseHandler: async response => {
    const contentType = response.headers.get("content-type");
    if (contentType?.includes("audio")) {
      return response.blob();
    }
    return response.json();
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (!result?.meta?.response?.ok && result?.meta?.response?.status === 401) {
    store.dispatch(logoutFromStore());
  }

  return result;
};

export const chatServices = createApi({
  reducerPath: "chatServices",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["save", "message", "count-query"],
  refetchOnReconnect: true,
  endpoints: builder => ({
    sendMessage: builder.mutation({
      query: data => {
        return {
          url: API_ENDPOINTS.messages,
          method: API_METHODS.POST,
          body: data,
        };
      },
      invalidatesTags: ["message"],
    }),
    getAllConversationList: builder.query({
      query: ({ page, per_page, filter }) => {
        return {
          url: API_ENDPOINTS.conversations_list,
          method: API_METHODS.GET,
          params: { page, per_page, filter },
        };
      },
      providesTags: ["save"],
    }),
    getAllMessagesList: builder.query({
      query: ({ conversationId }) => {
        return {
          url: `${API_ENDPOINTS.messages_list}/${conversationId}`,
          method: API_METHODS.GET,
        };
      },
    }),
    getLibraryList: builder.query({
      query: ({ page, per_page }) => {
        return {
          url: API_ENDPOINTS.library_list,
          method: API_METHODS.GET,
          params: { page, per_page },
        };
      },
      providesTags: ["save"],
    }),
    saveHistory: builder.mutation({
      query: ({ conversationId }) => {
        return {
          url: `conversations/${conversationId}/${API_ENDPOINTS.save_history}`,
          method: API_METHODS.POST,
        };
      },
      invalidatesTags: ["save"],
    }),
    unSaveHistory: builder.mutation({
      query: ({ conversationId }) => {
        return {
          url: `conversations/${conversationId}/${API_ENDPOINTS.unsave_history}`,
          method: API_METHODS.POST,
        };
      },
      invalidatesTags: ["save"],
    }),
    trackBillingClicked: builder.mutation({
      query: data => {
        return {
          url: API_ENDPOINTS.billing_clicked,
          method: API_METHODS.POST,
          body: data,
        };
      },
    }),
    getQueryCounts: builder.query({
      query: () => {
        return {
          url: API_ENDPOINTS.query_counts,
          method: API_METHODS.GET,
        };
      },
      keepUnusedDataFor: 0,
      providesTags: ["count-query"],
      // providesTags: ["message", "count-query"],
    }),
    getSearch: builder.query({
      query: ({ searchType, type }) => {
        return {
          url: `${API_ENDPOINTS.search}?${searchType}=${type}`,
          method: API_METHODS.GET,
        };
      },
    }),
    getLibrarySearch: builder.query({
      query: ({ searchType, type }) => {
        return {
          url: `${API_ENDPOINTS.library_search}?${searchType}=${type}`,
          method: API_METHODS.GET,
        };
      },
    }),
    getPlanURL: builder.query({
      query: () => {
        return {
          url: `${API_ENDPOINTS.payments_plans_url}`,
          method: API_METHODS.GET,
        };
      },
    }),
  }),
});

export const {
  useSendMessageMutation,
  useGetAllConversationListQuery,
  useLazyGetAllConversationListQuery,
  useGetAllMessagesListQuery,
  useLazyGetAllMessagesListQuery,
  useLazyGetLibraryListQuery,
  useSaveHistoryMutation,
  useUnSaveHistoryMutation,
  useGetQueryCountsQuery,
  useLazyGetQueryCountsQuery,
  useLazyGetSearchQuery,
  useLazyGetLibrarySearchQuery,
  useTrackBillingClickedMutation,
  useLazyGetPlanURLQuery,
} = chatServices;
