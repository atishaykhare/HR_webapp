import _ from '@lodash';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import { Link } from 'react-router-dom';
import FormHelperText from '@mui/material/FormHelperText';

import { useSelector } from 'react-redux';
import { selectAuthLoading, selectAuthStatus } from 'app/store/authSlice';
import Typography from '@mui/material/Typography';
import Outset from '../auth/Outset';
import jwtService from '../../auth/services/jwtService';
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  businessName: yup.string().required('You must enter a business name'),
  email: yup.string().email('You must enter a valid email').required('You must enter a email'),
  password: yup
    .string()
    .required('Please enter your password.')
    .min(12, 'Password is too short - should be 8 chars minimum.')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/\d/, 'Password must contain at least one number')
    .matches(/[@$!%*?&#]/, 'Password must contain at least one special character (@$!%*?&#)'),
  passwordConfirm: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match'),
  acceptTermsConditions: yup.boolean().oneOf([true], 'The terms and conditions must be accepted.'),
  acceptNewsLetter: yup.boolean(),
});

const defaultValues = {
  businessName: "Random Business",
  email: 'temp@mail.com',
  password: 'Password@123',
  passwordConfirm: 'Password@123',
  acceptTermsConditions: false,
  acceptNewsLetter: false,
};

function SignUpPage() {
  const { control, formState, handleSubmit, reset } = useForm({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const status = useSelector(selectAuthStatus);

  const isLoading = useSelector(selectAuthLoading);

  const { isValid, dirtyFields, errors } = formState;

  function onSubmit({ password, email, businessName }) {
    jwtService
      .createUser({
        name: businessName,
        password,
        email,
      })
      .then((user) => {
        // No need to do anything, registered user data will be set at app/auth/AuthContext
      });
  }

  return (
    <Outset>
      <div className="flex mt-2 font-medium gap-20 w-full">
        <Link className=" w-full mt-16 " to="/sign-in">
          <Button
            variant="outlined"
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
            variant="contained"
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
              A verification email has been sent on the registered email ID. Follow the instructions
              to start your journey with HiReach!
            </Typography>

            <Typography
              className="mt-32 mb-20 pb-20 text-3xl font-medium"
              align="center"
              color="text.dark"
            >
              <span>Already verified on HiReach?</span>
              <Link className="ml-4 underline" to="/sign-in">
                Login here
              </Link>
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
        <form
          name="registerForm"
          noValidate
          className="flex flex-col justify-center w-full mt-32"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Typography className="mt-0 mb-20 text-3xl font-medium" align="center" color="text.dark">
            Create an account
          </Typography>

          <Controller
              name="businessName"
              control={control}
              render={({ field }) => (
                  <TextField
                      {...field}
                      className="mb-24"
                      label="Business Name"
                      type="text"
                      error={!!errors.businessName}
                      helperText={errors?.businessName?.message}
                      variant="outlined"
                      required
                      fullWidth
                  />
              )}
          />

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

          <Controller
            name="acceptTermsConditions"
            control={control}
            render={({ field }) => (
              <FormControl error={!!errors.acceptTermsConditions}>
                <FormControlLabel
                  label="I agree to the Terms of Service and Privacy Policy"
                  control={<Checkbox size="small" {...field} />}
                />
                <FormHelperText>{errors?.acceptTermsConditions?.message}</FormHelperText>
              </FormControl>
            )}
          />
          <div>
            <Controller
              name="signUpNewsLetter"
              control={control}
              render={({ field }) => (
                <FormControl error={!!errors.acceptNewsLetter}>
                  <FormControlLabel
                    label="Sign up for the newsletter!"
                    control={<Checkbox size="small" {...field} />}
                  />
                  <FormHelperText>{errors?.acceptNewsLetter?.message}</FormHelperText>
                </FormControl>
              )}
            />
          </div>

          <LoadingButton
            variant="contained"
            color="secondary"
            className="w-full mt-24"
            aria-label="Register"
            loading={isLoading}
            loadingPosition="center"
            disabled={_.isEmpty(dirtyFields) || !isValid}
            type="submit"
            size="large"
          >
            Sign Up
          </LoadingButton>
        </form>
      )}
    </Outset>
  );
}

export default SignUpPage;
