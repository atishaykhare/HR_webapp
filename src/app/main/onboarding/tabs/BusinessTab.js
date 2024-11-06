import {motion} from 'framer-motion';
import {Controller, useForm} from "react-hook-form";
import Box from "@mui/system/Box";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete/Autocomplete";
import Checkbox from "@mui/material/Checkbox/Checkbox";
import _ from "@lodash";
import Button from "@mui/material/Button";
import NavLinkAdapter from "@fuse/core/NavLinkAdapter";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";
import {yupResolver} from "@hookform/resolvers/yup/dist/yup";
import * as yup from "yup";
import Select from "@mui/material/Select";
import {OutlinedInput} from "@mui/material";
import Chip from "@mui/material/Chip";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import ListItemText from "@mui/material/ListItemText";
import CircularProgress from "@mui/material/CircularProgress";
import {
    getCategory,
    getLanguages, saveOnBoarding,
    selectCategory,
    selectLanguages, selectLoading,
    setIsOpen
} from "../store/onBoardingSlice";
import Card from "@mui/material/Card";

const schema = yup.object().shape({
    platforms: yup.array().required('You must select a platform'),
    preferredLanguages: yup.array().required('Preferred Languages is required'),
    minimumFollowers: yup.number().typeError('Minimum Followers must be a number').min(1, 'Minimum Followers must be at least 1').required('Minimum Followers is required'),
    contentCategory: yup.array().required('Content Category is required'),
});


const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

function BusinessTab() {
    const container = {
        show: {
            transition: {
                staggerChildren: 0.05,
            },
        },
    };

    const dispatch = useDispatch();
    const platforms = ['YouTube', 'Instagram'];
    const languages = useSelector(selectLanguages);
    const category = useSelector(selectCategory);
    const inProcess = useSelector(selectLoading);

    const {result, isLoading, isOpen} = languages;
    const {result: categoryResult, isLoading: categoryLoading, isOpen: categoryOpen} = category;

    const {control, handleSubmit, formState, getValues, setValue} = useForm({
        mode: 'onChange',
        resolver: yupResolver(schema),
    });

    const {isValid, dirtyFields, errors} = formState;


    async function onSubmit(data) {
        const bodyData = {
            platforms: data.platforms,
            primaryLanguage: data.preferredLanguages.map((item) => item.id),
            categories: data.contentCategory.map((item) => item.id),
            minimumFollowers: data.minimumFollowers,
        }
        await dispatch(saveOnBoarding({data: bodyData, type: 'business'}));
        setValue('preferredLanguages', []);
        setValue('contentCategory', []);
        setValue('minimumFollowers', '');
        setValue('platforms', []);
    }

    const handleOpen = (key) => {
        dispatch(setIsOpen(true, key));
        (async () => {
            if (key === 'category' && !categoryResult.length) {
                await dispatch(getCategory());
            } else if (key !== 'category' && !result.length) {
                await dispatch(getLanguages());
            }

        })();
    };

    const handleClose = (key) => {
        dispatch(setIsOpen(false, key));
    };

    const item = {
        hidden: {opacity: 0, y: 40},
        show: {opacity: 1, y: 0},
    };


    const {preferredLanguages, contentCategory} = getValues();

    return (
        <motion.div variants={container} initial="hidden" animate="show" className="w-full">
            {inProcess ? (
                <CircularProgress/>
            ) : (
                <Card component={motion.div} variants={item} className="w-full mt-32 mb-32">
                    <div className="md:flex flex-col">
                        <div className="relative flex flex-auto items-center px-24 sm:px-48 gap-10 flex-wrap">
                            <Controller
                                control={control}
                                name="platforms"
                                render={({field: {onChange, value: selectedVal = []}}) => (
                                    <FormControl className={'mt-32'}
                                                 style={{width: '49%'}}>
                                        <InputLabel id="demo-multiple-checkbox-label">In which platforms you are active
                                            on?</InputLabel>
                                        <Select
                                            labelId="demo-multiple-checkbox-label"
                                            id="demo-multiple-checkbox"
                                            multiple
                                            value={selectedVal || []}
                                            onChange={(e) => {
                                                const {
                                                    target: {value},
                                                } = e;
                                                onChange(typeof value === 'string' ? value.split(',') : value,)
                                            }}
                                            input={<OutlinedInput
                                                label="In which platforms you are active on?"/>}
                                            renderValue={(selected) => (
                                                <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 0.5}}>
                                                    {selected.map((value) => (
                                                        <Chip key={value} label={value}/>
                                                    ))}
                                                </Box>
                                            )}
                                            MenuProps={MenuProps}
                                        >
                                            {platforms.map((platform) => (
                                                <MenuItem key={platform} value={platform}>
                                                    <Checkbox checked={selectedVal.includes(platform)}/>
                                                    <ListItemText primary={platform}/>
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                )}
                            />

                            <Controller
                                control={control}
                                name="minimumFollowers"
                                rules={{required: 'Minimum Followers is required'}}
                                render={({field}) => (
                                    <TextField
                                        className={'mt-32'}
                                        style={{width: '49%'}}
                                        {...field}
                                        label="Minimum Followers"
                                        placeholder="Minimum Followers"
                                        id="minimumFollowers"
                                        error={!!errors.minimumFollowers}
                                        helperText={errors?.minimumFollowers?.message}
                                        variant="outlined"
                                        required
                                        fullWidth
                                        type="number"
                                        min={1}
                                    />
                                )}
                            />

                            <Controller
                                control={control}
                                name="preferredLanguages"
                                render={({field: {onChange, value}}) => (
                                    <Autocomplete
                                        className={'mt-32'}
                                        style={{width: '49%'}}
                                        open={isOpen}
                                        multiple
                                        disableCloseOnSelect
                                        onOpen={() => handleOpen('languages')}
                                        onClose={() => handleClose('languages')}
                                        isOptionEqualToValue={(option, value) => option.name === value.name}
                                        getOptionLabel={(option) => option.name}
                                        options={result}
                                        loading={isLoading}
                                        value={preferredLanguages}
                                        onChange={(e, value) => {
                                            onChange(value)
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Preferred Languages"
                                                slotProps={{
                                                    InputProps: {
                                                        ...params.InputProps,
                                                        endAdornment: (
                                                            <>
                                                                {isLoading ?
                                                                    <CircularProgress color="inherit"
                                                                                      size={20}/> : null}
                                                                {params.InputProps.endAdornment}
                                                            </>
                                                        ),
                                                    },
                                                }}
                                            />
                                        )}
                                    />
                                )}
                            />

                            <Controller
                                control={control}
                                name="contentCategory"
                                render={({field: {onChange, value}}) => (
                                    <Autocomplete
                                        className={'mt-32'}
                                        style={{width: '49%'}}
                                        open={categoryOpen}
                                        multiple
                                        disableCloseOnSelect
                                        onOpen={() => handleOpen('category')}
                                        onClose={() => handleClose('category')}
                                        isOptionEqualToValue={(option, value) => option.name === value.name}
                                        getOptionLabel={(option) => option.name}
                                        options={categoryResult}
                                        loading={categoryLoading}
                                        value={contentCategory}
                                        onChange={(e, value) => {
                                            onChange(value)
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Content Category"
                                                slotProps={{
                                                    InputProps: {
                                                        ...params.InputProps,
                                                        endAdornment: (
                                                            <>
                                                                {categoryLoading ?
                                                                    <CircularProgress color="inherit"
                                                                                      size={20}/> : null}
                                                                {params.InputProps.endAdornment}
                                                            </>
                                                        ),
                                                    },
                                                }}
                                            />
                                        )}
                                    />
                                )}
                            />
                        </div>

                        <Box
                            className="flex items-center mt-40 py-14 pr-16 pl-4 sm:pr-48 sm:pl-36 border-t"
                            sx={{backgroundColor: 'background.default'}}
                        >

                            <Button className="ml-auto" component={NavLinkAdapter} to={-1}>
                                Cancel
                            </Button>
                            <Button
                                className="ml-8"
                                variant="contained"
                                color="secondary"
                                disabled={_.isEmpty(dirtyFields) || !isValid}
                                onClick={handleSubmit(onSubmit)}
                            >
                                Save
                            </Button>
                        </Box>
                    </div>
                </Card>)
            }
        </motion.div>
    );
}

export default BusinessTab;
