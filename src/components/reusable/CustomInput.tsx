import React, { forwardRef } from "react";


interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id?: string;
  label?: string;
  required?: boolean;
}

const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(
  ({ id, label, className = "", required = false, ...inputProps }, ref) => {
    return (
      <div className={`relative z-0 ${className}`}>
        <input
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
      </div>
    );
  }
);

// Set the displayName to avoid warnings and errors
CustomInput.displayName = "CustomInput";

export default CustomInput;
