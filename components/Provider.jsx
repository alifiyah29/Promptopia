"use client";

import React from "react";
import { SessionProvider } from "next-auth/react";

const Provider = ({ childern, session }) => {
  return <SessionProvider session={session}>{childern}</SessionProvider>;
};

export default Provider;
