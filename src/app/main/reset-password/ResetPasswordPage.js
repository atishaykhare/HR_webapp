import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import * as yup from 'yup';
import _ from '@lodash';
import AvatarGroup from '@mui/material/AvatarGroup';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Outset from '../auth/Outset';

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  password: yup
    .string()
    .required('Please enter your password.')
    .min(8, 'Password is too short - should be 8 chars minimum.'),
  passwordConfirm: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match'),
});

const defaultValues = {
  password: '',
  passwordConfirm: '',
};

function ResetPassword() {
  const { control, formState, handleSubmit, reset } = useForm({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { isValid, dirtyFields, errors } = formState;

  function onSubmit() {
    reset(defaultValues);
  }

  return (
    <Outset>


      <Typography className="mt-32 text-4xl font-extrabold tracking-tight leading-tight">
        Reset your password
      </Typography>
      <Typography className="font-medium">Create a new password for your account</Typography>

      <form
        name="registerForm"
        noValidate
        className="flex flex-col justify-center w-full mt-32"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              className="mb-24"
              label="Password"
              type="password"
              error={!!errors.password}
              helperText={errors?.password?.message}
              variant="outlined"
              required
              fullWidth
            />
          )}
        />

        <Controller
          name="passwordConfirm"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              className="mb-24"
              label="Password (Confirm)"
              type="password"
              error={!!errors.passwordConfirm}
              helperText={errors?.passwordConfirm?.message}
              variant="outlined"
              required
              fullWidth
            />
          )}
        />

        <Button
          variant="contained"
          color="secondary"
          className=" w-full mt-4"
          aria-label="Register"
          disabled={_.isEmpty(dirtyFields) || !isValid}
          type="submit"
          size="large"
        >
          Reset your password
        </Button>

        <Typography className="mt-32 text-md font-medium" color="text.secondary">
          <span>Return to</span>
          <Link className="ml-4" to="/sign-in">
            sign in
          </Link>
        </Typography>
      </form>
    </Outset>
  );
}

export default ResetPassword;
