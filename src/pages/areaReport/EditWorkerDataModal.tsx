import React, { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  CircularProgress,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  getDepartment,
  getMasterPlace,
  updateWorkerData,
} from "@/features/areaSlice/areaSlice";
import { PlaceType } from "@/features/areaSlice/areaType";
import { toast } from "@/components/ui/use-toast";
import { LoadingButton } from "@mui/lab";

export interface WorkerRowData {
  id?: string | number;
  code?: string;
  date?: string;
  department?: string;
  endTime?: string;
  name?: string;
  place?: string;
  startTime?: string;
  ID?: number;
}

interface EditWorkerDataModalProps {
  open: boolean;
  onClose: () => void;
  data: WorkerRowData | null;
  onSuccess?: () => void;
}

const EditWorkerDataModal: React.FC<EditWorkerDataModalProps> = ({
  open,
  onClose,
  data,
  onSuccess,
}) => {
  const dispatch = useDispatch<any>();
  const {
    placeList,
    placeLoading,
    departmentList,
    departmentLoading,
    updateWorkerDataLoading,
  } = useSelector((state: any) => state.placeMaster);

  const [selectedPlaceId, setSelectedPlaceId] = useState<string>("");
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>("");
  const initialSyncedRef = useRef(false);

  useEffect(() => {
    if (open && placeList.length === 0) {
      dispatch(getMasterPlace());
    }
  }, [open, placeList.length, dispatch]);

  useEffect(() => {
    if (!open || !data) {
      if (!open) initialSyncedRef.current = false;
      return;
    }
    const placeMatch = placeList.find((p: PlaceType) => p.text === data.place);
    if (placeMatch) {
      setSelectedPlaceId(placeMatch.id);
      //@ts-ignore
      dispatch(getDepartment({ place: placeMatch.id }));
    } else {
      setSelectedPlaceId("");
      setSelectedDepartmentId("");
    }
  }, [open, data, placeList]);

  useEffect(() => {
    if (
      !open ||
      !data ||
      !selectedPlaceId ||
      initialSyncedRef.current ||
      departmentList.length === 0
    )
      return;
    const placeMatch = placeList.find((p: PlaceType) => p.text === data.place);
    if (placeMatch && placeMatch.id === selectedPlaceId) {
      const deptMatch = departmentList.find(
        (d: PlaceType) => d.text === data.department
      );
      if (deptMatch) {
        setSelectedDepartmentId(deptMatch.id);
        initialSyncedRef.current = true;
      }
    }
  }, [open, data, selectedPlaceId, departmentList, placeList]);

  useEffect(() => {
    if (selectedPlaceId) {
        //@ts-ignore
      dispatch(getDepartment({ place: selectedPlaceId }));
    }
  }, [selectedPlaceId, dispatch]);

  useEffect(() => {
    if (!selectedPlaceId) {
      setSelectedDepartmentId("");
    }
  }, [selectedPlaceId]);

  useEffect(() => {
    if (!open) initialSyncedRef.current = false;
  }, [open]);

  const handlePlaceChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    setSelectedPlaceId(value);
    setSelectedDepartmentId("");
  };

  const handleDepartmentChange = (event: SelectChangeEvent<string>) => {
    setSelectedDepartmentId(event.target.value);
  };

  const handleClose = () => {
    setSelectedPlaceId("");
    setSelectedDepartmentId("");
    onClose();
  };

  const handleSave = () => {
    if (!data || !selectedPlaceId || !selectedDepartmentId) {
      toast({
        description: "Please select place and department.",
        variant: "destructive",
        className: "font-[500]",
        duration: 2000,
      });
      return;
    }
    const uniqueId = data.id ;
    if (uniqueId == null || uniqueId === "") {
      toast({
        description: "Unable to identify worker record.",
        variant: "destructive",
        className: "font-[500]",
        duration: 2000,
      });
      return;
    }
    const payload = {
      id: String(uniqueId),
      place: selectedPlaceId,
      department: selectedDepartmentId,
    };
    //@ts-ignore
    dispatch(updateWorkerData(payload))
      .then((res: any) => {
        if (res?.payload?.data?.success) {
          toast({
            description: res.payload.data.message ?? "Updated successfully.",
            variant: "success",
            className: "font-[500]",
            duration: 1500,
          });
          handleClose();
          onSuccess?.();
        } else {
          toast({
            description:
              res?.payload?.data?.message ?? "Something went wrong.",
            variant: "destructive",
            className: "font-[500]",
            duration: 2000,
          });
        }
      })
      .catch(() => {
        toast({
          description: "Failed to update worker data.",
          variant: "destructive",
          className: "font-[500]",
          duration: 2000,
        });
      });
  };

  const readOnlyFields: { key: keyof WorkerRowData; label: string }[] = [
    { key: "code", label: "Code" },
    { key: "name", label: "Name" },
    { key: "date", label: "Date" },
    { key: "startTime", label: "Start Time" },
    { key: "endTime", label: "End Time" },
  ];

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Worker Data</DialogTitle>
      <DialogContent>
        {data ? (
          <Box display="flex" flexDirection="column" gap={2} pt={0.5}>
            {readOnlyFields.map(({ key, label }) => (
              <Box
                key={key}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                borderBottom="1px solid"
                borderColor="divider"
                py={1}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                  fontWeight={500}
                >
                  {label}
                </Typography>
                <Typography variant="body2">{data[key] ||  "--"}</Typography>
              </Box>
            ))}

            <FormControl fullWidth variant="outlined" size="small" sx={{ mt: 1 }}>
              <InputLabel id="edit-place-select-label">Place</InputLabel>
              <Select
                labelId="edit-place-select-label"
                value={selectedPlaceId}
                onChange={handlePlaceChange}
                label="Place"
                disabled={placeLoading}
              >
                {placeLoading ? (
                  <MenuItem disabled>
                    <CircularProgress size={20} />
                    <span style={{ marginLeft: 8 }}>Loading...</span>
                  </MenuItem>
                ) : (
                  placeList.map((item: PlaceType) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.text}
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>

            <FormControl
              fullWidth
              variant="outlined"
              size="small"
              disabled={!selectedPlaceId || departmentLoading}
            >
              <InputLabel id="edit-department-select-label">
                Department
              </InputLabel>
              <Select
                labelId="edit-department-select-label"
                value={selectedDepartmentId}
                onChange={handleDepartmentChange}
                label="Department"
              >
                {departmentLoading ? (
                  <MenuItem disabled>
                    <CircularProgress size={20} />
                    <span style={{ marginLeft: 8 }}>Loading...</span>
                  </MenuItem>
                ) : (
                  departmentList.map((item: PlaceType) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.text}
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No data selected.
          </Typography>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} variant="outlined" disabled={updateWorkerDataLoading}>
          Cancel
        </Button>
        <LoadingButton
          variant="contained"
          onClick={handleSave}
          loading={updateWorkerDataLoading}
          loadingPosition="start"
          disabled={!selectedPlaceId || !selectedDepartmentId}
        >
          Save
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default EditWorkerDataModal;
