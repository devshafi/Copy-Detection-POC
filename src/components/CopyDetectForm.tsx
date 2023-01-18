import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { object, string, TypeOf } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, SubmitHandler, FormProvider } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import FormInput from './FormInput';
import { useMutation } from '@tanstack/react-query'
import axios from 'axios';

import { DuplicationResult } from "../types/resultTypes"
import { List, ListItem, ListItemText } from '@mui/material';
import moment from 'moment';
import BorderLinearProgress from './BorderLinearProgress';


// ? Login Schema with Zod
const duplicateFormSchema = object(
    {
        git_repo_url: string().min(1, 'Git repo URL is required').url('Git repo url is invalid')
    }
);

// ? Infer the Schema to get the TS Type
type FormSchema = TypeOf<typeof duplicateFormSchema>;


// ? Default Values
const defaultValues: FormSchema = {
    git_repo_url: ""
};

// type DuplicationResult = {
//     project_name: string,
//     highest_matched_with: string,
//     copy_probability: string,
//     html_similarity: number,
//     css_similarity: number,
//     weighted_avg_similarity: number,
//     js_similarity: 4
// }

async function fetchDuplicationResult(value: FormSchema): Promise<DuplicationResult> {

    console.log('function is called', value);
    const res = await axios.post('https://frshafi.pythonanywhere.com/check-duplication', value)
    console.log('fetchDuplicationResult response ===>', res)
    return res.data;
}

export default function CopyDetectForm() {

    // ? The object returned from useForm Hook
    const methods = useForm<FormSchema>({
        resolver: zodResolver(duplicateFormSchema),
        defaultValues,
    });


    const { mutate, isLoading, data } = useMutation({
        mutationFn: (values: FormSchema) => fetchDuplicationResult(values),
    })

    // ? Submit Handler
    const onSubmitHandler: SubmitHandler<FormSchema> = (values: FormSchema) => {
        mutate(values)
    };

    return (
        <Box >
            <Stack
                direction="column"
                justifyContent="center"
                alignItems="center"
            >
                <Paper sx={{ m: 2, p: 2 }}>
                    <FormProvider {...methods}>
                        <Stack spacing={2}
                            component='form'
                            noValidate
                            autoComplete='off'
                            onSubmit={methods.handleSubmit(onSubmitHandler)}
                        >
                            <Typography variant="h6" >
                                Enter a react git repository URL to check duplication
                            </Typography>
                            <FormInput
                                label='Enter Git repo uRL'
                                name='git_repo_url'
                                focused
                                required
                                variant='standard'
                                placeholder='Git Repo URL'
                            />
                            <LoadingButton
                                loading={isLoading}
                                type='submit'
                                variant='contained'
                            >
                                Check
                            </LoadingButton>
                        </Stack>
                    </FormProvider>
                </Paper>
            </Stack>
            {isLoading && <Stack
                direction="column"
                justifyContent="center"
                alignItems="center">
                Preparing report....
            </Stack>}

            {data && !isLoading &&

                <Stack
                    direction="column"
                    justifyContent="center"
                    alignItems="center"
                >

                    <Stack
                        direction="row"
                    >
                        <Paper sx={{ m: 2, p: 2 }}>
                            <Typography variant="h6" gutterBottom>
                                Project being tested: {data?.highest_match.project_name}
                            </Typography>
                            <Typography variant="h6" marginBottom={4}>
                                Highest matched with: {data?.highest_match.highest_matched_with}
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                HTML similarity: {data?.highest_match.html_similarity}%
                            </Typography>

                            <BorderLinearProgress sx={{ marginBottom: "20px" }} variant="determinate" value={data?.highest_match.html_similarity} />
                            {/* <span>{data?.highest_match.html_similarity}%</span> */}



                            <Typography variant="body1" gutterBottom>
                                CSS (css,scss,sass) similarity: {data?.highest_match.css_similarity}%
                            </Typography>
                            <BorderLinearProgress sx={{ marginBottom: "20px" }} variant="determinate" value={data?.highest_match.css_similarity} />
                            {/* <span>{data?.highest_match.css_similarity}%</span> */}
                            <Typography variant="body1" gutterBottom>
                                JS (js,jsx,tsx) similarity: {data?.highest_match.js_similarity}%
                            </Typography>

                            <BorderLinearProgress sx={{ marginBottom: "20px" }} variant="determinate" value={data?.highest_match.js_similarity} />
                            {/* <span>{data?.highest_match.js_similarity}%</span> */}


                            <Typography variant="body1" gutterBottom>
                                Weighted average similarity: {data?.highest_match.weighted_avg_similarity}%
                            </Typography>

                            <BorderLinearProgress sx={{ marginBottom: "20px" }} variant="determinate" value={data?.highest_match.weighted_avg_similarity} />
                            {/* <span >{data?.highest_match.weighted_avg_similarity}%</span> */}

                            <Typography variant="h6" gutterBottom>
                                Overall copy probability: {data?.highest_match.copy_probability}
                            </Typography>
                        </Paper>



                        <Paper sx={{ m: 2, p: 2 }}>
                            <Typography variant="h6" gutterBottom>
                                Repo Owner: {data?.repo_info.author_info.repo_owner}
                            </Typography>
                            <Typography variant="h6" gutterBottom>
                                Repo Owner Email: {data?.repo_info.author_info.repo_owner_email}
                            </Typography>

                            <Typography variant="h6" gutterBottom>

                                Latest {data.repo_info.latest_commits.length} commit(s) :
                                {
                                    <List dense>
                                        {
                                            data.repo_info.latest_commits.map(commit => (
                                                <ListItem>
                                                    <ListItemText primary={commit.commit_message} secondary={moment(commit.commit_time).format("LLL")} />
                                                </ListItem>
                                            ))

                                        }

                                    </List>

                                }
                            </Typography>

                        </Paper>

                    </Stack>



                    <Typography variant="caption" >
                        How probability is calculated: if weighted similarity is <b>less than 20</b>, duplication probability is <b>low</b>. <b>20-50 medium</b>, <b>50-70 high</b> and <b>more than 70 is extreme</b>. It can be modified based on our requirements
                    </Typography>
                    <Typography variant="caption" >
                        How weighted similarity is calculated: html priority 10%, css priority 20% and js priority 70%. It can be modified based on our requirements.
                    </Typography>

                </Stack>}


        </Box>

    )
}
