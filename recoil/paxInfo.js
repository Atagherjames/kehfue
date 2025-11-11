import { atom } from 'recoil';
export const PaxInfoState = atom({
  key: 'PaxInfoState',
  default: {
    clientRef: "", 
    postCode: "",  
    customerEmail: "",
    customerPhone: "",
    bookingNote: "",
    paxDetails: []
  }
});
