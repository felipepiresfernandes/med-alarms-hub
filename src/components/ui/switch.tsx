import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";

import { cn } from "@/lib/utils";

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "peer inline-flex shrink-0 cursor-pointer items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
      "data-[state=checked]:bg-[#A9D2B9] data-[state=unchecked]:bg-[#E8E8E8]",
      className,
    )}
    style={{
      width: '34px',
      height: '20px',
      padding: '2px',
    }}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none block rounded-full shadow-lg ring-0 transition-transform",
        "data-[state=checked]:bg-[#46845E] data-[state=unchecked]:bg-[#828282]",
        "data-[state=checked]:translate-x-[14px] data-[state=unchecked]:translate-x-0",
      )}
      style={{
        width: '16px',
        height: '16px',
      }}
    />
  </SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
