import React, { useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { getTrcRequestDetail } from "@/features/trc/ViewTrc/viewTrcSlice";
import { Button, CircularProgress, Divider, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, Popover, TextField } from "@mui/material";
import { clearTrcDetail, getTrcList, trcFinalSubmit } from "@/features/trc/ViewTrc/viewTrcSlice";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
// import { getLocationAsync } from "@/features/wearhouse/Divicemin/devaiceMinSlice";
// import { getPertCodesync } from "@/features/production/MaterialRequestWithoutBom/MRRequestWithoutBomSlice";
import { TrcFinalSubmitPayload } from "@/features/trc/ViewTrc/viewTrcType";
import FixIssuesTable from "@/table/TRC/FixIssuesTable";
import { LoadingButton } from "@mui/lab";
import { Icons } from "@/components/icons";
import { Typography } from "@mui/material";
import { showToast } from "@/utils/toasterContext";
import SelectLocationAcordingModule, { LocationType } from "@/components/reusable/SelectLocationAcordingModule";
import FullPageLoading from "@/components/shared/FullPageLoading";
// type Props = {
//   open: boolean;
//   setOpen: React.Dispatch<React.SetStateAction<boolean>>;
// };

interface Issue {
  id: string;
  selectedPart: { lable: string; value: string } | null;
  quantity: number | string;
  remarks: string;
  code: string;
  UOM: string;
  isNew: boolean;
}

const ViewTRCTable: React.FC<any> = () => {
  const dispatch = useAppDispatch();
  const { getTrcListLoading } = useAppSelector(
    (state) => state.viewTrc
  );

  const {
    trcRequestDetail,
    TrcFinalSubmitLoading,
    getTrcRequestDetailLoading
  } = useAppSelector((state) => state.viewTrc);
  const [process, setProcess] = useState<boolean>(false);
  const [location, setLocation] = useState<LocationType | null>(null);
  const [consumplocation, setConsumplocation] = useState<LocationType | null>(
    null
  );
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [issues, setIssues] = useState<any[]>([
    // { id: 1, issue: "Issue1", selectedPart: null, quantity: 0, remarks: "", isChecked: false },
  ]);
  const [partCode, setPartCode] = useState<string>("");
  // Function to open the drawer
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget); // Set the element that triggers the popover
  };

  const handleClose = () => {
    setAnchorEl(null); // Close the popover
  };

  const [approved, setApproved] = useState<string[]>([]);
  const [device, setDevice] = useState<string>("");
  const [imeiNo, setImeiNo] = useState<string>("");
  const [validateDevice, setValidateDevice] = useState<boolean>(false);
  const checkRequiredFields = (data: any[]) => {
    let hasErrors = false;

    const requiredFields: Array<keyof Issue> = ["selectedPart", "quantity"];
    const miss = data.map((item) => {
      const missingFields: string[] = [];
      requiredFields.forEach((field) => {
        if (
          item[field] === "" ||
          item[field] === 0 ||
          item[field] === undefined ||
          item[field] === null
        ) {
          missingFields.push(field);
        }
      });
      if (missingFields.length > 0) {
        return `${item.id}`;
      }
    });

    if (miss.filter((item) => item !== undefined).length > 0) {
      showToast(
        `Some required fields are missing: line no. ${miss
          .filter((item) => item !== undefined)
          .join(", ")}`,
        "error"
      );
      hasErrors = true;
    }
    return hasErrors;
  };

  const finalSubmit = () => {
    if (!checkRequiredFields(issues)) {
      if (!location) return showToast("Please select location", "error");
      if (!consumplocation)
        return showToast("Please select consump location", "error");
      const consumpItem = issues.map((item) => item.selectedPart?.value || "");
      const consumpQty = issues.map((item) => item.quantity);
      const remark = issues.map((item) => item.remarks);

      const payload: TrcFinalSubmitPayload = {
        txnId: trcRequestDetail?.header?.txnId || "",
        consumpItem,
        consumpQty,
        remark,
        putLocation: location?.code || "",
        itemCode: device || "",
        consumpLoc: consumplocation?.code || "",
      };
      dispatch(trcFinalSubmit(payload)).then((res: any) => {
        if (res.payload.data.success) {
          showToast(res.payload.data.message, "success");
          resetFeilds();
          if (!approved) {
            setApproved([device]);
          } else {
            setApproved([...approved, device]);
          }
          setDevice("");
          setLocation(null);
          setConsumplocation(null);
          setIssues([]);
          dispatch(getTrcList());
          if (approved?.length === trcRequestDetail!.body.length) {
            setProcess(false);
            dispatch(getTrcList());
          }
        }
      });
    }
  };
  const onSubmit = () => {
    if (issues.length !== 0) {
      finalSubmit();
    }
  };

  useEffect(() => {
    dispatch(getTrcList());
    // dispatch(getLocationAsync(null));
    // dispatch(getPertCodesync(null));
  }, []);

  useEffect(() => {
    if (!process) {
      dispatch(clearTrcDetail());
      setDevice("");
      setIssues([]);
    }
  }, [process]);

  const addRow = useCallback(() => {
    const newId = crypto.randomUUID();
    const newRow: Issue = {
      id: newId,
      selectedPart: null,
      quantity: "",
      remarks: "",
      code: "",
      UOM: "",
      isNew: true,
    };
    setIssues((prev) => [newRow, ...prev]);
  }, [issues]);

  const addRow2 = useCallback(
    (partCode: string) => {
      const newId = crypto.randomUUID();
      const newRow: Issue = {
        id: newId,
        selectedPart: { lable: partCode, value: partCode },
        quantity: 1,
        remarks: "",
        code: "",
        UOM: "",
        isNew: true,
      };
  
      // Add new row to the issues array
      setIssues((prev) => [newRow, ...prev]);
    },
    [issues] // You can also optimize this by removing issues from dependency array
  );
  

  useEffect(() => {
    device &&
      dispatch(
        getTrcRequestDetail({
          itemCode: device,
        })
      ).then((res: any) => {
        if (res.payload.data.success) {
          setValidateDevice(true);
        }
      })
  }, [device]);

  const resetFeilds = () => {
    setDevice("");
    setLocation(null);
    setConsumplocation(null);
    setIssues([]);
    setValidateDevice(false);
  };

  const sanitizeData = (data: string) => {
    return data
      .replace(/[\u00A0]/g, '') // Remove non-breaking spaces
      .replace(/[^a-zA-Z0-9\s,.{}[\]":]/g, ""); // Remove unwanted characters
  };
  
  

  return (
    <div className="flex flex-col h-full">
      {getTrcRequestDetailLoading && <FullPageLoading />}
      <div className="flex-1 grid grid-cols-[500px_1fr] bg-white">
        <div className="border-r border-neutral-300 h-[calc(100vh-100px)]">
          <div className=" border-neutral-300">
            <div className="bg-hbg h-[40px] flex items-center justify-between px-[10px] border-b border-neutral-300 gap-[10px]">
              <Typography fontWeight={600} fontSize={16}>
                Enter Device
              </Typography>
              <IconButton
                size="small"
                onClick={() => {
                  dispatch(getTrcList());
                  setDevice("");
                }}
              >
                {getTrcListLoading ? (
                  <CircularProgress size={20} />
                ) : (
                  <Icons.refresh className="cursor-pointer" fontSize="small" />
                )}
              </IconButton>
            </div>

            {/* Search Field */}
            <div className="flex items-center justify-center p-2">
              <TextField
                label="Search"
                variant="outlined"
                size="medium"
                fullWidth
                value={imeiNo}
                onChange={(e) => setImeiNo(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                   setDevice(imeiNo);
                  }
                }}
                sx={{
                  margin: "10px", // Adjust spacing around the text field
                  maxWidth: 500, // Optional: limit width
                }}
                inputProps={{ maxLength: 15 }}
              />
            </div>
          </div>

          <div className="flex-1 h-[calc(100vh-230px)]">
            <div>
              {/* Popover */}
              <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: "bottom", // Position the popover below the button
                  horizontal: "left", // Align with the left edge of the button
                }}
                transformOrigin={{
                  vertical: "top", // Align above the anchor
                  horizontal: "left", // Align to the left of the anchor
                }}
                sx={{
                  "& .MuiPopover-paper": {
                    borderRadius: "10px", // Rounded corners for popover
                    padding: "20px", // Padding inside popover
                    width: "300px", // Set a fixed width
                    boxShadow: 4, // Soft shadow around the popover
                    backgroundColor: "#fff", // White background
                    border: "1px solid #e0e0e0", // Light border to separate content
                  },
                }}
              >
                {/* Popover Content */}
                <div>
                  <Typography variant="h6" sx={{ marginBottom: 2 }}>
                    Details
                  </Typography>

                  <div className="flex flex-col gap-3">
                    {/* Requested By */}
                    <div className="flex items-center justify-between">
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        fontWeight={600}
                      >
                        Requested By:
                      </Typography>
                      <Typography variant="body2">
                        {trcRequestDetail ? trcRequestDetail?.header?.requestBy || "--" : "--"}
                      </Typography>
                    </div>

                    {/* Reference ID */}
                    <div className="flex items-center justify-between">
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        fontWeight={600}
                      >
                        Reference ID:
                      </Typography>
                      <Typography variant="body2">
                        {trcRequestDetail ? trcRequestDetail?.header?.txnId : "--"}
                      </Typography>
                    </div>


                    {/* Insert Date */}
                    <div className="flex items-center justify-between">
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        fontWeight={600}
                      >
                        Insert Date:
                      </Typography>
                      <Typography variant="body2">
                        {trcRequestDetail ? trcRequestDetail?.header?.insertDt : "--"}
                      </Typography>
                    </div>
                  </div>

                  <Divider sx={{ my: 2 }} />

                  {/* Close Button */}
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    startIcon={<Icons.close />}
                    onClick={handleClose}
                  >
                    Close
                  </Button>
                </div>
              </Popover>
            </div>
          </div>
        </div>
        {validateDevice && (
          <div>
            <div className="h-[40px] bg-hbg flex items-center px-[10px] justify-between  border-b border-neutral-300">
              <Typography fontWeight={600} fontSize={16}>
                Fix Issues
              </Typography>
              <Button
                size="small"
                variant="contained"
                color="primary"
                startIcon={<KeyboardArrowDownIcon />}
                onClick={handleClick}
                sx={{
                  borderRadius: "30px", // Rounded corners
                  boxShadow: 2, // Subtle shadow
                  "&:hover": {
                    boxShadow: 6, // More prominent shadow on hover
                  },
                  fontSize: "14px",
                }}
              >
                Open Details
              </Button>
            </div>
            <div className="h-[calc(100vh-140px)] overflow-y-auto ">
              <div className="h-[calc(100vh-140px)]">
                <div className="p-[20px]  h-[70px]">
                  <div className="grid grid-cols-[1fr_1fr] gap-[10px]">
                    <div className="flex items-center gap-[10px]">
                      <p>IMEI : </p>
                      <p>
                        {trcRequestDetail &&
                          trcRequestDetail.body.find(
                            (item) => item.device === device
                          )?.deviceDetail?.imei}{" "}
                      </p>
                    </div>
                    <div className="flex items-center gap-[10px]">
                      <p>Model No. : </p>
                      <p>
                        {trcRequestDetail &&
                          trcRequestDetail.body.find(
                            (item) => item.device === device
                          )?.deviceDetail?.model}{" "}
                      </p>
                    </div>
                  </div>
                </div>
                <div className=" h-[60px]  grid grid-cols-3 items-center gap-[20px] px-[20px]">
                  <FormControl fullWidth className="w-full">
                    <InputLabel htmlFor="outlined-adornment-barcode">
                      Scan PartCode
                    </InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-barcode"
                      value={partCode}
                      onChange={(e) => setPartCode(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          const data = sanitizeData(partCode); // Sanitize input
                            const parsedPartCode = JSON.parse(data); // Parse part code input
                      
                            // Check if parsedPartCode has 'Value' property
                            if (parsedPartCode && parsedPartCode.Value) {
                              const partCodeValue = parsedPartCode.Value; // Get the Value
                      
                              // Add row to issues with the partCode value
                              addRow2(partCodeValue);
                              setPartCode(""); // Clear input after adding
                            } else {
                              console.error("Invalid partCode format", parsedPartCode);
                              showToast("Invalid JSON format: 'Value' key missing.", "error");
                            }
                          
                        }
                      }}
                      
                      endAdornment={
                        <InputAdornment position="end">
                          <Icons.qrScan />
                        </InputAdornment>
                      }
                      className="w-[100%]"
                      label="Scan PartCode"
                    />
                  </FormControl>
                  <SelectLocationAcordingModule
                    endPoint="/trc/view/pickLocation"
                    value={consumplocation}
                    onChange={setConsumplocation}
                    label="Consump Location"
                  />
                  <SelectLocationAcordingModule
                    endPoint="/trc/view/dropLocation"
                    value={location}
                    onChange={setLocation}
                    label="Drop Location"
                  />
                </div>
                <div>
                  <div className="h-[40px] bg-hbg flex items-center px-[10px] justify-between border-t border-b border-neutral-300">
                    <Typography fontWeight={600} fontSize={16}>
                      Consumable Components
                    </Typography>
                    <p className="text-slate-600 font-[600]">
                      Total fix issues: {issues.length.toString()}
                    </p>
                  </div>
                  <div className="h-[calc(100vh-360px)]  overflow-y-auto overflow-x-auto">
                    {/* {device ? (
                      <div className="flex items-center justify-center h-[100%]">
                        <img
                          src="/empty.png"
                          alt=""
                          className="h-[100px] w-[100px]"
                        />
                      </div>
                    ) : ( */}
                      <FixIssuesTable
                        addRow={addRow}
                        rowData={issues}
                        setRowData={setIssues}
                      />
                    {/* )} */}
                  </div>
                  <div className="h-[50px] flex items-center justify-end px-[10px] gap-[10px] border-t  border-neutral-300">
                    <LoadingButton
                      disabled={TrcFinalSubmitLoading}
                      variant={"contained"}
                      startIcon={<Icons.close fontSize="small" />}
                      sx={{ background: "white", color: "red" }}
                      onClick={() => {
                        setIssues([]);
                        setConsumplocation(null);
                        setLocation(null);
                      }}
                    >
                      reset
                    </LoadingButton>
                    <LoadingButton
                      loadingPosition="start"
                      variant="contained"
                      onClick={onSubmit}
                      loading={TrcFinalSubmitLoading}
                      startIcon={<Icons.save fontSize="small" />}
                    >
                      Submit
                    </LoadingButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewTRCTable;
