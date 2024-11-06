import { useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FusePageCarded from '@fuse/core/FusePageCarded';
import * as yup from 'yup';
import CampaignCreateHeader from './CampaignCreateHeader';
import CampaignForm from './CampaignForm';
import useThemeMediaQuery from '../../../../@fuse/hooks/useThemeMediaQuery';

const schema = yup.object().shape({
  name: yup
    .string()
    .required('You must enter a product name')
    .min(5, 'The product name must be at least 5 characters'),
});

function CampaignCreate() {
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

  
  const methods = useForm({
    mode: 'onChange',
    defaultValues: {},
    resolver: yupResolver(schema),
  });
  const { reset, watch, control, onChange, formState } = methods;
  const form = watch();

  return (
    <FormProvider {...methods}>
      <FusePageCarded
        header={<CampaignCreateHeader />}
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
              return <CampaignForm />;
            })}
          </div>
        }
        scroll={isMobile ? 'normal' : 'content'}
      />
    </FormProvider>
  );
}

export default CampaignCreate;
