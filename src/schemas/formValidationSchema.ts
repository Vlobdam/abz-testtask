import { ALLOWED_HEIGHT, ALLOWED_WIDTH } from '@/consts';
import * as yup from 'yup';


export const validationSchema = yup.object().shape({
  name: yup
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(60, "Name must not exceed 60 characters")
    .required("Name is required"),
  email: yup
    .string()
    .min(2, "Email must be at least 2 characters")
    .max(100, "Email must not exceed 100 characters")
    .matches(
      /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/,
      "Email is invalid",
    )
    .required("Email is required"),
  phone: yup
    .string()
    .matches(/^[\+]{0,1}380([0-9]{9})$/, "Phone is invalid")
    .required("Phone is required"),
  position_id: yup.number().required("Position is required"),
  photo: yup
    .mixed<FileList>()
    .required("Photo is required")
    .test("file", "Photo is required", (value) => value.length !== 0)
    .test(
      "fileDimensions",
      `Photo should be atleast ${ALLOWED_WIDTH}x${ALLOWED_HEIGHT}`,
      (value) => {
        return new Promise((resolve) => {
          if (value.length === 0) return resolve(true);
          const reader = new FileReader();
          const url = value[0];
          reader.readAsDataURL(url);
          reader.onload = function (value) {
            const img = new Image();
            img.src = value?.target?.result as string;
            img.onload = () => {
              const { height, width } = img;
              resolve(height >= ALLOWED_HEIGHT && width >= ALLOWED_WIDTH);
            };
          };
        });
      },
    )
    .test("fileSize", "Photo should be less than 5MB", (value) => {
      if (value.length === 0) return true;
      return value[0].size <= 5 * 1024 * 1024;
    })
    .test("fileType", "Photo should be a jpg or jpeg", (value) => {
      if (value.length === 0) return true;
      return value[0].type === "image/jpeg" || value[0].type === "image/jpg";
    }),
});