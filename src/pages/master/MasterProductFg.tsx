import React, { useEffect, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import CustomSelect from "@/components/reusable/CustomSelect";
import CustomInput from "@/components/reusable/CustomInput";
import { CustomButton } from "@/components/reusable/CustomButton";
import { IoCheckmark } from "react-icons/io5";
import { HiOutlineRefresh } from "react-icons/hi";
import MasterProductFgTable from "@/table/master/MasterProductFgTable";
import MasterFGproductUpdateDrawer from "@/components/Drawers/master/MasterFGproductUpdateDrawer";
import MasterFGproductViewDrawer from "@/components/Drawers/master/MasterFGproductViewDrawer";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { createProductAsync, getProductsAsync } from "@/features/master/products/productSlice";
import { getUOMAsync } from "@/features/master/UOM/UOMSlice";
import { transformUomSelectData } from "@/utils/transformUtills";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { showToast } from "@/utils/toastUtils";
import { SingleValue } from "react-select";

type OptionType = {
  value: string;
  label: string;
};
export type createProductdata = {
  p_name: string;
  p_sku: string;
  units_id: OptionType | null;
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
      units_id: null// Reset the select field to null
    },
  });

  const dispatch = useAppDispatch();
  const { UOM, getUOMloading } = useAppSelector((state) => state.uom);
  const { createProductLoading } = useAppSelector((state) => state.product);

  const onSubmit: SubmitHandler<createProductdata> = (data) => {
    if (data.units_id !== null) {
      const newdata = { ...data, units_id: data.units_id?.value };

      dispatch(createProductAsync(newdata)).then((res: any) => {
        if (res.payload?.data?.success) {
          reset();
          dispatch(getProductsAsync());
          showToast({
            description: res.payload.data.message,
            variant: "success",
            className: "font-[500]",
          });
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
      <div className="h-[calc(100vh-100px)] grid grid-cols-[550px_1fr]">
        <div className="p-[10px]">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Card className="rounded-md ">
              <CardHeader className="h-[60px] p-0 flex flex-col justify-center px-[20px] bg-hbg">
                <CardTitle className="text-slate-600 font-[500]">Add New FG</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-[30px] mt-[30px]">
                  <div>
                    <Controller
                      name="units_id"
                      control={control}
                      rules={{ required: "You must select a unit" }}
                      render={({ field }) => (
                        <CustomSelect
                          {...field}
                          value={field.value}
                          isClearable={true}
                          onChange={(selectedOption) => field.onChange(selectedOption as SingleValue<OptionType>)}
                          options={transformUomSelectData(UOM)}
                          isLoading={getUOMloading}
                          placeholder={"Select UOM"}
                        />
                      )}
                    />
                    {errors.units_id && <span className="text-[12px] text-red-500">{errors.units_id.message}</span>}
                  </div>
                  <div>
                    <CustomInput {...register("p_sku", { required: "Product SKU is required" })} label="Product SKU" required />
                    {errors.p_sku && <span className="text-[12px] text-red-500">{errors.p_sku.message}</span>}
                  </div>
                  <div>
                    <CustomInput label="Product Name" required {...register("p_name", { required: "Product Name is required" })} />
                    {errors.p_name && <span className="text-[12px] text-red-500">{errors.p_name.message}</span>}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="h-[50px] p-0 flex items-center px-[20px] border-t gap-[10px] justify-end">
                <CustomButton
                  type="button"
                  onClick={() => reset()}  // Reset the form including the select input
                  icon={<HiOutlineRefresh className="h-[18px] w-[18px] text-red-600" />}
                  variant={"outline"}
                >
                  Reset
                </CustomButton>
                <CustomButton loading={createProductLoading} type="submit" icon={<IoCheckmark className="h-[18px] w-[18px] " />} className="bg-cyan-700 hover:bg-cyan-800">
                  Submit
                </CustomButton>
              </CardFooter>
            </Card>
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
