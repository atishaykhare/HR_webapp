import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

const CampaignForm = () => {
  const methods = useFormContext();
  const { control, formState } = methods;
  const { errors } = formState;

  return (
    <div
      className="flex flex-col sm:flex-row flex-1 w-full items-center justify-between space-y-8 sm:space-y-0 py-32 px-24 md:px-32">
      <div className="flex flex-col items-center sm:items-start space-y-8 sm:space-y-0 w-full sm:max-w-full min-w-0">

        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              className="mt-8 mb-16"
              error={!!errors.name}
              required
              helperText={errors?.name?.message}
              label="Name"
              autoFocus
              id="name"
              variant="outlined"
              fullWidth
            />
          )}
        />

        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              className="mt-8 mb-16"
              id="description"
              label="Description"
              type="text"
              multiline
              rows={5}
              variant="outlined"
              fullWidth
            />
          )}
        />

        <Controller
          name="categories"
          control={control}
          defaultValue={[]}
          render={({ field: { onChange, value } }) => (
            <Autocomplete
              className="mt-8 mb-16"
              multiple
              freeSolo
              options={[]}
              value={value}
              onChange={(event, newValue) => {
                onChange(newValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Select multiple categories"
                  label="Categories"
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              )}
            />
          )}
        />

        <Controller
          name="tags"
          control={control}
          defaultValue={[]}
          render={({ field: { onChange, value } }) => (
            <Autocomplete
              className="mt-8 mb-16"
              multiple
              freeSolo
              options={[]}
              value={value}
              onChange={(event, newValue) => {
                onChange(newValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Select multiple tags"
                  label="Tags"
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              )}
            />
          )}
        />
      </div>
    </div>
  );
};

export default CampaignForm;