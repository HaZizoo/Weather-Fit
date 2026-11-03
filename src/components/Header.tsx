import { CloudSun } from 'lucide-react'

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-900/[0.06] bg-canvas/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-3xl items-center justify-between gap-4 px-5 sm:h-[72px] sm:px-8">
        <a
          href="/"
          aria-label="Weather Fit home"
          className="flex items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
        >
          <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-indigo-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_8px_20px_-8px_rgba(56,189,248,0.8)]">
            <CloudSun className="size-5 text-white" strokeWidth={2} aria-hidden="true" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-[17px] font-semibold tracking-tight text-slate-900">
              Weather Fit
            </span>
            <span className="mt-1 text-[10px] font-medium uppercase tracking-[0.16em] text-slate-500">
              AI wardrobe
            </span>
          </span>
        </a>

        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-amber-200/80 bg-amber-50 px-2.5 py-1 text-[11px] font-medium text-amber-700">
          <span className="size-1.5 rounded-full bg-amber-500" aria-hidden="true" />
          Demo mode
        </span>
      </div>
    </header>
  )
}
