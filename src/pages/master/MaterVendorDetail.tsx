import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { ButtonBase, IconButton, ListItemIcon, Tab, Tabs, Typography } from "@mui/material";
import React from "react";
import Divider from "@mui/material/Divider";
import MuiTooltip from "@/components/reusable/MuiTooltip";
import { Link, useNavigate } from "react-router-dom";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Fade from "@mui/material/Fade";
const MaterVendorDetail: React.FC = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

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
      <div className="head bg-cyan-50 h-[100px] border-b border-neutral-400/70 flex items-center justify-between">
        <div className="flex items-center justify-between gap-[20px]   ">
          <Button onClick={() => navigate(-1)} className="p-0 pr-2 text-black bg-transparent rounded-none shadow-none rounded-e-md hover:bg-white/70">
            <Icons.left fontSize="small" />
          </Button>
          <div className="flex flex-col min-w-[200px]">
            <div className="flex items-center gap-[10px]">
              <Typography variant="h1" fontSize={17} fontWeight={600}>
                Sachin Maurya
              </Typography>
              <MuiTooltip title="Copy" placement="right">
                <IconButton size="small">
                  <Icons.copy fontSize="small" />
                </IconButton>
              </MuiTooltip>
            </div>
            <Typography variant="body2" color="text.secondary" gutterBottom fontSize={13}>
              sachin.gmail.com
            </Typography>
            <Typography variant="body2" color="success" gutterBottom fontSize={13}>
              Active
            </Typography>
          </div>
          <Divider orientation="vertical" flexItem />
        </div>
        <div className="flex items-center pr-[20px] gap-[30px]">
          <ButtonBase>
            <Button className="p-[5px] px-[8px]  bg-white text-red-600 border border-red-600 hover:bg-white/80">
              <Icons.delete fontSize="small" />
            </Button>
          </ButtonBase>
        </div>
      </div>
      <div className="h-[calc(100vh-150px)]  grid grid-cols-[200px_1fr]">
        <div className="border-r border-neutral-400/70">
          <Tabs selectionFollowsFocus orientation="vertical" value={value2} onChange={handleChange2} aria-label="secondary tabs example">
            <Tab
              value="primary-details"
              label={
                <div className="flex w-full items-start gap-[10px]">
                  <Typography fontSize={13} className="capitalize">
                    Primary Details
                  </Typography>
                </div>
              }
            />
          
            <Tab
              value="GST"
              label={
                <div className="flex w-full items-center gap-[10px]">
                  <Typography fontSize={13} className="capitalize">
                    GST Details
                  </Typography>
                </div>
              }
            />
            <Tab
              value="Branch"
              label={
                <div className="flex w-full items-center gap-[10px]">
                  <Typography fontSize={13} className="capitalize">
                    Branch Details
                  </Typography>
                </div>
              }
            />
            <Tab
              value="attachments"
              label={
                <div className="flex w-full items-center gap-[10px]">
                  <Typography fontSize={13} className="capitalize">
                    Documnets
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
              <div id="primary-details" className="flex items-center w-full gap-3">
                <h2 id="primary-details" className="text-lg font-semibold">
                  Primary Details
                </h2>
                <Divider sx={{ borderBottomWidth: 2, borderColor: "#d4d4d4", flexGrow: 1 }} />
              </div>

              {/* Subsection: Basic Item Details */}
              <section aria-labelledby="basic-item-details" className="mt-8">
                <header className="flex items-center w-full gap-3">
                  <h3 id="basic-item-details" className="text-sm font-medium text-cyan-700">
                    Basic Details
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
                    Edit basic details
                  </button>
                </header>

                {/* Grid: Basic Item Details */}
                <div className="grid grid-cols-4 gap-6 mt-4">
                  {[
                    { label: "Name", value: "Sachin Maurya" },
                    { label: "Email", value: "sachin.gmail.com" },
                    { label: "Pan Number", value: "12348998765" },
                    { label: "CIN Number", value: "123489FGHJK" },
                    { label: "Fax Number", value: "123489FGHJK" },
                    { label: "Payment Terms (in-days)", value: "30" },
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

              <section className="mt-8">
                <header className="flex items-center w-full gap-3">
                  <h3 id="item-prices" className="text-sm font-medium text-cyan-700">
                    Contact Details
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
                    <Icons.add fontSize="small" sx={{ fontSize: "15px" }} />
                    Add Contact Details
                  </button>
                </header>
                <div className="grid grid-cols-4 gap-[30px] mt-[20px]">
                  <div className="flex justify-between w-full items-strat ">
                    <div>
                      <Typography variant="body2" color="textSecondary" className="text-gray-600">
                        Sachin Maurya
                      </Typography>
                      <div className="flex items-center gap-[10px] text-cyan-900">
                        <Icons.email fontSize="small" sx={{ fontSize: "17px" }} />
                        <Typography fontWeight={500}>sachin.gmail.com</Typography>
                      </div>
                      <div className="flex items-center gap-[10px] text-cyan-900">
                        <Icons.call fontSize="small" sx={{ fontSize: "17px" }} />
                        <Typography fontWeight={500}>12348998765</Typography>
                      </div>
                    </div>
                    <div>
                      <IconButton size="small" id="fade-button" aria-controls={open ? "fade-menu" : undefined} aria-haspopup="true" aria-expanded={open ? "true" : undefined} onClick={handleClick}>
                        <Icons.threedotv fontSize="small" />
                      </IconButton>
                      <Menu
                        id="fade-menu"
                        MenuListProps={{
                          "aria-labelledby": "fade-button",
                        }}
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        TransitionComponent={Fade}
                      >
                        <MenuItem onClick={handleClose}>
                          <ListItemIcon>
                            <Icons.edit fontSize="small" />
                          </ListItemIcon>
                          <Typography variant="inherit">Edit</Typography>
                        </MenuItem>
                        <MenuItem onClick={handleClose}>
                          <ListItemIcon>
                            <Icons.delete fontSize="small" color="error" />
                          </ListItemIcon>
                          <Typography variant="inherit">Delete</Typography>
                        </MenuItem>
                      </Menu>
                    </div>
                  </div>
                </div>
              </section>

             

              <section id="GST" aria-labelledby="attachments" className="mt-8">
                <header className="flex items-center w-full gap-3">
                  <h2 className="text-lg font-semibold">GST Details</h2>
                  <Divider sx={{ borderBottomWidth: 2, borderColor: "#d4d4d4", flexGrow: 1 }} />
                  <button type="button" className="flex items-center gap-1 p-1 px-3 text-sm bg-transparent rounded-md shadow-none hover:bg-gray-100 text-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500" aria-label="Add attachments">
                    <Icons.edit fontSize="small" sx={{ fontSize: "15px" }} />
                    Edit GST Detail
                  </button>
                </header>
              </section>
              <div className="grid grid-cols-4 gap-6 mt-4">
                {[
                  { label: "GST Number", value: "123456789" },
                  { label: "E-Invoice Applicability", value: "No" },
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

              <section id="Branch" aria-labelledby="Branch" className="mt-8">
                <header className="flex items-center w-full gap-3">
                  <h2 className="text-lg font-semibold">Branch Details</h2>
                  <Divider sx={{ borderBottomWidth: 2, borderColor: "#d4d4d4", flexGrow: 1 }} />
                  <button type="button" className="flex items-center gap-1 p-1 px-3 text-sm bg-transparent rounded-md shadow-none hover:bg-gray-100 text-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500" aria-label="Add attachments">
                    <Icons.edit fontSize="small" sx={{ fontSize: "15px" }} />
                    Add Branch
                  </button>
                </header>
              </section>
              <header className="flex items-center w-full gap-3 mt-3">
                <h3 id="basic-item-details" className="text-sm font-medium text-cyan-700">
                  Branch 1
                </h3>
                <Divider
                  sx={{
                    borderBottomWidth: 1,
                    borderColor: "#d4d4d4",
                    flexGrow: 1,
                    borderStyle: "dashed",
                  }}
                />
                <button onClick={handleClick} type="button" className="flex items-center gap-1 p-1 px-3 text-sm bg-transparent rounded-md shadow-none hover:bg-gray-100 text-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500" aria-label="Edit basic item details">
                  Manage Branch <Icons.down fontSize="small" />
                </button>
              </header>
              <div className="flex gap-[50px]  mt-4 ">
                <div className="grid w-[80%] grid-cols-4 gap-[20px] ">
                  {[
                    { label: "Branch Name", value: "Noida Branch" },
                    { label: "State", value: "Uttar Pradesh" },
                    { label: "City", value: "Noida" },
                    { label: "Pincode", value: "201304" },
                    { label: "Complete Address", value: "Unit No 321, Tower - 4, Assotech Business Cresterra, Sector 135, Expressway Noida, UP 201304" },
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
              <header className="flex items-center w-full gap-3 mt-3">
                <h3 id="basic-item-details" className="text-sm font-medium text-cyan-700">
                  Branch 2
                </h3>
                <Divider
                  sx={{
                    borderBottomWidth: 1,
                    borderColor: "#d4d4d4",
                    flexGrow: 1,
                    borderStyle: "dashed",
                  }}
                />
                <button onClick={handleClick} type="button" className="flex items-center gap-1 p-1 px-3 text-sm bg-transparent rounded-md shadow-none hover:bg-gray-100 text-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500" aria-label="Edit basic item details">
                  Manage Branch <Icons.down fontSize="small" />
                </button>
              </header>

              <section id="attachments" aria-labelledby="attachments" className="mt-8">
                <header className="flex items-center w-full gap-3">
                  <h2 className="text-lg font-semibold">Documents</h2>
                  <Divider sx={{ borderBottomWidth: 2, borderColor: "#d4d4d4", flexGrow: 1 }} />
                  <button type="button" className="flex items-center gap-1 p-1 px-3 text-sm bg-transparent rounded-md shadow-none hover:bg-gray-100 text-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500" aria-label="Add attachments">
                    <Icons.add fontSize="small" sx={{ fontSize: "15px" }} />
                    Add Documents
                  </button>
                </header>
              </section>
              <div className="grid grid-cols-4 gap-[30px] mt-[20px]">
                <div className="flex justify-between w-full items-strat ">
                  <div>
                    <Typography variant="body2" color="textSecondary" className="text-gray-600">
                      Document 1
                    </Typography>
                    <Typography fontWeight={500} className="text-cyan-900">E-Invoice Document</Typography>
                    <Typography fontWeight={500} className="text-cyan-900" fontSize={13}>Size 2MB</Typography>
                    <Link to="#" className="flex items-center gap-[10px] text-cyan-900 hover:bg-neutral-200 rounded-md p-[2px] ">
                      <Typography fontWeight={500} fontSize={13}>E-InvoicDocumnet.pdf</Typography>
                      <Icons.followLink fontSize="small" sx={{ fontSize: "17px" }} />
                    </Link>
                  </div>
                  <div>
                    <IconButton size="small" id="fade-button" aria-controls={open ? "fade-menu" : undefined} aria-haspopup="true" aria-expanded={open ? "true" : undefined} onClick={handleClick}>
                      <Icons.threedotv fontSize="small" />
                    </IconButton>
                  
                  </div>
                </div>
                <div className="flex justify-between w-full items-strat ">
                  <div>
                    <Typography variant="body2" color="textSecondary" className="text-gray-600">
                      Document 2
                    </Typography>
                    <Typography fontWeight={500} className="text-cyan-900">E-Invoice Document</Typography>
                    <Typography fontWeight={500} className="text-cyan-900" fontSize={13}>Size 2MB</Typography>
                    <Link to="#" className="flex items-center gap-[10px] text-cyan-900 hover:bg-neutral-200 rounded-md p-[2px] ">
                      <Typography fontWeight={500} fontSize={13}>E-InvoicDocumnet.pdf</Typography>
                      <Icons.followLink fontSize="small" sx={{ fontSize: "17px" }} />
                    </Link>
                  </div>
                  <div>
                    <IconButton size="small" id="fade-button" aria-controls={open ? "fade-menu" : undefined} aria-haspopup="true" aria-expanded={open ? "true" : undefined} onClick={handleClick}>
                      <Icons.threedotv fontSize="small" />
                    </IconButton>
                   
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaterVendorDetail;
