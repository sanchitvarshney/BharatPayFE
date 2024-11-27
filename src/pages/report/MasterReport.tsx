import { AppBar, Autocomplete, Checkbox, Chip, FormControlLabel, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
const MasterReport: React.FC = () => {
  const chipLabels = ["All", "Sale Order Code", "Shipment Code", "Sale Order Item Code", "SKU Code", "Shelf Code", "Batch Code", "Facility Code", "Quantity", "Status Code"];
  const [checkedState, setCheckedState] = useState(chipLabels.map(() => false));

  const handleChipClick = (index: number) => {
    console.log("clicked");
    setCheckedState((prevState) => prevState.map((checked, i) => (i === index ? !checked : checked)));
  };
  return (
    <div className="bg-white">
      <AppBar
        elevation={2}
        position="static"
        sx={{ height: 50, p: 0, background: "white", color: "#475569", display: "flex", justifyContent: "center", px: 2 }} // Adjust height here
      >
        <Typography variant="h6" fontWeight={500} fontSize={16} component={"div"}>
          Download Report
        </Typography>
      </AppBar>
      <div className="h-[calc(100vh-100px)] overflow-y-auto p-[20px] flex flex-col gap-[20px]">
        <div className="border border-neutral-400">
          <div className="h-[50px] border-b border-neutral-400">
            <Typography variant="body1" fontWeight={500} fontSize={14} component={"div"} className="px-[20px] flex items-center h-full ">
              CHOOSE REPORT TYPE
            </Typography>
          </div>
          <div className="p-[20px]">
            <Autocomplete
              options={[
                { id: 1, label: "Sales Report" },
                { id: 2, label: "Inventory Report" },
                { id: 3, label: "Employee Report" },
                { id: 4, label: "Financial Report" },
              ]}
              getOptionLabel={(option) => option.label}
              renderInput={(params) => <TextField {...params} label="Choose Report Type" variant="standard" placeholder="Select a report type" />}
              isOptionEqualToValue={(option, value) => option.id === value?.id}
              sx={{ width: 400 }}
            />
          </div>
        </div>
        <div className="border border-neutral-400">
          <div className="h-[50px] border-b border-neutral-400">
            <Typography variant="body1" fontWeight={500} fontSize={14} component={"div"} className="px-[20px] flex items-center h-full ">
              REPORT SCHEDULE
            </Typography>
          </div>
          <div className="p-[20px]">
            <FormControlLabel className="text-slate-600" control={<Checkbox defaultChecked />} label="Schedule Report" />
          </div>
        </div>
        <div className="border border-neutral-400">
          <div className="h-[50px] border-b border-neutral-400">
            <Typography variant="body1" fontWeight={500} fontSize={14} component={"div"} className="px-[20px] flex items-center h-full ">
              CHOOSE COLUMNS
            </Typography>
          </div>
          <div className="p-[20px] flex items-center gap-[10px] flex-wrap">
            {chipLabels.map((label, index) => (
              <Chip
                key={index}
                label={
                  <FormControlLabel
                    className="text-slate-600"
                    onChange={() => {
                      handleChipClick(index);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    control={
                      <Checkbox
                        tabIndex={-1}
                        checked={checkedState[index]} // Controlled Checkbox
                        checkedIcon={<RadioButtonCheckedIcon />}
                        icon={<RadioButtonUncheckedIcon />}
                        sx={{
                          borderRadius: "50%", // Circle checkbox
                        }}
                      />
                    }
                    label={label}
                  />
                }
                variant="outlined"
                clickable
                onClick={(e) => {
                  e.stopPropagation();
                  handleChipClick(index);
                }} // Chip click also toggles checkbox
                sx={{
                  borderRadius: "16px", // Rounded corners for Chip
                  fontSize: "0.875rem", // Adjust font size if needed
                }}
              />
            ))}
          </div>
        </div>
        <div className="border border-neutral-400">
          <div className="h-[50px] border-b border-neutral-400">
            <Typography variant="body1" fontWeight={500} fontSize={14} component={"div"} className="px-[20px] flex items-center h-full ">
              FILTERS
            </Typography>
          </div>
          <div className="p">
            <div className="head h-[50px]  bg-neutral-200 grid grid-cols-[50px_1fr_1fr] items-center">
              <div>
                <Checkbox />
              </div>
              <div>Name</div>
              <div>Value</div>
            </div>
            <div className="body h-auto  grid grid-cols-[50px_1fr_1fr] items-center">
              <div>
                <Checkbox />
              </div>
              <div>Sales code</div>
              <div className="p-[5px]">
                <TextField fullWidth variant="standard" sx={{ width: "80%" }} />
              </div>
            </div>
          </div>
        </div>
        <div className="border border-neutral-400">
          <div className="h-[50px] border-b border-neutral-400">
            <Typography variant="body1" fontWeight={500} fontSize={14} component={"div"} className="px-[20px] flex items-center h-full ">
              EMAIL CONFIRMATION
            </Typography>
          </div>
          <div className="p-[20px]">
            <FormControlLabel className="text-slate-600" control={<Checkbox defaultChecked />} label="Send an email on job completion" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MasterReport;
