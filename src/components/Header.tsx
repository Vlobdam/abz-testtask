/* eslint-disable @next/next/no-img-element */
import styles from "@/styles/Header.module.scss";
import { Button } from "./Button";

export const Header = ({
  usersRef,
  formRef,
}: {
  usersRef: React.RefObject<Element>;
  formRef: React.RefObject<Element>;
}) => {
  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        <img src="/Logo.svg" alt="logo" />

        <div className={styles.headerButtonContainer}>
          <Button
            isActive
            handleClick={() => {
              usersRef.current?.scrollIntoView();
            }}
            color="primary"
          >
            Users
          </Button>

          <Button
            isActive
            handleClick={() => {
              formRef.current?.scrollIntoView();
            }}
            color="primary"
          >
            Sign up
          </Button>
        </div>
      </div>
    </header>
  );
};
