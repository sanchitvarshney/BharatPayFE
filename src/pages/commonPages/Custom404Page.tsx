import { useNavigate } from "react-router-dom";
import { ArrowLeft, FileQuestion, Home } from "lucide-react";

const Custom404Page = () => {
  const navigate = useNavigate();
  const canGoBack = window.history.length > 1;

  return (
    <main className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-slate-50 px-4">
      {/* soft background accents */}
      <div aria-hidden className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-cyan-200/40 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-sky-200/40 blur-3xl" />

      <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white px-8 py-10 text-center shadow-sm">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-cyan-50 ring-8 ring-cyan-50/50">
          <FileQuestion aria-hidden className="h-8 w-8 text-cyan-700" />
        </div>

        <p className="text-sm font-semibold uppercase tracking-widest text-cyan-700">Error 404</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">Page not found</h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          The page you're looking for doesn't exist or may have been moved.
        </p>

    

        <div className="mt-8 flex flex-col-reverse justify-center gap-3 sm:flex-row">
          {canGoBack && (
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600"
            >
              <ArrowLeft aria-hidden className="h-4 w-4" />
              Go back
            </button>
          )}
          <button
            type="button"
            onClick={() => navigate("/", { replace: true })}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-cyan-700 px-4 text-sm font-medium text-white transition-colors hover:bg-cyan-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 focus-visible:ring-offset-2"
          >
            <Home aria-hidden className="h-4 w-4" />
            Back to dashboard
          </button>
        </div>
      </div>
    </main>
  );
};

export default Custom404Page;
