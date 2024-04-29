"use server";

import { signOut } from "../auth";
// import Cookies from "js-cookie";

/* const removeAllCookies = () => {
  Object.keys(Cookies.get()).forEach((cookie) => Cookies.remove(cookie));
}; */

export const logout = async () => {
  // removeAllCookies();
  await signOut();
};
