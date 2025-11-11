// src/config/api.js
const API_BASE_URL = "https://khefue-backend.azurewebsites.net/khefue/api/v1";
const API_HEADERS = {
  "Content-Type": "application/json",
  Authorization:
    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFmYTA5Y2VjLWYzNzQtNGVlZS04YzAwLWY5NjkyMzU4MjQzMiIsImVtYWlsIjoiZGF2aWRjaHJpc3RhaW45QGdtYWlsLmNvbSIsImFjY291bnRUeXBlIjoiMTE0NSIsImlhdCI6MTc1NjMwMzUwMywiZXhwIjoxNzU2MzI1MTAzLCJpc3MiOiJraGVmdWV3ZWJhbmRhcHAifQ.dszlh8reLmRxxQm8v-9miIAX50pPSVg1ya8c5WLpGTg",
};

export { API_BASE_URL, API_HEADERS };
