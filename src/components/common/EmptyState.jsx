export default function EmptyState({ title, body, action }) {
  return (
    <div className="border border-dashed border-border bg-paper px-6 py-16 text-center">
      <p className="font-heading text-[1.4rem] text-forest">{title}</p>
      {body && <p className="mx-auto mt-3 max-w-md text-[0.9375rem] leading-relaxed text-ink/60">{body}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}