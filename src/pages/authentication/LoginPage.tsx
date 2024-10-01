import { CustomButton } from "@/components/reusable/CustomButton";
import CustomInput from "@/components/reusable/CustomInput";
import PasswordInput from "@/components/ui/PasswordInput";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { Link, useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { LoginCredentials } from "@/features/authentication/authType";
import { loginUserAsync } from "@/features/authentication/authSlice";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import { checkPermissions } from "@/helper/checkPermissions";
const LoginPage = () => {
  const [permissionsGranted, setPermissionsGranted] = useState<boolean | null>(null);

  useEffect(() => {
    const checkUserPermissions = async () => {
      const result = await checkPermissions();
      setPermissionsGranted(result);
    };

    checkUserPermissions();
  }, []);
console.log(permissionsGranted)


 


  
 
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>();
  const { loading } = useAppSelector((state) => state.auth);

  const onSubmit: SubmitHandler<LoginCredentials> = (data) => {
    if(!permissionsGranted){
      toast({ title: "Please Grant Permissions of location and Notification", variant: "destructive", duration: 3000 });
    }else{
      dispatch(loginUserAsync(data)).then((response: any) => {
        if (response.payload?.data?.success) {
          toast({ title: response.payload?.data?.message, variant: "success", duration: 3000 });
          navigate("/");
        } else {
          toast({ title: response.payload?.data?.message, variant: "destructive", duration: 3000 });
        }
      });
    }
    
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto grid w-[400px] gap-6 p-[20px] rounded-md bg-[#fff] shadow">
      <div className="grid gap-2">
        <h1 className="text-2xl font-[600] text-slate-600">Login</h1>
        <p className="text-balance text-muted-foreground">Enter your email below to login to your account</p>
        <div className="mt-[20px] flex flex-col gap-[35px]">
          <div>
            <CustomInput {...register("username", { required: "username is required" })} id="username" label="Username" autoComplete="off" />
            {errors.username && <span className=" text-[12px] text-red-500">{errors.username.message}</span>}
          </div>
          <div>
            <PasswordInput {...register("password", { required: "password is required" })} label="Password" autoComplete="off" />
            {errors.password && <span className=" text-[12px] text-red-500">{errors.password.message}</span>}
            <div className="flex justify-end mt-[5px]">
              <Link to={"/forgot-password"} className="text-[12px] text-slate-600 underline">
                Forgot Password
              </Link>
            </div>
          </div>
          <CustomButton  loading={loading} className="bg-cyan-700 hover:bg-cyan-800">
            Login
          </CustomButton>
        </div>
      </div>
    </form>
  );
};

export default LoginPage;
