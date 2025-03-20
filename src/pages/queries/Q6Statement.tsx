import { Icons } from "@/components/icons";
import { LoadingButton } from "@mui/lab";
import React, { useCallback, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { AgGridReact } from "ag-grid-react";
import { CardFooter } from "@/components/ui/card";
import { getQ6Data } from "@/features/query/query/querySlice";
import { CardContent, Divider, List, ListItem, ListItemText, Paper, TextField, Typography } from "@mui/material";
import MuiTooltip from "@/components/reusable/MuiTooltip";
import { Button } from "@/components/ui/button";
import Q6ReportTable from "@/table/query/Q6ReportTable";
const Q6Statement: React.FC = () => {
  const [input, setInput] = useState("");
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
                <div className="h-[90px] flex items-center gap-[10px] px-[20px] border-b border-neutral-300">
                  <TextField
                    // size="small"
                    label="IMEI / Serial Number"
                    sx={{ width: "400px", height: "50px" }}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        if (input) {
                          dispatch(getQ6Data(input));
                        }
                      }
                    }}
                    inputProps={{ maxLength: 15 }}
                    // className="w-full h-[50px] border-[2px] rounded-sm "
                  />
                </div>
              </CardContent>
              <CardFooter className="h-[50px] p-0 flex items-center justify-between px-[20px]  gap-[10px]">
                <LoadingButton
                  loadingPosition="start"
                  onClick={() => {
                    if (input) {
                      dispatch(getQ6Data(input));
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
