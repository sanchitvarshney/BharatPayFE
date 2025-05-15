import { Icons } from "@/components/icons";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import SelectBranch from "@/components/reusable/SelectBranch";
import { CostCenterType } from "@/components/reusable/SelectCostCenter";
import SelectLocationAcordingModule, {
  LocationType,
} from "@/components/reusable/SelectLocationAcordingModule";
import SelectDevice, { DeviceType } from "@/components/reusable/SelectSku";
import { resetBomDetail } from "@/features/master/BOM/BOMSlice";
import { createProductRequest } from "@/features/production/MaterialRequestWithoutBom/MRRequestWithoutBomSlice";
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
} from "@mui/material";
import { ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import DeleteIcon from "@mui/icons-material/Delete";
import React, { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

type FormData = {
  device: DeviceType | null;
  siftLocation: LocationType | null;
  pickLocation: LocationType | null;
  fromBranch: any;
  toBranch: any;
  quantity: number;
  remark: string;
  cc: CostCenterType | null;
  deviceType: string;
  branchType: string;
};

const ManageBranchTransfer: React.FC = () => {
  const { createProductRequestLoading } = useAppSelector(
    (state) => state.materialRequestWithoutBom
  );
  const dispatch = useAppDispatch();
  const [rowData, setRowData] = useState<any>([]);
  const [imei, setImei] = useState<string>("");

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      device: null,
      siftLocation: null,
      pickLocation: null,
      quantity: 1,
      remark: "",
      cc: null,
      deviceType: "",
      branchType: "main",
    },
  });
  const handleKeyDown = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  };

  const onSubmit: SubmitHandler<FormData> = (data) => {
    // if (bomCompDetail) {
    const itemKey = rowData.map((row: any) => row.compKey);
    const picLocation = rowData.map(() => data.pickLocation?.code || "");
    const qty = rowData.map((row: any) => row.requiredQty);
    const remark = rowData.map((row: any) => row.remark || "");
    dispatch(
      createProductRequest({
        itemKey,
        picLocation,
        qty,
        remark,
        reqType: "PART",
        putLocation: data.siftLocation?.code || "",
        comment: data.remark,
        cc: data.cc?.id || "",
      })
    ).then((res: any) => {
      if (res.payload?.data.success) {
        reset();
        setRowData([]);
        dispatch(resetBomDetail());
      }
    });
    // }
  };

  const handleImeiEnter = (imei: string) => {
    setRowData([...rowData, { imei: imei }]);
    setImei("");
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
      headerName: "IMEI",
      field: "imei",
      sortable: true,
      filter: true,
      width: 500,
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
          name="device"
          rules={{ required: "Device is required" }}
          control={control}
          render={({ field }) => (
            <SelectDevice
              {...field}
              label="Search Device"
              error={!!errors.device}
              helperText={errors?.device?.message}
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
        <Controller
          name="pickLocation"
          control={control}
          rules={{ required: "Pick Location is required" }}
          render={({ field }) => (
            <SelectLocationAcordingModule
              label="Pick Location"
              endPoint={`/deviceBranchTransfer/getLocationListBranchWise/${
                watch("fromBranch")?.id
              }`}
              error={!!errors.pickLocation}
              helperText={errors.pickLocation?.message}
              value={field.value}
              onChange={(e) => {
                field.onChange(e);
              }}
            />
          )}
        />
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
        <Controller
          name="siftLocation"
          control={control}
          rules={{ required: "Shift Location is required" }}
          render={({ field }) => (
            <SelectLocationAcordingModule
              label="Shift Location"
              endPoint={`/deviceBranchTransfer/getLocationListBranchWise/${
                watch("toBranch")?.id
              }`}
              error={!!errors.siftLocation}
              helperText={errors.siftLocation?.message?.toString()}
              value={field.value}
              onChange={(e) => {
                field.onChange(e);
              }}
            />
          )}
        />

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
          name="branchType"
          control={control}
          rules={{ required: "Branch type is required" }}
          render={({ field }) => (
            <FormControl error={!!errors.branchType} component="fieldset">
              <Typography variant="subtitle1" className="mb-2">
                Branch Type
              </Typography>
              <RadioGroup
                row
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
              >
                <FormControlLabel
                  value="main"
                  control={<Radio />}
                  label="Main Branch"
                />
                <FormControlLabel
                  value="sub"
                  control={<Radio />}
                  label="Sub Branch"
                />
              </RadioGroup>
              {errors.branchType && (
                <FormHelperText error>
                  {errors.branchType.message}
                </FormHelperText>
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
            disabled={createProductRequestLoading}
            startIcon={<Icons.refreshv2 />}
            variant="contained"
            sx={{ background: "white", color: "red" }}
          >
            Reset
          </LoadingButton>
          <LoadingButton
            loading={createProductRequestLoading}
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
                    <QrCodeScannerIcon />
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
