import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const PRODURL = "https://khefue-backend.azurewebsites.net/khefue/api/v1";
// export const PRODURL = "https://khefue-server-cne6ece6f6g2fpdc.eastus-01.azurewebsites.net/khefue/api/v1";
  export const SOCKET_URL = "https://khefue-backend.azurewebsites.net/";

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
    "flight",
    "hotel",
    "airport",
    "city",
    "car",
    "location",
  ],
  baseQuery: fetchBaseQuery({ baseUrl: PRODURL, credentials: "include" }),
  keepUnusedDataFor: 30,
  endpoints: () => ({}),
});
