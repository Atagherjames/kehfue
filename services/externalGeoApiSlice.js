import { apiSlice } from "./apiSlice";

export const externalGeoSlice = apiSlice.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    getCountriesWithStates: builder.query({
      query: () => "https://countriesnow.space/api/v0.1/countries/states",
      transformResponse: (response) => response.data || [],
      keepUnusedDataFor: 86400,
    }),
  }),
});

export const { useGetCountriesWithStatesQuery } = externalGeoSlice;
