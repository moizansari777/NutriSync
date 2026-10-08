import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_ENDPOINTS, API_METHODS } from "./endpoints";
import { TIMEZONE_KEY } from "../constant";

export const externalServices = createApi({
  reducerPath: "externalServices",
  baseQuery: fetchBaseQuery({
    baseUrl: `https://api.timezonedb.com/v2.1/`,
  }),
  endpoints: builder => ({
    getTimezone: builder.query({
      query: ({ lat, lng }) => {
        return {
          url: `${API_ENDPOINTS.get_time_zone}?key=${TIMEZONE_KEY}&format=json&by=position&lat=${lat}&lng=${lng}`,
          method: API_METHODS.GET,
        };
      },
    }),
  }),
});

export const { useLazyGetTimezoneQuery } = externalServices;
