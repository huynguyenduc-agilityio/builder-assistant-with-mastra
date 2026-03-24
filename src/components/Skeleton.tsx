// Utils
import { combineClasses } from '@/utils';

export const Skeleton = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    data-testid="skeleton"
    className={combineClasses(
      'animate-pulse rounded-md bg-gray-500/10',
      className,
    )}
    {...props}
  />
);
