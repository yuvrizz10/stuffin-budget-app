import { PiggyBank } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2 font-semibold text-primary", className)}>
      <PiggyBank className="h-7 w-7" />
      <span className="text-xl">Stuffin</span>
    </div>
  );
}
