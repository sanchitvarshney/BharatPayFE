import MasterBOMCraeteTable from "@/table/master/MasterBOMCraeteTable";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import React, { useCallback, useEffect, useState } from "react";
import MasterBomCraeteFileTable from "@/table/master/MasterBomCraeteFileTable";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { getPertCodesync } from "@/features/production/MaterialRequestWithoutBom/MRRequestWithoutBomSlice";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { getSkuAsync } from "@/features/wearhouse/Divicemin/devaiceMinSlice";
import { createBomAsync } from "@/features/master/BOM/BOMSlice";
import { showToast } from "@/utils/toastUtils";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import SelectSku, { DeviceType } from "@/components/reusable/SelectSku";
import LoadingButton from "@mui/lab/LoadingButton";
import RefreshIcon from "@mui/icons-material/Refresh";
import SaveIcon from "@mui/icons-material/Save";
import ConfirmationModel from "@/components/reusable/ConfirmationModel";
import { generateUniqueId } from "@/utils/uniqueid";
interface RowData {
  id: string;
  component: { lable: string; value: string } | null;
  qty: number;
  isNew: boolean;
  uom: string;
  remark: string;
  reference: string;
}

type FormState = {
  sku: DeviceType | null;
  type: string;
  remark: string;
  subject: string;
  reference: string;
};
const MasterCraeteBOM: React.FC = () => {
  const [option, setOption] = useState<string>("option-manual");
  const [rowData, setRowData] = useState<RowData[]>([]);
  const [alert, setAlert] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const { createBomLoading } = useAppSelector((state) => state.bom);
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormState>({
    defaultValues: {
      sku: null,
      type: "",
      remark: "",
      subject: "",
      reference: "",
    },
  });

  const addRow = useCallback(() => {
    const newId = generateUniqueId();
    const newRow: RowData = {
      id: newId,
      component: null,
      qty: 0,
      isNew: true,
      uom: "",
      remark: "",
      reference: "",
    };
    setRowData((prev) => [newRow, ...prev]);
  }, [rowData]);

  const checkRequiredFields = (data: RowData[]) => {
    let hasErrors = false;
    const requiredFields: Array<keyof RowData> = ["component", "qty"];
    const miss = data.map((item) => {
      const missingFields: string[] = [];
      requiredFields.forEach((field) => {
        // Check if the required field is empty
        if (
          item[field] === "" ||
          item[field] === 0 ||
          item[field] === undefined ||
          item[field] === null
        ) {
          missingFields.push(field);
        }
      });

      if (missingFields.length > 0) {
        return `${item.id}`;
      }
    });

    if (miss.filter((item) => item !== undefined).length > 0) {
      showToast({
        description: `Some required fields are empty: line no. ${miss
          .filter((item) => item !== undefined)
          .reverse()
          .join(", ")}`,
        variant: "destructive",
        duration: 3000,
      });
      hasErrors = true;
    }

    return hasErrors;
  };

  const onSubmit: SubmitHandler<FormState> = (data) => {
    if (rowData.length === 0) {
      showToast({
        description: "Please Add Material Details",
        variant: "destructive",
      });
    } else {
      if (!checkRequiredFields(rowData)) {
        const component = rowData.map((item) => item.component?.value || "");
        const qty = rowData.map((item) => item.qty.toString());
        const reference = rowData.map((item) => item.reference || "");
        const remark = rowData.map((item) => item.remark || "");
        const items = { component, qty, remark, reference };
        dispatch(
          createBomAsync({
            sku: data.sku!.id,
            type: data.type || "",
            remark: data.remark,
            subject: data.subject,
            items,
          })
        ).then((res: any) => {
          if (res.payload.data.success) {
            setRowData([]);
            reset();
          }
        });
      }
    }
  };
  useEffect(() => {
    dispatch(getPertCodesync(null));
    dispatch(getSkuAsync(null));
  }, []);
  return (
    <>
      <ConfirmationModel
        open={alert}
        onClose={() => setAlert(false)}
        title="Are you sure?"
        content="Are you sure you want to reset all the fields ?"
        onConfirm={() => {
          reset();
          setRowData([]);
          setAlert(false);
        }}
        confirmText="Continue"
        cancelText="Cancel"
      />
      <div className="h-[calc(100vh-100px)] grid grid-cols-[500px_1fr]  bg-white">
        <div className="h-full overflow-y-auto border-r border-neutral-300 ">
          <form onSubmit={handleSubmit(onSubmit)} className="p-[20px]">
            <Typography
              className="text-slate-600 "
              fontSize={20}
              fontWeight={500}
            >
              Add New BOM (Bill of Materials)
            </Typography>
            <div className="py-[20px]">
              <RadioGroup
                defaultValue={option}
                className="flex flex-row gap-[20px]"
                onValueChange={(e) => setOption(e)}
                value={option}
              >
                <div
                  className="flex items-center space-x-2 cursor-not-allowed pointer-events-none "
                  title="disabled"
                >
                  <RadioGroupItem
                    value="option-file"
                    id="option-file"
                    className="opacity-50"
                  />
                  <Label
                    htmlFor="option-file"
                    className="opacity-50 text-slate-500"
                  >
                    File
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="option-manual" id="option-manual" />
                  <Label
                    htmlFor="option-manual"
                    className="cursor-pointer text-slate-500"
                  >
                    Manual
                  </Label>
                </div>
              </RadioGroup>
            </div>
            <div className="grid grid-cols-2 gap-[20px] mt-[10px]">
              <div>
                <TextField
                  fullWidth
                  label="BOM Name"
                  {...register("subject", { required: "BOM Name is required" })}
                />
                {errors.subject && (
                  <p className="text-red-500 text-[12px]">
                    {errors.subject.message}
                  </p>
                )}
              </div>
              <div>
                <Controller
                  name="type"
                  control={control}
                  rules={{ required: "Product Type is required" }}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">
                        Product Type
                      </InputLabel>
                      <Select
                        {...field}
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Product Type"
                      >
                        <MenuItem value={"SFG"}>Semi Finished Goods</MenuItem>
                        <MenuItem value={"FG"}>Finished Goods</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
                {errors.type && (
                  <p className="text-red-500 text-[12px]">
                    {errors.type.message}
                  </p>
                )}
              </div>
              <div className="col-span-2">
                <Controller
                  name="sku"
                  control={control}
                  rules={{ required: "SKU is required" }}
                  render={({ field }) => (
                    <SelectSku
                      varient="outlined"
                      size="medium"
                      value={field.value}
                      onChange={(selectedOption) =>
                        field.onChange(selectedOption)
                      }
                    />
                  )}
                />
                {errors.sku && (
                  <span className=" text-[12px] text-red-500">
                    {errors.sku.message}
                  </span>
                )}
              </div>
            </div>
            <div className="mt-[30px]">
              <TextField
                multiline
                rows={3}
                fullWidth
                label="Remark"
                {...register("remark")}
              />
              {errors.subject && (
                <p className="text-red-500 text-[12px]">
                  {errors.subject.message}
                </p>
              )}
            </div>
            <div className="h-[50px] p-0 flex items-center px-[20px]  gap-[10px] justify-end mt-[30px]">
              <Button
                onClick={() => {
                  rowData.length > 0 ? setAlert(true) : reset();
                }}
                type="button"
                startIcon={<RefreshIcon fontSize="small" />}
                variant={"contained"}
                sx={{ backgroundColor: "white", color: "red" }}
              >
                Reset
              </Button>
              <LoadingButton
                loadingPosition="start"
                type="submit"
                variant="contained"
                loading={createBomLoading}
                startIcon={<SaveIcon fontSize="small" />}
              >
                Submit
              </LoadingButton>
            </div>
            {/* <Card className="rounded-md">
            <CardHeader className="h-[60px] p-0 flex flex-col justify-center px-[20px] bg-hbg"></CardHeader>
            <CardContent className="mt-[20px]"></CardContent>

            {option === "option-file" && (
              <CardContent>
                <div className="grid gap-[30px] mt-[30px]">
                  <p className="text-muted-foreground text-[13px]">
                    <strong>Note:</strong>
                    Kindly don't do any changes with columns of the sample file, it can lead to errors.
                  </p>
                  <FileUploaderTest files={files} setFiles={setfiles} />
                </div>
              </CardContent>
            )}
          
          </Card> */}
          </form>
        </div>
        <div>
          {option === "option-manual" ? (
            <MasterBOMCraeteTable
              addRow={addRow}
              rowData={rowData}
              setRowdata={setRowData}
            />
          ) : (
            <MasterBomCraeteFileTable />
          )}
        </div>
      </div>
    </>
  );
};

export default MasterCraeteBOM;
