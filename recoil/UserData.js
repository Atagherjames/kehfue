const { atom } = require("recoil");

export const UserData = atom({
    key: "UserData",
    default: {}
});

export const AccessToken = atom({
    key: "AccessToken",
    default: ""
});

export const PartnerAccessToken = atom({
    key: "PartnerAccessToken",
    default: ""
});