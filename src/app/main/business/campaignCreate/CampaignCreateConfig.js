import { lazy } from 'react';

const CampaignBusinessListing = lazy(() => import('./CampaignCreate'));

const CampaignCreateConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: 'business/campaigns/create',
      element: <CampaignBusinessListing />,
    },
  ],
};

export default CampaignCreateConfig;
