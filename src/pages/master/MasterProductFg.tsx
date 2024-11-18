import React, { useEffect, useState } from "react";

import MasterProductFgTable from "@/table/master/MasterProductFgTable";
import MasterFGproductUpdateDrawer from "@/components/Drawers/master/MasterFGproductUpdateDrawer";
import MasterFGproductViewDrawer from "@/components/Drawers/master/MasterFGproductViewDrawer";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { createProductAsync, getProductsAsync } from "@/features/master/products/productSlice";
import { getUOMAsync } from "@/features/master/UOM/UOMSlice";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { Autocomplete, Button, TextField, Typography } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";
import RefreshIcon from "@mui/icons-material/Refresh";
import { showToast } from "@/utils/toasterContext";

export type createProductdata = {
  p_name: string;
  p_sku: string;
  units_id: { units_id: string; units_name: string } | null;
};

const MasterProductFg: React.FC = () => {
  const [viewProduct, setViwProduct] = useState<boolean>(false);
  const [editProduct, setEditProduct] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<createProductdata>({
    defaultValues: {
      p_name: "",
      p_sku: "",
      units_id: null, // Reset the select field to null
    },
  });

  const dispatch = useAppDispatch();
  const { UOM, getUOMloading } = useAppSelector((state) => state.uom);
  const { createProductLoading } = useAppSelector((state) => state.product);

  const onSubmit: SubmitHandler<createProductdata> = (data) => {
    if (data.units_id !== null) {
      const newdata = { ...data, units_id: data.units_id?.units_id };

      dispatch(createProductAsync(newdata)).then((res: any) => {
        if (res.payload?.data?.success) {
          reset();
          dispatch(getProductsAsync());
          showToast(res.payload.data.message, "success");
        }
      });
    }
  };

  useEffect(() => {
    dispatch(getProductsAsync());
    dispatch(getUOMAsync());
  }, [dispatch]);

  return (
    <>
      <MasterFGproductUpdateDrawer open={editProduct} setOpen={setEditProduct} />
      <MasterFGproductViewDrawer open={viewProduct} setOpen={setViwProduct} />
      <div className="h-[calc(100vh-100px)] grid grid-cols-[550px_1fr] bg-white">
        <div className="p-[10px] border-r border-neutral-300">
          <form onSubmit={handleSubmit(onSubmit)} className="p-[20px]">
            <Typography className="text-slate-600 " fontSize={20} fontWeight={500}>
              Add New FG
            </Typography>
            <div className="grid grid-cols-2 gap-[30px] mt-[30px]">
              <div>
                <Controller
                  name="units_id"
                  control={control}
                  rules={{ required: "You must select a unit" }}
                  render={({ field }) => (
                    <Autocomplete
                      loading={getUOMloading}
                      value={field.value}
                      options={UOM ? UOM : []}
                      getOptionLabel={(option) => option.units_name}
                      renderInput={(params) => <TextField {...params} label={"Select UOM"} variant="outlined" />}
                      onChange={(_, value) => field.onChange(value)}
                      isOptionEqualToValue={(option, value) => option.units_id === value.units_id}
                    />
                  )}
                />

                {errors.units_id && <span className=" text-[12px] text-red-500">{errors.units_id.message}</span>}
              </div>
              <div>
                <TextField fullWidth {...register("p_sku", { required: "Product SKU is required" })} label="Product SKU" />
                {errors.p_sku && <span className="text-[12px] text-red-500">{errors.p_sku.message}</span>}
              </div>
            </div>
            <div className="mt-[20px]">
              <TextField fullWidth label="Product Name" {...register("p_name", { required: "Product Name is required" })} />
              {errors.p_name && <span className="text-[12px] text-red-500">{errors.p_name.message}</span>}
            </div>
            <div className="h-[50px] p-0 flex items-center px-[20px]  gap-[10px] justify-end mt-[30px]">
              <Button
                type="button"
                onClick={() => reset()} // Reset the form including the select input
                startIcon={<RefreshIcon fontSize="small" />}
                variant={"contained"}
                sx={{ background: "white", color: "red" }}
              >
                Reset
              </Button>
              <LoadingButton loadingPosition="start" variant="contained" loading={createProductLoading} type="submit" startIcon={<SaveIcon fontSize="small" />}>
                Submit
              </LoadingButton>
            </div>
          </form>
        </div>
        <div>
          <MasterProductFgTable setUpdateProduct={setEditProduct} setViewProduct={setViwProduct} />
        </div>
      </div>
    </>
  );
};

export default MasterProductFg;
