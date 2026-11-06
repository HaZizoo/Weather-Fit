import {
  AlertCircle,
  ArrowRight,
  Info,
  LoaderCircle,
  Search,
  X,
} from 'lucide-react'
import type { FormEvent } from 'react'

type SearchBarProps = {
  query: string
  notice: string | null
  isError?: boolean
  isLoading?: boolean
  onQueryChange: (value: string) => void
  onSearch: () => void
}

export function SearchBar({
  query,
  notice,
  isError = false,
  isLoading = false,
  onQueryChange,
  onSearch,
}: SearchBarProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onSearch()
  }

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      aria-busy={isLoading}
    >
      <label htmlFor="city-search" className="sr-only">
        Search for a city
      </label>

      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="flex h-12 flex-1 items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-4 shadow-sm transition focus-within:border-sky-400 focus-within:ring-4 focus-within:ring-sky-500/10">
          <Search
            className="size-[18px] shrink-0 text-slate-400"
            aria-hidden="true"
          />
          <input
            id="city-search"
            type="search"
            name="city"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search a city — e.g. Düsseldorf"
            autoComplete="off"
            spellCheck={false}
            enterKeyHint="search"
            className="h-full w-full min-w-0 border-0 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-500 [&::-webkit-search-cancel-button]:appearance-none"
          />
          {query.length > 0 && (
            <button
              type="button"
              onClick={() => onQueryChange('')}
              aria-label="Clear search"
              className="flex size-6 shrink-0 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
            >
              <X className="size-3.5" aria-hidden="true" />
            </button>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="group inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 text-sm font-medium text-white shadow-[0_10px_24px_-14px_rgba(15,23,42,0.85)] transition hover:bg-slate-800 active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas disabled:cursor-wait disabled:opacity-70 disabled:hover:bg-slate-900"
        >
          {isLoading ? (
            <>
              Searching
              <LoaderCircle
                className="size-4 animate-spin"
                aria-hidden="true"
              />
            </>
          ) : (
            <>
              Search
              <ArrowRight
                className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </>
          )}
        </button>
      </div>

      <p
        aria-live="polite"
        className={`mt-2.5 flex min-h-[18px] items-start gap-1.5 px-1 text-xs leading-relaxed ${
          isError ? 'text-rose-600' : 'text-slate-500'
        }`}
      >
        {notice ? (
          <>
            {isError ? (
              <AlertCircle
                className="mt-px size-3.5 shrink-0"
                aria-hidden="true"
              />
            ) : (
              <Info className="mt-px size-3.5 shrink-0" aria-hidden="true" />
            )}
            <span>{notice}</span>
          </>
        ) : (
          <span>
            Live conditions from OpenWeatherMap · AI styling by Groq.
          </span>
        )}
      </p>
    </form>
  )
}
