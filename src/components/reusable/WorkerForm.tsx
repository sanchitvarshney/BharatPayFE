import React, { useEffect, useState } from "react";

import { DatePicker } from "antd";
import dayjs, { Dayjs } from "dayjs";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  CircularProgress,
  Box,
  Checkbox,
} from "@mui/material";
import { DataGrid, GridRenderCellParams } from "@mui/x-data-grid";

import { AreaType, DepartmentType, Props } from "@/types/workerTypes";
import {
  getDepartment,
  getEmployees,
  getMasterPlace,
} from "@/features/areaSlice/areaSlice";
import { useDispatch, useSelector } from "react-redux";
import { PlaceType } from "@/features/areaSlice/areaType";
import { LoadingButton } from "@mui/lab";

const WorkerForm: React.FC<Props> = ({
  onFormChange,
  initialDate,
  onclick,
}) => {
  const dispatch = useDispatch<any>();
  const {
    placeList,
    placeLoading,
    departmentList,
    departmentLoading,
    empList,
    empLoading,
    submitLoading,
  } = useSelector((state: any) => state.placeMaster);
  const [area, setArea] = useState<AreaType | null>(null);
  const [department, setDepartment] = useState<DepartmentType | null>(null);

  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<string[]>([]);
  const [date] = useState<Dayjs>(initialDate || dayjs());

  const [areaList, setAreaList] = useState<AreaType[]>([]);
  const [deptList, setDeptList] = useState<DepartmentType[]>([]);

  useEffect(() => {
    if (placeList.length === 0) {
      dispatch(getMasterPlace());
    }
  }, []);

  useEffect(() => {
    setAreaList(placeList);
  }, [placeList]);

  useEffect(() => {
    setDeptList(departmentList);
  }, [departmentList]);

  useEffect(() => {
    if (empList.length === 0) {
      dispatch(getEmployees());
    }
  }, []);

  const fetchDepartments = async (areaId: string) => {
    const payload: any = {
      place: areaId,
    };
    //@ts-ignore
    dispatch(getDepartment(payload));
  };

  useEffect(() => {
    if (area?.id) {
      fetchDepartments(area.id || "");
      setDepartment(null);
    } else {
      setDeptList([]);
      setDepartment(null);
    }
  }, [area]);

  const selectedEmployees = empList.filter((emp: any) =>
    selectedEmployeeIds.includes(emp.id)
  );

  const handleCheckboxChange = (employeeId: string) => {
    setSelectedEmployeeIds((prev) => {
      if (prev.includes(employeeId)) {
        return prev.filter((id) => id !== employeeId);
      } else {
        return [...prev, employeeId];
      }
    });
  };

  useEffect(() => {
    if (onFormChange) {
      onFormChange({
        area,
        department,
        employees: selectedEmployees,
        date,
      });
    }
  }, [area, department, selectedEmployees, date, onFormChange]);

  const handleAreaChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    const selectedArea = areaList.find((a) => a.id === value);
    setArea(selectedArea || null);
  };

  const handleDepartmentChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    const selectedDepartment = deptList.find((d) => d.id === value);
    setDepartment(selectedDepartment || null);
  };

  const columns: any = [
    {
      field: "select",
      headerName: "Select",
      width: 100,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => {
        const isSelected = selectedEmployeeIds.includes(params.row.id);
        return (
          <Checkbox
            checked={isSelected}
            onChange={() => handleCheckboxChange(params.row.id)}
            onClick={(e) => e.stopPropagation()}
          />
        );
      },
    },
    {
      field: "id",
      headerName: "Code",
      width: 150,
      editable: false,
    },
    {
      field: "text",
      headerName: "Full Name",
      width: 150,
      editable: false,
    },
  ];

  return (
    <div>
      <div className="grid grid-cols-3 gap-[20px]">
        {/* Area Select */}
        <FormControl fullWidth variant="outlined">
          <InputLabel id="area-select-label">Select Place</InputLabel>
          <Select
            labelId="area-select-label"
            id="area-select"
            value={area?.id || ""}
            onChange={handleAreaChange}
            label="Select Area"
            disabled={placeLoading}
          >
            {placeLoading ? (
              <MenuItem disabled>
                <CircularProgress size={20} />
                <span style={{ marginLeft: 8 }}>Loading...</span>
              </MenuItem>
            ) : (
              areaList.map((item: PlaceType) => (
                <MenuItem key={item.id} value={item.id}>
                  {item.text}
                </MenuItem>
              ))
            )}
          </Select>
        </FormControl>

        {/* Department Select */}
        <FormControl fullWidth variant="outlined">
          <InputLabel id="department-select-label">
            Select Department
          </InputLabel>
          <Select
            labelId="department-select-label"
            id="department-select"
            value={department?.id || ""}
            onChange={handleDepartmentChange}
            label="Select Department"
            disabled={!area || departmentLoading}
          >
            {departmentLoading ? (
              <MenuItem disabled>
                <CircularProgress size={20} />
                <span style={{ marginLeft: 8 }}>Loading...</span>
              </MenuItem>
            ) : (
              deptList.map((item) => (
                <MenuItem key={item.id} value={item.id}>
                  {item.text}
                </MenuItem>
              ))
            )}
          </Select>
        </FormControl>

        {/* Date Field */}
        <FormControl fullWidth>
          <DatePicker
            className="w-full h-[50px] border-[2px] rounded-sm border-neutral-400/70 hover:border-neutral-400"
            value={date}
            format="DD/MM/YYYY"
            style={{ cursor: "not-allowed" }}
          />
        </FormControl>
      </div>

      {/* Selected Employees List */}
      <div className="mt-4 mb-4">
        <h3 className="text-lg font-semibold mb-3">Selected Employees</h3>
        <Box
          sx={{
            p: 2,
            border: "1px solid #e0e0e0",
            borderRadius: 1,
            backgroundColor: "#fff",
            height: "calc(100vh - 330px)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <DataGrid
            getRowId={(row) => row.id}
            rows={empList || []}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 10,
                },
              },
            }}
            disableColumnSelector
            loading={empLoading}
            pageSizeOptions={[10]}
            disableRowSelectionOnClick
            showToolbar={true}
            sx={{
              flex: 1,
              "& .MuiDataGrid-toolbarContainer": {
                padding: "8px",
              },
              "& .MuiDataGrid-toolbarContainer button[aria-label='Density']": {
                display: "none",
              },
              "& .MuiDataGrid-toolbarContainer button[aria-label='Export']": {
                display: "none",
              },
            }}
          />
        </Box>
      </div>

      <div className="flex justify-end  mt-[15px] mb-[15px]">
        <LoadingButton
          onClick={onclick}
          variant="contained"
          color="primary"
          className=" mt-[20px] mb-[20px] bg-cyan-400 hover:bg-cyan-600"
          loading={submitLoading}
          sx={{ minWidth: "120px" }}
        >
          Submit
        </LoadingButton>
      </div>
    </div>
  );
};

export default WorkerForm;
