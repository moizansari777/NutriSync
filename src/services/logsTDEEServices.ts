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

export const logsTDEEServices = createApi({
  reducerPath: "logsTDEEServices",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["logs", "quickAdd", "counts", "statistics"],
  refetchOnReconnect: true,
  endpoints: builder => ({
    calculateTDEE: builder.mutation({
      query: data => {
        return {
          url: API_ENDPOINTS.fitness_details,
          method: API_METHODS.PATCH,
          body: data,
        };
      },
      invalidatesTags: ["logs"],
    }),
    getTDEESuggesion: builder.query({
      query: (params: Record<string, any>) => {
        const queryString = Object.entries(params ?? {})
          .filter(
            ([, value]) =>
              value !== undefined && value !== null && value !== "",
          )
          .map(
            ([field, value]) => `${field}=${encodeURIComponent(String(value))}`,
          )
          .join("&");

        return {
          url: `${API_ENDPOINTS.fitness_details}?${queryString}`,
          method: API_METHODS.GET,
        };
      },
    }),
    getPreviousTDEE: builder.query({
      query: () => {
        return {
          url: API_ENDPOINTS.current_tdee_records,
          method: API_METHODS.GET,
        };
      },
      providesTags: ["logs"],
    }),

    getTargetKCal: builder.query({
      query: ({ date, autoRefetch }) => {
        return {
          url: `${API_ENDPOINTS.target_kcal}?period=${date}`,
          method: API_METHODS.GET,
        };
      },
      keepUnusedDataFor: 0,
      providesTags: ["logs", "counts"],
    }),
    getDietSuggessions: builder.query({
      query: ({ date, autoRefetch }) => {
        return {
          url: `${API_ENDPOINTS.diet_suggestions}?period=${date}`,
          method: API_METHODS.GET,
        };
      },
      providesTags: ["logs", "counts"],
    }),
    getAllLogs: builder.query({
      query: ({ date, query }) => {
        return {
          url: `${API_ENDPOINTS.get_logs}?period=${date}&q=${query}`,
          method: API_METHODS.GET,
        };
      },
      providesTags: ["logs"],
    }),
    getLogById: builder.query({
      query: ({ logId }) => {
        return {
          url: `${API_ENDPOINTS.get_logs_by_id}/${logId}`,
          method: API_METHODS.GET,
        };
      },
    }),
    addLogs: builder.mutation({
      query: data => {
        return {
          url: API_ENDPOINTS.add_logs,
          method: API_METHODS.POST,
          body: data,
        };
      },
      invalidatesTags: ["logs", "quickAdd"],
    }),
    deleteLogs: builder.mutation({
      query: ({ logId }) => {
        return {
          url: `${API_ENDPOINTS.delete_logs}/${logId}`,
          method: API_METHODS.DELETE,
        };
      },
      invalidatesTags: ["logs"],
    }),
    updateLogs: builder.mutation({
      query: data => {
        return {
          url: `${API_ENDPOINTS.update_logs}/${data?.logId}`,
          method: API_METHODS.PATCH,
          body: data,
        };
      },
      invalidatesTags: ["logs", "quickAdd"],
    }),
    // ===>
    getQuickItemsList: builder.query({
      query: ({ date, query }) => {
        return {
          url: `${API_ENDPOINTS.quick_logs}?period=${date}&q=${query}`,
          method: API_METHODS.GET,
        };
      },
      providesTags: ["logs", "quickAdd"],
    }),
    getSearchQuickItems: builder.query({
      query: ({ searchQuery }) => {
        return {
          url: `${API_ENDPOINTS.quick_logs}?q=${searchQuery}`,
          method: API_METHODS.GET,
        };
      },
      providesTags: ["quickAdd"],
    }),
    removeQuickItem: builder.mutation({
      query: ({ logId }) => {
        return {
          url: `${API_ENDPOINTS.quick_logs}/${logId}`,
          method: API_METHODS.DELETE,
        };
      },
      invalidatesTags: ["quickAdd"],
    }),
    quicklyAddItemsInLogs: builder.mutation({
      query: data => {
        return {
          url: API_ENDPOINTS.add_logs_quickly,
          method: API_METHODS.POST,
          body: data,
        };
      },
      invalidatesTags: ["quickAdd", "logs"],
    }),

    // ======= Statistics ========
    getWaterData: builder.query({
      query: () => {
        return {
          url: API_ENDPOINTS.water_target,
          method: API_METHODS.GET,
        };
      },
      providesTags: ["statistics", "counts"],
    }),
    updateWaterData: builder.mutation({
      query: data => {
        return {
          url: API_ENDPOINTS.water_target,
          method: API_METHODS.PATCH,
          body: data,
        };
      },
      invalidatesTags: ["statistics", "counts"],
    }),
    getStatistics: builder.query({
      query: ({ period }) => {
        return {
          url: `${API_ENDPOINTS.statistics}?period=${period}`,
          method: API_METHODS.GET,
        };
      },
      providesTags: ["statistics"],
    }),
    getGraphStatistics: builder.query({
      query: ({ period }) => {
        return {
          url: `${API_ENDPOINTS.statistics_graph}/${period}`,
          method: API_METHODS.GET,
        };
      },
      providesTags: ["statistics"],
    }),
    getSuggestedMealMacros: builder.query({
      query: ({ name, anchor, macros }) => {
        const params = [`name=${encodeURIComponent(name ?? "")}`];

        Object.entries(macros ?? {}).forEach(([field, value]) => {
          if (value === undefined || value === null || value === "") return;
          params.push(`${field}=${encodeURIComponent(String(value))}`);
        });

        if (anchor) {
          params.push(`anchor=${anchor}`);
        }

        return {
          url: `${API_ENDPOINTS.suggested_meal_macros}?${params.join("&")}`,
          method: API_METHODS.GET,
        };
      },
    }),
    addStatistics: builder.mutation({
      query: data => {
        return {
          url: API_ENDPOINTS.statistics,
          method: API_METHODS.POST,
          body: data,
        };
      },
      invalidatesTags: ["statistics", "counts"],
    }),
    updateStatistics: builder.mutation({
      query: data => {
        return {
          url: `${API_ENDPOINTS.statistics}/${data?.id}`,
          method: API_METHODS.PATCH,
          body: data,
        };
      },
      invalidatesTags: ["statistics", "counts"],
    }),
    enablePushNtification: builder.mutation({
      query: data => {
        return {
          url: API_ENDPOINTS.push_notifications,
          method: API_METHODS.PATCH,
          body: data,
        };
      },
    }),
    adjustLogHistoryPortion: builder.mutation({
      query: ({ data, logId }) => {
        return {
          url: `logs/${logId}/${API_ENDPOINTS.adjust_portion}`,
          method: API_METHODS.POST,
          body: data,
        };
      },
      invalidatesTags: ["logs"],
    }),
    addCustomMacros: builder.mutation({
      query: data => {
        return {
          url: API_ENDPOINTS.custom_targets,
          method: API_METHODS.PATCH,
          body: data,
        };
      },
      invalidatesTags: ["logs"],
    }),

    // ---- Scan
    analyzeFood: builder.mutation({
      query: data => {
        return {
          url: API_ENDPOINTS.food_scan_analyze,
          method: API_METHODS.POST,
          body: data,
        };
      },
    }),
    saveAutoAdaptiveCalories: builder.mutation({
      query: data => {
        return {
          url: API_ENDPOINTS.custom_macros_mode,
          method: API_METHODS.PATCH,
          body: data,
        };
      },
    }),
  }),
});

export const {
  useAddLogsMutation,
  useDeleteLogsMutation,
  useUpdateLogsMutation,
  useCalculateTDEEMutation,
  useGetTDEESuggesionQuery,
  useGetPreviousTDEEQuery,
  useGetAllLogsQuery,
  useGetLogByIdQuery,
  useGetTargetKCalQuery,
  useLazyGetTargetKCalQuery,
  useGetDietSuggessionsQuery,
  useGetQuickItemsListQuery,
  useLazyGetSearchQuickItemsQuery,
  useRemoveQuickItemMutation,
  useQuicklyAddItemsInLogsMutation,
  useEnablePushNtificationMutation,
  useLazyGetSuggestedMealMacrosQuery,
  useGetWaterDataQuery,
  useUpdateWaterDataMutation,

  // ===
  useGetStatisticsQuery,
  useGetGraphStatisticsQuery,
  useAddStatisticsMutation,
  useUpdateStatisticsMutation,
  useAdjustLogHistoryPortionMutation,
  useAddCustomMacrosMutation,

  // ===
  useAnalyzeFoodMutation,
  useSaveAutoAdaptiveCaloriesMutation,
} = logsTDEEServices;
