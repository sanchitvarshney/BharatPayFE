import MsterComponentsMaterialListTable from "@/table/master/MsterComponentsMaterialListTable";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import CustomInput from "@/components/reusable/CustomInput";
import CustomSelect from "@/components/reusable/CustomSelect";
import { Textarea } from "@/components/ui/textarea";
import { CustomButton } from "@/components/reusable/CustomButton";
import { HiOutlineRefresh } from "react-icons/hi";
import { IoCheckmark } from "react-icons/io5";
import MasterComponentsUpdateDrawer from "@/components/Drawers/master/MasterComponentsUpdateDrawer";
import MasterComponentsUplaodImageDrawer from "@/components/Drawers/master/MasterComponentsUplaodImageDrawer";
import MasterComponnetsViewImageDrawer from "@/components/Drawers/master/MasterComponnetsViewImageDrawer";
import { Checkbox } from "@/components/ui/checkbox";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { createComponentAsync, getComponentsAsync, getGroupsAsync } from "@/features/master/component/componentSlice";
import { getUOMAsync } from "@/features/master/UOM/UOMSlice";
import { transformGroupSelectData, transformUomSelectData } from "@/utils/transformUtills";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { showToast } from "@/utils/toastUtils";
import { SingleValue } from "react-select";

type OptionType = {
  value: string;
  label: string;
};
export type createComponentdata = {
  component: string;
  part: string;
  uom: OptionType | null;
  group: OptionType | null;
  notes: string;
};
const MasterComponent: React.FC = () => {
  const [update, setUpadte] = useState<boolean>(false);
  const [viewImage, setViewImage] = useState<boolean>(false);
  const [uploadImage, setUploadImage] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<createComponentdata>({
    defaultValues: {
      component: "",
      part: "",
      uom: null,
      group: null,
      notes: "",
    },
  });
  const { UOM, getUOMloading } = useAppSelector((state) => state.uom);
  const { groupList, getGroupListLoading, createComponentLoading } = useAppSelector((state) => state.component);

  const onSubmit: SubmitHandler<createComponentdata> = (data) => {
    if (data.group !== null && data.uom !== null) {
      let newdata = { ...data, uom: data.uom?.value, group: data.group?.value };
      dispatch(createComponentAsync(newdata)).then((res: any) => {
        if (res.payload?.data?.success) {
          reset();
          dispatch(getComponentsAsync());
          showToast({
            description: res.payload.data.message,
            variant: "success",
            className: "font-[500]",
          });
        }
      });
    } else {
      !data.group
        ? showToast({
            description: "Please select a Group ",
            variant: "destructive",
            className: "font-[500]",
          })
        : showToast({
            description: "Please select a UOM",
            variant: "destructive",
            className: "font-[500]",
          });
    }
  };

  useEffect(() => {
    dispatch(getComponentsAsync());
    dispatch(getUOMAsync());
    dispatch(getGroupsAsync());
  }, []);

  return (
    <>
      {/* drawers */}
      <MasterComponentsUpdateDrawer open={update} setOpen={setUpadte} />
      <MasterComponentsUplaodImageDrawer open={uploadImage} setOpen={setUploadImage} />
      <MasterComponnetsViewImageDrawer open={viewImage} setOpen={setViewImage} />
      {/* drawers */}
      <div className="h-[calc(100vh-100px)] grid grid-cols-[550px_1fr]">
        <div className="h-full overflow-y-auto p-[10px]">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Card className="rounded-md ">
              <CardHeader className="h-[60px] p-0 flex flex-col justify-center px-[20px] bg-hbg">
                <CardTitle className="text-slate-600 font-[500]">Add New Component</CardTitle>
              </CardHeader>
              <CardContent className="mt-[30px]">
                <div className="grid grid-cols-2 gap-[30px]">
                  <div>
                    <CustomInput label="Component Name" required={true} {...register("component", { required: "Component Name is required" })} />
                    {errors.component && <span className=" text-[12px] text-red-500">{errors.component.message}</span>}
                  </div>
                  <div>
                    <CustomInput label="Part Code" required={true} {...register("part", { required: "Part Code Name is required" })} />
                    {errors.part && <span className=" text-[12px] text-red-500">{errors.part.message}</span>}
                  </div>
                  <div>
                    <Controller
                      name="uom"
                      control={control}
                      rules={{ required: "You must select a unit" }}
                      render={({ field }) => (
                        <CustomSelect {...field} value={field.value} isClearable={true} onChange={(selectedOption) => field.onChange(selectedOption as SingleValue<OptionType>)} options={transformUomSelectData(UOM)} isLoading={getUOMloading} placeholder={"Select UOM"} />
                      )}
                    />

                    {errors.uom && <span className=" text-[12px] text-red-500">{errors.uom.message}</span>}
                  </div>
                  <div>
                    <Controller
                      name="group"
                      control={control}
                      rules={{ required: "You must select a unit" }}
                      render={({ field }) => (
                        <CustomSelect
                          {...field}
                          value={field.value}
                          isClearable={true}
                          onChange={(selectedOption) => field.onChange(selectedOption as SingleValue<OptionType>)}
                          options={transformGroupSelectData(groupList)}
                          isLoading={getGroupListLoading}
                          placeholder={"Select Group"}
                        />
                      )}
                    />
                    {errors.group && <span className=" text-[12px] text-red-500">{errors.group.message}</span>}
                  </div>
                </div>
                <div className="mt-[30px]">
                  <p className="text-slate-500 tetx-[15px]">
                    Description <span className="text-red-500 text-[15px]">*</span>
                  </p>
                  <Textarea className="h-[100px] resize-none" {...register("notes", { required: "Description Name is required" })} />
                  {errors.notes && <span className=" text-[12px] text-red-500">{errors.notes.message}</span>}
                </div>
              </CardContent>
              <CardFooter className="h-[50px] p-0 flex items-center px-[20px] border-t gap-[10px] justify-end">
                <CustomButton
                  type="button"
                  onClick={() => {
                    reset();
                  }}
                  icon={<HiOutlineRefresh className="h-[18px] w-[18px] text-red-600" />}
                  variant={"outline"}
                >
                  Reset
                </CustomButton>
                <CustomButton loading={createComponentLoading} type="submit" icon={<IoCheckmark className="h-[18px] w-[18px] " />} className="bg-cyan-700 hover:bg-cyan-800">
                  Submit
                </CustomButton>
              </CardFooter>
            </Card>
          </form>
          {/* <Card className="mt-[20px] rounded-md overflow-hidden">
            <CardHeader className="h-[60px] p-0 flex flex-col justify-center px-[20px] bg-hbg">
              <CardTitle className="text-slate-600 font-[500]">HSN Codes</CardTitle>
              <CardDescription> 0 Codes Added</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-[30px] mt-[30px]">
                <div>
                  <CustomSelect required placeholder={"Code"} />
                </div>
                <div>
                  <CustomInput label="Percentage %" required />
                </div>
              </div>
            </CardContent>
            <CardFooter className="h-[50px] p-0 flex items-center px-[20px] border-t gap-[10px] justify-end">
              <CustomButton icon={<HiOutlineRefresh className="h-[18px] w-[18px] text-red-600" />} variant={"outline"}>
                Reset
              </CustomButton>
              <CustomButton icon={<IoCheckmark className="h-[18px] w-[18px] " />} className="bg-cyan-700 hover:bg-cyan-800">
                Submit
              </CustomButton>
            </CardFooter>
          </Card> */}
          <div className="h-[100px]"></div>
        </div>
        <div>
          <div className="h-[40px] flex items-center gap-[20px] justify-end bg-white px-[20px]">
            <div className="flex items-center space-x-2">
              <Checkbox id="terms" className="data-[state=checked]:bg-cyan-800 data-[state=checked]:text-[#fff] border-slate-400" />
              <label htmlFor="terms" className="text-sm font-medium leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-500">
                Show Rejected
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="Disabled" className="data-[state=checked]:bg-cyan-800 data-[state=checked]:text-[#fff] border-slate-400" />
              <label htmlFor="Disabled" className="text-sm font-medium leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-500">
                Show Disabled
              </label>
            </div>
          </div>
          <MsterComponentsMaterialListTable setOpen={setUpadte} open={update} setViewImage={setViewImage} setUploadImage={setUploadImage} viewImage={viewImage} uploadImage={uploadImage} />
        </div>
      </div>
    </>
  );
};

export default MasterComponent;
