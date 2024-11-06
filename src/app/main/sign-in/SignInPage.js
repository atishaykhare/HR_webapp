import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import { Link } from 'react-router-dom';
import * as yup from 'yup';
import _ from '@lodash';
import { useEffect } from 'react';
import jwtService from '../../auth/services/jwtService';
import Outset from '../auth/Outset';
import { useSelector } from 'react-redux';
import LoadingButton from '@mui/lab/LoadingButton';
import { selectLoginLoading } from 'app/store/userSlice';

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  email: yup.string().email('You must enter a valid email').required('You must enter a email'),
  password: yup
    .string()
    .required('Please enter your password.')
    .min(4, 'Password is too short - must be at least 4 chars.'),
});

const defaultValues = {
  email: '',
  password: '',
  remember: true,
};

function SignInPage() {
  const { control, formState, handleSubmit, setValue } = useForm({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { isValid, dirtyFields, errors } = formState;

  useEffect(() => {
    setValue('email', 'temp@mail.com', { shouldDirty: true, shouldValidate: true });
    setValue('password', 'Password@123', { shouldDirty: true, shouldValidate: true });
  }, [setValue]);

  function onSubmit({ email, password }) {
    jwtService
      .signInWithEmailAndPassword(email, password)
      .then((user) => {
        // No need to do anything, user data will be set at app/auth/AuthContext
      })
      .catch((_errors) => {
        console.log({ e: _errors });
      });
  }

  const isLoading = useSelector(selectLoginLoading);

  return (
    <Outset>
      <div className="flex mt-2 font-medium gap-20 w-full">
        <Link className=" w-full mt-16 " to="/sign-in">
          <Button
            variant="contained"
            color="secondary"
            className="w-full"
            aria-label="Sign in"
            type="button"
            size="large"
          >
            Sign in
          </Button>
        </Link>
        <Link className=" w-full mt-16 " to="/sign-up">
          <Button
            variant="outlined"
            color="secondary"
            className=" w-full"
            aria-label="Sign up"
            type="button"
            size="large"
          >
            Sign Up
          </Button>
        </Link>
      </div>

      <form
        name="loginForm"
        noValidate
        className="flex flex-col justify-center w-full mt-32"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              className="mb-24"
              label="Email"
              autoFocus
              type="email"
              error={!!errors.email}
              helperText={errors?.email?.message}
              variant="outlined"
              required
              fullWidth
            />
          )}
        />

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

        <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between">
          <Controller
            name="remember"
            control={control}
            render={({ field }) => (
              <FormControl>
                <FormControlLabel
                  label="Remember me"
                  control={<Checkbox size="small" {...field} />}
                />
              </FormControl>
            )}
          />

          <Link className="text-md font-medium" to="/forgot-password">
            Forgot password?
          </Link>
        </div>

        <LoadingButton
          variant="contained"
          color="secondary"
          className="mt-16"
          aria-label="Sign in"
          disabled={_.isEmpty(dirtyFields) || !isValid}
          type="submit"
          size="large"
          loading={isLoading}
          loadingPosition="center"
        >
          Sign in
        </LoadingButton>


      </form>
    </Outset>
  )
    ;
}

export default SignInPage;
