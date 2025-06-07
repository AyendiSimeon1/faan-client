// In your form component (e.g., SignInForm.tsx)
import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import Input from '../components/ui/Input'; // Adjust path
import Button from '../components/ui/Button'; // Adjust path

interface SignInFormData {
  email: string;
  password_is_here: string; // Changed name to avoid conflict with HTML password
}

const SignInForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<SignInFormData>();

  const onSubmit: SubmitHandler<SignInFormData> = (data) => {
    console.log(data);
    // Handle form submission
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-4">
      <Input<SignInFormData>
        name="email"
        label="Email"
        type="email"
        placeholder="joymiracle@gmail.com"
        register={register}
        error={errors.email}
        // showSuccessTick // Uncomment to show tick on valid input (if not error)
      />
      <Input<SignInFormData>
        name="password_is_here" // Use the changed name here
        label="Password"
        type="password"
        placeholder="Enter your password"
        register={register}
        error={errors.password_is_here} // And here
      />
      <Button type="submit" variant="primary" fullWidth>
        Sign In
      </Button>
    </form>
  );
};

export default SignInForm;