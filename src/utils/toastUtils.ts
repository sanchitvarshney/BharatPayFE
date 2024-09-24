// toastUtils.ts
import { toast } from "@/components/ui/use-toast";

export function showToast({ title, description, variant,className,duration=3000 }: { title?: string; description?: string; variant?: "default" | "destructive" | "success" | null | undefined ,className?:string,duration?:number}) {
  toast({
    title,
    description,
    variant,
    className: `font-[500] ${className}`,
    duration: duration,
  });
}
