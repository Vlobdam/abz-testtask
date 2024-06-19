import { Font } from "./Font";
import styles from "@/styles/Text.module.scss";
import clsx from "clsx";
import { PropsWithChildren } from "react";

type Props = {
  [key: string]: any;
  className?: string;
};

export const Text = ({
  children,
  className,
  ...props
}: PropsWithChildren<Props>) => (
  <p className={clsx(styles.text, className)} {...props}>
    <Font>{children}</Font>
  </p>
);
