import { lazy } from 'react';

const CampaignBusinessListing = lazy(() => import('./CampaignBusiness'));

const CampaignBusinessConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: 'business/campaigns',
      element: <CampaignBusinessListing />,
    },
  ],
};

export default CampaignBusinessConfig;
