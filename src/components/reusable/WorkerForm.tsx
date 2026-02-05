import React, { useEffect, useState, useRef } from "react";

import { DatePicker, TimePicker } from "antd";
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
import WorkerFormPreviewModal, { PreviewData } from "./WorkerFormPreviewModal";

const WorkerForm: React.FC<Props> = ({
  onFormChange,
  initialDate,
  initialArea,
  initialDepartment,
  initialEmployees,
  onclick,
  crnID,
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
  const [area, setArea] = useState<AreaType | null>(initialArea || null);
  const [department, setDepartment] = useState<DepartmentType | null>(
    initialDepartment || null,
  );

  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<string[]>(
    initialEmployees?.map((emp) => emp.id) || [],
  );
  const [date, setDate] = useState<Dayjs>(initialDate || dayjs());
  const [startTime, setStartTime] = useState<Dayjs | null>(null);
  const [endTime, setEndTime] = useState<Dayjs | null>(null);
  const [areaList, setAreaList] = useState<AreaType[]>([]);
  const [deptList, setDeptList] = useState<DepartmentType[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);
  const [pendingDepartment, setPendingDepartment] =
    useState<DepartmentType | null>(null);
  const prevSubmitLoadingRef = useRef<boolean>(false);

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
    if (pendingDepartment && departmentList.length > 0) {
      const dept = departmentList.find(
        (d: any) => d.id === pendingDepartment.id,
      );
      if (dept) {
        setDepartment(dept);
        setPendingDepartment(null);
      }
    }
  }, [departmentList, pendingDepartment]);

  useEffect(() => {
    if (date) {
      //@ts-ignore
      dispatch(getEmployees({ date: dayjs(date).format("DD-MM-YYYY") }));
    }
  }, [date]);

  useEffect(() => {
    if (initialArea) {
      setArea(initialArea);
      if (initialArea.id) {
        fetchDepartments(initialArea.id);
      }
    }
  }, [initialArea]);

  useEffect(() => {
    if (initialDepartment && deptList.length > 0) {
      setDepartment(initialDepartment);
    }
  }, [initialDepartment, deptList]);

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
    selectedEmployeeIds.includes(emp.id),
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
        startTime,
      });
    }
  }, [area, department, selectedEmployees, date, startTime, onFormChange]);

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

  const handlePreview = () => {
    if (!area || !department || selectedEmployees.length === 0) {
      return;
    }
    const data = {
      area,
      department,
      employees: selectedEmployees,
      date,
      startTime,
    };
    setPreviewData(data);
    setPreviewOpen(true);
  };

  const handlePreviewConfirm = () => {
    if (onclick && previewData && !submitLoading) {
      onclick();
    }
  };

  useEffect(() => {
    if (prevSubmitLoadingRef.current && !submitLoading && previewOpen) {
      const timer = setTimeout(() => {
        setPreviewOpen(false);
        setPreviewData(null);
      }, 100);
      return () => clearTimeout(timer);
    }
    prevSubmitLoadingRef.current = submitLoading;
  }, [submitLoading, previewOpen]);

  const handleDeleteEmployee = (employeeId: string) => {
    setSelectedEmployeeIds((prev) => prev.filter((id) => id !== employeeId));
    if (previewData) {
      const updatedEmployees = previewData.employees.filter(
        (emp) => emp.id !== employeeId,
      );
      setPreviewData({
        ...previewData,
        employees: updatedEmployees,
      });
    }
  };

  const handlePreviewUpdate = () => {
    if (previewData) {
      setArea(previewData.area);
      setSelectedEmployeeIds(previewData.employees.map((emp) => emp.id));
      setDate(previewData.date);
      setStartTime(previewData.startTime || null);
      if (previewData.area?.id) {
        setPendingDepartment(previewData.department);
        fetchDepartments(previewData.area.id);
      } else {
        setDepartment(previewData.department);
      }

      setPreviewOpen(false);
      setPreviewData(null);
    }
  };

  const handleClosePreview = () => {
    // Prevent closing while submitting
    if (!submitLoading) {
      setPreviewOpen(false);
    }
  };

  const columns: any = [
    {
      field: "select",
      headerName: "Select",
      maxWidth: 90,
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
      maxWidth: 100,
      editable: false,
    },
    {
      field: "text",
      headerName: "Full Name",
      width: 200,
      maxWidth: 200,
      editable: false,
    },
    {
      field: "department",
      headerName: "Department",
      width: 200,
      maxWidth: 200,
      editable: false,
    },
    {
      field: "place",
      headerName: "Place",
      width: 200,
      maxWidth: 200,
      editable: false,
    },
    {
      field: "startTime",
      headerName: "Start Time",
      maxWidth: 200,
      editable: false,
    },
    {
      field: "endTime",
      headerName: "End Time",
      maxWidth: 200,
      editable: false,
    },
  ];

  return (
    <div>
      <div className="grid grid-cols-3 gap-[20px]">
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

        <FormControl fullWidth>
          <DatePicker
            className="w-full h-[50px] border-[2px] rounded-sm border-neutral-400/70 hover:border-neutral-400"
            value={date}
            onChange={(newDate) => {
              newDate && setDate(newDate);
            }}
            format="DD/MM/YYYY"
          />
        </FormControl>
        <FormControl fullWidth>
          <TimePicker
            className="w-full h-[50px] border-[2px] rounded-sm border-neutral-400/70 hover:border-neutral-400"
            value={startTime}
            onChange={(newTime) => setStartTime(newTime)}
            format="hh:mm"
            placeholder="Select Start Time"
            inputReadOnly
          />
        </FormControl>
        {crnID === "CRN7218718" && (
          <FormControl fullWidth>
            <TimePicker
              className="w-full h-[50px] border-[2px] rounded-sm border-neutral-400/70 hover:border-neutral-400"
              value={endTime}
              onChange={(newTime) => setEndTime(newTime)}
              format="hh:mm"
              placeholder="Select End Time"
              inputReadOnly
            />
          </FormControl>
        )}
      </div>

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

      <div className="flex justify-end gap-3 mt-[15px] mb-[15px]">
        <LoadingButton
          onClick={handlePreview}
          variant="outlined"
          color="primary"
          className="mt-[20px] mb-[20px]"
          sx={{ minWidth: "120px" }}
          disabled={!area || !department || selectedEmployees.length === 0}
        >
          Preview
        </LoadingButton>
      </div>

      <WorkerFormPreviewModal
        open={previewOpen}
        previewData={previewData}
        submitLoading={submitLoading}
        onClose={handleClosePreview}
        onDeleteEmployee={handleDeleteEmployee}
        onUpdate={handlePreviewUpdate}
        onConfirm={handlePreviewConfirm}
      />
    </div>
  );
};

export default WorkerForm;
