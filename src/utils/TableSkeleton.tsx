export function TableSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(5)].map((_, index) => (
        <div
          key={index}
          className="h-12 bg-gray-200 rounded animate-pulse"
        />
      ))}
    </div>
  );
}