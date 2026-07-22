"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { setAccessToken } from "../lib/authToken";

export default function AuthTokenSync() {
  const { data: session } = useSession();

  useEffect(() => {
    setAccessToken(session?.user?.access_token ?? null);
  }, [session]);

  return null;
}
