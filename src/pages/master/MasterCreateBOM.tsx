import { CustomButton } from "@/components/reusable/CustomButton";
import CustomInput from "@/components/reusable/CustomInput";
import CustomSelect from "@/components/reusable/CustomSelect";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import MasterBOMCraeteTable from "@/table/master/MasterBOMCraeteTable";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { HiOutlineRefresh } from "react-icons/hi";
import { IoCheckmark } from "react-icons/io5";
import FileUploaderTest from "@/components/reusable/FileUploaderTest";
import MasterBomCraeteFileTable from "@/table/master/MasterBomCraeteFileTable";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { getPertCodesync } from "@/features/production/MaterialRequestWithoutBom/MRRequestWithoutBomSlice";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { SingleValue } from "react-select";
import { transformGroupSelectData } from "@/utils/transformUtills";
import { getSkuAsync } from "@/features/wearhouse/Divicemin/devaiceMinSlice";
import { createBomAsync } from "@/features/master/BOM/BOMSlice";
import { showToast } from "@/utils/toastUtils";
interface RowData {
  id: number;
  component: string;
  qty: number;
  isNew: boolean;
}
type OptionType = {
  value: string;
  label: string;
};
type FormState = {
  sku: OptionType | null;
  type: OptionType | null;
  remark: string;
  subject: string;
};
const MasterCraeteBOM: React.FC = () => {
  const [option, setOption] = useState<string>("option-manual");
  const [files, setfiles] = useState<File[] | null>(null);
  const [rowData, setRowData] = useState<RowData[]>([]);
  const [product, setProduct] = useState<String>("");
  const dispatch = useAppDispatch();
  const { skuData, skuLoading } = useAppSelector((state) => state.divicemin);
  const { createBomLoading } = useAppSelector((state) => state.bom);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const {
    register,
    handleSubmit,
    control,

    reset,
    formState: { errors },
  } = useForm<FormState>({
    defaultValues: {
      sku: null,
      type: null,
      remark: "",
      subject: "",
    },
  });

  const addRow = useCallback(() => {
    const newId = rowData.length + 1;
    const newRow: RowData = {
      id: newId,
      component: "",
      qty: 0,
      isNew: true,
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
        if (item[field] === "" || item[field] === 0 || item[field] === undefined || item[field] === null) {
          missingFields.push(field);
        }
      });

      if (missingFields.length > 0) {
        return `${item.id}`;
      }
    });
    console.log(miss.filter((item) => item !== undefined));
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
        const component = rowData.map((item) => item.component);
        const qty = rowData.map((item) => item.qty.toString());
        const items = { component, qty };
        dispatch(
          createBomAsync({
            sku: data.sku!.value,
            type: data.type!.value,
            remark: data.remark,
            subject: data.subject,
            items,
          })
        ).then((res: any) => {
          if (res.payload.data.success) {
            setRowData([]);
            reset();
            setProduct("");
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
    <div className="h-[calc(100vh-100px)] grid grid-cols-[500px_1fr]">
      <div className="p-[10px] h-full overflow-y-auto">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card className="rounded-md">
            <CardHeader className="h-[60px] p-0 flex flex-col justify-center px-[20px] bg-hbg">
              <CardTitle className="text-slate-600 font-[500]">Add New Component</CardTitle>
            </CardHeader>
            <CardContent className="mt-[20px]">
              <div className="py-[20px]">
                <RadioGroup defaultValue={option} className="flex flex-row gap-[20px]" onValueChange={(e) => setOption(e)} value={option}>
                  <div className="flex items-center space-x-2 cursor-not-allowed pointer-events-none " title="disabled">
                    <RadioGroupItem value="option-file" id="option-file" className="opacity-50" />
                    <Label htmlFor="option-file" className="opacity-50 text-slate-500">
                      File
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="option-manual" id="option-manual" />
                    <Label htmlFor="option-manual" className="cursor-pointer text-slate-500">
                      Manual
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="grid grid-cols-2 gap-[30px] mt-[10px]">
                <div>
                  <CustomInput label="BOM Name" required={true} {...register("subject", { required: "BOM Name is required" })} />
                  {errors.subject && <p className="text-red-500 text-[12px]">{errors.subject.message}</p>}
                </div>
                <div>
                  <Controller
                    name="type"
                    control={control}
                    rules={{ required: "Product Type is required" }}
                    render={({ field }) => (
                      <CustomSelect
                        {...field}
                        defaultValue={{ value: "V01", label: "Vendor" }}
                        options={[
                          { value: "SFG", label: "Semi Finished Goods" },
                          { value: "FG", label: "Finished Goods" },
                        ]}
                        required
                        value={field.value}
                        isClearable={true}
                        onChange={(selectedOption) => field.onChange(selectedOption as SingleValue<OptionType>)}
                        placeholder={"Product Type"}
                      />
                    )}
                  />
                  {errors.type && <p className="text-red-500 text-[12px]">{errors.type.message}</p>}
                </div>
                <div>
                  <Controller
                    name="sku"
                    control={control}
                    rules={{ required: "SKU is required" }}
                    render={({ field }) => (
                      <CustomSelect
                        options={transformGroupSelectData(skuData)}
                        isLoading={skuLoading}
                        {...field}
                        required
                        value={field.value}
                        isClearable={true}
                        onChange={(selectedOption) => {
                          field.onChange(selectedOption as SingleValue<OptionType>);
                          setProduct(selectedOption?.label as string);
                        }}
                        placeholder={"SKU"}
                        onInputChange={(value) => {
                          if (debounceTimeout.current) {
                            clearTimeout(debounceTimeout.current);
                          }
                          debounceTimeout.current = setTimeout(() => {
                            dispatch(getSkuAsync(!value ? null : value));
                          }, 500);
                        }}
                      />
                    )}
                  />
                  {errors.sku && <span className=" text-[12px] text-red-500">{errors.sku.message}</span>}
                </div>
                <div>
                  <p className="font-[500] text-slate-600">Product</p>
                  <p className="text-slate-500 text-[14px]">{product}</p>
                </div>
              </div>
            </CardContent>

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
            <CardFooter className="h-[50px] p-0 flex items-center px-[20px] border-t gap-[10px] justify-end">
              <CustomButton type="button" icon={<HiOutlineRefresh className="h-[18px] w-[18px] text-red-600" />} variant={"outline"}>
                Reset
              </CustomButton>
              <CustomButton loading={createBomLoading} icon={<IoCheckmark className="h-[18px] w-[18px] " />} className="bg-cyan-700 hover:bg-cyan-800">
                Submit
              </CustomButton>
            </CardFooter>
          </Card>
        </form>
      </div>
      <div>{option === "option-manual" ? <MasterBOMCraeteTable addRow={addRow} rowData={rowData} setRowdata={setRowData} /> : <MasterBomCraeteFileTable />}</div>
    </div>
  );
};

export default MasterCraeteBOM;
