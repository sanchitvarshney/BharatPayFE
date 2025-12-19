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
  TextField,
  Autocomplete,
  Box,
  Typography,
  ListItem,
  ListItemText,
  List,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  AreaType,
  DepartmentType,
  EmployeeType,
  Props,
} from "@/types/workerTypes";
import {
  getDepartment,
  getEmployees,
  getMasterPlace,
} from "@/features/areaSlice/areaSlice";
import { useDispatch, useSelector } from "react-redux";
import { PlaceType } from "@/features/areaSlice/areaType";
import { LoadingButton } from "@mui/lab";
import useDebouncedCallback from "@/hooks/useDebouncedCallback";

const WorkerForm
: React.FC<Props> = ({
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
  } = useSelector((state: any) => state.placeMaster);
  const [area, setArea] = useState<AreaType | null>(null);
  const [department, setDepartment] = useState<DepartmentType | null>(null);
  const [employees, setEmployees] = useState<EmployeeType[]>([]);
  const [date] = useState<Dayjs>(initialDate || dayjs());

  const [areaList, setAreaList] = useState<AreaType[]>([]);
  const [deptList, setDeptList] = useState<DepartmentType[]>([]);
  const [employeeList, setEmployeeList] = useState<EmployeeType[]>([]);
  const [selectedEmployee, setSelectedEmployee] =
    useState<EmployeeType[]>([]);


   

  const searchEmployees = (value: string) => {
    const payload: any = {
      search: value,
    };
    //@ts-ignore
    dispatch(getEmployees(payload));
  };

  const debouncedSearchEmployees = useDebouncedCallback(searchEmployees, 500);

  useEffect(() => {
    dispatch(getMasterPlace());
  }, []);

  useEffect(() => {
    setAreaList(placeList);
  }, [placeList]);

  useEffect(() => {
    setDeptList(departmentList);
  }, [departmentList]);

  useEffect(() => {
    setEmployeeList(empList);
  }, [empList]);

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

  useEffect(() => {
    setEmployees(selectedEmployee);
  }, [selectedEmployee]);

  useEffect(() => {
    if (onFormChange) {
      onFormChange({
        area,
        department,
        employees,
        date,
      });
    }
  }, [area, department, employees, date, onFormChange]);

  const handleDeleteEmployee = (employeeId: string) => {
    const updatedEmployees = selectedEmployee.filter(
      (emp) => emp.id !== employeeId
    );
    setSelectedEmployee(updatedEmployees);
  };

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

        {/* Employee Multi-Select */}
        <FormControl fullWidth>
          <Autocomplete
            options={employeeList}
            disableClearable
            multiple
             renderTags={() => null}
            getOptionLabel={(option: any) => option.text}
            
            loading={empLoading}
            value={selectedEmployee}
            onChange={(event, newValue) => {
              console.log(event)
              setSelectedEmployee(newValue)}}
            onInputChange={(event, value) => {
              console.log(event)
              if (value) {
                debouncedSearchEmployees(value);
              }
            }}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search Employee"
                variant="outlined"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {empLoading ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
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
            backgroundColor: "#f5f5f5",
            minHeight:"calc(100vh - 390px)",
              maxHeight:"calc(100vh - 390px)",
              overflowY:"auto"
          }}
        >
          {selectedEmployee.length === 0 ? (
            <Typography color="text.secondary" textAlign={"center"} sx={{ my: 2 }}>
              No employees selected
            </Typography>
          ) : (
            <List sx={{ width: "100%", p: 0 }}>
              {selectedEmployee.map((emp: any, index) => (
                <ListItem
                  key={emp.id}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleDeleteEmployee(emp.id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  }
                  sx={{
                    borderBottom: "1px solid #e0e0e0",
                    "&:last-child": {
                      borderBottom: "none",
                    },
                    "&:hover": {
                      backgroundColor: "rgba(0, 0, 0, 0.04)",
                    },
                  }}
                >
                  <ListItemText primary={`${index + 1}. ${emp.text} (${emp.id})`} />
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </div>

     
      <div className="flex justify-end  mt-[15px] mb-[15px]">
      
        <LoadingButton
        
         onClick={onclick}
          variant="contained"
          color="primary"
          className=" mt-[20px] mb-[20px] bg-cyan-400 hover:bg-cyan-600"
          loading={false}
              sx={{ minWidth: "120px" }}
        >
          Submit
        </LoadingButton>
      </div>
    </div>
  );
};

export default WorkerForm
;
