import React, { useEffect } from "react";

import RefreshIcon from "@mui/icons-material/Refresh";
import SaveIcon from "@mui/icons-material/Save";
import MasterUomTable from "@/table/master/MasterUomTable";
import { useForm, SubmitHandler } from "react-hook-form";
import { UOM } from "@/features/master/UOM/UOMType";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { createUomAsync, getUOMAsync } from "@/features/master/UOM/UOMSlice";
import { useToast } from "@/components/ui/use-toast";
import { Button, TextField, Typography } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";

const MasterUOM: React.FC = () => {
  const dispatch = useAppDispatch();
  const { createUOMloading } = useAppSelector((state) => state.uom);
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
    <div className="h-[calc(100vh-50px)] relative  ">
      
      <div className="grid  w-full grid-cols-[500px_1fr] bg-white ">
        <div className="w-full border-r border-neutral-300">
          <form onSubmit={handleSubmit(onSubmit)} className="p-[30px]">
            <Typography className="text-slate-600" variant="h1" component={"div"} fontSize={20} fontWeight={500}>Create UOM</Typography>
            <div className="py-[20px] flex flex-col gap-[30px]">
              <div>
                <TextField fullWidth label="Unit" {...register("uom", { required: "unit is required" })} />
                {errors.uom && <span className=" text-[12px] text-red-500">{errors.uom.message}</span>}
              </div>
              <div className="flex flex-col gap-[10px]">
                <div>
                  <TextField multiline rows={4} fullWidth label="Specification" {...register("description", { required: "specification is required" })} />
                  {errors.description && <span className=" text-[12px] text-red-500">{errors.description.message}</span>}
                </div>
              </div>
            </div>
            <div className="h-[50px] p-0 flex items-center px-[20px] gap-[10px] justify-end">
              <Button startIcon={<RefreshIcon fontSize="small" />} onClick={() => reset()} variant="contained" sx={{ background: "white", color: "red" }}>
                Reset
              </Button>
              <LoadingButton startIcon={<SaveIcon fontSize="small" />} loadingPosition="start" type="submit" variant="contained" loading={createUOMloading}>
                Submit
              </LoadingButton>
            </div>
          </form>
        </div>
        <div>
          <MasterUomTable />
        </div>
      </div>
    </div>
  );
};

export default MasterUOM;
