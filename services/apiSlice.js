import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const PRODURL = "https://khefue-backend.azurewebsites.net/khefue/api/v1";
export const apiSlice = createApi({
  reducerPath: "apiSlice",
  tagTypes: [
    "user",
    "offers",
    "vtu",
    "product",
    "campaign",
    "giftcard",
    "store",
    "team",
    "sales",
  ],
  baseQuery: fetchBaseQuery({ baseUrl: PRODURL, credentials: "include" }),
  keepUnusedDataFor: 30,
  endpoints: () => ({}),
});
