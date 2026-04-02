import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../app/AuthContext';
import { toast } from '../../services/toast';
import type { RegisterCreds } from '../../types/user';

type CredentialsForm = {
    email: string;
    displayName: string;
    password: string;
    confirmPassword: string;
};

type ProfileForm = {
    gender: string;
    dateOfBirth: string;
    city: string;
    country: string;
};

type Props = {
    onCancel: () => void;
};

export default function RegisterForm({ onCancel }: Props) {
    const { register: registerUser } = useAuth();
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [validationErrors, setValidationErrors] = useState<string[]>([]);

    const {
        register,
        getValues,
        watch,
        formState: { errors, isValid },
    } = useForm<CredentialsForm>({ mode: 'onChange' });

    const {
        register: registerProfile,
        handleSubmit: handleSubmitProfile,
        formState: { errors: profileErrors, isValid: isProfileValid },
    } = useForm<ProfileForm>({ mode: 'onChange', defaultValues: { gender: 'male' } });

    const password = watch('password');

    const onNextStep = () => {
        if (isValid) setCurrentStep(2);
    };

    const onRegister = async (profileData: ProfileForm) => {
        const credData = getValues();
        const formData: RegisterCreds = {
            email: credData.email,
            displayName: credData.displayName,
            password: credData.password,
            gender: profileData.gender,
            dateOfBirth: profileData.dateOfBirth,
            city: profileData.city,
            country: profileData.country,
        };

        try {
            setValidationErrors([]);
            await registerUser(formData);
            toast.success('Registered successfully');
            navigate('/members');
        } catch (error: any) {
            const errors = error?.response?.data?.errors;
            if (errors) {
                setValidationErrors(Object.values(errors).flat() as string[]);
            } else {
                toast.error('Registration failed');
            }
        }
    };

    const getMaxDate = () => {
        const today = new Date();
        today.setFullYear(today.getFullYear() - 18);
        return today.toISOString().split('T')[0];
    };

    return (
        <div className="bg-white w-1/2 mx-auto flex flex-col p-6 rounded-lg shadow-lg">
            <h2 className="text-3xl text-center text-purple-600 font-semibold mb-4">Sign up</h2>

            <div className="flex justify-center gap-4 mb-6">
                <div className={`px-4 py-1 rounded-full text-sm font-medium ${currentStep === 1 ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                    Credentials
                </div>
                <div className={`px-4 py-1 rounded-full text-sm font-medium ${currentStep === 2 ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                    Profile
                </div>
            </div>

            {currentStep === 1 && (
                <form className="flex flex-col gap-4" autoComplete="off">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input {...register('email', {
                            required: 'Email is required',
                            pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' }
                        })}
                            type="text" autoComplete="off" className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none" />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Display name</label>
                        <input {...register('displayName', { required: 'Display name is required' })}
                            type="text" autoComplete="off" className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none" />
                        {errors.displayName && <p className="text-red-500 text-xs mt-1">{errors.displayName.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input {...register('password', {
                            required: 'Password is required',
                            minLength: { value: 4, message: 'Min 4 characters' },
                            maxLength: { value: 8, message: 'Max 8 characters' }
                        })}
                            type="password" autoComplete="off" className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none" />
                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm password</label>
                        <input {...register('confirmPassword', {
                            required: 'Please confirm password',
                            validate: value => value === password || 'Passwords do not match'
                        })}
                            type="password" autoComplete="off" className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none" />
                        {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
                    </div>

                    <div className="flex justify-end gap-3 mt-2">
                        <button type="button" onClick={onCancel}
                            className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 cursor-pointer">
                            Cancel
                        </button>
                        <button type="button" onClick={onNextStep} disabled={!isValid}
                            className="px-4 py-2 rounded-md bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 cursor-pointer">
                            Next
                        </button>
                    </div>
                </form>
            )}

            
            {currentStep === 2 && (
                <form onSubmit={handleSubmitProfile(onRegister)} className="flex flex-col gap-4" autoComplete="off">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                        <div className="flex gap-6">
                            <label className="flex items-center gap-2">
                                <input {...registerProfile('gender')} type="radio" value="male" />
                                <span>Male</span>
                            </label>
                            <label className="flex items-center gap-2">
                                <input {...registerProfile('gender')} type="radio" value="female" />
                                <span>Female</span>
                            </label>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date of birth</label>
                        <input {...registerProfile('dateOfBirth', { required: 'Date of birth is required' })}
                            type="date" max={getMaxDate()}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none" />
                        {profileErrors.dateOfBirth && <p className="text-red-500 text-xs mt-1">{profileErrors.dateOfBirth.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                        <input {...registerProfile('city', { required: 'City is required' })}
                            type="text" autoComplete="off" className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none" />
                        {profileErrors.city && <p className="text-red-500 text-xs mt-1">{profileErrors.city.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                        <input {...registerProfile('country', { required: 'Country is required' })}
                            type="text" autoComplete="off" className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none" />
                        {profileErrors.country && <p className="text-red-500 text-xs mt-1">{profileErrors.country.message}</p>}
                    </div>

                    <div className="flex justify-end gap-3 mt-2">
                        <button type="button" onClick={() => setCurrentStep(1)}
                            className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 cursor-pointer">
                            Back
                        </button>
                        <button type="submit" disabled={!isProfileValid}
                            className="px-4 py-2 rounded-md bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 cursor-pointer">
                            Register
                        </button>
                    </div>
                </form>
            )}

            
            {validationErrors.length > 0 && (
                <div className="mt-4 bg-gray-100 rounded-xl p-3">
                    <ul className="text-red-500 text-sm space-y-1">
                        {validationErrors.map((err, i) => <li key={i}>{err}</li>)}
                    </ul>
                </div>
            )}
        </div>
    );
}