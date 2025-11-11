import { apiSlice } from "../apiSlice";

const travelRoute = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // ====================
    // Hotel Endpoints
    // ====================
    getHotelBookings: builder.query({
      query: (token) => ({
        url: "/hotels/bookings",
        headers: { Authorization: `Bearer ${token}` },
        method: "GET",
      }),
      providesTags: ["hotel"],
    }),

     getCities: builder.query({
      query: ({ token, from = 1, to = 50 }) => ({
        url: `/hotels/list-cities?from=${from}&to=${to}`,
        headers: { Authorization: `Bearer ${token}` },
      }),
      providesTags: ["city"],
    }),

    getCitySearch: builder.query({
  query: ({ token, term }) => ({
    url: `/hotels/find-city?term=${term}`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }),
  providesTags: ["city"],
}),

    searchHotels: builder.mutation({
      query: ({ token, searchParams }) => ({
        url: "/hotels/search",
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: searchParams,
      }),
      transformResponse: (response) => response?.result || {},
      invalidatesTags: ["hotel"],
    }),

    getHotelContent: builder.query({
      query: ({ token, sessionId, hotelId, productId, tokenId }) => ({
        url: `/hotels/content?sessionId=${sessionId}&hotelId=${hotelId}&productId=${productId}&tokenId=${tokenId}`,
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }),
      providesTags: ["hotel"],
    }),

     getHotelRoomRates: builder.mutation({
      query: ({ token, sessionId, productId, hotelId, tokenId }) => ({
        url: "/hotels/room-rate",
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: { sessionId, productId, hotelId, tokenId },
      }),
      invalidatesTags: ["hotel"],
    }),

    checkHotelRoomRate: builder.mutation({
  query: ({ token, rateBasisId, productId, tokenId, sessionId }) => ({
    url: "/hotels/check-rate",
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: { rateBasisId, productId, tokenId, sessionId }
  }),
  invalidatesTags: ["hotel"],
}),

initiateHotelPayment: builder.mutation({
  query: ({ token, payload }) => ({
    url: "/payment/initiate-vpay-purchase",
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: payload
  }),
    invalidatesTags: ["hotel"],
}),
bookHotelRoom: builder.mutation({
  query: ({ token, bookingPayload }) => ({
    url: "/hotels/booking",
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: bookingPayload
  }),

    invalidatesTags: ["hotel"],
}),



    // ====================
    // Flight Endpoints
    // ====================
    getFlightBookings: builder.query({
      query: (token) => ({
        url: "/travel/bookings",
        headers: { Authorization: `Bearer ${token}` },
        method: "GET",
      }),
      providesTags: ["flight"],
    }),


    bookFlight: builder.mutation({
  query: ({ token,  bookingParams }) => ({
    url: "/travel/booking", 
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body:  bookingParams,
  }),
  invalidatesTags: ["flight"],
}),
generateFlightTicket: builder.mutation({
  query: ({ token, bookingId, flightBookingInfo, paxInfo }) => ({
    url: `/travel/order-ticket/${bookingId}`,
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: {
      bookingId,           
      flightBookingInfo,        
      paxInfo                     
    },
  }),
  invalidatesTags: ["flight"],
}),


  getAirports: builder.query({
      query: ({ token, page, pageSize }) => ({
        url: `/travel/list-airports?page=${page}&pageSize=${pageSize}`,
        headers: { Authorization: `Bearer ${token}` },
        method: "GET",
      }),
      transformResponse: (response) => ({
        airports: response?.result?.docs || [],
        totalDocs: response?.result?.totalDocs,
        totalPages: response?.result?.totalPages,
        page: response?.result?.page,
      }),
      providesTags: ["airport"],
    }),

   
    searchFlights: builder.mutation({
      query: ({ token, searchParams }) => ({
        url: "/travel/search",
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: searchParams,
      }),
      transformResponse: (response) => response?.result?.AirSearchResponse || {},
      invalidatesTags: ["flight"],
    }),

validateFare: builder.mutation({
  query: ({ token, validationParams }) => ({
    url: "/travel/validate-fare",
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: validationParams,
  }),
  invalidatesTags: ["flight"],
}),




    // ====================
    // Car Rental Endpoints
    // ====================
    getCarDestinations: builder.query({
      query: (token) => ({
        url: "/cars/destinations",
        headers: { Authorization: `Bearer ${token}` },
        method: "GET",
      }),
      transformResponse: (response) => response?.result || [],
      providesTags: ["car"],
    }),

   searchCars: builder.mutation({
  query: ({ token, searchParams }) => ({
    url: "/cars/search",
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: searchParams,
  }),
  transformResponse: (response) => ({
    cars: response?.result?.data || [],
    sessionId: response?.result?.sessionId || "",
  }),
  invalidatesTags: ["car"],
}),

  }),
});

export const {
  useGetHotelBookingsQuery,
  useGetFlightBookingsQuery,
  useGetAirportsQuery,
  useLazyGetAirportsQuery,
  useGetCitiesQuery,
  useLazyGetCitiesQuery,
  useGetCitySearchQuery,
  useSearchHotelsMutation,
  useGetHotelContentQuery,
  useGetHotelRoomRatesMutation,
  useCheckHotelRoomRateMutation,
  useBookHotelRoomMutation,
  useInitiateHotelPaymentMutation,
  useSearchFlightsMutation,
  useValidateFareMutation,
  useGetCarDestinationsQuery,
  useSearchCarsMutation,
  useBookFlightMutation,
  useGenerateFlightTicketMutation,
} = travelRoute;
