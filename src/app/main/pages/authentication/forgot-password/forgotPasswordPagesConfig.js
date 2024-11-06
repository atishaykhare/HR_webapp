import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import authRoles from '../../../../auth/authRoles';

const ClassicForgotPasswordPage = lazy(() => import('./ClassicForgotPasswordPage'));
const ModernForgotPasswordPage = lazy(() => import('./ModernForgotPasswordPage'));
const ModernReversedForgotPasswordPage = lazy(() => import('./ModernReversedForgotPasswordPage'));
const SplitScreenForgotPasswordPage = lazy(() => import('./SplitScreenForgotPasswordPage'));
const SplitScreenReversedForgotPasswordPage = lazy(() =>
  import('./SplitScreenReversedForgotPasswordPage')
);
const FullScreenForgotPasswordPage = lazy(() => import('./FullScreenForgotPasswordPage'));
const FullScreenReversedForgotPasswordPage = lazy(() =>
  import('./FullScreenReversedForgotPasswordPage')
);

const forgotPasswordPagesConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: 'pages/authentication/forgot-password',
      children: [
        {
          path: '',
          element: <Navigate to="split-screen-reversed" />,
        },
        {
          path: 'classic',
          element: <ClassicForgotPasswordPage />,
        },
        {
          path: 'modern',
          element: <ModernForgotPasswordPage />,
        },
        {
          path: 'modern-reversed',
          element: <ModernReversedForgotPasswordPage />,
        },
        {
          path: 'split-screen',
          element: <SplitScreenForgotPasswordPage />,
        },
        {
          path: 'split-screen-reversed',
          element: <SplitScreenReversedForgotPasswordPage />,
        },
        {
          path: 'full-screen',
          element: <FullScreenForgotPasswordPage />,
        },
        {
          path: 'full-screen-reversed',
          element: <FullScreenReversedForgotPasswordPage />,
        },
      ],
    },
  ],
};

export default forgotPasswordPagesConfig;
