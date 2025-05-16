import { Icons } from "@/components/icons";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import SelectBranch from "@/components/reusable/SelectBranch";
import { CostCenterType } from "@/components/reusable/SelectCostCenter";
import SelectDevice, { DeviceType } from "@/components/reusable/SelectSku";
import { createTransferRequest } from "@/features/production/MaterialRequestWithoutBom/MRRequestWithoutBomSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import { LoadingButton } from "@mui/lab";
import {
  InputAdornment,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormHelperText,
  Typography,
  IconButton,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import DeleteIcon from "@mui/icons-material/Delete";
import React, { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import axiosInstance from "@/api/axiosInstance";
import { getDeviceDetails } from "@/features/production/Batteryqc/BatteryQcSlice";
import { showToast } from "@/utils/toasterContext";

type FormData = {
  product: DeviceType | null;
  toLocation: any;
  fromLocation: any;
  fromBranch: any;
  toBranch: any;
  quantity: number;
  remark: string;
  cc: CostCenterType | null;
  type: string;
  branchType: string;
};

const ManageBranchTransfer: React.FC = () => {
  const { transferRequestLoading } = useAppSelector(
    (state) => state.materialRequestWithoutBom
  );
  const { deviceDetailLoading } = useAppSelector(
    (state) => state.batteryQcReducer
  );
  const dispatch = useAppDispatch();
  const [rowData, setRowData] = useState<any>([]);
  const [imei, setImei] = useState<string>("");
  const [fromLocationList, setFromLocationList] = useState<any[]>([]);
  const [toLocationList, setToLocationList] = useState<any[]>([]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      product: null,
      toLocation: null,
      fromLocation: null,
      quantity: 1,
      remark: "",
      cc: null,
      type: "soundBox",
    },
  });
  const handleKeyDown = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  };

  const onSubmit: SubmitHandler<FormData> = (data) => {
    if (rowData.length === 0) {
      showToast("Please add at least one device", "error");
      return;
    }
    if (data.fromBranch === data.toBranch) {
      showToast("From and To Branch cannot be the same", "error");
      return;
    }
    const imei = rowData.map((row: any) => row.imei);
    const serial = rowData.map((row: any) => row.srno || "");
    dispatch(
      createTransferRequest({
        imei,
        serial,
        fromBranch: data.fromBranch?.id || "",
        fromLocation: data.fromLocation || "",
        toBranch: data.toBranch?.id || "",
        toLocation: data.toLocation || "",
        product: data.product?.id || "",
        type: data.type,
        qty: data.quantity,
      })
    ).then((res: any) => {
      if (res.payload?.data.success) {
        reset();
        setRowData([]);
        showToast(res.payload.data.message ||"Transfer Request Created Successfully", "success");
      }
    });
  };

  const handleImeiEnter = (imei: string) => {
    dispatch(
      getDeviceDetails({
        imei: imei,
        deviceType: watch("type"),
      })
    ).then((res: any) => {
      if (res.payload.data.success) {
        setImei("");
        const newRowData = res?.payload?.data?.data?.map((device: any) => {
          return {
            imei: device.device_imei || device.imei_no1 || "",
            srno: device.sl_no || "",
            modalNo: device?.p_name || "",
            deviceSku: device?.device_sku || "",
            productKey: device?.product_key || "",
            imei2: device?.imei_no2 || "",
          };
        });
        console.log(newRowData);
        // Update rowData by appending newRowData to the existing rowData
        setRowData((prevRowData: any) => [...newRowData, ...prevRowData]);
      } else {
        showToast(res.payload.data.message, "error");
      }
    });
  };

  const columnDefs: ColDef[] = [
    {
      headerName: "#",
      field: "serialNo",
      sortable: true,
      filter: true,
      valueGetter: "node.rowIndex+1",
      width: 100,
    },
    {
      headerName: "Modal Name",
      field: "modalNo",
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      headerName: "Device SKU",
      field: "deviceSku",
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      headerName: "IMEI",
      field: "imei",
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      headerName: "IMEI2",
      field: "imei2",
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      headerName: "SR No.",
      field: "srno",
      sortable: true,
      filter: true,
      flex: 1,
    },

    {
      headerName: "Actions",
      field: "",
      sortable: false,
      filter: false,
      cellRenderer: (params: any) => (
        <IconButton
          onClick={() => {
            setRowData(
              rowData.filter((row: any) => row.imei !== params.data.imei)
            );
          }}
        >
          <DeleteIcon fontSize="small" color="error" />
        </IconButton>
      ),
      width: 100,
    },
  ];

  const fetchLocations = async (endPoint: string) => {
    // setLoading(true);
    try {
      const response = await axiosInstance.get(`${endPoint}`);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  useEffect(() => {
    if (watch("fromBranch")) {
      fetchLocations(
        `/deviceBranchTransfer/getLocationListBranchWise/${
          watch("fromBranch")?.id
        }`
      ).then((res) => {
        setFromLocationList(res);
      });
    }
  }, [watch("fromBranch")]);

  useEffect(() => {
    if (watch("toBranch")) {
      fetchLocations(
        `/deviceBranchTransfer/getLocationListBranchWise/${
          watch("toBranch")?.id
        }`
      ).then((res) => {
        console.log(res);
        setToLocationList(res);
      });
    }
  }, [watch("toBranch")]);

  return (
    <div className="h-[calc(100vh-100px)] bg-white flex w-full">
      {/* Side form - 1/3 */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-[20px] border-r border-neutral-300 p-[20px] h-full overflow-y-auto"
        style={{ flex: "1 1 0%", minWidth: 0, maxWidth: "33.3333%" }}
        onKeyDown={handleKeyDown}
      >
        <Controller
          name="product"
          rules={{ required: "Device is required" }}
          control={control}
          render={({ field }) => (
            <SelectDevice
              {...field}
              label="Search Device"
              error={!!errors.product}
              helperText={errors?.product?.message}
              onChange={(value) => {
                field.onChange(value);
              }}
            />
          )}
        />
        <Controller
          name="fromBranch"
          rules={{ required: "From Branch is required" }}
          control={control}
          render={({ field }) => (
            <SelectBranch
              {...field}
              label="From Branch"
              error={!!errors.fromBranch}
              helperText={errors?.fromBranch?.message?.toString()}
            />
          )}
        />
        <div>
          <Controller
            name="fromLocation"
            control={control}
            rules={{ required: "From Location is required" }}
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  From Location
                </InputLabel>
                <Select
                  {...field}
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="From Location"
                  onChange={(e) => {
                    const selectedLocation = fromLocationList.find(
                      (loc: any) => loc.loc_name === e.target.value
                    );
                    field.onChange(selectedLocation?.location_key || "");
                  }}
                  value={
                    fromLocationList.find(
                      (loc: any) => loc.location_key === field.value
                    )?.loc_name || ""
                  }
                >
                  {fromLocationList?.length > 0 ? (
                    fromLocationList.map((location: any) => (
                      <MenuItem
                        key={location.location_key}
                        value={location.loc_name}
                      >
                        {location.loc_name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem value="">No Location Found</MenuItem>
                  )}
                </Select>
              </FormControl>
            )}
          />
          {errors.fromLocation && (
            <p className="text-red-500 text-[12px]">
              {errors.fromLocation.message?.toString()}
            </p>
          )}
        </div>

        <Controller
          name="toBranch"
          rules={{ required: "To Branch is required" }}
          control={control}
          render={({ field }) => (
            <SelectBranch
              {...field}
              label="To Branch"
              error={!!errors.toBranch}
              helperText={errors?.toBranch?.message?.toString()}
            />
          )}
        />
        <div>
          <Controller
            name="toLocation" 
            control={control}
            rules={{ required: "To Location is required" }}
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  To Location
                </InputLabel>
                <Select
                  {...field}
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="To Location"
                  onChange={(e) => {
                    const selectedLocation = toLocationList.find(
                      (loc) => loc.loc_name === e.target.value
                    );
                    field.onChange(selectedLocation?.location_key || "");
                  }}
                  value={
                    toLocationList.find(
                      (loc) => loc.location_key === field.value
                    )?.loc_name || ""
                  }
                >
                  {toLocationList?.length > 0 ? (
                    toLocationList.map((location: any) => (
                      <MenuItem
                        key={location.location_key}
                        value={location.loc_name}
                      >
                        {location.loc_name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem value="">No Location Found</MenuItem>
                  )}
                </Select>
              </FormControl>
            )}
          />
          {errors.toLocation && (
            <p className="text-red-500 text-[12px]">
              {errors.toLocation.message?.toString()}
            </p>
          )}
        </div>

        <TextField
          slotProps={{
            htmlInput: {
              min: 1,
            },
          }}
          type="number"
          fullWidth
          label="QTY"
          {...register("quantity", { required: "Quantity is required" })}
          error={!!errors.quantity}
          helperText={errors?.quantity?.message}
          onChange={(e) => {
            register("quantity").onChange(e);
          }}
        />
        <Controller
          name="type"
          control={control}
          rules={{ required: "Device type is required" }}
          render={({ field }) => (
            <FormControl error={!!errors.branchType} component="fieldset">
              <Typography variant="subtitle1" className="mb-2">
                Device Type
              </Typography>
              <RadioGroup
                row
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
              >
                <FormControlLabel
                  value="soundBox"
                  control={<Radio />}
                  label="Soundbox"
                />
                <FormControlLabel
                  value="swipeMachine"
                  control={<Radio />}
                  label="Swipe Machine"
                />
              </RadioGroup>
              {errors.type && (
                <FormHelperText error>{errors.type.message}</FormHelperText>
              )}
            </FormControl>
          )}
        />

        <div className="flex items-center justify-end gap-[10px] h-[50px] border-t border-neutral-300 px-[20px] mt-auto">
          <LoadingButton
            onClick={() => {
              reset();
              setRowData([]);
            }}
            disabled={transferRequestLoading}
            startIcon={<Icons.refreshv2 />}
            variant="contained"
            sx={{ background: "white", color: "red" }}
          >
            Reset
          </LoadingButton>
          <LoadingButton
            loading={transferRequestLoading}
            startIcon={<Icons.save />}
            variant="contained"
            type="submit"
          >
            Submit
          </LoadingButton>
        </div>
      </form>
      {/* Table and IMEI input - 2/3 */}
      <div
        className="flex flex-col p-[20px] h-full"
        style={{ flex: "2 1 0%", minWidth: 0, maxWidth: "66.6666%" }}
      >
        <div className="mb-4" style={{ maxWidth: 400 }}>
          <TextField
            fullWidth
            rows={2}
            value={imei}
            label="Single IMEI/SR No."
            id="standard-adornment-qty"
            aria-describedby="standard-weight-helper-text"
            inputProps={{
              "aria-label": "weight",
            }}
            onChange={(e) => setImei(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleImeiEnter(imei); // Uncomment and implement this function as needed
              }
            }}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    {deviceDetailLoading ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <QrCodeScannerIcon />
                    )}
                  </InputAdornment>
                ),
              },
            }}
          />
        </div>
        <div className="flex-1 min-h-0 w-full">
          <div className=" ag-theme-quartz h-[calc(100vh-250px)] ">
            <AgGridReact
              overlayNoRowsTemplate={OverlayNoRowsTemplate}
              suppressCellFocus={true}
              rowData={rowData}
              columnDefs={columnDefs}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageBranchTransfer;
