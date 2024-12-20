import React, { useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { getTrcRequestDetail } from "@/features/trc/ViewTrc/viewTrcSlice";
import {
  Button,
  CircularProgress,
  Divider,
  Popover,
  TextField,
} from "@mui/material";
import {
  clearTrcDetail,
  getTrcList,
  trcFinalSubmit,
} from "@/features/trc/ViewTrc/viewTrcSlice";
import { Skeleton } from "@/components/ui/skeleton";
import { getLocationAsync } from "@/features/wearhouse/Divicemin/devaiceMinSlice";
import { getPertCodesync } from "@/features/production/MaterialRequestWithoutBom/MRRequestWithoutBomSlice";
import { TrcFinalSubmitPayload } from "@/features/trc/ViewTrc/viewTrcType";
import FixIssuesTable from "@/table/TRC/FixIssuesTable";
import { LoadingButton } from "@mui/lab";
import { Icons } from "@/components/icons";
import {
  Chip,
  FormControlLabel,
  List,
  ListItemButton,
  ListItemText,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import { showToast } from "@/utils/toasterContext";
import SelectLocationAcordingModule, {
  LocationType,
} from "@/components/reusable/SelectLocationAcordingModule";
import { Add, Remove } from "@mui/icons-material";
type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

interface Issue {
  id: string;
  selectedPart: { lable: string; value: string } | null;
  quantity: number | string;
  remarks: string;
  code: string;
  UOM: string;
  isNew: boolean;
}

const ViewTRCTable: React.FC<Props> = () => {
  const dispatch = useAppDispatch();
  const { trcList, getTrcListLoading } = useAppSelector(
    (state) => state.viewTrc
  );
  // const columnDefs: ColDef[] = [
  //   {
  //     headerName: "#",
  //     field: "id",
  //     sortable: true,
  //     filter: true,
  //     flex: 1,
  //     maxWidth: 80,
  //     valueGetter: "node.rowIndex + 1",
  //   },
  //   {
  //     headerName: "Requested By",
  //     field: "requestBy",
  //     sortable: true,
  //     filter: true,
  //     flex: 1,
  //     cellRenderer: (params: any) => (params?.value ? params?.value : "--"),
  //   },
  //   {
  //     headerName: "Reference ID",
  //     field: "txnId",
  //     sortable: true,
  //     filter: true,
  //     flex: 1,
  //   },
  //   {
  //     headerName: "From Location",
  //     field: "putLocation",
  //     sortable: true,
  //     filter: true,
  //     flex: 1,
  //   },
  //   {
  //     headerName: "Insert Date",
  //     field: "insertDate",
  //     sortable: true,
  //     filter: true,
  //     flex: 1,
  //   },
  //   {
  //     headerName: "Total Device",
  //     field: "totalDevice",
  //     sortable: true,
  //     filter: true,
  //     flex: 1,
  //   },
  //   {
  //     headerName: "Action",
  //     field: "action",
  //     cellRenderer: (params: any) => (
  //       <div className="flex items-center justify-center h-full">
  //         <Button
  //           onClick={() => {
  //             setOpen(true);
  //             const payload: TcDetail = {
  //               txnId: params?.data?.txnId,
  //               location: params?.data?.putLocation,
  //               requestedBy: params?.data?.requestBy,
  //               insertDate: params?.data?.insertDate,
  //               totalDevice: params?.data?.totalDevice,
  //             };
  //             dispatch(setTrcDetail(payload));
  //             dispatch(
  //               getTrcRequestDetail({
  //                 txnid: params?.data?.txnId,
  //                 itemCode: params?.data?.itemCode,
  //               })
  //             );
  //           }}
  //           startIcon={<Icons.refreshv2 />}
  //           variant="contained"
  //           size="small"
  //         >
  //           Process
  //         </Button>
  //       </div>
  //     ),
  //     flex: 1,
  //     maxWidth: 100,
  //   },
  // ];

  // const defaultColDef = useMemo<ColDef>(() => {
  //   return {
  //     filter: true,
  //   };
  // }, []);

  const {
    getTrcRequestDetailLoading,
    trcRequestDetail,
    TrcFinalSubmitLoading,
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

  // Function to open the drawer
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget); // Set the element that triggers the popover
  };

  const handleClose = () => {
    setAnchorEl(null); // Close the popover
  };

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [data, setData] = useState<any>();
  const [approved, setApproved] = useState<string[]>([]);
  const [device, setDevice] = useState<string>("");
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
        txnId: data?.txnId || "",
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
          if (!approved) {
            setApproved([device]);
          } else {
            setApproved([...approved, device]);
          }
          setDevice("");
          setLocation(null);
          setConsumplocation(null);
          setIssues([]);
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
    dispatch(getLocationAsync(null));
    dispatch(getPertCodesync(null));
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

  const filteredTrcList = trcList?.filter((item) => {
    const search = searchTerm.toLowerCase();
    return (
      item?.itemCode?.toLowerCase().includes(search) ||
      item?.txnId?.toLowerCase().includes(search) ||
      item?.requestBy?.toLowerCase().includes(search)
    );
  });

  useEffect(() => {
    device &&
      dispatch(
        getTrcRequestDetail({
          txnid: data?.txnId,
          itemCode: data?.itemCode,
        })
      );
  }, [device]);

  const resetFeilds = () => {
    setDevice("");
    setLocation(null);
    setConsumplocation(null);
    setIssues([]);
  };
  console.log(device);
  return (
    <div>
      {/* <div className="ag-theme-quartz h-[calc(100vh-100px)]">
        <AgGridReact
          loadingOverlayComponent={CustomLoadingOverlay}
          loading={getTrcListLoading}
          overlayNoRowsTemplate={OverlayNoRowsTemplate}
          suppressCellFocus={true}
          rowData={trcList ? trcList : []}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          pagination={true}
          paginationPageSize={20}
        />
      </div> */}
      <div className="h-[calc(100vh-50px)] grid grid-cols-[500px_1fr] bg-white">
        <div className="border-r border-neutral-300">
          <div className="bg-hbg h-[40px] flex items-center px-[10px] border-b border-neutral-300 gap-[10px]">
            <Typography fontWeight={600} fontSize={16}>
              Device List
            </Typography>
            <Button
              onClick={() => {
                dispatch(getTrcList());
                setSearchTerm("");
                setDevice("");
              }}
              variant="text"
              style={{ marginLeft: "auto" }}
            >
              {getTrcListLoading ? (
                <CircularProgress size={24} />
              ) : (
                <Icons.refresh className="cursor-pointer" />
              )}
            </Button>
          </div>

          {/* <div className="p-4">
            <TextField
              label="Search"
              variant="outlined"
              size="medium"
              fullWidth
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div> */}
          <div className="flex items-center justify-center">
            <TextField
              label="Search"
              variant="outlined"
              size="medium"
              fullWidth
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{
                margin: "10px", // Add spacing around the text field
                maxWidth: 500, // Optional: to limit the width
              }}
            />
          </div>

          <div className="h-[calc(100vh-150px)] ">
            <div className=" h-[calc(100vh-290px)] overflow-y-auto">
              {getTrcRequestDetailLoading || getTrcListLoading ? (
                <div className="flex flex-col gap-[5px] p-[10px]">
                  <Skeleton className="h-[30px] w-full" />
                  <Skeleton className="h-[30px] w-full" />
                  <Skeleton className="h-[30px] w-full" />
                  <Skeleton className="h-[30px] w-full" />
                  <Skeleton className="h-[30px] w-full" />
                  <Skeleton className="h-[30px] w-full" />
                </div>
              ) : (
                <RadioGroup value={device}>
                  <List className="">
                    {filteredTrcList?.map((item: any, index) => (
                      <ListItemButton
                        // disabled={approved!.includes(item.device)}
                        key={index}
                        onClick={() => {
                          resetFeilds();
                          setDevice(item.itemCode);
                          setData(item);
                        }}
                        selected={device === item.itemCode}
                        sx={{
                          backgroundColor:
                            device === item.itemCode ? "lightblue" : "inherit",
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <FormControlLabel
                          value={item?.itemCode}
                          control={<Radio />}
                          label={
                            <ListItemText
                              primary={item?.itemCode}
                              secondary={
                                <>
                                  <span>Reference ID: {item?.txnId}</span>
                                  <br />
                                  <span>Requested By: {item?.requestBy}</span>
                                </>
                              }
                            />
                          }
                          sx={{ width: "100%", margin: 0 }}
                        />
                        {approved?.includes(item?.device) ? (
                          <Chip
                            size="small"
                            label="Approved"
                            color="success"
                            icon={<Icons.checkcircle fontSize="small" />}
                          />
                        ) : (
                          <Chip
                            size="small"
                            sx={{ background: "#d97706" }}
                            label="Pending"
                            color="info"
                            icon={<Icons.time fontSize="small" />}
                          />
                        )}
                      </ListItemButton>
                    ))}
                  </List>
                </RadioGroup>
              )}
            </div>
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
                        {data ? data?.requestBy || "--" : "--"}
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
                        {data ? data?.txnId : "--"}
                      </Typography>
                    </div>

                    {/* From Location */}
                    <div className="flex items-center justify-between">
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        fontWeight={600}
                      >
                        From Location:
                      </Typography>
                      <Typography variant="body2">
                        {data ? data?.putLocation : "--"}
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
                        {data ? data?.insertDate : "--"}
                      </Typography>
                    </div>

                    {/* Total Devices */}
                    <div className="flex items-center justify-between">
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        fontWeight={600}
                      >
                        Total Devices:
                      </Typography>
                      <Typography variant="body2">
                        {data ? data?.totalDevice : "--"}
                      </Typography>
                    </div>
                  </div>

                  <Divider sx={{ my: 2 }} />

                  {/* Close Button */}
                  <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<Remove />}
                    onClick={handleClose}
                  >
                    Close
                  </Button>
                </div>
              </Popover>
            </div>
          </div>
        </div>
        {device && (
          <div>
            <div className="h-[40px] bg-hbg flex items-center px-[10px] justify-between border-t border-b border-neutral-300">
              <Typography fontWeight={600} fontSize={16}>
                Fix Issues
              </Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<Add />}
                onClick={handleClick}
                sx={{
                  borderRadius: "30px", // Rounded corners
                  boxShadow: 2, // Subtle shadow
                  "&:hover": {
                    boxShadow: 6, // More prominent shadow on hover
                    backgroundColor: "#1976d2", // Darker blue on hover
                  },
                  fontSize: "14px",
                }}
              >
                Open Details
              </Button>
            </div>
            <div className="h-[calc(100vh-100px)] overflow-y-auto ">
              <div className="h-[calc(100vh-150px)] ">
                <div className="p-[20px]  h-[70px]">
                  <div className="grid grid-cols-[1fr_1fr] gap-[20px]">
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
                <div className=" h-[60px]  grid grid-cols-2 items-center gap-[20px] px-[20px]">
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
                  <div className="h-[calc(100vh-320px)]  overflow-y-auto overflow-x-auto">
                    {!device ? (
                      <div className="flex items-center justify-center h-[100%]">
                        <img
                          src="/empty.png"
                          alt=""
                          className="h-[100px] w-[100px]"
                        />
                      </div>
                    ) : (
                      <FixIssuesTable
                        addRow={addRow}
                        rowData={issues}
                        setRowData={setIssues}
                      />
                    )}
                  </div>
                </div>
              </div>
              <div className="h-[50px] flex items-center justify-end px-[10px] gap-[10px] border-t  border-neutral-300">
                <LoadingButton
                  disabled={TrcFinalSubmitLoading}
                  variant={"contained"}
                  startIcon={<Icons.close fontSize="small" />}
                  sx={{ background: "white", color: "red" }}
                  onClick={() => setProcess(false)}
                >
                  Cancel
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
        )}
      </div>
    </div>
  );
};

export default ViewTRCTable;
