import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { Skeleton } from "@/components/ui/skeleton";
import { approveDeviceRequest, clearItemdetail, getItemDetailsAsync, getPendingMaterialListsync, getProcessMrReqeustAsync, materialRequestReject } from "@/features/wearhouse/MaterialApproval/MrApprovalSlice";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import Grid from "@mui/material/Grid2";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import PlaceIcon from "@mui/icons-material/Place";
import InsertInvitationIcon from "@mui/icons-material/InsertInvitation";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ContactEmergencyIcon from "@mui/icons-material/ContactEmergency";
import AppsIcon from "@mui/icons-material/Apps";
import Dialog from "@mui/material/Dialog";
import { Avatar, Button, Chip, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, FormControlLabel, InputAdornment, InputLabel, ListItem, ListItemAvatar, OutlinedInput, Radio, RadioGroup, TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import SelectLocation, { LocationType } from "@/components/reusable/SelectLocation";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import { showToast } from "@/utils/toasterContext";
import DeleteIcon from "@mui/icons-material/Delete";
import DoneIcon from "@mui/icons-material/Done";
import { ProcessRequestDataBody } from "@/features/wearhouse/MaterialApproval/MrApprovalType";
type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  alert: boolean;
  setAlert: React.Dispatch<React.SetStateAction<boolean>>;
  approved: string[] | null;
  setApproved: React.Dispatch<React.SetStateAction<string[] | null>>;
};
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<unknown>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

type Forstate = {
  picLocation: LocationType | null;
  issueQty: string;
  remarks: string;
};
const MaterialRequestDeviceApprovalDrawer: React.FC<Props> = ({ open, setOpen, approved, setApproved }) => {
  const [itemkey, setItemKey] = useState<string>("");
  const { processMrRequestLoading, processRequestData, requestDetail, itemDetail, itemDetailLoading, approveItemLoading, rejectItemLoading } = useAppSelector((state) => state.pendingMr);
  const [scanned, setScanned] = useState<string[] | null>(null);
  const [input, setInput] = useState<string>("");
  const [isueeQty, setIsueeQty] = useState<string>("");
  const [confirmIssueChange, setConfirmIssueChange] = useState<boolean>(false);
  const [remarks, setRemarks] = useState<string>("");
  const dispatch = useAppDispatch();
  const [data, setData] = useState<ProcessRequestDataBody[] | null>(null);

  const [selectedValue, setSelectedValue] = useState<string | null>(null);

  const handleChange = (value: string) => {
    setSelectedValue(value);
    setItemKey(value);
  };

  const handleClose = () => {
    setOpen(false);
    dispatch(getPendingMaterialListsync());
    setSelectedValue(null);
    setRemarks("");
    setIsueeQty("");
    setItemKey("");
    setScanned(null);
    setInput("");
  };
  const {
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<Forstate>({
    defaultValues: {
      picLocation: null,
      issueQty: "",
      remarks: "",
    },
  });
  const onSubmit: SubmitHandler<Forstate> = (data) => {
    dispatch(
      approveDeviceRequest({
        itemCode: itemkey,
        pickLocation: data.picLocation!.id,
        issueQty: data.issueQty,
        txnID: requestDetail?.id || "",
        srlNumber: scanned || [],
      })
    ).then((response: any) => {
      if (response.payload.data?.success) {
        dispatch(clearItemdetail());
        setItemKey("");
        reset();
        approved ? setApproved([...approved, itemkey]) : setApproved([itemkey]);
        setScanned(null);
        setIsueeQty("");
        setSelectedValue(null);
      }
    });
  };

  useEffect(() => {
    if (!open) {
      setScanned(null);
      setItemKey("");
      reset();
      setIsueeQty("");
      setRemarks("");
    }
  }, [open]);
  useEffect(() => {
    dispatch(clearItemdetail());
    setScanned(null);
    reset();
    setIsueeQty("");
    setRemarks("");
  }, [selectedValue]);
  useEffect(() => {
    if (processRequestData) {
      setData(processRequestData.body);
    }else{
      setData(null)
    }
  }, [processRequestData]);
  return (
    <>
      {/*confirm isuee change =======================================================  */}

      <Dialog open={confirmIssueChange} onClose={() => setConfirmIssueChange(false)}>
        <DialogTitle>Are you absolutely sure?</DialogTitle>
        <DialogContent>
          <DialogContentText>If you change the issue quantity, Then your all scanned data will be cleared.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmIssueChange(false)}>No</Button>
          <LoadingButton
            onClick={() => {
              setConfirmIssueChange(false);
              setIsueeQty("");
              setValue("issueQty", "");
              setScanned(null);
            }}
            type="submit"
            variant="contained"
            color="error"
          >
            Yes
          </LoadingButton>
        </DialogActions>
      </Dialog>
   
      <Dialog
        fullScreen
        open={open}
        onClose={() => {
          setOpen(false);
          dispatch(getPendingMaterialListsync());
        }}
        TransitionComponent={Transition}
      >
        <div className="h-[50px] flex items-center  px-[20px] bg-neutral-200  shadow border-b border-neutral-300">
          <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Device Process Request
          </Typography>
        </div>

        <Grid container sx={{ height: "calc(100vh-50px)", flexDirection: "row", flex: 1, overflowY: "auto", width: "100%" }}>
          <Grid size={3} sx={{ borderRight: "1px solid #d4d4d4",position:"relative" }} >
            <div className="h-[50px] flex items-center px-[10px] bg-cyan-50 border-b">
            <Chip label="1" sx={{mr:2}} />
              <Typography variant="h5" fontSize={18} fontWeight={500}>
                Requested Details
              </Typography>
            </div>
            <List sx={{ width: "100%", bgcolor: "background.paper" }}>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <AccountTreeIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary="BOM" secondary={processMrRequestLoading ? <Skeleton className="w-full h-[20px]" /> : processRequestData?.head?.bomName} />
              </ListItem>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <PlaceIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary="Req. Location:" secondary={processMrRequestLoading ? <Skeleton className="w-full h-[20px]" /> : processRequestData?.head?.locationName} />
              </ListItem>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <AppsIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary="MFG Qty:" secondary={processMrRequestLoading ? <Skeleton className="w-full h-[20px]" /> : processRequestData?.head?.mfgQty} />
              </ListItem>
            </List>
         
           <div className="absolute bottom-0 left-0 right-0 ">
           <Divider />
           <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }} >
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <ContactEmergencyIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary="Request ID" secondary={requestDetail?.id} />
              </ListItem>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <AccountCircleIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary="Requested By" secondary={requestDetail?.name} />
              </ListItem>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <InsertInvitationIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary="Request Date" secondary={requestDetail?.requestDate} />
              </ListItem>
            </List>
           </div>
          </Grid>

          <Grid size={4} sx={{ borderRight: "1px solid #d4d4d4" }}>
            <div className="h-[50px] flex items-center px-[10px] bg-cyan-50 border-b">
            <Chip label="2" sx={{mr:2}} />
              <Typography variant="h5" fontSize={18} fontWeight={500}>
                Requested Items
              </Typography>
            </div>
            <FormControl fullWidth sx={{ p: 2 }}>
              <OutlinedInput
                onChange={(e) => {
                  if (processRequestData) {
                    setData(processRequestData.body.filter((item) => item.partName.toLowerCase().includes(e.target.value.toLowerCase()) || item.partCode.toLowerCase().includes(e.target.value.toLowerCase())));
                  }
                }}
                placeholder="Search..."
                endAdornment={
                  <InputAdornment position="end">
                    {" "}
                    <FilterAltIcon />
                  </InputAdornment>
                }
              />
            </FormControl>
            {processMrRequestLoading ? (
              <ul className="flex flex-col gap-[10px]">
                <li>
                  <Skeleton className="h-[50px] w-full" />
                </li>
                <li>
                  <Skeleton className="h-[50px] w-full" />
                </li>
                <li>
                  <Skeleton className="h-[50px] w-full" />
                </li>
              </ul>
            ) : (
              <RadioGroup value={selectedValue}>
                <List className=" h-[calc(100vh-185px)] overflow-y-auto">
                  {data &&
                    data.map((item, index) => (
                      <ListItemButton
                        disabled={approved?.includes(item?.partKey)}
                        key={index}
                        onClick={() => handleChange(item.partKey)}
                        selected={selectedValue === item.partKey}
                        sx={{
                          backgroundColor: selectedValue === item.partKey ? "lightblue" : "inherit",
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <FormControlLabel value={item?.partKey} control={<Radio />} label={<ListItemText primary={item?.partCode} secondary={item?.partName} />} sx={{ width: "100%", margin: 0 }} />
                        {approved?.includes(item?.partKey) ? (
                          <Chip size="small" label="Approved" color="success" icon={<CheckCircleOutlineIcon fontSize="small" />} />
                        ) : (
                          <Chip size="small" sx={{ background: "#d97706" }} label="Pending" color="info" icon={<AccessTimeIcon fontSize="small" />} />
                        )}
                      </ListItemButton>
                    ))}
                </List>
              </RadioGroup>
            )}
          </Grid>

          <Grid size={5}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="h-[50px] flex items-center px-[10px] bg-cyan-50 border-b">
              <Chip label="3" sx={{mr:2}} />
                <Typography variant="h5" fontSize={18} fontWeight={500}>
                   Transferring Details
                </Typography>
              </div>
              <div className="h-[calc(100vh-100px)]  ">
                {!selectedValue && (
                  <div className="flex items-center justify-center w-full h-[calc(100vh-100px)] ">
                    <img src="/select.svg" alt="" className="opacity-30 w-[150px]" />
                  </div>
                )}

                {selectedValue && (
                  <>
                    <List sx={{ width: "100%", bgcolor: "background.paper", display: "flex", height: "85px" }}>
                      <ListItem>
                        <ListItemText primary="Available Qty" secondary={itemDetailLoading ? <Skeleton className="w-full h-[20px]" /> : itemDetail ? itemDetail[0]?.stock : "--"} />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="Requested Qty" secondary={itemDetailLoading ? <Skeleton className="w-full h-[20px]" /> : itemDetail ? itemDetail[0]?.reqQty : "--"} />
                      </ListItem>
                    </List>
                    <Grid container spacing={2} sx={{ p: 2 }}>
                      <Grid size={6}>
                        <Controller
                          name="picLocation"
                          control={control}
                          rules={{ required: "Pic Location is required" }}
                          render={({ field }) => (
                            <SelectLocation
                              value={field.value}
                              onChange={(e) => {
                                field.onChange(e);
                                dispatch(getItemDetailsAsync({ txnid: requestDetail?.id || "", itemKey: itemkey, picLocation: e?.id || "" }));
                              }}
                              error={!!errors.picLocation}
                              label="Pick Location"
                            />
                          )}
                        />
                      </Grid>
                      <Grid size={6}>
                        <Controller
                          name="issueQty"
                          control={control}
                          rules={{ required: "Issue Qty is required" }}
                          render={({ field }) => (
                            <FormControl disabled={!itemDetail || itemDetail[0]?.stock < 1 || itemDetail[0]?.reqQty < 1} fullWidth>
                              <InputLabel>Issue Qty</InputLabel>
                              <OutlinedInput
                                disabled={!itemDetail || itemDetail[0]?.stock < 1 || itemDetail[0]?.reqQty < 1}
                                fullWidth
                                error={!!errors.issueQty}
                                {...field}
                                value={field.value}
                                type="number"
                                label="Issue Qty"
                                onChange={(e) => {
                                  if (!/^[0-9]*$/.test(e.target.value)) return;
                                  if (itemDetail) {
                                    if (parseInt(e.target.value) > itemDetail[0]?.stock || parseInt(e.target.value) > itemDetail[0]?.reqQty) {
                                      showToast("Issue Qty can't be greater than Available Qty or Requested Qty", "error");
                                    } else {
                                      if (scanned && scanned?.length > 0) {
                                        setConfirmIssueChange(true);
                                      } else {
                                        field.onChange(e);
                                        setIsueeQty(e.target.value);
                                      }
                                    }
                                  }
                                }}
                              />
                            </FormControl>
                          )}
                        />
                      </Grid>
                      <Grid size={12}>
                        <Controller
                          name="remarks"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              label="Remark"
                              fullWidth
                              {...field}
                              multiline
                              rows={1}
                              value={field.value}
                              onChange={(e) => {
                                field.onChange(e);
                                setRemarks(e.target.value);
                              }}
                            />
                          )}
                        />
                      </Grid>
                    </Grid>

                    <div className="px-[20px] h-[60px] flex items-center justify-center">
                      <FormControl fullWidth>
                        <OutlinedInput
                          value={input}
                          disabled={!isueeQty || Number(isueeQty) === scanned?.length}
                          endAdornment={
                            <InputAdornment position="end">
                              <QrCodeScannerIcon />
                            </InputAdornment>
                          }
                          placeholder="Scan items"
                          fullWidth
                          onChange={(e) => setInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              if (input) {
                                if (scanned && scanned.includes(input)) {
                                  showToast("Product already scanned", "error");
                                } else {
                                  if (scanned && scanned.length + 1 > parseInt(isueeQty)) {
                                    showToast("Scanned Items can't be greater than Issue Qty", "error");
                                  } else {
                                    scanned ? setScanned([input, ...scanned]) : setScanned([input]);
                                    setInput("");
                                    if (Number(isueeQty) === scanned?.length! + 1) {
                                      e.currentTarget.blur();
                                    }
                                  }
                                }
                              }
                            }
                          }}
                        />
                      </FormControl>
                    </div>
                    <div className="h-[calc(100%-350px)]    ">
                      <div className="h-[30px] bg-cyan-50 flex items-center justify-between px-[10px] border-t border-b">
                        <Typography fontWeight={500} fontSize={16}>
                          Total Scanned Item {scanned ? scanned.length : 0}
                        </Typography>
                      </div>
                      <div className="h-[calc(100vh-475px)] overflow-y-auto">
                        {scanned
                          ? scanned.map((item, index) => (
                              <>
                                <ListItem
                                  key={index}
                                  sx={{ paddingY: 0 }}
                                  secondaryAction={
                                    <IconButton
                                      edge="end"
                                      aria-label="delete"
                                      size="small"
                                      color="error"
                                      onClick={() => {
                                        setScanned(scanned.filter((sc) => sc !== item));
                                      }}
                                    >
                                      <DeleteIcon fontSize="small" />
                                    </IconButton>
                                  }
                                >
                                  <ListItemText primary={item} />
                                </ListItem>
                                <Divider />
                              </>
                            ))
                          : ""}
                      </div>
                    </div>
                    <Divider />
                    <div className="h-[50px]  flex items-center justify-end gap-[10px] px-[10px] bg-neutral-200">
                      <LoadingButton
                        loadingPosition="start"
                        startIcon={<CloseIcon fontSize="small" />}
                        variant="contained"
                        sx={{ background: "white", color: "red" }}
                        onClick={() => {
                          if (!remarks) {
                            showToast("Remark is required", "error");
                          } else {
                            dispatch(
                              materialRequestReject({
                                itemCode: itemkey,
                                txnId: requestDetail?.id || "",
                                remarks: remarks,
                              })
                            ).then((response: any) => {
                              if (response.payload.data?.success) {
                                dispatch(getProcessMrReqeustAsync(requestDetail?.id || "")).then((res: any) => {
                                  if (!res.payload.data?.success) {
                                    setOpen(false);
                                   
                                  }
                                });
                                setItemKey("");
                                reset();
                                setSelectedValue(null);
                              }
                            });
                          }
                        }}
                        loading={rejectItemLoading}
                      >
                        Reject
                      </LoadingButton>
                      <LoadingButton loadingPosition="start" type="submit" startIcon={<DoneIcon fontSize="small" />} variant="contained" disabled={!(scanned ? parseInt(isueeQty) === scanned.length : true) || approveItemLoading || !scanned} loading={approveItemLoading}>
                        Approve
                      </LoadingButton>
                    </div>
                  </>
                )}
              </div>
            </form>
          </Grid>
        </Grid>
      </Dialog>
    </>
  );
};

export default MaterialRequestDeviceApprovalDrawer;
