import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth.js';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      console.log('Attempting to sign in...');
      const result = await signIn(email, password);
      console.log('Sign in result:', result);
      
      if (result.error) {
        console.error('Sign in error:', result.error);
        const errorMessage = result.error?.message || result.error || 'Failed to sign in';
        setError(errorMessage);
        setLoading(false);
      } else {
        console.log('Sign in successful, redirecting...');
        // Wait a bit for session to be set, then redirect
        setTimeout(() => {
          window.location.href = '/dashboard/admin';
        }, 1000);
      }
    } catch (err: any) {
      console.error('Sign in exception:', err);
      setError(err.message || 'An unexpected error occurred');
      setLoading(false);
    }
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-800">{error}</div>
        </div>
      )}
      <div className="rounded-md shadow-sm -space-y-px">
        <div>
          <label htmlFor="email-address" className="sr-only">
            Email address
          </label>
          <input
            id="email-address"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:z-10 sm:text-sm"
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#16345F';
              e.currentTarget.style.boxShadow = '0 0 0 1px #16345F';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#D1D5DB';
              e.currentTarget.style.boxShadow = 'none';
            }}
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password" className="sr-only">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:z-10 sm:text-sm"
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#16345F';
              e.currentTarget.style.boxShadow = '0 0 0 1px #16345F';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#D1D5DB';
              e.currentTarget.style.boxShadow = 'none';
            }}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={loading}
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all hover:opacity-90"
          style={{ backgroundColor: '#16345F' }}
          onFocus={(e) => {
            e.currentTarget.style.boxShadow = '0 0 0 2px rgba(22, 52, 95, 0.2)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.boxShadow = '';
          }}
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </div>
    </form>
  );
}

