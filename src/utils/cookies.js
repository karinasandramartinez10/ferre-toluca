import Cookies from "js-cookie";

export const removeAllCookies = () => {
  Object.keys(Cookies.get()).forEach((cookie) => Cookies.remove(cookie));
};
