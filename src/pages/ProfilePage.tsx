import { Button, Divider, IconButton, InputAdornment, LinearProgress, ListItem, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import Grid from "@mui/material/Grid2";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import PersonIcon from "@mui/icons-material/Person";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import SecurityIcon from "@mui/icons-material/Security";
import CreateIcon from "@mui/icons-material/Create";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import SystemUpdateAltIcon from "@mui/icons-material/SystemUpdateAlt";
import CloseIcon from "@mui/icons-material/Close";

import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUser } from "@/hooks/useUser";
import { Icons } from "@/components/icons";
import { CheckCircle } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { PasswordChangePayload } from "@/features/authentication/authType";
import { changePasswordAsync } from "@/features/authentication/authSlice";
import { showToast } from "@/utils/toasterContext";
import UpadteEmail from "@/components/featureModels/UpdateEmail";

const schema = z
  .object({
    oldPassword: z.string().min(1, "Old password is required"), // Old password must be filled
    password: z.string().min(8, "Password must be at least 8 characters long"),
    confirmPassword: z.string().min(1, "password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // This highlights confirmPassword in case of an error
  });
type FormValues = z.infer<typeof schema>;

const ProfilePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { changepasswordloading } = useAppSelector((state) => state.auth);
  const { user } = useUser();
  const [tab, setTab] = React.useState("P");
  const [editFullName, setEditFullName] = React.useState(false);
  const [editEmail, setEditEmail] = React.useState(false);
  const [editPhone, setEditPhone] = React.useState(false);
  const [changePassword, setChangePassword] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState<boolean>(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    label: "",
  });
  const [passwordChecks, setPasswordChecks] = useState({
    hasUpperCase: false,
    hasNumber: false,
    hasSpecialChar: false,
    isValidLength: false,
  });
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      oldPassword: "",
      password: "",
      confirmPassword: "",
    },
  });

  const checkPasswordStrength = (password: string) => {
    const checks = {
      hasUpperCase: /[A-Z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[^a-zA-Z0-9]/.test(password),
      isValidLength: password.length >= 8 && password.length <= 16,
    };

    const score = Object.values(checks).filter((check) => check).length;

    setPasswordChecks(checks);

    let label = "";
    if (score <= 2) label = "Weak";
    else if (score === 3) label = "Medium";
    else label = "Strong";

    setPasswordStrength({ score, label });
  };

  const onSubmit = (data: FormValues) => {
    const payload: PasswordChangePayload = {
      oldPassword: data.oldPassword,
      newPassword: data.password,
      confirmPassword: data.confirmPassword,
      userId: user?.crn_id || "",
    };
    if (data.oldPassword === data.password) {
      showToast("New password cannot be same as old password", "error");
    } else {
      dispatch(changePasswordAsync(payload)).then((res: any) => {
        if (res.payload?.data?.success) {
          setChangePassword(false);
          reset();
        }
      });
    }
  };

  return (
    <>
    <UpadteEmail open={editEmail} handleClose={() => setEditEmail(false)}/>
      <Dialog
        open={editFullName}
        onClose={() => setEditFullName(false)}
        PaperProps={{
          component: "form",
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            // const formData = new FormData(event.currentTarget);
            // const formJson = Object.fromEntries((formData as any).entries());
          },
        }}
      >
        <DialogTitle>Update Name</DialogTitle>
        <DialogContent>
          <DialogContentText>Please enter your new name below. This will be displayed on your profile.</DialogContentText>
          <TextField autoFocus required margin="dense" id="name" name="name" label="Name" type="text" fullWidth variant="standard" />
        </DialogContent>
        <DialogActions>
          <Button startIcon={<CloseIcon fontSize="small" />} variant="contained" sx={{ background: "white", color: "red" }} onClick={() => setEditFullName(false)}>
            Cancel
          </Button>
          <Button startIcon={<SystemUpdateAltIcon fontSize="small" />} variant="contained" type="submit">
            Update
          </Button>
        </DialogActions>
      </Dialog>
      
      <Dialog
        open={editPhone}
        onClose={() => setEditPhone(false)}
        PaperProps={{
          component: "form",
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
          },
        }}
      >
        <DialogTitle>Update Phone No.</DialogTitle>
        <DialogContent>
          <DialogContentText>Please enter your new phone number to keep your contact information up to date. We’ll use this to reach you if needed.</DialogContentText>
          <TextField autoFocus required margin="dense" id="phone" name="phone" label="Phone No." type="text" fullWidth variant="standard" />
        </DialogContent>
        <DialogActions>
          <Button startIcon={<CloseIcon fontSize="small" />} variant="contained" sx={{ background: "white", color: "red" }} onClick={() => setEditPhone(false)}>
            Cancel
          </Button>
          <Button startIcon={<SystemUpdateAltIcon fontSize="small" />} variant="contained" type="submit">
            Update
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog maxWidth="lg" open={changePassword} onClose={() => setChangePassword(false)}>
        <div className="absolute top-0 left-0 right-0">{changepasswordloading && <LinearProgress />}</div>
        <div className="flex items-center justify-between w-full pr-[20px]">
          <DialogTitle>Reset Password</DialogTitle>
          <IconButton
            onClick={() => {
              setChangePassword(false);
              reset();
            }}
          >
            <Icons.close />
          </IconButton>
        </div>
        <Divider />
        <DialogContent className="min-w-[700px]">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2">
              <div className="flex flex-col gap-[20px] px-[20px]">
                <TextField
                  {...register("oldPassword")}
                  error={!!errors.oldPassword}
                  helperText={errors.oldPassword?.message}
                  margin="dense"
                  label="Current Password"
                  type="text"
                  fullWidth
                  variant="filled"
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <Icons.code fontSize="small" />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      value={field.value}
                      onChange={(e) => {
                        checkPasswordStrength(e.target.value);
                        field.onChange(e);
                      }}
                      slotProps={{
                        input: {
                          endAdornment: (
                            <InputAdornment position="end">
                              {showPassword ? (
                                <IconButton onClick={() => setShowPassword(false)} size="small">
                                  <Icons.visible fontSize="small" />
                                </IconButton>
                              ) : (
                                <IconButton size="small" onClick={() => setShowPassword(true)}>
                                  <Icons.invisible fontSize="small" />
                                </IconButton>
                              )}
                            </InputAdornment>
                          ),
                        },
                      }}
                      error={!!errors.password}
                      helperText={errors.password?.message}
                      margin="dense"
                      label="New Password"
                      type={showPassword ? "text" : "password"}
                      fullWidth
                      variant="filled"
                    />
                  )}
                />
                <TextField
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          {showConfirmPassword ? (
                            <IconButton onClick={() => setShowConfirmPassword(false)} size="small">
                              <Icons.visible fontSize="small" />
                            </IconButton>
                          ) : (
                            <IconButton size="small" onClick={() => setShowConfirmPassword(true)}>
                              <Icons.invisible fontSize="small" />
                            </IconButton>
                          )}
                        </InputAdornment>
                      ),
                    },
                  }}
                  {...register("confirmPassword")}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message}
                  margin="dense"
                  label="Confirm Password"
                  type={showConfirmPassword ? "text" : "password"}
                  fullWidth
                  variant="filled"
                />
                <Button disabled={changepasswordloading} variant="contained" type="submit">
                  Update
                </Button>
              </div>

              <div className="px-[20px] border-l border-gray-200 min-w-[400px]">
                <Typography gutterBottom variant="h3" fontWeight={600} fontSize={20}>
                  Password Requirements
                </Typography>

                <ul className="space-y-5 text-lg text-gray-600">
                  <li className={`flex items-center ${passwordChecks.hasUpperCase ? "text-green-600" : "text-gray-500"}`}>
                    {passwordChecks.hasUpperCase ? <CheckCircle className="w-8 h-8 mr-4 text-green-600" /> : <div className="w-8 h-8 mr-4 text-gray-500" />}
                    <span>At least one uppercase letter</span>
                  </li>
                  <li className={`flex items-center ${passwordChecks.hasNumber ? "text-green-600" : "text-gray-500"}`}>
                    {passwordChecks.hasNumber ? <CheckCircle className="w-8 h-8 mr-4 text-green-600" /> : <div className="w-8 h-8 mr-4 text-gray-500" />}
                    <span>At least one number</span>
                  </li>
                  <li className={`flex items-center ${passwordChecks.hasSpecialChar ? "text-green-600" : "text-gray-500"}`}>
                    {passwordChecks.hasSpecialChar ? <CheckCircle className="w-8 h-8 mr-4 text-green-600" /> : <div className="w-8 h-8 mr-4 text-gray-500" />}
                    <span>At least one special character</span>
                  </li>
                  <li className={`flex items-center ${passwordChecks.isValidLength ? "text-green-600" : "text-gray-500"}`}>
                    {passwordChecks.isValidLength ? <CheckCircle className="w-8 h-8 mr-4 text-green-600" /> : <div className="w-8 h-8 mr-4 text-gray-500" />}
                    <span>8-16 characters in length</span>
                  </li>
                </ul>
                <div className="mt-8">
                  <Typography variant="h4" fontWeight={600} fontSize={18}>
                    Password Strength:
                  </Typography>
                  <div className="w-full h-3 mt-2 bg-gray-200 rounded-full">
                    <div className={`h-3 rounded-full ${passwordStrength.label === "Strong" ? "bg-green-600" : passwordStrength.label === "Medium" ? "bg-yellow-600" : "bg-red-600"}`} style={{ width: `${passwordStrength.score * 25}%` }} />
                  </div>
                  <Typography gutterBottom fontWeight={600}>
                    <span className={`${passwordStrength.label === "Strong" ? "text-green-600" : passwordStrength.label === "Medium" ? "text-yellow-600" : "text-red-600"}`}>{passwordStrength.label}</span>
                  </Typography>
                </div>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <div className="h-full bg-white">
        <Grid container spacing={2} sx={{ height: "calc(100vh - 50px)" }}>
          <Grid size={3} sx={{ borderRight: "1px solid #c5c5c5" }}>
            <div className="flex items-center justify-center py-[20px] flex-col gap-[5px]">
              <Avatar className="h-[70px] w-[70px]">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <Typography variant="h5">{user?.username}</Typography>
              <div className="w-full px-[20px] mt-[20px]">
                <div className="flex items-center justify-between">
                  <Typography fontWeight={500}>Department</Typography>
                  <Typography>{user?.department}</Typography>
                </div>
                <div className="flex items-center justify-between">
                  <Typography fontWeight={500}>Phone No:</Typography>
                  <Typography>{user?.crn_mobile}</Typography>
                </div>
                <div className="flex items-center justify-between">
                  <Typography fontWeight={500}>Email</Typography>
                  <Typography>{user?.crn_email}</Typography>
                </div>
              </div>
            </div>
            <Divider />
            <Box sx={{ width: "100%", bgcolor: "background.paper" }}>
              <List component="nav" aria-label="main mailbox folders">
                <ListItemButton
                  selected={tab === "P"}
                  onClick={() => {
                    setTab("P");
                  }}
                >
                  <ListItemIcon>
                    <PersonIcon />
                  </ListItemIcon>
                  <ListItemText primary="Personal Information" />
                  <ListItemIcon sx={{ minWidth: "30px" }}>
                    <KeyboardArrowRightIcon />
                  </ListItemIcon>
                </ListItemButton>
                <ListItemButton
                  selected={tab === "S"}
                  onClick={() => {
                    setTab("S");
                  }}
                >
                  <ListItemIcon>
                    <SecurityIcon />
                  </ListItemIcon>
                  <ListItemText primary="Security Setting" />
                  <ListItemIcon sx={{ minWidth: "30px" }}>
                    <KeyboardArrowRightIcon />
                  </ListItemIcon>
                </ListItemButton>
              </List>
            </Box>
          </Grid>
          <Grid size={9} sx={{ height: "100%", overflowY: "auto", widht: "100%", paddingY: "20px" }}>
            {tab === "P" && (
              <div className="p-[30px]">
                <Typography variant="h1" fontSize={"25px"} fontWeight={500}>
                  Personal Information
                </Typography>
                <Typography variant="h2" fontSize={"15px"}>
                  Basic info, like your name and phone number, that you use on BharatPay Platform.
                </Typography>
                <div className="mt-[50px]">
                  {/* <Typography variant="h3" fontSize={"18px"} fontWeight={500}>
                      Basic Information
                    </Typography> */}
                  {/* <Divider /> */}
                  <List sx={{ width: "100%", bgcolor: "background.paper" }}>
                    <ListItem
                      sx={{ ":hover": { backgroundColor: "#f5f5f5" }, paddingX: "20px" }}
                      // secondaryAction={
                      //   <IconButton onClick={() => setEditFullName(true)}>
                      //     <CreateIcon />
                      //   </IconButton>
                      // }
                    >
                      <ListItemText
                        primary={
                          <Typography variant="h4" fontSize={"17px"}>
                            Name
                          </Typography>
                        }
                        secondary={user?.username}
                      />
                    </ListItem>

                    <ListItem
                      sx={{ ":hover": { backgroundColor: "#f5f5f5" }, paddingX: "20px" }}
                      secondaryAction={
                        <IconButton onClick={() => setEditEmail(true)} aria-label="comment">
                          <CreateIcon />
                        </IconButton>
                      }
                    >
                      <ListItemText
                        primary={
                          <Typography variant="h4" fontSize={"17px"}>
                            Email
                          </Typography>
                        }
                        secondary={user?.crn_email}
                      />
                    </ListItem>

                    <ListItem
                      sx={{ ":hover": { backgroundColor: "#f5f5f5" }, paddingX: "20px" }}
                      // secondaryAction={
                      //   <IconButton onClick={() => setEditPhone(true)} aria-label="comment">
                      //     <CreateIcon />
                      //   </IconButton>
                      // }
                    >
                      <ListItemText
                        primary={
                          <Typography variant="h4" fontSize={"17px"}>
                            Phone Number
                          </Typography>
                        }
                        secondary={user?.crn_mobile}
                      />
                      {editPhone && <TextField value={user?.crn_mobile} label="Update Mobile No." />}
                    </ListItem>
                  </List>
                  {/* <Typography sx={{ mt: 3 }} variant="h3" fontSize={"18px"} fontWeight={500}>
                      Preferences
                    </Typography>
                    <Divider />
                    <List sx={{ width: "100%", bgcolor: "background.paper" }}>
                      <ListItem
                        sx={{ ":hover": { backgroundColor: "#f5f5f5" }, paddingX: "20px" }}
                        secondaryAction={
                          <IconButton aria-label="comment">
                            <CreateIcon />
                          </IconButton>
                        }
                      >
                        <ListItemText
                          primary={
                            <Typography variant="h4" fontSize={"17px"}>
                              Language
                            </Typography>
                          }
                          secondary="
English (United State)"
                        />
                      </ListItem>
                      <ListItem
                        sx={{ ":hover": { backgroundColor: "#f5f5f5" }, paddingX: "20px" }}
                        secondaryAction={
                          <IconButton aria-label="comment">
                            <CreateIcon />
                          </IconButton>
                        }
                      >
                        <ListItemText
                          primary={
                            <Typography variant="h4" fontSize={"17px"}>
                              Date Format
                            </Typography>
                          }
                          secondary="DD/MM/YYYY"
                        />
                      </ListItem>

                      <ListItem
                        sx={{ ":hover": { backgroundColor: "#f5f5f5" }, paddingX: "20px" }}
                        secondaryAction={
                          <IconButton aria-label="comment">
                            <CreateIcon />
                          </IconButton>
                        }
                      >
                        <ListItemText
                          primary={
                            <Typography variant="h4" fontSize={"17px"}>
                              Timezone
                            </Typography>
                          }
                          secondary="Bangladesh (GMT +6)"
                        />
                      </ListItem>
                    </List> */}
                </div>
              </div>
            )}
            {tab === "S" && (
              <div className="p-[30px]">
                <Typography variant="h1" fontSize={"25px"} fontWeight={500}>
                  Security Settings
                </Typography>
                <Typography variant="h2" fontSize={"15px"}>
                  These settings are helps you keep your account secure.
                </Typography>
                <div className="mt-[50px]">
                  <List sx={{ width: "100%", bgcolor: "background.paper" }}>
                    <ListItem
                      sx={{ ":hover": { backgroundColor: "#f5f5f5" }, paddingX: "20px" }}
                      secondaryAction={
                        <IconButton onClick={() => setChangePassword(true)} aria-label="comment">
                          <CreateIcon />
                        </IconButton>
                      }
                    >
                      <ListItemText
                        primary={
                          <Typography variant="h4" fontSize={"17px"}>
                            Reset Password
                          </Typography>
                        }
                        secondary="Set a unique password to protect your account."
                      />
                    </ListItem>

                    {/* <ListItem sx={{ ":hover": { backgroundColor: "#f5f5f5" }, paddingX: "20px" }}>
                      <ListItemText
                        primary={
                          <Typography variant="h4" fontSize={"17px"}>
                            2 Factor Auth
                          </Typography>
                        }
                        secondary="Secure your account with 2FA security. When it is activated you will need to enter not only your password, but also a special code using app. You can receive this code by in mobile app."
                      />
                      <Switch
                        edge="end"
                        inputProps={{
                          "aria-labelledby": "switch-list-label-wifi",
                        }}
                      />
                    </ListItem> */}
                  </List>
                </div>
              </div>
            )}
          </Grid>
        </Grid>
      </div>
    </>
  );
};

export default ProfilePage;
