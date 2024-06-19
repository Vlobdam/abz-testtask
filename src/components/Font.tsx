import styles from "@/styles/Font.module.scss";
import clsx from "clsx";
import { Nunito } from "next/font/google";
import { PropsWithChildren } from "react";

type Props = {
  [key: string]: any;
  className?: string;
};

export const nunito = Nunito({ subsets: ["latin"], weight: "400" });

export const Font = ({
  children,
  className,
  ...props
}: PropsWithChildren<Props>) => (
  <span className={clsx(styles.font, className, nunito.className)} {...props}>
    {children}
  </span>
);
