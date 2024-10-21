import { CustomButton } from "@/components/reusable/CustomButton";
import CustomSelect from "@/components/reusable/CustomSelect";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCallback, useEffect, useRef, useState } from "react";
import { HiOutlineRefresh } from "react-icons/hi";
import { IoCheckmark } from "react-icons/io5";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { SingleValue } from "react-select";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { getLocationAsync } from "@/features/production/MaterialRequestWithoutBom/MRRequestWithoutBomSlice";
import { transformGroupSelectData } from "@/utils/transformUtills";
import styled from "styled-components";
import { FaArrowRightLong } from "react-icons/fa6";
import AddtrcTable from "@/table/TRC/AddtrcTable";
import { showToast } from "@/utils/toastUtils";
import { addTrcAsync } from "@/features/trc/AddTrc/addtrcSlice";
import { AddtrcPayloadType } from "@/features/trc/AddTrc/addtrcType";
import { getIsueeList } from "@/features/common/commonSlice";

interface RowData {
  remarks: string;
  id: number;
  isNew: boolean;
  issues: string[];
  IMEI: string;
}
type Formstate = {
  pickLocation: OptionType | null;
  putLocation: OptionType | null;
  remarks: string;
};
type OptionType = {
  value: string;
  label: string;
};
const AddTRC = () => {
  const [rowData, setRowData] = useState<RowData[]>([]);
  const [location, setLocation] = useState<OptionType | null>(null);
  const [locationdetail, setLocationdetail] = useState<string>("--");
  const [final, setFinal] = useState<boolean>(false);
  const { locationData, getLocationDataLoading, craeteRequestData } = useAppSelector((state) => state.materialRequestWithoutBom);
  const { addTrcLoading } = useAppSelector((state) => state.addTrc);
  // const { locationData, getLocationLoading } = useAppSelector((state) => state.divicemin);

  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<Formstate>({
    defaultValues: {
      pickLocation: null,
      putLocation: null,
      remarks: "",
    },
  });
  const addRow = useCallback(() => {
    const newId = rowData.length + 1;
    const newRow: RowData = {
      id: newId,
      remarks: "",
      isNew: true,
      IMEI: "",
      issues: [],
    };
    setRowData((prev) => [...prev, newRow].reverse());
  }, [rowData]);

  const onSubmit: SubmitHandler<Formstate> = (data) => {
    if (rowData.length === 0) {
      showToast({
        description: "Please Add Material Details",
        variant: "destructive",
      });
      return;
    } else {
      let hasErrors = false;

      rowData.forEach((row) => {
        const missingFields: string[] = [];
        if (!row.IMEI) {
          missingFields.push("IMEI");
        }
        if (!row.issues.length) {
          missingFields.push("issues");
        }

        if (missingFields.length > 0) {
          showToast({
            description: `Row ${row.id}: Empty fields: ${missingFields.join(", ")}`,
            variant: "destructive",
          });
          hasErrors = true;
        }
      });

      if (!hasErrors) {
        const issue = rowData.map((row) => row.issues);
        const device = rowData.map((row) => row.IMEI);
        const remark = rowData.map((row) => row.remarks);
        const payload: AddtrcPayloadType = {
          issue,
          device,
          remark,
          comment: data.remarks,
          pickLocation: data.pickLocation?.value || "",
          putLocation: data.putLocation?.value || "",
        };
        dispatch(addTrcAsync(payload)).then((response: any) => {
          if (response.payload.data?.success) {
            showToast({
              description: `TRC Request Added Successfully -\n Txn ID : ${response.payload.data?.data?.refID}`,
              variant: "success",
            });
            reset();
            setRowData([]);
          }
        });
      }
    }
  };
  useEffect(() => {
    dispatch(getLocationAsync(null));
    dispatch(getIsueeList(null));
  }, []);
  useEffect(() => {
    if (location) {
      const locationDetail = locationData?.find((item) => item.id === location?.value)?.specification;
      setLocationdetail(locationDetail || "");
    }
  }, [location]);
  return (
    <div>
      {final ? (
        <div className="h-[calc(100vh-100px)] flex items-center justify-center bg-white">
          <div className="max-h-max max-w-max flex flex-col gap-[30px]">
            <Success>
              <div className="success-animation">
                <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                  <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
                  <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                </svg>
              </div>
            </Success>
            <div className="flex items-center gap-[10px]">
              <p className="text-green-600">{craeteRequestData && craeteRequestData.message}</p>
            </div>
            <div className="flex items-center justify-center">
              <CustomButton onClick={() => setFinal(false)} className="flex items-center gap-[10px] bg-cyan-700 hover:bg-cyan-800">
                Create New Request
                <FaArrowRightLong />
              </CustomButton>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-[calc(100vh-100px)] overflow-y-hidden grid grid-cols-[450px_1fr]">
          <div className="p-[10px] border-r h-full overflow-y-auto">
            <form onSubmit={handleSubmit(onSubmit)}>
              <Card className="rounded-md ">
                <CardHeader className="h-[50px] p-0 flex flex-col justify-center px-[20px] bg-hbg">
                  <CardTitle className="text-slate-600 font-[500]">Header Details</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-[20px] py-[20px]">
                  <div>
                    <Controller
                      name="pickLocation"
                      control={control}
                      rules={{ required: "Pick Location is required" }}
                      render={({ field }) => (
                        <CustomSelect
                          isLoading={getLocationDataLoading}
                          {...field}
                          defaultValue={{ value: "V01", label: "Vendor" }}
                          options={transformGroupSelectData(locationData)}
                          onInputChange={(value) => {
                            if (debounceTimeout.current) {
                              clearTimeout(debounceTimeout.current);
                            }
                            debounceTimeout.current = setTimeout(() => {
                              dispatch(getLocationAsync(!value ? null : value));
                            }, 500);
                          }}
                          required
                          value={field.value}
                          isClearable={true}
                          onChange={(selectedOption) => {
                            field.onChange(selectedOption as SingleValue<OptionType>);
                            setLocation(selectedOption);
                          }}
                          placeholder={"Pick Location"}
                        />
                      )}
                    />
                    {errors.pickLocation && <span className=" text-[12px] text-red-500">{errors.pickLocation.message}</span>}
                  </div>
                  <div>
                    <Controller
                      name="putLocation"
                      control={control}
                      rules={{ required: "Put Location is required" }}
                      render={({ field }) => (
                        <CustomSelect
                          isLoading={getLocationDataLoading}
                          {...field}
                          options={transformGroupSelectData(locationData)}
                          onInputChange={(value) => {
                            if (debounceTimeout.current) {
                              clearTimeout(debounceTimeout.current);
                            }
                            debounceTimeout.current = setTimeout(() => {
                              dispatch(getLocationAsync(!value ? null : value));
                            }, 500);
                          }}
                          required
                          value={field.value}
                          isClearable={true}
                          onChange={(selectedOption) => {
                            field.onChange(selectedOption as SingleValue<OptionType>);
                            setLocation(selectedOption);
                          }}
                          placeholder={"Put Location"}
                        />
                      )}
                    />
                    {errors.putLocation && <span className=" text-[12px] text-red-500">{errors.putLocation.message}</span>}
                  </div>
                  <div className="flex gap-[10px] items-center">
                    <Label className="text-slate-500 text-[14px]">Location Details :</Label>
                    <span className="text-[14px] text-slate-600">{locationdetail}</span>
                  </div>
                  <div>
                    <Label className="text-slate-500">Remarks</Label>
                    <Textarea className="h-[100px] resize-none" {...register("remarks")} />
                  </div>
                </CardContent>
                <CardFooter className="h-[50px] p-0 flex items-center px-[20px] border-t gap-[10px] justify-end">
                  <CustomButton
                    type="button"
                    onClick={() => {
                      reset();
                      setRowData([]);
                    }}
                    icon={<HiOutlineRefresh className="h-[18px] w-[18px] text-red-600" />}
                    variant={"outline"}
                  >
                    Reset
                  </CustomButton>
                  <CustomButton loading={addTrcLoading} icon={<IoCheckmark className="h-[18px] w-[18px] " />} className="bg-cyan-700 hover:bg-cyan-800">
                    Submit
                  </CustomButton>
                </CardFooter>
              </Card>
            </form>
          </div>
          <AddtrcTable addRow={addRow} setRowdata={setRowData} rowData={rowData} />
        </div>
      )}
    </div>
  );
};

const Success = styled.div`
  .checkmark {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    display: block;
    stroke-width: 2;
    stroke: #4bb71b;
    stroke-miterlimit: 10;
    box-shadow: inset 0px 0px 0px #4bb71b;
    animation: fill 0.4s ease-in-out 0.4s forwards, scale 0.3s ease-in-out 0.9s both;
    position: relative;
    top: 5px;
    right: 5px;
    margin: 0 auto;
  }
  .checkmark__circle {
    stroke-dasharray: 166;
    stroke-dashoffset: 166;
    stroke-width: 2;
    stroke-miterlimit: 10;
    stroke: #4bb71b;
    fill: #fff;
    animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
  }

  .checkmark__check {
    transform-origin: 50% 50%;
    stroke-dasharray: 48;
    stroke-dashoffset: 48;
    animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
  }

  @keyframes stroke {
    100% {
      stroke-dashoffset: 0;
    }
  }

  @keyframes scale {
    0%,
    100% {
      transform: none;
    }

    50% {
      transform: scale3d(1.1, 1.1, 1);
    }
  }

  @keyframes fill {
    100% {
      box-shadow: inset 0px 0px 0px 30px #4bb71b;
    }
  }
`;

export default AddTRC;
