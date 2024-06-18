import { useToken } from "@/hooks/useToken";
import { Heading } from "./Heading";
import { useEffect, useRef, useState } from "react";
import { Position } from "@/types/Position";
import { ALLOWED_HEIGHT, ALLOWED_WIDTH, BASE_POSITIONS_URL, BASE_USERS_URL } from "@/consts";
import axios from "axios";
import styles from '@/styles/Form.module.scss';
import { useForm } from "react-hook-form";
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import buttonStyle from "@/styles/Button.module.scss";
import clsx from "clsx";
import { Loader } from "./Loader";
import { nunito } from "./Font";
import { TextInput } from "./TextInput";
import toast, { toastConfig } from 'react-simple-toasts';
import 'react-simple-toasts/dist/theme/dark.css'; // choose your theme

toastConfig({ theme: 'dark' }); 

const validationSchema = yup.object().shape({
  name: yup.string()
    .min(2, 'Name must be at least 2 characters')
    .max(60, 'Name must not exceed 60 characters')
    .required('Name is required'),
  email: yup.string()
  .min(2, 'Email must be at least 2 characters')
  .max(100, 'Email must not exceed 100 characters')
  .matches(
    /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/,
    'Email is invalid')
  .required('Email is required'),
  phone: yup.string()
    .matches(
      /^[\+]{0,1}380([0-9]{9})$/,
      'Phone is invalid'
    )
    .required('Phone is required'),
  position_id: yup.number().required('Position is required'),
  photo: yup.mixed<any[]>()
    .required('Photo is required')
    .test('file', 'Photo is required', ((value: any) => value.length !== 0 ))
    .test('fileDimensions', `Photo should be atleast ${ALLOWED_WIDTH}x${ALLOWED_HEIGHT}`, (value: any) => {
      return new Promise(resolve => {
        if (value.length === 0) return resolve(true);
        const reader = new FileReader();
        const url = value[0];
        reader.readAsDataURL(url);
        reader.onload = function(value) {
          const img = new Image();
          img.src = value?.target?.result as string;
          img.onload = () => {
            const {height, width} = img;
            resolve(height >= ALLOWED_HEIGHT && width >= ALLOWED_WIDTH);
          };
        }
      })
    })
    .test('fileSize', 'Photo should be less than 5MB', (value: any) => {
      if (value.length === 0) return true;
      return value[0].size <= 5 * 1024 * 1024;
    })
    .test('fileType', 'Photo should be a jpg or jpeg', (value: any) => {
      if (value.length === 0) return true;
      return value[0].type === 'image/jpeg' || value[0].type === 'image/jpg';
    }),
})

export const Form = ({
  loadFirstPage,
  setFormSubmited,
} : { 
  loadFirstPage: () => void, 
  setFormSubmited: (bool: boolean) => void,
}) => {
  const [token, clearToken] = useToken();
  const [positions, setPositions] = useState<Position[]>([]);
  const {register, handleSubmit, formState, reset, watch} = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues:{
      name: '',
      email: '',
      phone: '',
      position_id: 1,
    },
  });
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchPositions = async () => {
      const response = await axios.get(BASE_POSITIONS_URL);
      setPositions(response.data.positions);
    }
  
    fetchPositions();
  }, []);

  const onSubmit = async (data: any) => {
    const formData = new FormData();
    formData.append('photo', data.photo[0]);
    formData.append('name', data.name);
    formData.append('email', data.email);
    formData.append('phone', data.phone);
    formData.append('position_id', data.position_id);
  
    setIsProcessing(true);
    console.log(formData);

    try {
      const response = await axios.post(BASE_USERS_URL, formData, {
        headers: {
          token: token,
          'Content-Type': 'multipart/form-data',
        }
      });
      console.log(response);
      setIsProcessing(false);
      clearToken();
      setFormSubmited(true);
      loadFirstPage();
      reset();
    } catch (error: any) {
      setIsProcessing(false);
      
      const message = error.response?.data?.message as string;

      if (message === 'Invalid token. Try to get a new one by the method GET api/v1/token.') {
        toast('The token expired. Try again!');
        clearToken();
      }

      if (message === 'User with this phone or email already exist') {
        toast('User with this phone or email already exist. Try another one!');
        reset();
      }
    }
  }

  return (
    <>
      <Heading>Working with POST request</Heading>      
        {
          positions?.length > 0 || isProcessing ? (
            <form className={clsx(styles.form, nunito.className)} onSubmit={handleSubmit(onSubmit)}>
              {['name', 'email', 'phone'].map((fieldName) => (
                <TextInput
                key={fieldName}
                name={fieldName}
                register={register}
                errors={formState.errors}
                dirtyFields={formState.dirtyFields}
                helperText={
                  fieldName === 'phone'
                    ? '+38 (XXX) XXX - XX - XX'
                    : ''
                }
                label={fieldName === 'name' 
                  ? 'Your name' 
                  : fieldName[0].toUpperCase() + fieldName.slice(1)
                }/>

              ))}
              
              <div className={styles.radioboxField}>
                <p className={styles.radioboxLabel}>Select your position</p>
                {
                  positions.map((position) => {
                    return (
                      <label key={position.id} className={styles.radiobox} htmlFor={`position-${position.id}`}> {position.name}
                        <input {...register('position_id')} type="radio"  id={`position-${position.id}`} value={position.id} defaultChecked={position.id === 1} />
                        <button type='button' onClick={() => document.querySelector<any>(`#position-${position.id}`)?.click()} className={styles.checkmark} />
                      </label>
                    )
                  })
                }
              </div>
              
              <p className={clsx(styles.errorText, {
                [styles.errorTextHidden]: !formState.errors.position_id
              })}>{formState.errors.position_id?.message}</p>
              
              <div className={clsx(styles.fileInputWrapper, {
                [styles.fileInputWrapperError]: formState.errors.photo,
              })}>

                <div className={styles.customFileInput}>
                  <button className={styles.button} type="button" onClick={() => document.querySelector<any>('input[type="file"]')?.click()}>Upload</button>
                  <p>
                  {
                    watch('photo')?.length > 0 ? watch('photo')[0].name : "Upload your photo" 
                  }
                  </p>
                </div>
              
                <input 
                  className={styles.fileInput} 
                  type="file" 
                  {...register('photo')}
                />
                
                <p className={styles.helperText}>
                  {formState.errors.photo?.message || 'Only jpg and jpeg formats are allowed.'}
                </p>
              </div>
                
              <button className={clsx(buttonStyle.button, {
                  [buttonStyle["button-primary"]]: formState.isValid,
                  [buttonStyle["button-disabled"]]: !formState.isValid,
                })} type="submit">
                Sign up
                </button>
            </form>
          ): <Loader />
        }  
    </>
  );
}

