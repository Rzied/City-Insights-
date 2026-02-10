export function ErrorState({ title, message, onRetry }: { title: string; message: string; onRetry?: () => void }) {
  return (
    <div className="rounded-2xl border border-red-100 bg-red-50/80 p-4 text-sm text-red-900 backdrop-blur transition-colors dark:border-red-500/30 dark:bg-red-950/40 dark:text-red-100">
      <p className="font-semibold">{title}</p>
      <p className="mt-1 text-red-700 dark:text-red-200">{message}</p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-3 rounded-full border border-red-200 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-red-800 transition hover:-translate-y-0.5 hover:border-red-300 dark:border-red-400/40 dark:text-red-100"
        >
          Réessayer
        </button>
      ) : null}
    </div>
  );
}
