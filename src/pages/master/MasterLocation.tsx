import React, { useRef, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import CustomSelect from "@/components/reusable/CustomSelect";
import CustomInput from "@/components/reusable/CustomInput";
import { CustomButton } from "@/components/reusable/CustomButton";
import { HiOutlineRefresh } from "react-icons/hi";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import MasterLocationViewDrawer from "@/components/Drawers/master/MasterLocationViewDrawer";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import TreeDataLocation from "@/table/master/TreeDataLocation";
import { SingleValue } from "react-select";
import { transformGroupSelectData } from "@/utils/transformUtills";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { getLocationAsync } from "@/features/wearhouse/Divicemin/devaiceMinSlice";
import { createLocationAsync } from "@/features/master/location/locationSlice";

type OptionType = {
  value: string;
  label: string;
};
type FormType = {
  name: string;
  address: string;
  parent: OptionType | null;
  type: OptionType | null;
};
const MasterLocation: React.FC = () => {
  const [viewLocation, setViwLocation] = useState<boolean>(false);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const { getLocationLoading, locationData } = useAppSelector((state) => state.divicemin);
  const { createLocationLoading } = useAppSelector((state) => state.location);
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormType>({
    defaultValues: {
      name: "",
      address: "",
      parent: null,
      type: null,
    },
  });

  const onSubmit: SubmitHandler<FormType> = (data) => {
    const newdata = {
      name: data.name,
      address: data.address,
      parent: data.parent!.value,
      type: data.type!.value,
    };
    dispatch(createLocationAsync(newdata)).then((res: any) => {
      if (res.payload?.data?.success) {
        reset();
        
      }
    });
  };

  return (
    <>
      <MasterLocationViewDrawer open={viewLocation} setOpen={setViwLocation} />
      <div className="h-[calc(100vh-50px)] grid grid-cols-[550px_1fr]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-[10px]">
            <Card className="rounded-md ">
              <CardHeader className="h-[60px] p-0 flex flex-col justify-center px-[20px] bg-hbg">
                <CardTitle className="text-slate-600 font-[500]">Add Location</CardTitle>
              </CardHeader>
              <CardContent className="py-[20px]">
                <div>
                  <CustomInput label="Location Name" required {...register("name", { required: "Location Name is required" })} />
                  {errors.name && <span className=" text-[12px] text-red-500">{errors.name.message}</span>}
                </div>
                <div className="grid grid-cols-2 gap-[30px] mt-[30px]">
                  <div>
                    <Controller
                      name="parent"
                      control={control}
                      rules={{ required: "Parent Location is required" }}
                      render={({ field }) => (
                        <CustomSelect
                          onMenuOpen={() => dispatch(getLocationAsync(null))}
                          options={transformGroupSelectData(locationData)}
                          isLoading={getLocationLoading}
                          {...field}
                          required
                          value={field.value}
                          isClearable={true}
                          onChange={(selectedOption) => field.onChange(selectedOption as SingleValue<OptionType>)}
                          placeholder={"Parent Location"}
                          onInputChange={(value) => {
                            if (debounceTimeout.current) {
                              clearTimeout(debounceTimeout.current);
                            }
                            debounceTimeout.current = setTimeout(() => {
                              dispatch(getLocationAsync(!value ? null : value));
                            }, 500);
                          }}
                        />
                      )}
                    />

                    {errors.parent && <span className=" text-[12px] text-red-500">{errors.parent.message}</span>}
                  </div>
                  <div>
                    <Controller
                      name="type"
                      control={control}
                      rules={{ required: "Location Type is required" }}
                      render={({ field }) => (
                        <CustomSelect
                          {...field}
                          options={[
                            { value: "1", label: "Storable" },
                            { value: "0", label: "Non-Storable" },
                          ]}
                          required
                          value={field.value}
                          isClearable={true}
                          onChange={(selectedOption) => field.onChange(selectedOption as SingleValue<OptionType>)}
                          placeholder={"Location Type"}
                        />
                      )}
                    />
                    {errors.type && <span className=" text-[12px] text-red-500">{errors.type.message}</span>}
                  </div>
                </div>
                <div className="py-[20px]">
                  <Label className="text-slate-500 text-[15px] font-[400]">
                    Address <span className="text-red-500">*</span>
                  </Label>
                  <Textarea {...register("address")} className="h-[100px] resize-none" />
                </div>
              </CardContent>
              <CardFooter className="h-[50px] p-0 flex items-center px-[20px] border-t gap-[10px] justify-end">
                <CustomButton onClick={() => reset()} type="button" icon={<HiOutlineRefresh className="h-[18px] w-[18px] text-red-600" />} variant={"outline"}>
                  Reset
                </CustomButton>
                <CustomButton loading={createLocationLoading} icon={<Plus className="h-[18px] w-[18px] " />} className="bg-cyan-700 hover:bg-cyan-800">
                  Add
                </CustomButton>
              </CardFooter>
            </Card>
          </div>
        </form>
        <div>
          <TreeDataLocation setViewLocation={setViwLocation}/>
        </div>
      </div>
    </>
  );
};

export default MasterLocation;
