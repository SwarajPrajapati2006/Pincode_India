export default function ErrorMsg({ message = "Something went wrong" }) {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="bg-red-50 border border-red-200 rounded-2xl px-6 py-5 max-w-md text-center shadow-sm">
        <p className="text-red-600 text-base font-semibold mb-1">⚠️ Error</p>
        <p className="text-red-500 text-sm">{message}</p>
      </div>
    </div>
  );
}
