import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Input from '@mui/material/Input';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import Paper from '@mui/material/Paper';
import { useCallback } from 'react';
import { debounce } from '@mui/material/utils';
import { useNavigate } from 'react-router-dom';
import {
  getCampaign,
  selectCampaignQuery,
  selectToggleSearch,
  setCampaignQuery,
  setSearchToggle,
} from './store/campaignBusinessSlice';

function CampaignBusinessHeader(props) {
  const dispatch = useDispatch();
  const navigation = useNavigate();
  const toggleSearch = useSelector(selectToggleSearch);
  const query = useSelector(selectCampaignQuery);

  const handleQueryChange = useCallback(
    debounce((event) => {
      dispatch(setCampaignQuery(event));
      dispatch(getCampaign());
    }, 500),
    [],
  );

  return (
    <div className="flex flex-col w-full px-24 sm:px-32">
      <div className="flex flex-col sm:flex-row flex-auto sm:items-center min-w-0 my-32 sm:my-48">
        <div className="flex flex-col flex-auto md:w-2/4">
          <Typography className="text-3xl font-semibold tracking-tight leading-8">
            Manage Your Campaigns
          </Typography>
          <Typography className="font-medium tracking-tight md:w-3/4" color="text.secondary">
            View and manage your posted campaigns, monitor engagement, and stay connected with your
            influencer community. If you need help, reach out to us at support@hireach.in or call us
            on +91-78189-35265.
          </Typography>
        </div>
        <div className="flex items-center mt-24 sm:mt-0 sm:mx-6 space-x-6">
          {toggleSearch ? (
            <Paper
              component={motion.div}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
              className="flex items-center space-x-8 px-16 rounded-full border-1 shadow-0"
            >
              <FuseSvgIcon color="disabled">heroicons-solid:search</FuseSvgIcon>

              <Input
                placeholder="Search orders"
                className="flex flex-1"
                disableUnderline
                fullWidth
                defaultValue={query}
                inputProps={{
                  'aria-label': 'Search Orders',
                }}
                onChange={(ev) => handleQueryChange(ev)}
              />
              <FuseSvgIcon onClick={handleQueryChange} color="disabled">heroicons-solid:x</FuseSvgIcon>
            </Paper>
          ) : (
            <Button
              onClick={() => dispatch(setSearchToggle(!toggleSearch))}
              className="whitespace-nowrap"
              variant="contained"
              color="secondary"
              startIcon={<FuseSvgIcon size={20}>heroicons-solid:search</FuseSvgIcon>}
            >
              Search
            </Button>
          )}
          <Button
            className="whitespace-nowrap"
            variant="contained"
            color="secondary"
            startIcon={<FuseSvgIcon size={20}>heroicons-solid:plus</FuseSvgIcon>}
            onClick={() => {
              navigation('/business/campaigns/create');
            }}
          >
            Create New
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CampaignBusinessHeader;
