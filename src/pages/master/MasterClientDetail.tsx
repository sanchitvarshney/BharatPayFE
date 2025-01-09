import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { IconButton, LinearProgress, Tab, Tabs, Typography } from "@mui/material";
import React, { useEffect } from "react";
import Divider from "@mui/material/Divider";
import MuiTooltip from "@/components/reusable/MuiTooltip";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { Skeleton } from "@/components/ui/skeleton";
import { getClientDetail } from "@/features/master/client/clientSlice";
import MasterClientBranchDetailTable from "@/table/master/MasterClientBranchDetailTable";
import AddClientBranch from "@/components/featureModels/AddClientBranch";
import EditClientBasicDetail from "@/components/featureModels/EditClientBasicDetail";
const MasterClientDetail: React.FC = () => {
  const dispatch = useAppDispatch();
  const { clientDetailLoading, clientDetail } = useAppSelector((state) => state.client);
  const [addbranch, setAddBranch] = React.useState<boolean>(false);
  const [editBasicDetail, setEditBasicDetail] = React.useState<boolean>(false);
  const { id } = useParams();

  const [value2, setValue2] = React.useState("detail1");
  const navigate = useNavigate();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  const handleChange2 = (_: React.SyntheticEvent, newValue: string) => {
    setValue2(newValue);
    scrollToSection(newValue);
  };

 
  useEffect(() => {
    if (id) {
      dispatch(getClientDetail(id));
    }
  }, [id]);
  return (
    <>
    <EditClientBasicDetail open={editBasicDetail} handleClose={() => setEditBasicDetail(false)} />
      <AddClientBranch open={addbranch} handleClose={()=>setAddBranch(false)} />
      <div className="relative bg-white">
        <div className="absolute top-0 left-0 right-0">{clientDetailLoading && <LinearProgress />}</div>

        <div className="head bg-amber-50 h-[100px] border-b border-neutral-400/70 flex items-center justify-between">
          <div className="flex items-center justify-between gap-[20px]   ">
            <Button onClick={() => navigate(-1)} className="p-0 pr-2 text-black bg-transparent rounded-none shadow-none rounded-e-md hover:bg-white/70">
              <Icons.left fontSize="small" />
            </Button>
            {clientDetailLoading ? (
              <div className="min-w-[300px] flex flex-col gap-[5px]">
                <Skeleton className="w-full rounded-md h-[20px]" />
                <Skeleton className="w-[70%] rounded-md h-[15px]" />
                <Skeleton className="w-[40%] rounded-md h-[13px]" />
              </div>
            ) : (
              <div className="flex flex-col min-w-[200px]">
                <div className="flex items-center gap-[10px]">
                  <Typography variant="h1" fontSize={17} fontWeight={600}>
                    {clientDetail?.client?.name}
                  </Typography>
                  <MuiTooltip title="Copy" placement="right">
                    <IconButton size="small">
                      <Icons.copy fontSize="small" />
                    </IconButton>
                  </MuiTooltip>
                </div>
                <Typography variant="body2" color="text.secondary" gutterBottom fontSize={13}>
                  {clientDetail?.client?.c_id}
                </Typography>
              </div>
            )}

            <Divider orientation="vertical" flexItem />
          </div>
          <div className="flex items-center pr-[20px] gap-[10px]">
            <Button
              onClick={() => {
                dispatch(getClientDetail(id || ""));
              }}
              className="p-[5px] px-[8px]  bg-white text-slate-600 border border-slate-600 hover:bg-white/80"
            >
              <Icons.refresh fontSize="small" />
            </Button>
            <Button disabled className="p-[5px] px-[8px]  bg-white text-red-600 border border-red-600 hover:bg-white/80">
              <Icons.delete fontSize="small" />
            </Button>
          </div>
        </div>
        {clientDetailLoading ? (
          <div className="h-[calc(100vh-150px)] flex items-center justify-center">
            <img src="/search.svg" className="w-[400px] opacity-60 " alt="" />
          </div>
        ) : (
          <div className="h-[calc(100vh-150px)]  grid grid-cols-[200px_1fr]">
            <div className="border-r border-neutral-400/70">
              <Tabs selectionFollowsFocus orientation="vertical" value={value2} onChange={handleChange2} aria-label="secondary tabs example">
                <Tab
                  value="Basic-details"
                  label={
                    <div className="flex w-full items-start gap-[10px]">
                      <Typography fontSize={13} className="capitalize">
                        Basic Details
                      </Typography>
                    </div>
                  }
                />

                <Tab
                  value="branch-details"
                  label={
                    <div className="flex w-full items-center gap-[10px]">
                      <Typography fontSize={13} className="capitalize">
                        Branch Details
                      </Typography>
                    </div>
                  }
                />
              </Tabs>
            </div>
            <div className="h-full overflow-y-auto">
              <div id="Basic-details" className="px-[20px] py-[10px]">
                <header className="flex items-center w-full gap-3">
                  <h2 className="text-lg font-semibold">Basic Details</h2>
                  <Divider sx={{ borderBottomWidth: 2, borderColor: "#d4d4d4", flexGrow: 1 }} />
                  <button onClick={() => setEditBasicDetail(true)} type="button" className="flex items-center gap-1 p-1 px-3 text-sm bg-transparent rounded-md shadow-none hover:bg-gray-100 text-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500" aria-label="Add attachments">
                    <Icons.edit fontSize="small" sx={{ fontSize: "15px" }} />
                    Edit Basic Details
                  </button>
                </header>
                <div className="grid w-[80%] grid-cols-4 gap-[20px] ">
                  {[
                    { label: "Name", value: clientDetail?.client?.name },
                    { label: "City", value: clientDetail?.client?.city },
                    { label: "Mobile", value: clientDetail?.client?.mobile },
                    { label: "Email", value: clientDetail?.client?.email },
                    { label: "GST Number", value: clientDetail?.client?.gst },
                    { label: "PAN Number", value: clientDetail?.client?.panno },
                    { label: "State", value: clientDetail?.client?.state?.name },
                    { label: "Country", value: clientDetail?.client?.country?.name },
                    { label: "Website", value: clientDetail?.client?.website },
                  ].map(({ label, value }) => (
                    <div key={label} className={`py-3 ${label === "Complete Address" ? "col-span-2" : ""}`}>
                      <Typography variant="body2" color="textSecondary" className="text-gray-600">
                        {label}:
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {value || "N/A"}
                      </Typography>
                    </div>
                  ))}
                </div>
              </div>
              <div id="branch-details" className=" h-[calc(100vh-150px)] ">
                <div className="p-[20px]">
                  <header className="flex items-center w-full gap-3">
                    <h2 className="text-lg font-semibold">Basic Details</h2>
                    <Divider sx={{ borderBottomWidth: 2, borderColor: "#d4d4d4", flexGrow: 1 }} />
                    <button
                      onClick={() => setAddBranch(true)}
                      type="button"
                      className="flex items-center gap-1 p-1 px-3 text-sm bg-transparent rounded-md shadow-none hover:bg-gray-100 text-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      aria-label="Add attachments"
                    >
                      <Icons.add fontSize="small" sx={{ fontSize: "15px" }} />
                      Add Branch
                    </button>
                  </header>
                </div>
                <div className="border-t border-neutral-300">
                  <MasterClientBranchDetailTable />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MasterClientDetail;
