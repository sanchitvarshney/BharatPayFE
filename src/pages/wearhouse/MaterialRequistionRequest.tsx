import MrRequisitionReqTable from "@/table/wearhouse/MrRequisitionReqTable";
import React, { useRef } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import CustomSelect from "@/components/reusable/CustomSelect";
import { CustomButton } from "@/components/reusable/CustomButton";
import { Download, Search } from "lucide-react";
import CustomDatePicker from "@/components/reusable/CustomDatePicker";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { getUserAsync } from "@/features/common/commonSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { SingleValue } from "react-select";
import { transformGroupSelectData } from "@/utils/transformUtills";
import moment from "moment";

type Fomrstate = {
  user: OptionType | null;
  date: string;
};

type OptionType = {
  value: string;
  label: string;
};
const MaterialRequistionRequest: React.FC = () => {
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const dispatch = useAppDispatch();
  const { userData, getUserLoading } = useAppSelector((state) => state.common);
  const {
   
    handleSubmit,
  
    control,
    formState: { errors },
  } = useForm<Fomrstate>({
    defaultValues: {
      user: null,
      date: "",
    },
  });
  const onSubmit: SubmitHandler<Fomrstate> = (data) => {
    console.log(data)
  }
  ;

  return (
    <div className="h-[calc(100vh-100px)] grid grid-cols-[400px_1fr]">
      <div className="p-[10px] h-full overflow-y-auto">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card className="rounded-md ">
            <CardHeader className="h-[50px] p-0 flex flex-col justify-center px-[20px] bg-hbg">
              <CardTitle className="text-slate-600 font-[500]">HSN Codes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid  gap-[40px] mt-[30px]">
                <div>
                  <Controller
                    name="user"
                    control={control}
                    rules={{ required: "User is required" }}
                    render={({ field }) => (
                      <CustomSelect
                        options={transformGroupSelectData(userData)}
                        isLoading={getUserLoading}
                        {...field}
                        required
                        value={field.value}
                        isClearable={true}
                        onChange={(selectedOption) => field.onChange(selectedOption as SingleValue<OptionType>)}
                        placeholder={"User"}
                        onInputChange={(value) => {
                          if (debounceTimeout.current) {
                            clearTimeout(debounceTimeout.current);
                          }
                          debounceTimeout.current = setTimeout(() => {
                            dispatch(getUserAsync(!value ? null : value));
                          }, 500);
                        }}
                      />
                    )}
                  />
                  {errors.user && <p className="text-red-500 text-[12px]">{errors.user.message}</p>}
                </div>
                <div>
                  <Controller
                    name="date"
                    control={control}
                    rules={{ required: " Date is required" }}
                    render={({ field }) => (
                      <CustomDatePicker
                        label="Date"
                        className="w-full"
                        onDateChange={(e) => {
                          const date = new Date(e!.toString());
                          const formattedDate = moment(date).format("DD-MM-YYYY");
                          field.onChange(formattedDate);
                        }}
                      />
                    )}
                  />
                  {errors.date && <p className="text-red-500 text-[12px]">{errors.date.message}</p>}
                </div>
              </div>
            </CardContent>
            <CardFooter className="h-[50px] p-0 flex items-center px-[20px] border-t gap-[10px] justify-end">
              <CustomButton icon={<Download className="h-[18px] w-[18px] " />} variant={"outline"}>
                Download
              </CustomButton>
              <CustomButton icon={<Search className="h-[18px] w-[18px] " />} className="bg-cyan-700 hover:bg-cyan-800">
                Search
              </CustomButton>
            </CardFooter>
          </Card>
        </form>
      </div>
      <div>
        <MrRequisitionReqTable />
      </div>
    </div>
  );
};

export default MaterialRequistionRequest;
