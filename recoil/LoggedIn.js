const { atom } = require("recoil");

const LoggedIn = atom({
    key: "LoggedIn",
    default: false
});

export default LoggedIn;
