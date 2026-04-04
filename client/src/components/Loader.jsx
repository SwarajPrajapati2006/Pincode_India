export default function Loader() {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3">
      <div className="w-10 h-10 rounded-full border-[3px] border-slate-200 border-t-indigo-600 animate-spin"></div>
      <p className="text-sm text-slate-400 font-medium">Loading data…</p>
    </div>
  );
}
