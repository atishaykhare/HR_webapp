import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import authRoles from '../../../../auth/authRoles';

const ClassicConfirmationRequiredPage = lazy(() => import('./ClassicConfirmationRequiredPage'));
const ModernConfirmationRequiredPage = lazy(() => import('./ModernConfirmationRequiredPage'));
const ModernReversedConfirmationRequiredPage = lazy(() =>
  import('./ModernReversedConfirmationRequiredPage')
);
const SplitScreenConfirmationRequiredPage = lazy(() =>
  import('./SplitScreenConfirmationRequiredPage')
);
const SplitScreenReversedConfirmationRequiredPage = lazy(() =>
  import('./SplitScreenReversedConfirmationRequiredPage')
);
const FullScreenConfirmationRequiredPage = lazy(() =>
  import('./FullScreenConfirmationRequiredPage')
);
const FullScreenReversedConfirmationRequiredPage = lazy(() =>
  import('./FullScreenReversedConfirmationRequiredPage')
);

const confirmationRequiredPagesConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: 'pages/authentication/confirmation-required',
      children: [
        {
          path: '',
          element: <Navigate to="split-screen-reversed" />,
        },
        {
          path: 'classic',
          element: <ClassicConfirmationRequiredPage />,
        },
        {
          path: 'modern',
          element: <ModernConfirmationRequiredPage />,
        },
        {
          path: 'modern-reversed',
          element: <ModernReversedConfirmationRequiredPage />,
        },
        {
          path: 'split-screen',
          element: <SplitScreenConfirmationRequiredPage />,
        },
        {
          path: 'split-screen-reversed',
          element: <SplitScreenReversedConfirmationRequiredPage />,
        },
        {
          path: 'full-screen',
          element: <FullScreenConfirmationRequiredPage />,
        },
        {
          path: 'full-screen-reversed',
          element: <FullScreenReversedConfirmationRequiredPage />,
        },
      ],
    },
  ],
};

export default confirmationRequiredPagesConfig;
