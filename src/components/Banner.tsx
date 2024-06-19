/* eslint-disable @next/next/no-img-element */
import styles from "@/styles/Banner.module.scss";
import { Heading } from "./Heading";
import { Text } from "./Text";
import { Button } from "./Button";

export const Banner = ({
  formRef,
}: {
  formRef: React.RefObject<HTMLDivElement>;
}) => (
  <div className={styles.banner}>
    <div className={styles.bannerContainer}>
      <Heading>Test assignment for front-end developer</Heading>

      <Text>
        What defines a good front-end developer is one that has skilled
        knowledge of HTML, CSS, JS with a vast understanding of User design
        thinking as they&apos;ll be building web interfaces with accessibility
        in mind. They should also be excited to learn, as the world of Front-End
        Development keeps evolving.
      </Text>

      <Button
        isActive
        handleClick={() => formRef.current?.scrollIntoView}
        color="primary"
      >
        Sign up
      </Button>
    </div>
  </div>
);
