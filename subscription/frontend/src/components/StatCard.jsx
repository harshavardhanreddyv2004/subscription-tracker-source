export const StatCard = ({ label, value, helper, tone = "default" }) => {
  const toneClass =
    tone === "danger"
      ? "border-rose-400/30 bg-rose-500/10"
      : tone === "success"
        ? "border-emerald-400/30 bg-emerald-500/10"
        : "border-cyan-400/30 bg-cyan-500/10";

  return (
    <article className={`rounded-xl border p-4 ${toneClass}`}>
      <p className="text-xs uppercase tracking-[0.18em] text-slate-300">{label}</p>
      <p className="mt-3 text-2xl font-bold text-white">{value}</p>
      {helper ? <p className="mt-1 text-sm text-slate-300">{helper}</p> : null}
    </article>
  );
};
