import { ReactNode } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
interface CustomTooltipProps {
  children: ReactNode;
  message: string;
  side?: "top" | "right" | "bottom" | "left";
  className?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ children, message, side = "top", className = "" }) => {
  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent className={`bg-cyan-600 ${className}`} side={side}>
          <p>{message}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default CustomTooltip;