import styles from "@/styles/Main.module.scss";
import { Banner } from "./Banner";
import { Users } from "./Users";
import { Form } from "./Form";
import { useUsersLoader } from "@/hooks/useUsersLoader";
import { useState } from "react";
import { SubmitedForm } from "./SubmitedForm";

export const Main = ({
  usersRef,
  formRef,
}: {
  usersRef: React.RefObject<HTMLDivElement>;
  formRef: React.RefObject<HTMLDivElement>;
}) => {
  const [isSubmited, setIsSubmited] = useState(false);
  const {
    currentUsers,
    currentPage,
    isLoading,
    totalPages,
    loadNext,
    loadFirstPage,
  } = useUsersLoader();

  return (
    <main className={styles.main}>
      <Banner formRef={formRef} />

      <div ref={usersRef} className={styles.block}>
        <Users
          currentUsers={currentUsers}
          currentPage={currentPage}
          isLoading={isLoading}
          totalPages={totalPages}
          loadNext={loadNext}
        />
      </div>

      <div ref={formRef} className={styles.block}>
        {!isSubmited ? (
          <Form loadFirstPage={loadFirstPage} setFormSubmited={setIsSubmited} />
        ) : (
          <SubmitedForm />
        )}
      </div>
    </main>
  );
};
