import { useEffect, useRef, useState } from "react"
import { Header } from "./Header"
import { Main } from "./Main"

export const Body = () => {
  const usersRef = useRef(null);
  const formRef = useRef(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <body>
      <Header usersRef={usersRef} formRef={formRef}></Header>
      <Main usersRef={usersRef} formRef={formRef}></Main>
    </body>
  )
}