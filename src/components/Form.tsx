import { useToken } from "@/hooks/useToken";
import { Heading } from "./Heading";
import { useEffect, useState } from "react";
import { Position } from "@/types/Position";
import { BASE_POSITIONS_URL, BASE_USERS_URL } from "@/consts";
import axios from "axios";
import styles from "@/styles/Form.module.scss";
import { useForm } from "react-hook-form";
import { validationSchema } from "@/schemas/formValidationSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import buttonStyle from "@/styles/Button.module.scss";
import clsx from "clsx";
import { Loader } from "./Loader";
import { nunito } from "./Font";
import { TextInput } from "./TextInput";
import toast, { toastConfig } from "react-simple-toasts";
import "react-simple-toasts/dist/theme/dark.css";
import { ErrorType } from "@/types/enums";

toastConfig({ theme: "dark" });

export const Form = ({
  loadFirstPage,
  setFormSubmited,
}: {
  loadFirstPage: () => void;
  setFormSubmited: (bool: boolean) => void;
}) => {
  const [token, clearToken] = useToken();
  const [positions, setPositions] = useState<Position[]>([]);
  const { register, handleSubmit, formState, reset, watch } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      position_id: 1,
    },
  });
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchPositions = async () => {
      const response = await axios.get(BASE_POSITIONS_URL);
      setPositions(response.data.positions);
    };

    fetchPositions();
  }, []);

  const onSubmit = async (data: {
    name: string;
    email: string;
    phone: string;
    position_id: number;
    photo: FileList;
  }) => {
    const formData = new FormData();
    formData.append("photo", data.photo[0]);
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("phone", data.phone);
    formData.append("position_id", String(data.position_id));

    setIsProcessing(true);

    try {
      await axios.post(BASE_USERS_URL, formData, {
        headers: {
          token: token,
          "Content-Type": "multipart/form-data",
        },
      });
      setIsProcessing(false);
      clearToken();
      setFormSubmited(true);
      loadFirstPage();
      reset();
    } catch (error: any) {
      setIsProcessing(false);

      const message = error.response?.data?.message as string;

      if (message === ErrorType.INVALID_TOKEN) {
        toast("The token expired. Try again!");
        clearToken();
      }

      if (message === ErrorType.USER_EXISTS) {
        toast("User with this phone or email already exist. Try another one!");
        reset();
      }
    }
  };

  return (
    <>
      <Heading>Working with POST request</Heading>
      {positions?.length > 0 || isProcessing ? (
        <form
          className={clsx(styles.form, nunito.className)}
          onSubmit={handleSubmit(onSubmit)}
        >
          {["name", "email", "phone"].map((fieldName) => (
            <TextInput
              key={fieldName}
              name={fieldName}
              register={register}
              errors={formState.errors}
              dirtyFields={formState.dirtyFields}
              helperText={
                fieldName === "phone" ? "+38 (XXX) XXX - XX - XX" : ""
              }
              label={
                fieldName === "name"
                  ? "Your name"
                  : fieldName[0].toUpperCase() + fieldName.slice(1)
              }
            />
          ))}

          <div className={styles.radioboxField}>
            <p className={styles.radioboxLabel}>Select your position</p>
            {positions.map((position) => {
              return (
                <label
                  key={position.id}
                  className={styles.radiobox}
                  htmlFor={`position-${position.id}`}
                >
                  {" "}
                  {position.name}
                  <input
                    {...register("position_id")}
                    type="radio"
                    id={`position-${position.id}`}
                    value={position.id}
                    defaultChecked={position.id === 1}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      document
                        .querySelector<any>(`#position-${position.id}`)
                        ?.click()
                    }
                    className={styles.checkmark}
                  />
                </label>
              );
            })}
          </div>

          <p
            className={clsx(styles.errorText, {
              [styles.errorTextHidden]: !formState.errors.position_id,
            })}
          >
            {formState.errors.position_id?.message}
          </p>

          <div
            className={clsx(styles.fileInputWrapper, {
              [styles.fileInputWrapperError]: formState.errors.photo,
            })}
          >
            <div className={styles.customFileInput}>
              <button
                className={styles.button}
                type="button"
                onClick={() =>
                  document.querySelector<any>('input[type="file"]')?.click()
                }
              >
                Upload
              </button>
              <p>
                {watch("photo")?.length > 0
                  ? watch("photo")[0].name
                  : "Upload your photo"}
              </p>
            </div>

            <input
              className={styles.fileInput}
              type="file"
              {...register("photo")}
            />

            <p className={styles.helperText}>
              {formState.errors.photo?.message}
            </p>
          </div>

          <button
            className={clsx(buttonStyle.button, {
              [buttonStyle["button-primary"]]: formState.isValid,
              [buttonStyle["button-disabled"]]: !formState.isValid,
            })}
            type="submit"
          >
            Sign up
          </button>
        </form>
      ) : (
        <Loader />
      )}
    </>
  );
};
