import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Typography,
} from "@mui/material";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { BiLoaderAlt } from "react-icons/bi";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { showToast } from "@/utils/toasterContext";
import { Icons } from "@/components/icons";
import { useUser } from "@/hooks/useUser";
import { changePasswordAsync } from "@/features/authentication/authSlice";

const ChangePassword: React.FC = () => {
  const dispatch = useAppDispatch();
  const { clearUser, saveUser,user } = useUser();
  const { changepasswordloading } = useAppSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [errors, setErrors] = useState<any>({});
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev:any) => ({ ...prev, [name]: "" }));
  };

  const togglePasswordVisibility = (field: string) => {
    setShowPasswords((prev:any) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: any = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }

    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required";
    }

    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const payload: any = {
        oldPassword: formData.currentPassword,
        confirmPassword: formData.confirmPassword,
        newPassword: formData.newPassword,
      };
      dispatch(changePasswordAsync(payload)).then((res: any) => {
        if (res.payload.data.success) {
          showToast(res.payload.data.message, "success");
          setIsSuccess(true);
          setFormData({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          });
          if (user) {
            const newuser = {
              ...user,
              other: {
                ...user?.other,
                c_p: true,
              },
            };
            saveUser(newuser);
            window.location.reload();
          }
        }
      });
    } catch (error) {
      setErrors({ submit: "Failed to update password. Please try again." });
    } 
  };

  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => setIsSuccess(false), 3000);
    }
  }, [isSuccess]);

  return (
    <div className="flex justify-center h-[100vh] bg-white relative">
      <div className="absolute top-[30px] right-[20px]">
        <Button
          onClick={() => {
            localStorage.clear();
            clearUser();
            saveUser(null);
            window.location.reload();
          }}
          className="flex items-center gap-[20px] border border-red-500 hover:bg-red-50 shadow-none bg-transparent text-red-500 "
        >
          Logout <Icons.logout />
        </Button>
      </div>
      <div className="w-[650px] h-full py-[50px] px-[20px]">
        <Typography variant="inherit" fontSize={17} gutterBottom>
          MsCorpres Automation
        </Typography>
        <Typography gutterBottom variant="h1" fontWeight={600} fontSize={25}>
          Change Your Password
        </Typography>
        <Typography variant="inherit" fontSize={15} gutterBottom>
          {/* Enter the code that we sent to {user?.crn_email} */}
        </Typography>
        <div className="w-full h-[300px] overflow-hidden flex items-end justify-center bg-teal-100">
          <img src="./ChangePassword.jpg" alt="" className="w-[50%]" />
        </div>
        <div className="flex flex-col gap-[20px] mt-[20px] justify-start items-center">
          {/* Current Password Field */}
          <FormControl fullWidth variant="outlined">
            <OutlinedInput
              value={formData.currentPassword}
              onChange={handleChange}
              name="currentPassword"
              type={showPasswords.current ? "text" : "password"}
              placeholder="Enter current password"
              sx={{
                borderRadius: "15px",
                "& .MuiInputBase-input::placeholder": {
                  fontSize: "16px",
                  fontWeight: "bold",
                  color: "gray",
                },
              }}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => togglePasswordVisibility("current")}
                  >
                    {showPasswords.current ? <FaEyeSlash /> : <FaEye />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>

          {/* New Password Field */}
          <FormControl fullWidth variant="outlined">
            <OutlinedInput
              value={formData.newPassword}
              onChange={handleChange}
              name="newPassword"
              type={showPasswords.new ? "text" : "password"}
              placeholder="Enter new password"
              sx={{
                borderRadius: "15px",
                "& .MuiInputBase-input::placeholder": {
                  fontSize: "16px",
                  fontWeight: "bold",
                  color: "gray",
                },
              }}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton onClick={() => togglePasswordVisibility("new")}>
                    {showPasswords.new ? <FaEyeSlash /> : <FaEye />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>

          {/* Confirm Password Field */}
          <FormControl fullWidth variant="outlined">
            <OutlinedInput
              value={formData.confirmPassword}
              onChange={handleChange}
              name="confirmPassword"
              type={showPasswords.confirm ? "text" : "password"}
              placeholder="Confirm new password"
              sx={{
                borderRadius: "15px",
                "& .MuiInputBase-input::placeholder": {
                  fontSize: "16px",
                  fontWeight: "bold",
                  color: "gray",
                },
              }}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => togglePasswordVisibility("confirm")}
                  >
                    {showPasswords.confirm ? <FaEyeSlash /> : <FaEye />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
          {/* Error Message */}
          {errors.submit && (
            <Typography color="error" variant="body2" sx={{ mt: 2 }}>
              {errors.submit}
            </Typography>
          )}

          {/* Success Message */}
          {isSuccess && (
            <Typography color="success.main" variant="body2" sx={{ mt: 2 }}>
              Password successfully updated!
            </Typography>
          )}

          {/* Submit Button */}
          <Button
            disabled={changepasswordloading}
            onClick={handleSubmit}
            className="w-full rounded-full bg-cyan-500 hover:bg-cyan-600 disabled:bg-neutral-300 disabled:text-slate-400"
          >
            {changepasswordloading ? (
              <BiLoaderAlt className="animate-spin" size={24} />
            ) : (
              "Update Password"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
