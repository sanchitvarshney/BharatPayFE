import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Divider from "@mui/material/Divider";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import MuiTooltip from "@/components/reusable/MuiTooltip";
import { Icons } from "@/components/icons";
import { FormControl, InputAdornment, InputLabel, List, ListItem, ListItemIcon, ListItemText, MenuItem, Select, TextField } from "@mui/material";
import MasterVendorDetailTable from "@/table/master/MasterVendorDetailTable";
import FileUploader from "@/components/reusable/FileUploader";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { createVendor, getVendor, uploadFile } from "@/features/master/vendor/vedorSlice";
import { LoadingButton } from "@mui/lab";
import { showToast } from "@/utils/toasterContext";
import { Controller, useForm } from "react-hook-form";
import { Branch, VendorCreatePayload, VendorData } from "@/features/master/vendor/vendorType";
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<unknown>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

type FormDataType = {
  name: string;
  email: string;
  mobile: string;
  fax: string;
  pan: string;
  cin: string;
  gst: string;
  paymenttermsdays: string;
  einvoiceapplicability: "Y" | "N";
  branch: string;
  state: string;
  city: string;
  address: string;
  pincode: string;
  msme_status: "Y" | "N";
  msme_year: string;
  msme_id: string;
  msme_type: string;
  msme_activity: string;
  dateOfApplicability: string;
};

const MasterAddVender: React.FC = () => {
  const dispatch = useAppDispatch();
  const { uploadfileloading, createVendorLoading } = useAppSelector((state) => state.vendor);
  const [open, setOpen] = React.useState(false);
  const [file, setFile] = useState<File[] | null>(null);
  const [files, setFiles] = useState<{ name: string; url: string }[]>([]);
  const [filename, setFilename] = useState<string>("");
  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormDataType>({
    mode: "all",
    defaultValues: {
      name: "",
      email: "",
      mobile: "",
      fax: "",
      pan: "",
      cin: "",
      gst: "",
      paymenttermsdays: "",
      einvoiceapplicability: "N",
      branch: "",
      state: "",
      city: "",
      address: "",
      pincode: "",
      msme_status: "N",
      msme_year: "",
      msme_id: "",
      msme_type: "",
      msme_activity: "",
    },
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  useEffect(() => {
    dispatch(getVendor());
  }, []);
  const onSubmit = (data: FormDataType) => {
    const vendor: VendorData = {
      vendorname: data.name,
      email: data.email,
      panno: data.pan,
      eInvoice: data.einvoiceapplicability,
      term_days: data.paymenttermsdays,
      cinno: data.cin,
      gstin: data.gst,
      mobile: data.mobile,
      state: data.state,
      city: data.city,
      address: data.address,
      pincode: data.pincode,
      files: files.map((file) => file.url),
      documentName: files.map((file) => file.name),
      msme_status: data.msme_status,
      msme_year: data.msme_year,
      msme_id: data.msme_id,
      msme_type: data.msme_type,
      msme_activity: data.msme_activity,
      dateOfApplicability: data.dateOfApplicability,
    };
    const branch: Branch = {
      branch: data.branch,
      state: data.state,
      city: data.city,
      address: data.address,
      pincode: data.pincode,
      mobile: data.mobile,
      gstin: data.gst,
    };
    const payload: VendorCreatePayload = {
      vendor,
      branch,
    };
    dispatch(createVendor(payload)).then((res: any) => {
      if (res.payload.data.success) {
        reset();
        setFiles([]);
      }
    });
  };
  return (
    <>
      <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <AppBar sx={{ position: "relative" }}>
            <Toolbar>
              <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                <CloseIcon />
              </IconButton>
              <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                Add Vendor
              </Typography>
              <LoadingButton loadingPosition="start" loading={createVendorLoading} type="submit" startIcon={<Icons.save />} variant="contained" sx={{ background: "white", color: "black" }} autoFocus color="inherit">
                save
              </LoadingButton>
            </Toolbar>
          </AppBar>
          <div className="sm:p-[20px] md:px-[100px] md:py-[30px] h-[calc(100vh-64px)] overflow-y-auto">
            <div id="primary-item-details" className="flex items-center w-full py-[20px] gap-3">
              <h2 id="primary-item-details" className="text-lg font-semibold">
                Vendor Details
              </h2>
              <Divider sx={{ borderBottomWidth: 2, borderColor: "#d4d4d4", flexGrow: 1 }} />
            </div>

            <div className="grid grid-cols-4 gap-[30px]">
              <div className="col-span-2">
                <TextField
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  {...register("name", { required: "Vendor Name is required" })}
                  fullWidth
                  variant="filled"
                  label="Vendor Name"
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <Icons.user />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </div>
              <div className="col-span-2"></div>

              <Controller
                name="email"
                rules={{
                  required: "Vendor Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                }}
                control={control}
                render={({ field }) => (
                  <TextField
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    {...field}
                    label="Vendor Email"
                    variant="filled"
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <Icons.email />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                )}
              />
              <Controller
                name="mobile"
                control={control}
                rules={{
                  required: "Mobile Number is required",
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: "Invalid mobile number",
                  },
                }}
                render={({ field }) => (
                  <TextField
                    error={!!errors.mobile}
                    helperText={errors.mobile?.message}
                    value={field.value}
                    onChange={(e) => {
                      if (/^-?\d*\.?\d*$/.test(e.target.value)) {
                        field.onChange(e.target.value);
                      }
                    }}
                    label="Mobile Number"
                    variant="filled"
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <Icons.call />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                )}
              />
              <TextField
                {...register("fax")}
                label="Fax Number"
                variant="filled"
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <Icons.fax />
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <div></div>
              <Controller
                name="pan"
                rules={{
                  required: "PAN Number is required",
                  pattern: {
                    value: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
                    message: "Invalid PAN Number",
                  },
                }}
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="PAN Number"
                    error={!!errors.pan}
                    helperText={errors.pan?.message}
                    variant="filled"
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <Icons.idCard />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                )}
              />
              <Controller
                control={control}
                name="cin"
                rules={{
                  required: false,
                  pattern: {
                    value: /^[UL]{1}[0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$/,
                    message: "Invalid CIN Number",
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="CIN  Number"
                    error={!!errors.cin}
                    helperText={errors.cin?.message}
                    variant="filled"
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <Icons.tag />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                )}
              />
              <div></div>
              <TextField
                {...register("paymenttermsdays", { required: "Payment Term is required" })}
                error={!!errors.paymenttermsdays}
                helperText={errors.paymenttermsdays?.message}
                label="Payments Terms (in-days)"
                type="number"
                variant="filled"
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <Icons.date />
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <FormControl fullWidth variant="filled">
                <InputLabel id="demo-simple-select-label">MSME Status</InputLabel>
                <Select {...register("msme_status")} labelId="demo-simple-select-label" id="demo-simple-select" label="MSME Status">
                  <MenuItem value={"Y"}>Yes</MenuItem>
                  <MenuItem value={"N"}>No</MenuItem>
                </Select>
              </FormControl>
              {watch("msme_status") === "Y" && (
                <FormControl fullWidth variant="filled">
                  <InputLabel id="demo-simple-select-label">MSME year</InputLabel>
                  <Select {...register("msme_year")} labelId="demo-simple-select-label" id="demo-simple-select" label="MSME year">
                    <MenuItem value={"20023-2024"}>20023-2024</MenuItem>
                    <MenuItem value={"2024-2025"}>2024-2025</MenuItem>
                  </Select>
                </FormControl>
              )}
              {watch("msme_status") === "Y" && (
                <TextField
                  {...register("msme_id")}
                  label="CIN  Number"
                  variant="filled"
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <Icons.tag />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              )}
              {watch("msme_status") === "Y" && (
                <FormControl fullWidth variant="filled">
                  <InputLabel id="demo-simple-select-label">MSME Type</InputLabel>
                  <Select {...register("msme_type")} labelId="demo-simple-select-label" id="demo-simple-select" label="MSME Type">
                    <MenuItem value={"micro"}>Micro</MenuItem>
                    <MenuItem value={"small"}>Small</MenuItem>
                    <MenuItem value={"medium"}>Medium</MenuItem>
                  </Select>
                </FormControl>
              )}
              {watch("msme_status") === "Y" && (
                <FormControl fullWidth variant="filled">
                  <InputLabel id="demo-simple-select-label">MSME Activity</InputLabel>
                  <Select {...register("msme_activity")} labelId="demo-simple-select-label" id="demo-simple-select" label="MSME Activity">
                    <MenuItem value={"trediing"}>Treding</MenuItem>
                    <MenuItem value={"manufacturing"}>Manufacturing</MenuItem>
                    <MenuItem value={"service"}>Service</MenuItem>
                  </Select>
                </FormControl>
              )}
            </div>
            <div className="flex items-center w-full py-[20px] gap-3 mt-[20px]">
              <h2 className="text-lg font-semibold">GST Details</h2>
              <Divider sx={{ borderBottomWidth: 2, borderColor: "#d4d4d4", flexGrow: 1 }} />
            </div>
            <div className="grid grid-cols-4 gap-[30px]">
              <Controller
                control={control}
                name="gst"
                rules={{
                  required: "GST Number is required",

                  pattern: {
                    value: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[0-9A-Z]{1}$/,
                    message: "Invalid GST Number",
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    error={!!errors.gst}
                    helperText={errors.gst?.message}
                    label="GST Number"
                    variant="filled"
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <Icons.qrcode />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                )}
              />
              <FormControl fullWidth variant="filled">
                <InputLabel id="demo-simple-select-label">E-Invoice Applicability</InputLabel>
                <Select {...register("einvoiceapplicability")} labelId="demo-simple-select-label" id="demo-simple-select" label="E-Invoice Applicability">
                  <MenuItem value={"Y"}>Yes</MenuItem>
                  <MenuItem value={"N"}>No</MenuItem>
                </Select>
              </FormControl>
            </div>
            <div className="flex items-center w-full py-[20px] gap-3 mt-[20px]">
              <h2 className="text-lg font-semibold">Branch Details</h2>
              <Divider sx={{ borderBottomWidth: 2, borderColor: "#d4d4d4", flexGrow: 1 }} />
            </div>
            <div className="grid grid-cols-4 gap-[30px]">
              <TextField
                {...register("branch", { required: "Branch Name is required" })}
                error={!!errors.branch}
                helperText={errors.branch?.message}
                label="Branch Name"
                variant="filled"
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <Icons.branch />
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <TextField
                label="State"
                {...register("state", { required: "State is required" })}
                error={!!errors.state}
                helperText={errors.state?.message}
                variant="filled"
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <Icons.city />
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <TextField
                {...register("city", { required: "City is required" })}
                error={!!errors.city}
                helperText={errors.city?.message}
                label="City"
                variant="filled"
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <Icons.city />
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <TextField
                {...register("pincode", { required: "Pin Code is required" })}
                error={!!errors.pincode}
                helperText={errors.pincode?.message}
                label="Pin Code"
                variant="filled"
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <Icons.tag />
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <div className="col-span-2">
                <TextField {...register("address", { required: "Address is required" })} error={!!errors.address} helperText={errors.address?.message} fullWidth multiline rows={3} label="Complete Address" placeholder="use line break for next line" variant="filled" />
              </div>
            </div>
            <div className="flex items-center w-full py-[20px] gap-3 mt-[20px]">
              <h2 className="text-lg font-semibold">Upload Document</h2>
              <Divider sx={{ borderBottomWidth: 2, borderColor: "#d4d4d4", flexGrow: 1 }} />
            </div>
            <div className="grid grid-cols-2 gap-[30px]">
              <div className="flex flex-col gap-[20px]">
                <TextField
                  fullWidth
                  value={filename}
                  label="Document Name"
                  onChange={(e) => setFilename(e.target.value)}
                  variant="filled"
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <Icons.attachment />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
                <FileUploader value={file} onFileChange={setFile} />
                <LoadingButton
                  loadingPosition="start"
                  loading={uploadfileloading}
                  onClick={() => {
                    if (file) {
                      const formdata = new FormData();
                      formdata.append("file", file[0]);
                      dispatch(uploadFile(formdata)).then((res: any) => {
                        if (res.payload.data.success) {
                          files.push({ name: filename, url: res.payload.data.data.name });
                          setFile(null);
                          setFilename("");
                        }
                      });
                    } else {
                      showToast("Upload File", "error");
                    }
                  }}
                  startIcon={<Icons.uploadfile />}
                  variant="contained"
                  className="max-w-max "
                >
                  Upload
                </LoadingButton>
              </div>
              <div>
                <List>
                  {files.map((file, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <Icons.attachment />
                      </ListItemIcon>
                      <ListItemText primary={file.name} secondary={file.url} />
                    </ListItem>
                  ))}
                </List>
              </div>
            </div>
          </div>
        </form>
      </Dialog>
      <div className="h-full bg-white">
        <div className="h-[90px] flex items-center px-[20px] justify-between">
          <div className="flex items-center gap-[10px]">
            <Typography variant="h2" fontSize={20} fontWeight={500}>
              Vendor / Suppliers
            </Typography>
            <MuiTooltip title="Vendor / Suppliers" placement="right">
              <Icons.outlineinfo className="text-cyan-700" />
            </MuiTooltip>
          </div>
          <Button variant="contained" startIcon={<Icons.add />} onClick={handleClickOpen}>
            Add New Vendor
          </Button>
        </div>

        <MasterVendorDetailTable />
      </div>
    </>
  );
};

export default MasterAddVender;
