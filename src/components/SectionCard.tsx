import type { ReactNode } from "react";

export function SectionCard({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) {
  return (
    <section className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-glow backdrop-blur transition-colors dark:border-white/10 dark:bg-white/5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="font-display text-xl font-semibold text-ink dark:text-white">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}
