
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    // Standard path for non-jelly buttons
    if (variant !== "default" && variant !== "outline") {
      const Comp = asChild ? Slot : "button";
      return (
        <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props}>
          {children}
        </Comp>
      );
    }

    // Custom path for jelly buttons ("default" and "outline")
    const jellyContainerSizeClasses =
      size === 'lg' ? "h-14" :
      size === 'sm' ? "h-9" :
      size === 'icon' ? "h-11 w-11" :
      "h-11";

    const frontPaddingClasses =
      size === 'lg' ? "px-8" :
      size === 'sm' ? "px-3" :
      size === 'icon' ? "" :
      "px-4";

    const jellyBaseClasses = "relative p-0 border-none bg-transparent cursor-pointer group drop-shadow-futuristic-glow disabled:cursor-not-allowed disabled:opacity-50";

    const frontClasses = cn(
      "flex items-center justify-center gap-2 relative w-full h-full rounded-lg text-sm font-medium will-change-transform transition-all duration-500 ease-jelly -translate-y-1 group-hover:-translate-y-1.5 group-active:-translate-y-0.5",
      frontPaddingClasses,
      "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
    );

    const JellyInner = ({ content }: { content: React.ReactNode }) => (
      <div className="relative w-full h-full">
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
          {content}
        </span>
      </div>
    );
    
    if (asChild) {
      const childElement = React.Children.only(children) as React.ReactElement;
      return React.cloneElement(
        childElement,
        {
          ...props,
          className: cn(jellyBaseClasses, jellyContainerSizeClasses, className, childElement.props.className),
          ref,
        },
        <JellyInner content={childElement.props.children} />
      );
    }

    return (
      <button
        className={cn(jellyBaseClasses, jellyContainerSizeClasses, className)}
        ref={ref}
        {...props}
      >
        <JellyInner content={children} />
      </button>
    );
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
