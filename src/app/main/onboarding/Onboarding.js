import FusePageSimple from '@fuse/core/FusePageSimple';
import { styled } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import Box from '@mui/material/Box';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import withReducer from "app/store/withReducer";
import onBoardingReducer from "./store";
import InfluencerTab from "./tabs/InfluencerTab";
import BusinessTab from "./tabs/BusinessTab";

const Root = styled(FusePageSimple)(({ theme }) => ({
  '& .FusePageSimple-header': {
    backgroundColor: theme.palette.background.paper,
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderColor: theme.palette.divider,
    '& > .container': {
      maxWidth: '100%',
    },
  },
}));

function Onboarding() {
  const [selectedTab, setSelectedTab] = useState(null);
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

  function handleTabChange(event, value) {
    setSelectedTab(value);
  }

  return (
    <Root
      header={
        <div className="flex flex-auto justify-center w-full mx-20">
          <div className="flex flex-1 justify-start py-10 lg:my-0">
            <div className="flex flex-col items-center lg:items-center justify-center">
              <Typography className="text-lg font-bold leading-none">Are you a </Typography>
            </div>
            <div className="hidden lg:flex h-32 mx-32 border-l-2"/>
            <Tabs
                value={selectedTab}
                onChange={handleTabChange}
                indicatorColor="secondary"
                textColor="secondary"
                variant="scrollable"
                scrollButtons={false}
                className="-mx-4 min-h-40"
                classes={{indicator: 'flex justify-center bg-transparent w-full h-full'}}
                TabIndicatorProps={{
                  children: (
                      <Box
                          sx={{bgcolor: 'text.disabled'}}
                          className="w-full h-full rounded-full opacity-20"
                      />
                  ),
                }}
            >
              <Tab
                  className="text-14 font-semibold min-h-40 min-w-64 mx-4 px-12 "
                  disableRipple
                  label="Influencer"
              />
              <Tab
                  className="text-14 font-semibold min-h-40 min-w-64 mx-4 px-12 "
                  disableRipple
                  label="Business"
              />

            </Tabs>
          </div>
        </div>
      }
      content={
        <div className="flex flex-auto justify-center w-full mx-20 ">
          {selectedTab === 0 && <InfluencerTab/>}
          {selectedTab === 1 && <BusinessTab/>}
        </div>
      }
      scroll={isMobile ? 'normal' : 'page'}
    />
  );
}

export default withReducer('onBoarding', onBoardingReducer )(Onboarding);
