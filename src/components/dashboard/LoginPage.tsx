import { AuthProvider } from '../../hooks/useAuth.js';
import LoginForm from './LoginForm.js';

export default function LoginPage() {
  return (
    <AuthProvider>
      <LoginForm />
    </AuthProvider>
  );
}

