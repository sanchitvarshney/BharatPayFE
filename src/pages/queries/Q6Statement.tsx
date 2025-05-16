import { Icons } from "@/components/icons";
import { LoadingButton } from "@mui/lab";
import React, { useCallback, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { AgGridReact } from "ag-grid-react";
import { CardFooter } from "@/components/ui/card";
import { getQ6Data } from "@/features/query/query/querySlice";
import { CardContent, Divider, FormControl, List, ListItem, ListItemText, MenuItem, Paper, Select, TextField, Typography } from "@mui/material";
import MuiTooltip from "@/components/reusable/MuiTooltip";
import { Button } from "@/components/ui/button";
import Q6ReportTable from "@/table/query/Q6ReportTable";
import { showToast } from "@/utils/toasterContext";

const Q6Statement: React.FC = () => {
  const [input, setInput] = useState("");
  const [deviceType, setDeviceType] = useState<string>("");
  const { q6StatementLoading, q6Statement } = useAppSelector(
    (state) => state.query
  );
  const [colapse, setcolapse] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const gridRef = useRef<AgGridReact<any>>(null);

  const onBtExport = useCallback(() => {
    gridRef.current!.api.exportDataAsExcel();
  }, []);

  return (
    // <div className="h-[calc(100vh-100px)] bg-white">
    //   <div className="h-[90px] flex items-center gap-[10px] px-[20px] border-b border-neutral-300">
    //     <TextField
    //       size="small"
    //       label="IMEI / Serial Number"
    //       sx={{ width: "400px" }}
    //       value={input}
    //       onChange={(e) => setInput(e.target.value)}
    //       onKeyDown={(e) => {
    //         if (e.key === "Enter") {
    //           if (input) {
    //             dispatch(getQ6Data(input));
    //           }
    //         }
    //       }}
    //       inputProps={{ maxLength: 15 }}
    //     />
    //     <LoadingButton
    //       loadingPosition="start"
    //       onClick={() => {
    //         if (input) {
    //           dispatch(getQ6Data(input));
    //         }
    //       }}
    //       loading={q6StatementLoading}
    //       startIcon={<Icons.search />}
    //       variant="contained"
    //     >
    //       Search
    //     </LoadingButton>
    //   </div>
    //   {/* <div className="h-[calc(100vh-190px)] p-[20px] overflow-y-auto">
    //     {q6Statement ? (
    //       <div className="flex ">
    //         <div className="w-full">
    //           <Timeline
    //             position="right"
    //             sx={{
    //               [`& .${timelineOppositeContentClasses.root}`]: {
    //                 flex: 0.2,
    //               },
    //             }}
    //           >
    //             {q6Statement?.map((item, index) => (
    //               <TimelineItem key={index}>
    //                 <TimelineOppositeContent sx={{ m: "auto 0" }} align="right" variant="body2" color="text.secondary">
    //                   {item.time}
    //                 </TimelineOppositeContent>
    //                 <TimelineSeparator>
    //                   {index !== 0 && <TimelineConnector />}
    //                   <TimelineDot color="primary">
    //                     <ReceiptIcon fontSize="small" />
    //                   </TimelineDot>
    //                   {index !== q6Statement.length - 1 && <TimelineConnector />}
    //                 </TimelineSeparator>
    //                 <TimelineContent sx={{ py: "12px", px: 2 }}>
    //                   <Typography variant="h6" component="span">
    //                     {item.transactionType}
    //                   </Typography>
    //                   <Typography>TXN ID: {item.minNo}</Typography>
    //                   <Typography>User: {item.user || ""}</Typography>
    //                   <Typography>Location In: {item.location || ""}</Typography>
    //                   <Typography>Method: {item.method || ""}</Typography>
    //                   <Typography>Location Out: {item.locationOut || ""}</Typography>
    //                 </TimelineContent>
    //               </TimelineItem>
    //             ))}
    //           </Timeline>
    //         </div>
    //         <div className="max-w-max">
    //           <ListItemText
    //             primary={"IMEI"}
    //             secondary={q6Statement[0]?.imei}
    //             primaryTypographyProps={{ fontSize: "18px", fontWeight: "bold" }} // Increase primary text size
    //             secondaryTypographyProps={{ fontSize: "1rem", color: "gray" }} // Increase secondary text size
    //           />
    //           <ListItemText
    //             primary={"Serial No."}
    //             secondary={q6Statement[0]?.serial}
    //             primaryTypographyProps={{ fontSize: "1.5rem", fontWeight: "bold" }} // Increase primary text size
    //             secondaryTypographyProps={{ fontSize: "1rem", color: "gray" }} // Increase secondary text size
    //           />
    //         </div>
    //       </div>
    //     ) : (
    //       <div className="flex items-center justify-center h-full">
    //         <img src="/search.svg" className="w-[300px] opacity-60 " alt="" />
    //       </div>
    //     )}
    //   </div> */}
    //    <div className="w-full">
    //       <Q6ReportTable gridRef={gridRef} />
    //     </div>
    // </div>
    <div>
      <div className="relative flex bg-white">
        <div
          className={`transition-all flex flex-col gap-[10px] h-[calc(100vh-100px)]  border-r border-neutral-300   ${
            colapse ? "min-w-0 max-w-0" : "min-w-[400px] max-w-[400px] "
          }`}
        >
          <div
            className={`transition-all ${
              colapse ? "left-0" : "left-[400px]"
            } w-[16px] p-0  h-full top-0 bottom-0 absolute rounded-none  text-slate-600 z-[10] flex items-center justify-center`}
          >
            <Button
              onClick={() => setcolapse(!colapse)}
              className={`transition-all w-[16px] p-0 py-[35px] bg-neutral-200  rounded-none hover:bg-neutral-300/50 text-slate-600 hover:h-full shadow-sm shadow-neutral-400 duration-300   `}
            >
              {colapse ? (
                <Icons.right fontSize="small" />
              ) : (
                <Icons.left fontSize="small" />
              )}
            </Button>
          </div>
          <div className="h-full overflow-y-auto ">
            <Paper elevation={0}>
              <CardContent>
                <div className="flex flex-col gap-[20px] px-[20px] py-[20px]">
                  <div className="flex flex-col gap-[10px]">
                    <Typography
                      variant="subtitle1"
                      className="text-slate-600 font-medium"
                    >
                      Device Type
                    </Typography>
                    <FormControl fullWidth>
                      <Select
                        value={deviceType}
                        onChange={(e) => setDeviceType(e.target.value)}
                        displayEmpty
                        inputProps={{ "aria-label": "Device Type" }}
                        sx={{
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "rgb(203 213 225)",
                          },
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "rgb(148 163 184)",
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "rgb(14 116 144)",
                          },
                        }}
                      >
                        <MenuItem value="" disabled>
                          <em>Select Device Type</em>
                        </MenuItem>
                        <MenuItem value="soundbox">Sound Box</MenuItem>
                        <MenuItem value="swipe">Swipe Machine</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                  <div className="flex flex-col gap-[10px]">
                    <Typography
                      variant="subtitle1"
                      className="text-slate-600 font-medium"
                    >
                      IMEI / Serial Number
                    </Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          if (input) {
                            dispatch(getQ6Data({ id: input, type: deviceType }));
                          }
                        }
                      }}
                      inputProps={{ maxLength: deviceType === "soundbox" ? 15 : undefined }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: "rgb(203 213 225)",
                          },
                          "&:hover fieldset": {
                            borderColor: "rgb(148 163 184)",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "rgb(14 116 144)",
                          },
                        },
                      }}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="h-[50px] p-0 flex items-center justify-between px-[20px]  gap-[10px]">
                <LoadingButton
                  loadingPosition="start"
                  onClick={() => {
                    if (input && deviceType) {
                      dispatch(getQ6Data({ id: input, type: deviceType }));
                    }
                    else{
                      showToast("Please enter IMEI or Serial Number and Device Type", "error");
                    }
                  }}
                  loading={q6StatementLoading}
                  startIcon={<Icons.search />}
                  variant="contained"
                >
                  Search
                </LoadingButton>
                <div className="flex items-center gap-[5px]">
                  <MuiTooltip title="Download" placement="right">
                    <LoadingButton
                      disabled={!q6Statement || q6Statement?.length === 0}
                      variant="contained"
                      color="primary"
                      style={{
                        borderRadius: "50%",
                        width: 30,
                        height: 30,
                        minWidth: 0,
                        padding: 0,
                      }}
                      onClick={() => onBtExport()}
                      size="small"
                      sx={{ zIndex: 1 }}
                    >
                      <Icons.download fontSize="small" />
                    </LoadingButton>
                  </MuiTooltip>
                </div>
              </CardFooter>
            </Paper>
            {q6Statement && (
              <>
                <Paper elevation={0} className="rounded-md mt-[20px] px-[20px] ">
                  <Typography className=" text-slate-600" fontWeight={600} gutterBottom>
                    Device Info
                  </Typography>
                  <Divider />
                  <List>
                    <ListItem>
                      <ListItemText primary="IMEI" secondary={q6Statement?.[0]?.imei || "--"} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Serial No." secondary={q6Statement?.[0]?.serial || "--"} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Manufacturing Month" secondary={q6Statement?.[0]?.manufacturingMonth || "--"} />
                    </ListItem>
                  </List>
                </Paper>
              </>
            )}
          </div>
        </div>
        <div className="w-full">
          <Q6ReportTable gridRef={gridRef} />
        </div>
      </div>
    </div>
  );
};

export default Q6Statement;
