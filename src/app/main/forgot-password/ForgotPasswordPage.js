import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import * as yup from 'yup';
import _ from '@lodash';
import Box from '@mui/material/Box';
import { useDispatch, useSelector } from 'react-redux';
import { selectAuthStatus, setSuccess } from 'app/store/authSlice';
import Outset from '../auth/Outset';
import jwtService from '../../auth/services/jwtService';

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  email: yup.string().email('You must enter a valid email').required('You must enter a email'),
});

const defaultValues = {
  email: '',
};

function ForgotPassword() {
  const { control, formState, handleSubmit, reset } = useForm({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { isValid, dirtyFields, errors } = formState;

  function onSubmit({ email }) {
    jwtService.getResetPasswordLink(email).then((r) => {
      console.log(r);
    });
  }

  const status = useSelector(selectAuthStatus);
  const dispatch = useDispatch();

  const resetMsg = () => {
    dispatch(setSuccess(false));
  };


  return (
    <Outset>
      <Typography className="mt-32 text-4xl font-extrabold tracking-tight leading-tight">
        Forgot password?
      </Typography>

      {status ? (
        <>
          <Box
            component="g"
            sx={{
              borderRadius: 5,
              bgcolor: '#e0e0e0',
            }}
            className="mt-32"
            fill="none"
            stroke="currentColor"
            strokeWidth="100"
          >
            <Typography
              className="mt-32 p-20 text-3xl font-medium"
              align="center"
              color="text.dark"
            >
              An email has been sent to you. Please follow the instructions to update your password.
            </Typography>

            <Typography
              className="mt-32 mb-20 pb-20 text-3xl font-medium"
              align="center"
              color="text.dark"
            >
              <span>Re-enter the E-mail</span>
              <Button onClick={resetMsg} variant="text" className="underline font-medium text-3xl ">
                <Link to={''}>Click here</Link>
              </Button>
            </Typography>
          </Box>

          <Typography className="mt-32 text-3xl font-medium" align="center" color="text.dark">
            Haven’t received the email?
          </Typography>

          <Typography
            className="mt-10 pl-40 pr-40 text-2xl font-medium"
            align="center"
            color="text.dark"
          >
            <span>
              Wait for a few minutes, refresh and check the spam folder. In case you’re still facing
              issues, contact us on
            </span>
            <Link className="ml-4 underline block" to="mailto:support@hireach.com">
              support@hireach.com
            </Link>
          </Typography>
        </>
      ) : (
        <>
          <div className="flex items-baseline mt-2 font-medium">
            <Typography>Fill your email to reset your password</Typography>
          </div>

          <form
            name="registerForm"
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
                  type="email"
                  error={!!errors.email}
                  helperText={errors?.email?.message}
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
              Send reset link
            </Button>

            <Typography className="mt-32 text-md font-medium" color="text.secondary">
              <span>Return to</span>
              <Link className="ml-4" to="/sign-in">
                Login
              </Link>
            </Typography>
          </form>
        </>
      )}
    </Outset>
  );
}

export default ForgotPassword;
