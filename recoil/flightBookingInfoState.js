// recoil/flightBookingInfo.js
import { atom } from 'recoil';


export const FlightBookingInfoState = atom({
  key: 'FlightBookingInfoState',
  default: {
    flight_session_id: "",
    fare_source_code: "",
    IsPassportMandatory: false,
    fareType: "",
    areaCode: "",
    countryCode: "",
    fare_source_code_inbound: null
  }
});
