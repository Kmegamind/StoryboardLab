
import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { Circle } from "lucide-react"

import { cn } from "@/lib/utils"

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn("grid gap-2", className)}
      {...props}
      ref={ref}
    />
  )
})
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, children, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        "relative group p-0 border-none bg-transparent cursor-pointer transition-opacity",
        "w-12 h-12", // A larger size for the new style
        "data-[state=unchecked]:opacity-50 hover:data-[state=unchecked]:opacity-100",
        "data-[state=checked]:opacity-100 data-[state=checked]:drop-shadow-futuristic-glow",
        "disabled:cursor-not-allowed disabled:opacity-25",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className
      )}
      {...props}
    >
      {/* Shadow layer */}
      <span className="absolute top-0 left-0 w-full h-full rounded-full bg-black/25 will-change-transform transition-transform duration-500 ease-jelly translate-y-1 group-hover:translate-y-1.5 group-active:translate-y-px" />
      
      {/* Edge layer for 3D effect */}
      <span className="absolute top-0 left-0 w-full h-full rounded-full bg-gradient-to-l from-primary/40 via-primary/70 to-primary/40" />

      {/* Front layer with jelly effect */}
      <span className={cn(
        "flex items-center justify-center relative w-full h-full rounded-full",
        "bg-primary text-primary-foreground shadow-futuristic-inset",
        "will-change-transform transition-transform duration-500 ease-jelly -translate-y-1.5",
        "group-hover:-translate-y-2 group-active:-translate-y-0.5"
      )}>
        {children}
        <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
          <Circle className="h-6 w-6 fill-primary-foreground/50 text-primary-foreground/50" />
        </RadioGroupPrimitive.Indicator>
      </span>
    </RadioGroupPrimitive.Item>
  )
})
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName

export { RadioGroup, RadioGroupItem }
