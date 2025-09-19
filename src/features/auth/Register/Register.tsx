import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { authService } from '../../../api/services/auth.service';
import { Button } from '../../../components/common/Button/Button';
import { Input } from '../../../components/common/Input/Input';
import styles from './Register.module.css';

const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type RegisterForm = z.infer<typeof registerSchema>;

export const Register = () => {
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    try {
      await authService.register({
        username: data.username,
        email: data.email,
        password: data.password,
      });
      
      toast.success('Registration successful! Please login.');
      navigate('/login');
    } catch (error: any) {
      if (error.response?.status === 409) {
        toast.error('Username or email already exists');
      } else {
        toast.error('Registration failed. Please try again.');
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.registerBox}>
        <h1 className={styles.title}>SprintSync</h1>
        <h2 className={styles.subtitle}>Create your account</h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <Input
            label="Username"
            placeholder="Choose a username"
            error={errors.username?.message}
            {...register('username')}
          />
          
          <Input
            label="Email"
            type="email"
            placeholder="Enter your email"
            error={errors.email?.message}
            {...register('email')}
          />
          
          <Input
            label="Password"
            type="password"
            placeholder="Create a password"
            error={errors.password?.message}
            {...register('password')}
          />
          
          <Input
            label="Confirm Password"
            type="password"
            placeholder="Confirm your password"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />
          
          <Button
            type="submit"
            size="lg"
            loading={isSubmitting}
            className={styles.submitButton}
          >
            Sign Up
          </Button>
        </form>
        
        <p className={styles.footer}>
          Already have an account?{' '}
          <Link to="/login" className={styles.link}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};