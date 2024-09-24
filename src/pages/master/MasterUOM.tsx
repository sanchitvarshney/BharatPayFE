import React, { useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import CustomInput from "@/components/reusable/CustomInput";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CustomButton } from "@/components/reusable/CustomButton";
import { HiOutlineRefresh } from "react-icons/hi";
import { IoCheckmark } from "react-icons/io5";
import MasterUomTable from "@/table/master/MasterUomTable";
import { useForm, SubmitHandler } from "react-hook-form";
import { UOM } from "@/features/master/UOM/UOMType";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { createUomAsync, getUOMAsync } from "@/features/master/UOM/UOMSlice";
import { useToast } from "@/components/ui/use-toast";

const MasterUOM: React.FC = () => {
  const dispatch = useAppDispatch();
  const {createUOMloading} = useAppSelector((state) => state.uom);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UOM>();

  const onSubmit: SubmitHandler<UOM> = (data) => {
    dispatch(createUomAsync(data)).then((res: any) => {
      if (res.payload?.data?.success) {
        reset();
        dispatch(getUOMAsync());
        toast({
          description: res.payload.data.message,
          variant: "success",
          className: "font-[500]",
        });
      }
    });
  };
  useEffect(() => {
    dispatch(getUOMAsync());
  }, []);
  return (
    <div className="h-[calc(100vh-50px)]  flex py-[20px] justify-center">
      <div className="grid  w-[70%] grid-cols-[400px_1fr] gap-[20px]">
        <div className="w-full">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Card className="overflow-hidden rounded-md">
              <CardHeader className="p-0 h-[40px] flex justify-center px-[10px] bg-hbg border-b">
                <CardTitle className="font-[500] text-slate-600">Create UOM</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="py-[20px] flex flex-col gap-[30px]">
                  <div>
                    <CustomInput required label="Unit" {...register("uom", { required: "unit is required" })} />
                    {errors.uom && <span className=" text-[12px] text-red-500">{errors.uom.message}</span>}
                  </div>
                  <div className="flex flex-col gap-[10px]">
                    <Label className="text-slate-600 font-[400]">
                      Specification <span className="text-[15px] text-red-500">*</span>
                    </Label>
                    <div>
                      <Textarea className="h-[100px] resize-none" {...register("description", { required: "specification is required" })} />
                      {errors.description && <span className=" text-[12px] text-red-500">{errors.description.message}</span>}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="h-[50px] p-0 flex items-center px-[20px] border-t gap-[10px]">
                <CustomButton onClick={() => reset()} type="button" icon={<HiOutlineRefresh className="h-[18px] w-[18px] text-red-600" />} variant={"outline"}>
                  Reset
                </CustomButton>
                <CustomButton type="submit" loading={createUOMloading} icon={<IoCheckmark className="h-[18px] w-[18px] " />} className="bg-cyan-700 hover:bg-cyan-800">
                  Submit
                </CustomButton>
              </CardFooter>
            </Card>
          </form>
        </div>
        <div>
          <Card className="p-0 overflow-hidden rounded-md">
            <CardContent className="p-0">
              <MasterUomTable />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MasterUOM;
