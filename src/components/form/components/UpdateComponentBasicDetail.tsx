import { LoadingButton } from "@mui/lab";
import { Autocomplete, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { useParams } from "react-router-dom";
import { showToast } from "@/utils/toasterContext";
import { Icons } from "@/components/icons";
import { getComponentDetailSlice, updateCompoenntBasicDetailAsync } from "@/features/master/component/componentSlice";
import SelectUom, { GroupdataType } from "@/components/reusable/SelectUom";
import SelectCategory, { CategoryType } from "@/components/reusable/SelectCategory.";
import SelectSubCategory, { SubCategoryType } from "@/components/reusable/SelectSubCategory";
import { UpdateComponentBasicDetailPayload } from "@/features/master/component/componentType";

type DepartmentOption = { id: string; text: string };

const departmentOptions: DepartmentOption[] = [
  { id: "ASSEMBLY", text: "Assembly" },
  { id: "TRC", text: "TRC" },
];

type FormDataType = {
  name: string;
  uom: GroupdataType | null; // Unit of Measure
  category: CategoryType | null;
  subcategory: SubCategoryType | null;
  mrp: string; // Maximum Retail Price
  status: string; // Assuming status is a binary "Yes" or "No"
  description: string;
  department: DepartmentOption | null;
  rate: string;
};
type Props = {
  detail: {
    name: string;
    uom: string; // Unit of Measure
    category:  {
      code:string;
      name: string;
    };
    subcategory:  {
      code:string;
      name: string;
    };
    mrp: string; // Maximum Retail Price
    status: string; // Assuming status is a binary "Yes" or "No"
    description: string;
    uomId: string;
    department: string;
    rate: string;
  } | null;
  setUpdateBasicDetail: React.Dispatch<React.SetStateAction<boolean>>;
};
const UpdateComponentBasicDetail: React.FC<Props> = ({ detail, setUpdateBasicDetail }) => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { updateCompoenntBasciDetailLoading } = useAppSelector((state) => state.component);
  const defaultValues: FormDataType = {
    name: detail?.name || "",
    uom: { id: detail?.uomId || "", text: detail?.uom || "" },
    category: {catId: detail?.category?.code || "", name: detail?.category?.name || "" },
    subcategory: {catId: detail?.subcategory?.code || "", name: detail?.subcategory?.name || "" },
    mrp: detail?.mrp || "",
    status: detail?.status || "",
    description: detail?.description || "",
    department: departmentOptions.find((opt) => opt.id === detail?.department || opt.text === detail?.department) || null,
    rate: detail?.rate || "",
  };
  const {
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<FormDataType>({
    mode: "all",
    defaultValues,
  });
  const onSubmit = (data: FormDataType) => {
    if (JSON.stringify(data) === JSON.stringify(defaultValues)) return showToast("No changes made", "warning");
    const payload: UpdateComponentBasicDetailPayload = {
      componentKey: id || "",
      name: data.name,
      uom: data.uom?.id || "",
      category: data.category?.catId || "",
      subcategory: data.subcategory?.catId || "",
      mrp: data.mrp,
      status: data.status,
      description: data.description,
      department: data.department?.id || "",
      rate: data.rate,
    };
    dispatch(updateCompoenntBasicDetailAsync(payload)).then((res: any) => {
      if (res.payload?.data?.success) {
        dispatch(getComponentDetailSlice(id || ""));
        setUpdateBasicDetail(false);
      }
    });
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-4 gap-[20px] py-[20px]">
          <Controller
            name="name"
            control={control}
            rules={{
              required: "Component Name is required",
            }}
            render={({ field }) => <TextField error={!!errors.name} helperText={errors?.name?.message} {...field} label="Component Name" variant="filled" />}
          />
          <Controller
            name="mrp"
            control={control}
            rules={{
              required: "MRP is required",
            }}
            render={({ field }) => <TextField error={!!errors.mrp} helperText={errors?.mrp?.message} {...field} label="MRP" variant="filled" />}
          />
          <Controller
            name="uom"
            control={control}
            rules={{
              required: "UOM is required",
            }}
            render={({ field }) => <SelectUom value={field.value} onChange={field.onChange} error={!!errors.uom} helperText={errors?.uom?.message} label="  UOM" varient="filled" />}
          />
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <FormControl variant="filled" fullWidth>
                <InputLabel>Status</InputLabel>
                <Select {...field} label="Status">
                  <MenuItem value={"Y"}>Active</MenuItem>
                  <MenuItem value={"N"}>Inactive</MenuItem>
                  <MenuItem value={"P"}>Pending</MenuItem>
                </Select>
              </FormControl>
            )}
          />
          <Controller name="category" control={control} render={({ field }) => <SelectCategory value={field.value} onChange={field.onChange} error={!!errors.category} helperText={errors?.category?.message} label="Category" variant="filled" />} />
          <Controller
            name="subcategory"
            control={control}
            render={({ field }) => (
              <SelectSubCategory disabled={!watch("category")} categoryId={watch("category")?.catId || ""} value={field.value} onChange={field.onChange} error={!!errors.subcategory} helperText={errors?.subcategory?.message} label="Sub Category" variant="filled" />
            )}
          />
          <Controller
            name="department"
            control={control}
            rules={{
              required: "You must select Department",
            }}
            render={({ field }) => (
              <Autocomplete
                value={field.value}
                options={departmentOptions}
                getOptionLabel={(option) => option.text}
                renderInput={(params) => <TextField {...params} label={"Department"} variant="filled" error={!!errors.department} helperText={errors?.department?.message} />}
                onChange={(_, value) => field.onChange(value)}
                isOptionEqualToValue={(option, value) => option.id === value.id}
              />
            )}
          />
          <Controller
            name="rate"
            control={control}
            rules={{
              required: "Rate is required",
              min: { value: 0, message: "Rate cannot be negative" },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                type="number"
                label="Rate"
                variant="filled"
                error={!!errors.rate}
                helperText={errors?.rate?.message}
                inputProps={{ min: 0, step: "any" }}
                onKeyDown={(e) => {
                  if (e.key === "-" || e.key === "+" || e.key === "e" || e.key === "E") {
                    e.preventDefault();
                  }
                }}
              />
            )}
          />
          <div className="col-span-2">
            <Controller name="description" control={control} render={({ field }) => <TextField fullWidth error={!!errors.name} multiline rows={3} {...field} label="Description" variant="filled" />} />
          </div>
        </div>

        <div className="flex items-center gap-[10px] mt-[20px]">
          <LoadingButton
            disabled={updateCompoenntBasciDetailLoading}
            onClick={() => {
              setUpdateBasicDetail(false);
            }}
            sx={{ background: "white", color: "red" }}
            variant="contained"
            startIcon={<Icons.close />}
          >
            Cancel
          </LoadingButton>
          <LoadingButton loading={updateCompoenntBasciDetailLoading} loadingPosition="start" type="submit" variant="contained" startIcon={<Icons.save />}>
            Save
          </LoadingButton>
        </div>
      </form>
    </div>
  );
};

export default UpdateComponentBasicDetail;
