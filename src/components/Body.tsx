"use client";

import { useRef } from "react";
import { Header } from "./Header";
import { Main } from "./Main";

export const Body = () => {
  const usersRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  return (
    <body>
      <Header usersRef={usersRef} formRef={formRef}></Header>
      <Main usersRef={usersRef} formRef={formRef}></Main>
    </body>
  );
};
