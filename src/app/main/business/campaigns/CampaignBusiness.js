import { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import FusePageSimple from '@fuse/core/FusePageSimple';
import { motion } from 'framer-motion';
import Tabs from '@mui/material/Tabs';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import { styled } from '@mui/material/styles';
import withReducer from 'app/store/withReducer';
import CampaignBusinessHeader from './CampaignBusinessHeader';
import { getCampaign, setFilterStatus } from './store/campaignBusinessSlice';
import reducer from './store';
import CampaignListingWidget from './widgets/CampaignListingWidget';
import { CampaignBusinessTabs } from './CampaignBusinessConstants';

const Root = styled(FusePageSimple)(({ theme }) => ({
  '& .FusePageSimple-header': {
    backgroundColor: theme.palette.background.paper,
    boxShadow: `inset 0 0 0 1px  ${theme.palette.divider}`,
  },
}));

const TabsHeader = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}));

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function CampaignBusiness() {
  const dispatch = useDispatch();

  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    dispatch(getCampaign());
  }, [dispatch]);

  function handleChangeTab(event, value) {
    setTabValue(value);
    const filterVal = CampaignBusinessTabs[event.target.name];
    dispatch(setFilterStatus(filterVal));
    dispatch(getCampaign());
  }

  return (
    <Root
      header={<CampaignBusinessHeader />}
      content={
        <div className="w-full pb-24">
          {useMemo(() => {
            const container = {
              show: {
                transition: {
                  staggerChildren: 0.06,
                },
              },
            };

            const item = {
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 },
            };
            return (
              <motion.div className="w-full" variants={container} initial="hidden" animate="show">
                <TabsHeader sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs
                    key={tabValue}
                    value={tabValue}
                    variant="fullWidth"
                    scrollButtons="auto"
                    onChange={handleChangeTab}
                    textColor="secondary"
                    indicatorColor="secondary"
                    aria-label="scrollable auto tabs example"
                  >
                    {Object.keys(CampaignBusinessTabs).map((tab, index) => (
                      <Tab
                        label={tab}
                        key={tab}
                        name={tab}
                        {...a11yProps(index)}
                      />
                    ))}
                  </Tabs>
                </TabsHeader>
                <motion.div variants={item} className="flex flex-col flex-auto">
                  <CustomTabPanel value={tabValue} index={tabValue}>
                    <CampaignListingWidget />
                  </CustomTabPanel>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      }
    />
  );
}

export default withReducer('campaignBusiness', reducer)(CampaignBusiness);
