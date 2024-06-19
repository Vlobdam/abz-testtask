import styles from "@/styles/SubmitedForm.module.scss";
import { Heading } from "./Heading";

export const SubmitedForm = () => (
  <>
    <Heading>User successfully registered</Heading>
    <div className={styles.submitedImage} />
  </>
);
