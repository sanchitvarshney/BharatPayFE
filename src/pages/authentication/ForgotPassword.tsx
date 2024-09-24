import CustomInput from "@/components/reusable/CustomInput"
import { Button } from "@/components/ui/button"



const ForgotPassword = () => {
  return (
    <div className="mx-auto grid w-[400px] gap-6 p-[20px] rounded-md bg-[#fff] dark:bg-slate-50 shadow ">
    <div className="grid gap-2">
      <p className="text-balance text-muted-foreground text-[13px]">
        Enter your email address associated with your account and we'll send you a link to reset password
      </p>
    </div>
    <div className="grid gap-4 mt-[20px]">
     <CustomInput id="Email" label="Email" />
      <Button type="submit" className="w-full shadow bg-cyan-700 hover:bg-cyan-600 shadow-slate-500">
        Continue
      </Button>
    </div>
  </div>
  )
}

export default ForgotPassword
