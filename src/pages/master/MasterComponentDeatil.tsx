import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Chip, IconButton, Tab, Tabs, Typography } from "@mui/material";
import React from "react";
import Divider from "@mui/material/Divider";
import MuiTooltip from "@/components/reusable/MuiTooltip";
import { useNavigate } from "react-router-dom";
import SelectLocation, { LocationType } from "@/components/reusable/SelectLocation";
import SelectUom, { GroupdataType } from "@/components/reusable/SelectUom";
import { LoadingButton } from "@mui/lab";
import ComponentHistoryTable from "@/table/master/ComponentHistoryTable";
const MasterComponentDeatil: React.FC = () => {
  const [value, setValue] = React.useState("detail");
  const [value2, setValue2] = React.useState("detail1");
  const [location, setLocation] = React.useState<LocationType | null>(null);
  const [uom, setUom] = React.useState<GroupdataType | null>(null);
  const navigate = useNavigate();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
  };
  const handleChange = (_: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
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
          <div className="bg-white p-[10px] px-[20px] border border-neutral-300 rounded-md">
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
          </div>
          <Button className="py-[5px] px-[10px] bg-white text-red-600 border border-red-600 hover:bg-white/80">
            <Icons.delete />
          </Button>
        </div>
      </div>
      <div className="border-b tsb border-neutral-400/70 h-[48px]">
        <Tabs selectionFollowsFocus value={value} onChange={handleChange} aria-label="secondary tabs example">
          <Tab
            value="detail"
            label={
              <div className="flex items-center gap-[10px]">
                <Icons.detail fontSize="small" sx={{ fontSize: "15px" }} />
                <Typography fontSize={14}>Item Details</Typography>
              </div>
            }
          />
          <Tab
            value="history"
            label={
              <div className="flex items-center gap-[10px]">
                <Icons.history fontSize="small" sx={{ fontSize: "15px" }} />
                <Typography fontSize={14}>Item History</Typography>
              </div>
            }
          />
        </Tabs>
        {value === "detail" && (
          <div className="h-[calc(100vh-198px)]  grid grid-cols-[200px_1fr]">
            <div className="border-r border-neutral-400/70">
              <Tabs selectionFollowsFocus orientation="vertical" value={value2} onChange={handleChange2} aria-label="secondary tabs example">
                <Tab
                  value="primary-item-details"
                  label={
                    <div className="flex w-full items-start gap-[10px]">
                      <Typography fontSize={13} className="capitalize">
                        Primary Item Details
                      </Typography>
                    </div>
                  }
                />
                <Tab
                  value="stock-in-all-units"
                  label={
                    <div className="flex w-full items-start gap-[10px]">
                      <Typography fontSize={13} className="capitalize">
                        Stock in all units
                      </Typography>
                    </div>
                  }
                />

                <Tab
                  value="attachments"
                  label={
                    <div className="flex w-full items-center gap-[10px]">
                      <Typography fontSize={13} className="capitalize">
                        Attachments
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
                      Primary Item Details
                    </h2>
                    <Divider sx={{ borderBottomWidth: 2, borderColor: "#d4d4d4", flexGrow: 1 }} />
                  </div>

                  {/* Subsection: Basic Item Details */}
                  <section aria-labelledby="basic-item-details" className="mt-8">
                    <header className="flex items-center w-full gap-3">
                      <h3 id="basic-item-details" className="text-sm font-medium text-cyan-700">
                        Basic Item Details
                      </h3>
                      <Divider
                        sx={{
                          borderBottomWidth: 1,
                          borderColor: "#d4d4d4",
                          flexGrow: 1,
                          borderStyle: "dashed",
                        }}
                      />
                      <button type="button" className="flex items-center gap-1 p-1 px-3 text-sm bg-transparent rounded-md shadow-none hover:bg-gray-100 text-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500" aria-label="Edit basic item details">
                        <Icons.edit fontSize="small" sx={{ fontSize: "15px" }} />
                        Edit basic item details
                      </button>
                    </header>

                    {/* Grid: Basic Item Details */}
                    <div className="grid grid-cols-4 gap-6 mt-4">
                      {[
                        { label: "Item ID", value: "SKU00008" },
                        { label: "Item Name", value: "Bharatpay Special Tracker" },
                        { label: "Type", value: "Buy" },
                        { label: "Item Category", value: "Product" },
                        { label: "Base Unit", value: "NOS" },
                        { label: "Tax", value: "NOS" },
                        { label: "HSN Code", value: "" },
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

                  {/* Subsection: Item Prices */}
                  <section aria-labelledby="item-prices" className="mt-8">
                    <header className="flex items-center w-full gap-3">
                      <h3 id="item-prices" className="text-sm font-medium text-cyan-700">
                        Item Prices
                      </h3>
                      <Divider
                        sx={{
                          borderBottomWidth: 1,
                          borderColor: "#d4d4d4",
                          flexGrow: 1,
                          borderStyle: "dashed",
                        }}
                      />
                      <button type="button" className="flex items-center gap-1 p-1 px-3 text-sm bg-transparent rounded-md shadow-none hover:bg-gray-100 text-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500" aria-label="Edit item prices">
                        <Icons.edit fontSize="small" sx={{ fontSize: "15px" }} />
                        Edit Item Prices
                      </button>
                    </header>

                    {/* Grid: Item Prices */}
                    <div className="grid grid-cols-4 gap-6 mt-4">
                      {[
                        { label: "Default Price", value: "₹10.00" },
                        { label: "Regular Buying Price", value: "₹0.00" },
                        { label: "Wholesale Buying Price", value: "₹0.00" },
                        { label: "MRP", value: "₹0.00" },
                        { label: "Dealer Price", value: "₹0.00" },
                        { label: "Distributor Price", value: "₹0.00" },
                        { label: "Regular Selling Price", value: "₹0.00" },
                      ].map(({ label, value }) => (
                        <div key={label} className="py-5">
                          <Typography variant="body2" color="textSecondary" className="text-gray-600">
                            {label}:
                          </Typography>
                          <Typography variant="body1" fontWeight={500}>
                            {value}
                          </Typography>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Section: Stock in All Units */}
                  <section id="stock-in-all-units" aria-labelledby="stock-details" className="mt-8">
                    <header className="flex items-center w-full gap-3">
                      <h2 id="stock-details" className="text-lg font-semibold">
                        Stock in All Units
                      </h2>
                      <Divider sx={{ borderBottomWidth: 2, borderColor: "#d4d4d4", flexGrow: 1 }} />
                      <button type="button" className="flex items-center gap-1 p-1 px-3 text-sm bg-transparent rounded-md shadow-none hover:bg-gray-100 text-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500" aria-label="Add alternate UOM">
                        <Icons.add fontSize="small" sx={{ fontSize: "15px" }} />
                        Add alternate UOM
                      </button>
                    </header>
                    <div className="flex gap-[50px] px-4 py-2 mt-4 rounded-md bg-neutral-200 max-w-max">
                      <div>
                        <Typography variant="body2" color="textSecondary" className="text-gray-600">
                          Stock:
                        </Typography>
                        <Typography variant="body1" fontWeight={500}>
                          0 NOS
                        </Typography>
                      </div>
                      <div>
                        <Typography variant="body2" color="textSecondary" className="text-gray-600">
                          Price Per Unit:
                        </Typography>
                        <Typography variant="body1" fontWeight={500}>
                          ₹10.00
                        </Typography>
                      </div>
                    </div>
                  </section>

                  {/* Section: Attachments */}
                  <section id="attachments" aria-labelledby="attachments" className="mt-8">
                    <header className="flex items-center w-full gap-3">
                      <h2 id="attachments" className="text-lg font-semibold">
                        Attachments
                      </h2>
                      <Divider sx={{ borderBottomWidth: 2, borderColor: "#d4d4d4", flexGrow: 1 }} />
                      <button type="button" className="flex items-center gap-1 p-1 px-3 text-sm bg-transparent rounded-md shadow-none hover:bg-gray-100 text-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500" aria-label="Add attachments">
                        <Icons.add fontSize="small" sx={{ fontSize: "15px" }} />
                        Add Attachments
                      </button>
                    </header>
                  </section>
                </section>
              </div>
            </div>
          </div>
        )}
        {value === "history" && (
          <div>
            <div className="flex items-center gap-[20px] justify-between h-[100px] px-[20px]">
              <div className="flex items-center gap-[20px]">
              <SelectLocation width="300px" value={location} varient="filled" onChange={setLocation} />
              <SelectUom varient="filled" value={uom} width="300px" onChange={setUom} />
              </div>
              <LoadingButton variant="contained" size="small" sx={{background:"white",color:"green"}} startIcon={<Icons.download fontSize="small" />}>Download</LoadingButton>
            </div>
            <ComponentHistoryTable/>
          </div>
        )}
      </div>
    </div>
  );
};

export default MasterComponentDeatil;
