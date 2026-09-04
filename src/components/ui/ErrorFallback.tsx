const ErrorFallback = () => (
  <div className="force-light flex min-h-screen items-center justify-center bg-brand-bg px-4">
    <div className="w-full max-w-sm rounded-2xl border border-brand-border bg-brand-bg-alt p-8 text-center shadow-xl">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
        <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
      </div>
      <h1 className="text-lg font-bold text-brand-text-h">Something went wrong</h1>
      <p className="mt-2 text-sm text-brand-text-muted">
        An unexpected error occurred. Try reloading the page.
      </p>
      <div className="mt-6 flex flex-col gap-2">
        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center justify-center rounded-lg bg-brand-green px-5 py-2.5 text-sm font-semibold text-[#061414] transition-colors hover:bg-[#061414] hover:text-white"
        >
          Reload page
        </button>
        <a
          href="/"
          className="inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-sm font-semibold text-brand-text-muted transition-colors hover:text-brand-green"
        >
          Go to homepage
        </a>
      </div>
    </div>
  </div>
)

export default ErrorFallback
