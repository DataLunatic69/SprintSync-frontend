import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { authService } from '../../../api/services/auth.service';
import { useAuthStore } from '../../../stores/authStore';
import { Button } from '../../../components/common/Button/Button';
import { Input } from '../../../components/common/Input/Input';
import styles from './Login.module.css';

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

type LoginForm = z.infer<typeof loginSchema>;

export const Login = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      const response = await authService.login(data);
      
      // Decode token to get user info (or make another API call)
      const user = {
        id: '1',
        username: data.username,
        email: '',
        is_admin: false,
        created_at: new Date().toISOString(),
      };
      
      setAuth(user, response.access_token);
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Invalid username or password');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <h1 className={styles.title}>SprintSync</h1>
        <h2 className={styles.subtitle}>Sign in to your account</h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <Input
            label="Username"
            placeholder="Enter your username"
            error={errors.username?.message}
            {...register('username')}
          />
          
          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            error={errors.password?.message}
            {...register('password')}
          />
          
          <Button
            type="submit"
            size="lg"
            loading={isSubmitting}
            className={styles.submitButton}
          >
            Sign In
          </Button>
        </form>
        
        <p className={styles.footer}>
          Don't have an account?{' '}
          <Link to="/register" className={styles.link}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};