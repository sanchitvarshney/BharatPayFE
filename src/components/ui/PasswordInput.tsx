import React, { forwardRef, useState } from "react";
import { Button } from "../ui/button";
import { EyeIcon, EyeOff } from "lucide-react";

interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id?: string;
  label?: string;
  required?: boolean;
}

const PasswordInput = forwardRef<HTMLInputElement, CustomInputProps>(
  ({ id, label, className = "", required = false, ...inputProps }, ref) => {
    const [togglePassword,setTogglePassword] = useState<boolean>(true)
    return (
      <div className={`relative z-0 ${className}`}>
        <input
        type={togglePassword?"password":"text"}
          id={id}
          ref={ref} 
          className="block py-2.5 h-[40px] px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-teal-500 focus:outline-none focus:ring-0 focus:border-slate-400 focus:border-b-2 peer"
          placeholder=" "
          {...inputProps}
          autoComplete="off"
        />
        <label
          htmlFor={id}
          className="absolute text-sm text-slate-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-100 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-slate-600 peer-focus:dark:text-teal-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-100 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
        >
          <p>
            {label} {required && <span className="text-red-500">*</span>}
          </p>
        </label>
        <Button type="button" onClick={()=>setTogglePassword(!togglePassword)} className="absolute top-0 right-0 border-none px-[5px] py-[3px] max-h-max hover:bg-transparent bg-transparent" variant={"outline"}>
            {
              togglePassword ? <EyeOff className="t-[15px] h-[15px] text-slate-600"/> : <EyeIcon className="t-[15px] h-[15px] text-slate-600"/>
            }

            </Button>
      </div>
    );
  }
);

// Set the displayName to avoid warnings and errors
PasswordInput.displayName = "CustomInput";

export default PasswordInput;
