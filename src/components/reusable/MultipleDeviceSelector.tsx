import React, { useEffect, useState } from "react";
import {
  Autocomplete,
  CircularProgress,
  TextField,
  Button,
  IconButton,
  Card,
  CardContent,
  Typography,
  Grid,
} from "@mui/material";
import { Delete as DeleteIcon, Add as AddIcon } from "@mui/icons-material";
import useDebounce from "@/hooks/useDebounce";
import axiosInstance from "@/api/axiosInstance";

export type DeviceType = {
  id: string;
  text: string;
  rate?: number;
  quantity?: number;
};

export type SelectedDeviceType = {
  device: DeviceType;
  rate: number;
  quantity: number;
  hsnCode?: string;
  materialName?: string;
};

type Props = {
  deviceType: string;
  selectedDevices: SelectedDeviceType[];
  onDevicesChange: (devices: SelectedDeviceType[]) => void;
  error?: boolean;
  helperText?: string;
};

const MultipleDeviceSelector: React.FC<Props> = ({
  deviceType,
  selectedDevices,
  onDevicesChange,
  error,
  helperText,
}) => {
  const [inputValue, setInputValue] = useState("");
  const debouncedInputValue = useDebounce(inputValue, 300);
  const [loading, setLoading] = useState<boolean>(false);
  const [deviceList, setDeviceList] = useState<DeviceType[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<DeviceType | null>(null);

  // Fetch devices based on device type
  const fetchDevices = async (query: string | null) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `backend/search/sku/${query}/${deviceType}`
      );
      setDeviceList(response.data.data || []);
    } catch (error) {
      console.error("Error fetching devices:", error);
      setDeviceList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (debouncedInputValue) {
      fetchDevices(debouncedInputValue);
    }
  }, [debouncedInputValue, deviceType]);

  useEffect(() => {
    // Load initial devices when device type changes
    fetchDevices(null);
  }, [deviceType]);

  const handleAddDevice = () => {
    if (selectedDevice) {
      const newDevice: SelectedDeviceType = {
        device: selectedDevice,
        rate: 0,
        quantity: 1,
      };
      onDevicesChange([...selectedDevices, newDevice]);
      setSelectedDevice(null);
      setInputValue("");
    }
  };

  const handleRemoveDevice = (index: number) => {
    const updatedDevices = selectedDevices.filter((_, i) => i !== index);
    onDevicesChange(updatedDevices);
  };

  const handleDeviceUpdate = (
    index: number,
    field: "rate" | "quantity" | "hsnCode" | "materialName",
    value: number | string
  ) => {
    const updatedDevices = [...selectedDevices];
    updatedDevices[index] = {
      ...updatedDevices[index],
      [field]: value,
    };
    onDevicesChange(updatedDevices);
  };

  const isDeviceAlreadySelected = (device: DeviceType) => {
    return selectedDevices.some((selected) => selected.device.id === device.id);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-end">
        <Autocomplete
          onFocus={() => fetchDevices(null)}
          value={selectedDevice}
          onChange={(_, newValue) => {
            console.log(newValue);
            setSelectedDevice(newValue);
          }}
          options={deviceList.filter(
            (device) => !isDeviceAlreadySelected(device)
          )}
          getOptionLabel={(option) => option.text}
          loading={loading}
          isOptionEqualToValue={(option, value) => option.id === value?.id}
          filterSelectedOptions
          onInputChange={(_, newInputValue, reason) => {
            setInputValue(newInputValue || "");
            if (reason === "clear" || newInputValue === "") {
              fetchDevices(null);
            }
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Select Device"
              variant="filled"
              error={error}
              helperText={helperText}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loading ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
          sx={{ flexGrow: 1 }}
        />
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddDevice}
          disabled={!selectedDevice}
        >
          Add
        </Button>
      </div>

      {selectedDevices.length > 0 && (
        <div className="space-y-2">
          <Typography variant="subtitle2" className="font-medium">
            Selected Devices ({selectedDevices.length})
          </Typography>
          {selectedDevices.map((selectedDevice, index) => (
            <Card key={index} variant="outlined" className="border-gray-200">
              <CardContent className="p-3">
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={3}>
                    <Typography variant="body2" className="font-medium">
                      {selectedDevice.device.text}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      label="Material Name"
                      type="text"
                      variant="filled"
                      size="small"
                      fullWidth
                      value={selectedDevice.materialName || ""}
                      onChange={(e) =>
                        handleDeviceUpdate(
                          index,
                          "materialName",
                          e.target.value
                        )
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <TextField
                      label="HSN Number"
                      type="text"
                      variant="filled"
                      size="small"
                      fullWidth
                      value={selectedDevice.hsnCode || ""}
                      onChange={(e) =>
                        handleDeviceUpdate(index, "hsnCode", e.target.value)
                      }
                    />
                  </Grid>
                  <Grid item xs={6} sm={2}>
                    <TextField
                      label="Device Rate"
                      type="number"
                      variant="filled"
                      size="small"
                      fullWidth
                      value={selectedDevice.rate}
                      onChange={(e) =>
                        handleDeviceUpdate(
                          index,
                          "rate",
                          Number(e.target.value)
                        )
                      }
                    />
                  </Grid>
                  <Grid item xs={6} sm={1}>
                    <TextField
                      label="Quantity"
                      type="number"
                      variant="filled"
                      size="small"
                      fullWidth
                      value={selectedDevice.quantity}
                      onChange={(e) =>
                        handleDeviceUpdate(
                          index,
                          "quantity",
                          Number(e.target.value)
                        )
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={1} className="flex justify-end">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleRemoveDevice(index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultipleDeviceSelector;
