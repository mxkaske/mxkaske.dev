export function LoadingAnimation() {
  return (
    <div className="flex items-center justify-center gap-1">
      <div className="h-1 w-1 animate-pulse direction-alternate duration-700 rounded-full bg-primary-foreground" />
      <div className="h-1 w-1 animate-pulse direction-alternate duration-700 delay-150 rounded-full bg-primary-foreground" />
      <div className="h-1 w-1 animate-pulse direction-alternate duration-700 delay-300 rounded-full bg-primary-foreground" />
    </div>
  );
}
