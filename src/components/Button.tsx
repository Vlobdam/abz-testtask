import { PropsWithChildren } from "react";
import styles from "@/styles/Button.module.scss";
import { Font } from "./Font";
import clsx from "clsx";
import { ButtonType } from "@/types/enums";

type Props = {
  isActive: boolean;
  type?: ButtonType;
  color: "primary" | "secondary";
  handleClick: () => void;
  className?: string;
};

export const Button = ({
  isActive,
  handleClick,
  type,
  color,
  children,
  className,
}: PropsWithChildren<Props>) => (
  <button
    onClick={handleClick}
    disabled={!isActive}
    type={type}
    className={clsx(
      styles.button,
      {
        [styles[`button-${color}`]]: isActive,
        [styles['button-disabled']]: !isActive,
      },
      className,
    )}
  >
    <Font>{children}</Font>
  </button>
);
