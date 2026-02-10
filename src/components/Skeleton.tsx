export function Skeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className="h-4 w-full animate-pulse rounded-full bg-slate-200"
          style={{ width: `${80 - index * 10}%` }}
        />
      ))}
    </div>
  );
}
