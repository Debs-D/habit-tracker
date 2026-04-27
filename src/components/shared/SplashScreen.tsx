export default function SplashScreen() {
  return (
    <div
      data-testid="splash-screen"
      className="flex items-center justify-center min-h-screen"
      style={{
        background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 60%, #6366f1 100%)',
      }}
    >
      <div className="text-center px-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 mb-5 backdrop-blur-sm">
          <span className="text-3xl">✓</span>
        </div>
        <h1 className="text-4xl font-bold text-white tracking-tight">Habit Tracker</h1>
        <p className="mt-2 text-indigo-200 text-base">Small steps. Big results.</p>
        <div className="mt-8 flex justify-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="inline-block w-2 h-2 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="inline-block w-2 h-2 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}
