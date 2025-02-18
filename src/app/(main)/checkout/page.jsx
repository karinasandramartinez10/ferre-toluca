"use client"

import dynamic from "next/dynamic";

const CheckoutPage = dynamic(() => import("./CheckoutPage"), { ssr: false });

export default async function Page() {
  return <CheckoutPage />;
}
