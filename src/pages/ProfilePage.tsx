import { Button, Divider, FormControl, IconButton, Input, InputAdornment, InputLabel, ListItem, Switch, TextField, Typography } from "@mui/material";
import React from "react";
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
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useUser } from "@/hooks/useUser";
const ProfilePage: React.FC = () => {
  const { user } = useUser();
  const [tab, setTab] = React.useState("P");
  const [editFullName, setEditFullName] = React.useState(false);
  const [editEmail, setEditEmail] = React.useState(false);
  const [editPhone, setEditPhone] = React.useState(false);
  const [changePassword, setChangePassword] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <>
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
        open={editEmail}
        onClose={() => setEditEmail(false)}
        PaperProps={{
          component: "form",
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            // const formData = new FormData(event.currentTarget);
            // const formJson = Object.fromEntries((formData as any).entries());
          },
        }}
      >
        <DialogTitle>Update Email</DialogTitle>
        <DialogContent>
          <DialogContentText>Please enter your new email address to update your contact information. We’ll use this email to send you important updates.</DialogContentText>
          <TextField autoFocus required margin="dense" id="email" name="email" label="Email" type="email" fullWidth variant="standard" />
        </DialogContent>
        <DialogActions>
          <Button startIcon={<CloseIcon fontSize="small" />} variant="contained" sx={{ background: "white", color: "red" }} onClick={() => setEditEmail(false)}>
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
      <Dialog
        open={changePassword}
        onClose={() => setChangePassword(false)}
        PaperProps={{
          component: "form",
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            // const formData = new FormData(event.currentTarget);
            // const formJson = Object.fromEntries((formData as any).entries());
          },
        }}
      >
        <DialogTitle>Reset Password</DialogTitle>
        <DialogContent>
          <DialogContentText>Update your password to keep your account secure. Use a combination of letters, numbers, and special characters for better protection.</DialogContentText>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid size={6}>
              <TextField size="small" autoFocus required margin="dense" id="Cpassword" name="Cpassword" label="Current Password" type="text" fullWidth variant="standard" />
            </Grid>
            <Grid size={6}>
              <FormControl size="small" required sx={{ width: "100%" }} variant="standard">
                <InputLabel htmlFor="standard-adornment-password">New Password</InputLabel>
                <Input
                  id="standard-adornment-password"
                  type={showPassword ? "text" : "password"}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton aria-label={showPassword ? "hide the password" : "display the password"} onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword} onMouseUp={handleMouseUpPassword}>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
            </Grid>
            <Grid size={6}>
              <TextField size="small" autoFocus required margin="dense" id="Copassword" name="Copassword" label="Confirm Password" type="text" fullWidth variant="standard" />
            </Grid>
            <Grid size={6}>
              <TextField size="small" autoFocus required margin="dense" id="2stepVCode" name="2stepVCode" label="Enter 2 Step Verification Code" type="text" fullWidth variant="standard" />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button startIcon={<CloseIcon fontSize="small" />} variant="contained" sx={{ background: "white", color: "red" }} onClick={() => setChangePassword(false)}>
            Cancel
          </Button>
          <Button startIcon={<SystemUpdateAltIcon fontSize="small" />} variant="contained" type="submit">
            Reset
          </Button>
        </DialogActions>
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
                  Basic info, like your name and phone number, that you use on HRMS Platform.
                </Typography>
                <div className="mt-[50px]">
                  {/* <Typography variant="h3" fontSize={"18px"} fontWeight={500}>
                      Basic Information
                    </Typography> */}
                  {/* <Divider /> */}
                  <List sx={{ width: "100%", bgcolor: "background.paper" }}>
                    <ListItem
                      sx={{ ":hover": { backgroundColor: "#f5f5f5" }, paddingX: "20px" }}
                      secondaryAction={
                        <IconButton onClick={() => setEditFullName(true)}>
                          <CreateIcon />
                        </IconButton>
                      }
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
                      secondaryAction={
                        <IconButton onClick={() => setEditPhone(true)} aria-label="comment">
                          <CreateIcon />
                        </IconButton>
                      }
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

                    <ListItem sx={{ ":hover": { backgroundColor: "#f5f5f5" }, paddingX: "20px" }}>
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
                    </ListItem>
                   
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
