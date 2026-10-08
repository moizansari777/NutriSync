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

export const friendAccessServices = createApi({
  reducerPath: "friendAccessServices",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["request"],
  refetchOnReconnect: true,
  endpoints: builder => ({
    // Approve request
    approveFriendRequest: builder.mutation({
      query: ({ requestId }) => ({
        url: `friends/requests/${requestId}/approve`,
        method: API_METHODS.POST,
      }),
      invalidatesTags: ["request"],
    }),

    // Reject request
    rejectFriendRequest: builder.mutation({
      query: ({ requestId }) => ({
        url: `friends/requests/${requestId}/reject`,
        method: API_METHODS.POST,
      }),
      invalidatesTags: ["request"],
    }),

    // Create request / invite
    createFriendRequest: builder.mutation({
      query: data => ({
        url: API_ENDPOINTS.create_friend_request,
        method: API_METHODS.POST,
        body: data,
      }),
      invalidatesTags: ["request"],
    }),

    // Incoming requests
    getAllSentRequests: builder.query({
      query: () => ({
        url: API_ENDPOINTS.get_sent_request,
        method: API_METHODS.GET,
      }),
      providesTags: ["request"],
    }),

    getIncomingFriendRequests: builder.query({
      query: () => ({
        url: API_ENDPOINTS.get_incoming_friend_requests,
        method: API_METHODS.GET,
      }),
      providesTags: ["request"],
    }),

    // Request statuses
    getAcceptRejectIncomingRequests: builder.query({
      query: ({ status }) => ({
        url: `${API_ENDPOINTS.get_incoming_friend_requests}?status=${status}`,
        method: API_METHODS.GET,
      }),
      providesTags: ["request"],
    }),

    // Approved friends
    getApprovedFriends: builder.query({
      query: () => ({
        url: API_ENDPOINTS.get_friends_approved_list,
        method: API_METHODS.GET,
      }),
    }),

    // Friend dashboard
    getFriendDashboard: builder.query({
      query: ({
        userId,
        period,
      }: {
        userId: number | string;
        period?: string;
      }) => ({
        url: `friends/${userId}/dashboard?period=${period}`,
        method: API_METHODS.GET,
      }),
    }),
    getFriendFoodLogged: builder.query({
      query: ({
        userId,
        period,
        page,
      }: {
        userId: number | string;
        period?: string;
        page: number;
      }) => ({
        url: `friends/${userId}/food_logs?period=${period}&page=${page}&per_page=10`,
        method: API_METHODS.GET,
      }),
    }),
  }),
});

export const {
  useCreateFriendRequestMutation,
  useGetAllSentRequestsQuery,
  useGetIncomingFriendRequestsQuery,
  useApproveFriendRequestMutation,
  useRejectFriendRequestMutation,
  useGetAcceptRejectIncomingRequestsQuery,
  useGetApprovedFriendsQuery,
  useGetFriendDashboardQuery,
  useGetFriendFoodLoggedQuery,
} = friendAccessServices;
