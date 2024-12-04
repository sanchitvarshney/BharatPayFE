import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Chip, IconButton, Tab, Tabs, Typography } from "@mui/material";
import React from "react";
import Divider from "@mui/material/Divider";
import MuiTooltip from "@/components/reusable/MuiTooltip";
import { useNavigate } from "react-router-dom";

const MasterComponentDeatil: React.FC = () => {
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

  return (
    <div className="bg-white">
      <div className="head bg-amber-100/50 h-[100px] border-b border-neutral-400/70 flex items-center justify-between">
        <div className="flex gap-[20px] ">
          <Button onClick={() => navigate(-1)} className="p-0 pr-2 text-black bg-transparent rounded-none shadow-none rounded-e-md hover:bg-white/70">
            <Icons.left fontSize="small" />
          </Button>
          <div className="flex flex-col">
            <div className="flex items-center gap-[10px]">
              <Typography variant="h1" fontSize={17} fontWeight={600}>
                Bharatpay Special Tracker (SKU0001){" "}
              </Typography>
              <MuiTooltip title="Copy" placement="right">
                <IconButton size="small">
                  <Icons.copy fontSize="small" />
                </IconButton>
              </MuiTooltip>
            </div>
            <Chip label="Product" size="small" variant="filled" sx={{ maxWidth: "max-content", px: "10px", background: "black", color: "white", fontWeight: 500 }} />
          </div>
          <Divider orientation="vertical" flexItem />
        </div>
        <div className="flex items-center pr-[20px] gap-[30px]">
          {/* <div className="bg-white p-[10px] px-[20px] border border-neutral-300 rounded-md">
            <Typography fontSize={14}>TOTAL STOCK</Typography>
            <div className="flex items-center gap-[10px]">
              <Typography className="text-cyan-700" fontSize={16} fontWeight={600}>
                0 NOS
              </Typography>
              <Divider
                sx={{
                  width: "3px", // Adjust the width of the vertical divider
                  backgroundColor: "gray", // Optional: Set the color
                  margin: "4px 7px", // Optional: Add margin
                }}
                orientation="vertical"
                variant="middle"
                flexItem
              />
              <Typography fontSize={16} fontWeight={600}>
                0.0 $
              </Typography>
            </div>
          </div> */}
          <Button disabled className="py-[5px] px-[10px] bg-white text-red-600 border border-red-600 hover:bg-white/80">
            <Icons.delete />
          </Button>
        </div>
      </div>
      <div className="border-b tsb border-neutral-400/70 ">
        <div className="h-[calc(100vh-151px)]  grid grid-cols-[200px_1fr]">
          <div className="border-r border-neutral-400/70">
            <Tabs selectionFollowsFocus orientation="vertical" value={value2} onChange={handleChange2} aria-label="secondary tabs example">
              <Tab
                value="primary-item-details"
                label={
                  <div className="flex w-full items-start gap-[10px]">
                    <Typography fontSize={13} className="capitalize">
                      Basic Detail
                    </Typography>
                  </div>
                }
              />
              <Tab
                value="stock-in-all-units"
                label={
                  <div className="flex w-full items-start gap-[10px]">
                    <Typography fontSize={13} className="capitalize">
                      Tax Details
                    </Typography>
                  </div>
                }
              />

              <Tab
                value="attachments"
                label={
                  <div className="flex w-full items-center gap-[10px]">
                    <Typography fontSize={13} className="capitalize">
                      Advance Details
                    </Typography>
                  </div>
                }
              />
              <Tab
                value="production-details"
                label={
                  <div className="flex w-full items-center gap-[10px]">
                    <Typography fontSize={13} className="capitalize">
                      Production Details
                    </Typography>
                  </div>
                }
              />
            </Tabs>
          </div>
          <div className="h-full overflow-y-auto  p-[20px]">
            <div>
              {/* Section: Primary Item Details */}
              <section aria-labelledby="primary-item-details">
                <div id="primary-item-details" className="flex items-center w-full gap-3">
                  <h2 id="primary-item-details" className="text-lg font-semibold">
                    Basic Details
                  </h2>
                  <Divider sx={{ borderBottomWidth: 2, borderColor: "#d4d4d4", flexGrow: 1 }} />
                  <button type="button" className="flex items-center gap-1 p-1 px-3 text-sm bg-transparent rounded-md shadow-none hover:bg-gray-100 text-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500" aria-label="Add alternate UOM">
                    <Icons.edit fontSize="small" sx={{ fontSize: "15px" }} />
                    Edit Basic Details
                  </button>
                </div>

                <div className="grid grid-cols-4 gap-6 mt-4">
                  {[
                    { label: "Part Code", value: "SKU00008" },
                    { label: "Component Name", value: "Bharatpay Special Tracker" },
                    { label: "UOM", value: "Buy" },
                    { label: "Type", value: "Product" },
                    { label: "MRP", value: "NOS" },
                    { label: "Group", value: "NOS" },
                    { label: "Attribute Code", value: "" },
                    { label: "Status", value: "" },
                    { label: "Job Work", value: "" },
                    { label: "QC Status", value: "" },
                    { label: "Description", value: "" },
                  ].map(({ label, value }) => (
                    <div key={label} className="py-5">
                      <Typography variant="body2" color="textSecondary" className="text-gray-600">
                        {label}:
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {value || "N/A"}
                      </Typography>
                    </div>
                  ))}
                </div>

                {/* Section: Stock in All Units */}
                <section id="stock-in-all-units" aria-labelledby="stock-details" className="mt-8">
                  <header className="flex items-center w-full gap-3">
                    <h2 id="stock-details" className="text-lg font-semibold">
                      Tax Details
                    </h2>
                    <Divider sx={{ borderBottomWidth: 2, borderColor: "#d4d4d4", flexGrow: 1 }} />
                    <button type="button" className="flex items-center gap-1 p-1 px-3 text-sm bg-transparent rounded-md shadow-none hover:bg-gray-100 text-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500" aria-label="Add alternate UOM">
                      <Icons.edit fontSize="small" sx={{ fontSize: "15px" }} />
                      Edit Tax Details
                    </button>
                  </header>
                  <div className="grid grid-cols-4 gap-6 mt-4">
                    {[
                      { label: "Tax Type", value: "GST" },
                      { label: "Tax Rate (%)", value: "18" },
                    ].map(({ label, value }) => (
                      <div key={label} className="py-5">
                        <Typography variant="body2" color="textSecondary" className="text-gray-600">
                          {label}:
                        </Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {value || "N/A"}
                        </Typography>
                      </div>
                    ))}
                  </div>
                </section>

                <section id="attachments" aria-labelledby="attachments" className="mt-8">
                  <header className="flex items-center w-full gap-3">
                    <h2 id="attachments" className="text-lg font-semibold">
                      Advance Details
                    </h2>
                    <Divider sx={{ borderBottomWidth: 2, borderColor: "#d4d4d4", flexGrow: 1 }} />
                    <button type="button" className="flex items-center gap-1 p-1 px-3 text-sm bg-transparent rounded-md shadow-none hover:bg-gray-100 text-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500" aria-label="Add attachments">
                      <Icons.edit fontSize="small" sx={{ fontSize: "15px" }} />
                      Edit Advance Details
                    </button>
                  </header>
                  <div className="grid grid-cols-4 gap-6 mt-4">
                    {[
                      { label: "Brand", value: "BrandX" },
                      { label: "Ean", value: "1234567890123" },
                      { label: "Weight(gms)", value: "500" },
                      { label: "Height(mm)", value: "150" },
                      { label: "Width(mm)", value: "100" },
                      { label: "Volumetric Weight", value: "750" },
                    ].map(({ label, value }) => (
                      <div key={label} className="py-5">
                        <Typography variant="body2" color="textSecondary" className="text-gray-600">
                          {label}:
                        </Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {value || "N/A"}
                        </Typography>
                      </div>
                    ))}
                  </div>
                </section>
                <section id="production-details" aria-labelledby="production-details" className="mt-8">
                  <header className="flex items-center w-full gap-3">
                    <h2 className="text-lg font-semibold">Production Details</h2>
                    <Divider sx={{ borderBottomWidth: 2, borderColor: "#d4d4d4", flexGrow: 1 }} />
                    <button type="button" className="flex items-center gap-1 p-1 px-3 text-sm bg-transparent rounded-md shadow-none hover:bg-gray-100 text-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500" aria-label="Add attachments">
                      <Icons.edit fontSize="small" sx={{ fontSize: "15px" }} />
                      Edit Production Details
                    </button>
                  </header>
                  <div className="grid grid-cols-4 gap-6 mt-4">
                    {[
                      { label: "Min Stock", value: "50" },
                      { label: "Max Stock", value: "200" },
                      { label: "Min Order", value: "10" },
                      { label: "Lead Time", value: "7 days" },
                      { label: "Enable Alert", value: "true" },
                      { label: "Purchase Cost", value: "150.00" },
                      { label: "Other Cost", value: "25.00" },
                    ].map(({ label, value }) => (
                      <div key={label} className="py-5">
                        <Typography variant="body2" color="textSecondary" className="text-gray-600">
                          {label}:
                        </Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {value || "N/A"}
                        </Typography>
                      </div>
                    ))}
                  </div>
                </section>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MasterComponentDeatil;
