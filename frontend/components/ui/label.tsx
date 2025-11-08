import * as React from "react";
import { cn } from "@/lib/utils"; // Utility function for conditional classNames

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(({ className, ...props }, ref) => {
  return (
    <label
      ref={ref}
      className={cn("block text-sm font-medium text-gray-300", className)}
      {...props}
    />
  );
});

Label.displayName = "Label";

export { Label };
