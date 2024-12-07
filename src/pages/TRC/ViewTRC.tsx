import ViewTRCTable from "@/table/TRC/ViewTRCTable";
import React, { useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { clearTrcDetail, getTrcList, trcFinalSubmit } from "@/features/trc/ViewTrc/viewTrcSlice";
import { Skeleton } from "@/components/ui/skeleton";
import { getLocationAsync } from "@/features/wearhouse/Divicemin/devaiceMinSlice";
import { Drawer } from "antd";
import { getPertCodesync } from "@/features/production/MaterialRequestWithoutBom/MRRequestWithoutBomSlice";
import { TrcFinalSubmitPayload } from "@/features/trc/ViewTrc/viewTrcType";
import FixIssuesTable from "@/table/TRC/FixIssuesTable";
import { LoadingButton } from "@mui/lab";
import { Icons } from "@/components/icons";
import SelectLocation, { LocationType } from "@/components/reusable/SelectLocation";
import { Chip, FormControlLabel, List, ListItemButton, ListItemText, Radio, RadioGroup, Typography } from "@mui/material";
import { showToast } from "@/utils/toasterContext";
interface Issue {
  id: string;
  selectedPart: { lable: string; value: string } | null;
  quantity: number | string;
  remarks: string;
  code: string;
  UOM: string;
  isNew: boolean;
}

const ViewTRC: React.FC = () => {
  const dispatch = useAppDispatch();
  const { TRCDetail, getTrcRequestDetailLoading, trcRequestDetail, TrcFinalSubmitLoading } = useAppSelector((state) => state.viewTrc);
  const [process, setProcess] = useState<boolean>(false);
  const [location, setLocation] = useState<LocationType | null>(null);
  const [consumplocation, setConsumplocation] = useState<LocationType | null>(null);
  const [issues, setIssues] = useState<Issue[]>([
    // { id: 1, issue: "Issue1", selectedPart: null, quantity: 0, remarks: "", isChecked: false },
  ]);

  const [approved, setApproved] = useState<string[]>([]);
  const [device, setDevice] = useState<string>("");
  const checkRequiredFields = (data: Issue[]) => {
    let hasErrors = false;

    const requiredFields: Array<keyof Issue> = ["selectedPart", "quantity"];
    const miss = data.map((item) => {
      const missingFields: string[] = [];
      requiredFields.forEach((field) => {
        // Check if the required field is empty
        if (item[field] === "" || item[field] === 0 || item[field] === undefined || item[field] === null) {
          missingFields.push(field);
        }
      });
      if (missingFields.length > 0) {
        return `${item.id}`;
      }
    });

    if (miss.filter((item) => item !== undefined).length > 0) {
      showToast(`Some required fields are missing: line no. ${miss.filter((item) => item !== undefined).join(", ")}`, "error");
      hasErrors = true;
    }
    return hasErrors;
  };
  const onSubmit = () => {
    if (issues.length === 0) {
      showToast("Issue not added", "error");
    } else if (!checkRequiredFields(issues)) {
      // TRCDetail?.txnId
      if (!location) return showToast("Please select location", "error");
      if (!consumplocation) return showToast("Please select consump location", "error");
      const consumpItem = issues.map((item) => item.selectedPart?.value || "");
      const consumpQty = issues.map((item) => item.quantity);
      const remark = issues.map((item) => item.remarks);

      const payload: TrcFinalSubmitPayload = {
        txnId: TRCDetail?.txnId || "",
        consumpItem,
        consumpQty,
        remark,
        putLocation: location?.id || "",
        itemCode: device || "",
        consumpLoc: consumplocation?.id || "",
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

  return (
    <>
      <Drawer
        placement="bottom"
        styles={{
          body: {
            padding: "0px",
          },
          header: {
            padding: "0px 20px",
            background: "#e5e5e5",
            minHeight: "50px",
            borderBottom: "1px solid #c4c4c4",
          },
        }}
        closeIcon={<Icons.close />}
        title={`#Ref: ${TRCDetail ? TRCDetail?.txnId : "--"}`}
        width={"100%"}
        height={"100vh"}
        open={process}
        onClose={() => {
          setProcess(false);
          dispatch(getTrcList());
        }}
      >
        <div className="h-[calc(100vh-50px)] grid grid-cols-[500px_1fr] ">
          <div className="border-r border-neutral-300">
            <div className="bg-hbg h-[40px] flex items-center px-[10px] border-b border-neutral-300 gap-[10px]">
              <Chip label="1" />
              <Typography fontWeight={600} fontSize={16}>
                Device List
              </Typography>
            </div>
            <div className="h-[calc(100vh-150px)] ">
              <div className=" h-[calc(100vh-290px)] overflow-y-auto">
                {getTrcRequestDetailLoading ? (
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
                      {trcRequestDetail &&
                        trcRequestDetail.body.map((item, index) => (
                          <ListItemButton
                            disabled={approved!.includes(item.device)}
                            key={index}
                            onClick={() => setDevice(item.device)}
                            selected={device === item.device}
                            sx={{
                              backgroundColor: device === item.device ? "lightblue" : "inherit",
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <FormControlLabel value={item?.device} control={<Radio />} label={<ListItemText primary={item?.device} />} sx={{ width: "100%", margin: 0 }} />
                            {approved?.includes(item?.device) ? (
                              <Chip size="small" label="Approved" color="success" icon={<Icons.checkcircle fontSize="small" />} />
                            ) : (
                              <Chip size="small" sx={{ background: "#d97706" }} label="Pending" color="info" icon={<Icons.time fontSize="small" />} />
                            )}
                          </ListItemButton>
                        ))}
                    </List>
                  </RadioGroup>
                )}
              </div>
              <div className=" h-[150px] border-t border-neutral-300 p-[10px]">
                <div className="flex items-center gap-[10px]">
                  <p className="font-[500]">Requested By : </p>
                  <p>{TRCDetail ? TRCDetail?.requestedBy || "--" : "--"} </p>
                </div>
                <div className="flex items-center gap-[10px]">
                  <p className="font-[500]">Reference ID: </p>
                  <p>{TRCDetail ? TRCDetail?.txnId : "--"} </p>
                </div>
                <div className="flex items-center gap-[10px]">
                  <p className="font-[500]">From Location: </p>
                  <p>{TRCDetail ? TRCDetail?.location : "--"} </p>
                </div>
                <div className="flex items-center gap-[10px]">
                  <p className="font-[500]">Insert Date: </p>
                  <p>{TRCDetail ? TRCDetail?.insertDate : "--"} </p>
                </div>
                <div className="flex items-center gap-[10px]">
                  <p className="font-[500]">Total Device </p>
                  <p>{TRCDetail ? TRCDetail?.totalDevice : "--"} </p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="bg-hbg h-[40px] flex items-center px-[10px] border-b border-neutral-300 gap-[10px]">
              <Chip label="2" />
              <Typography fontWeight={600} fontSize={16}>
                Fix Issues
              </Typography>
            </div>
            <div className="h-[calc(100vh-100px)] overflow-y-auto ">
              <div className="h-[calc(100vh-150px)] ">
                <div className="p-[20px]  h-[70px]">
                  <div className="grid grid-cols-[1fr_1fr] gap-[20px]">
                    <div className="flex items-center gap-[10px]">
                      <p>IMEI : </p>
                      <p>{trcRequestDetail && trcRequestDetail.body.find((item) => item.device === device)?.deviceDetail?.imei} </p>
                    </div>
                    <div className="flex items-center gap-[10px]">
                      <p>Model No. : </p>
                      <p>{trcRequestDetail && trcRequestDetail.body.find((item) => item.device === device)?.deviceDetail?.model} </p>
                    </div>
                  </div>
                </div>
                <div className=" h-[60px]  grid grid-cols-2 items-center gap-[20px] px-[20px]">
                  <SelectLocation value={location} onChange={setLocation} label="Drop Location" />
                  <SelectLocation value={consumplocation} onChange={setConsumplocation} label="Consump Location" />
                </div>
                <div>
                  <div className="h-[40px] bg-hbg flex items-center px-[10px] justify-between border-t border-b border-neutral-300">
                    <Typography fontWeight={600} fontSize={16}>
                      Consumable Components
                    </Typography>
                    <p className="text-slate-600 font-[600]">Total fix issues: {issues.length.toString()}</p>
                  </div>
                  <div className="h-[calc(100vh-320px)]  overflow-y-auto overflow-x-auto">
                    {!device ? (
                      <div className="flex items-center justify-center h-[100%]">
                        <img src="/empty.png" alt="" className="h-[100px] w-[100px]" />
                      </div>
                    ) : (
                      <FixIssuesTable addRow={addRow} rowData={issues} setRowData={setIssues} />
                    )}
                  </div>
                </div>
              </div>
              <div className="h-[50px] flex items-center justify-end px-[10px] gap-[10px] border-t  border-neutral-300">
                <LoadingButton disabled={TrcFinalSubmitLoading} variant={"contained"} startIcon={<Icons.close fontSize="small" />} sx={{ background: "white", color: "red" }} onClick={() => setProcess(false)}>
                  Cancel
                </LoadingButton>
                <LoadingButton loadingPosition="start" disabled={!issues.length} variant="contained" onClick={onSubmit} loading={TrcFinalSubmitLoading} startIcon={<Icons.save fontSize="small" />}>
                  Submit
                </LoadingButton>
              </div>
            </div>
          </div>
        </div>
      </Drawer>
      <ViewTRCTable open={process} setOpen={setProcess} />
    </>
  );
};

export default ViewTRC;
