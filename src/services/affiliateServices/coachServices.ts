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

export const coachServices = createApi({
  reducerPath: "coachServices",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["notes"],
  refetchOnReconnect: true,
  endpoints: builder => ({
    getCoachDashboardData: builder.query({
      query: ({ filter, page }) => {
        return {
          url: `${API_ENDPOINTS.coach_dashboard}?period=${filter}&page=${page}`,
          method: API_METHODS.GET,
        };
      },
    }),
    getAllClients: builder.query({
      query: ({ filter, page }) => {
        return {
          url: `${API_ENDPOINTS.coach_clients}?period=${filter}&page=${page}`,
          method: API_METHODS.GET,
        };
      },
    }),
    getAllClientDetailsData: builder.query({
      query: ({ clientId, filter, statsPage, logsPages }) => {
        return {
          url: `${API_ENDPOINTS.coach_clients}/${clientId}?period=${filter}&stats_page=${statsPage}&logs_page=${logsPages}`,
          method: API_METHODS.GET,
        };
      },
    }),
    getAllFoodLogsForCoach: builder.query({
      query: ({ clientId, filter, page }) => {
        return {
          url: `${API_ENDPOINTS.coach_clients}/${clientId}/food_logs?period=${filter}&page=${page}`,
          method: API_METHODS.GET,
        };
      },
    }),
    getAllNotesList: builder.query({
      query: ({ clientId, page }) => {
        return {
          url: `${API_ENDPOINTS.coach_clients}/${clientId}/notes?page=${page}`,
          method: API_METHODS.GET,
        };
      },
      providesTags: ["notes"],
    }),
    sendCoachMessage: builder.mutation({
      query: ({ data, clientId }) => {
        return {
          url: `${API_ENDPOINTS.coach_clients}/${clientId}/message`,
          method: API_METHODS.POST,
          body: data,
        };
      },
    }),
    saveCoachNotes: builder.mutation({
      query: ({ data, clientId }) => {
        return {
          url: `${API_ENDPOINTS.coach_clients}/${clientId}/notes`,
          method: API_METHODS.POST,
          body: data,
        };
      },
      invalidatesTags: ["notes"],
    }),
  }),
});

export const {
  useGetCoachDashboardDataQuery,
  useGetAllClientsQuery,
  useGetAllClientDetailsDataQuery,
  useSendCoachMessageMutation,
  useSaveCoachNotesMutation,
  useGetAllFoodLogsForCoachQuery,
  useGetAllNotesListQuery,
} = coachServices;
