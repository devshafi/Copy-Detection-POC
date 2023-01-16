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

type DuplicationResult = {
    project_name: string,
    highest_matched_with: string,
    copy_probability: string,
    html_similarity: number,
    css_similarity: number,
    weighted_avg_similarity: number,
    js_similarity: 4
}

async function fetchDuplicationResult(value: FormSchema): Promise<DuplicationResult> {

    console.log('function is called', value);
    const res = await axios.post('https://8d2d-27-147-226-162.in.ngrok.io/check-duplication', value)
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
                                Enter a react public git repository URL to check duplication (private repo is not supported yet)
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
            {data && !isLoading && <Stack
                direction="column"
                justifyContent="center"
                alignItems="center"
            >
                <Paper sx={{ m: 2, p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        Project being tested: {data?.project_name}
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                        Highest matched with: {data?.highest_matched_with}
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                        HTML similarity: {data?.html_similarity}%
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                        CSS similarity: {data?.css_similarity}%
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                        JS similarity: {data?.js_similarity}%
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                        Weighted average similarity: {data?.weighted_avg_similarity}%
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                        Duplication probability: {data?.copy_probability}
                    </Typography>
                </Paper>

                <Typography variant="caption" >
                    How probability is calculated: if weighted similarity is <b>less than 30</b>, duplication probability is <b>low</b>. <b>30-50 medium</b>, <b>50-70 high</b> and <b>more than 70 is extreme</b>. It can be modified based on our requirements
                </Typography>
                <Typography variant="caption" >
                    How weighted similarity is calculated: html priority 10%, css priority 20% and js priority 70%. It can be modified based on our requirements.
                </Typography>

            </Stack>}





        </Box>

    )
}
