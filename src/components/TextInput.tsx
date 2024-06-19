import styles from "@/styles/TextInput.module.scss";
import clsx from "clsx";
import { UseFormRegister } from "react-hook-form";

export const TextInput = ({
  name,
  register,
  errors,
  dirtyFields,
  label,
  helperText,
} : {
  name: string;
  register: UseFormRegister<any>;
  errors: any;
  dirtyFields: any;
  label: string;
  helperText: string;
}) => {
  return (
    <div
      className={clsx(styles.textInputWrapper, {
        [styles.textInputWrapperError]: errors[name],
      })}
    >
      <label
        className={clsx(styles.label, {
          [styles.labelIsShown]: dirtyFields[name],
        })}
      >
        {label}
      </label>
      <input
        className={styles.textInput}
        placeholder={label}
        {...register(name)}
      />

      <p className={styles.helperText}>{errors[name]?.message || helperText}</p>
    </div>
  );
};
