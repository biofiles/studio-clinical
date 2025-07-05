import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

interface ProgressProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  color?: 'primary' | 'success' | 'info' | 'accent' | 'gray'
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value, color = 'primary', ...props }, ref) => {
  const getColorClass = (color: string) => {
    switch (color) {
      case 'primary': return 'bg-[hsl(var(--progress-primary))]';
      case 'success': return 'bg-[hsl(var(--progress-success))]';
      case 'info': return 'bg-[hsl(var(--progress-info))]';
      case 'accent': return 'bg-[hsl(var(--progress-accent))]';
      case 'gray': return 'bg-[hsl(var(--progress-gray))]';
      default: return 'bg-[hsl(var(--progress-primary))]';
    }
  };

  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={`h-full w-full flex-1 transition-all ${getColorClass(color)}`}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  )
})
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }