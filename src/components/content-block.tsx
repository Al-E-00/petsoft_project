import { cn } from '@/lib/utils';

type ContentBlockProps = {
  children: React.ReactNode;
  className?: string;
};

export default function ContentBlock({ children, className }: ContentBlockProps) {
  return <div className={cn('h-full w-full overflow-hidden rounded-sm bg-[#F7F8FA] shadow-sm', className)}>{children}</div>;
}
