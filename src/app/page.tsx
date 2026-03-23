export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-6 py-24 text-zinc-50">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 rounded-3xl border border-white/10 bg-white/5 p-10 shadow-2xl shadow-black/30 backdrop-blur">
        <span className="w-fit rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-sm font-medium text-emerald-200">
          Next.js + TypeScript + Tailwind CSS
        </span>
        <div className="space-y-4">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Your app is ready for the next build step.
          </h1>
          <p className="max-w-2xl text-base leading-7 text-zinc-300 sm:text-lg">
            This repository now uses the App Router with a src directory, ESLint, Tailwind CSS,
            and the <code className="rounded bg-black/30 px-1.5 py-0.5 text-sm">@/*</code>
            import alias.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <h2 className="text-lg font-medium">Start editing</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-300">
              Update <code className="rounded bg-black/30 px-1.5 py-0.5">src/app/page.tsx</code>{" "}
              to build your first screen.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <h2 className="text-lg font-medium">Available scripts</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-300">
              Use <code className="rounded bg-black/30 px-1.5 py-0.5">npm run dev</code> to start
              the local development server once dependencies are installed.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
