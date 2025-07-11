import * as Yup from 'yup';

export const loginSchema = Yup.object().shape({
  email: Yup.string()
    .matches(/^.+@.+\..+$/, 'Email must be in the format example@example.com')
    .max(254, 'Email address is too long')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 6 characters long')
    .max(128, 'Password is too long')
    .required('Password is required'),
});

export const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .matches(/^.+@.+\..+$/, 'Email must be in the format example@example.com')
    .max(254, 'Email address is too long')
    .required('Email is required'),
});