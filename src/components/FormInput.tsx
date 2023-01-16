import { FC } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { TextField, TextFieldProps } from '@mui/material';

// 👇 Type of Props the FormInput will receive
type FormInputProps = {
    name: string;
} & TextFieldProps;

const FormInput: FC<FormInputProps> = ({ name, ...otherProps }) => {
    // 👇 Utilizing useFormContext to have access to the form Context
    const {
        control,
        formState: { errors },
    } = useFormContext();

    return (
        <Controller
            control={control}
            name={name}
            defaultValue=''
            render={({ field }) => (
                <TextField
                    {...field}
                    {...otherProps}
                    error={!!errors[name]}
                    helperText={
                        errors[name] ? (errors[name]?.message as unknown as string) : ''
                    }
                />
            )}
        />
    );
};

export default FormInput;