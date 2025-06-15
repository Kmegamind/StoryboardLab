import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const futuristicButtonVariants = cva(
  "relative p-0 border-none bg-transparent cursor-pointer group drop-shadow-futuristic-glow disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "",
        outline: "",
      },
      size: {
        default: "h-11",
        sm: "h-9",
        lg: "h-14",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface FuturisticButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof futuristicButtonVariants> {
  asChild?: boolean
}

const FuturisticButton = React.forwardRef<HTMLButtonElement, FuturisticButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    const frontClasses = "flex items-center justify-center relative w-full h-full px-8 rounded-lg text-lg font-semibold will-change-transform transition-all duration-500 ease-jelly -translate-y-1 group-hover:-translate-y-1.5 group-active:-translate-y-0.5"
    
    return (
      <Comp
        className={cn(futuristicButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        <span className="absolute top-0 left-0 w-full h-full rounded-lg bg-black/25 will-change-transform transition-all duration-500 ease-jelly translate-y-0.5 group-hover:translate-y-1 group-active:translate-y-px" />
        <span className={cn(
          "absolute top-0 left-0 w-full h-full rounded-lg",
          variant === 'outline' ? "bg-background/80 border-2 border-primary" : "bg-gradient-to-l from-primary/50 via-primary/80 to-primary/50"
        )} />
        <span className={cn(
          frontClasses,
          variant === 'outline' 
            ? "bg-transparent text-primary shadow-none" 
            : "bg-primary text-primary-foreground shadow-futuristic-inset"
        )}>
          {props.children}
        </span>
      </Comp>
    )
  }
)
FuturisticButton.displayName = "FuturisticButton"

export { FuturisticButton, futuristicButtonVariants }
