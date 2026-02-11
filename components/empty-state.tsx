export function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-20">
      <p className="text-zinc-600 text-sm">{message}</p>
    </div>
  );
}
