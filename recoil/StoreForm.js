import { atom } from "recoil";

export const storeFormState = atom({
  key: "storeFormState",
  default: {
    storeName: "",
    category: "",
    websiteURL: "",
    description: "",
    businessRegistrationType: "soleOwner",
    streetAddress: "",
    city: "",
    state: /** @type {string} */ (""),
    country: "",
    storeType: "",
    teamMembers: null,
    businessLogo: null,
    businessBanner: null,
    CAC_StatusReport: null,
    CertificateOfIncorporation: null,
    ProofOfBusinessAddress: null,
    TaxIdentificationDocument: null,
  },
});
