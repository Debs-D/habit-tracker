import SignupForm from '@/components/auth/SignupForm';

export default function SignupPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(160deg, #f0f0ff 0%, #fafaff 50%, #f5f3ff 100%)' }}>
      <div className="flex-1 flex flex-col items-center justify-center p-5">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-600 mb-4 shadow-md shadow-indigo-200">
              <span className="text-xl text-white font-bold">✓</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Start tracking</h1>
            <p className="mt-1 text-sm text-gray-500">Build habits that actually stick</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm shadow-gray-200 border border-gray-100 p-6">
            <SignupForm />
          </div>

          <p className="mt-5 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <a href="/login" className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline underline-offset-2">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
