import { lazy } from 'react';

const Onboarding = lazy(() => import('./Onboarding'));

const onBoardingConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: 'onboarding',
      element: <Onboarding />,
    },
  ],
};

export default onBoardingConfig;
