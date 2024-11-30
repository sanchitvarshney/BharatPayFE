import { Icons } from "@/components/icons";
import SelectCategory, { CategoryType } from "@/components/reusable/SelectCategory.";
import { createCategory, createSubCategory, getCategoryList } from "@/features/master/Category/CategorySlice";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import MasterCategoryList from "@/table/master/MasterCategoryList";
import MasterSubCategoryListTable from "@/table/master/MasterSubCategoryListTable";
import { showToast } from "@/utils/toasterContext";
import { LoadingButton } from "@mui/lab";
import { Drawer, FormControl, IconButton, MenuItem, Select, TextField, Typography } from "@mui/material";
import React, { useEffect } from "react";

const MasterCategory: React.FC = () => {
  const [type, setType] = React.useState("category");
  const [category, setCategory] = React.useState<CategoryType | null>(null);
  const { createCategoryLoading, createSubCategoryLoading } = useAppSelector((state) => state.category);
  const [name, setName] = React.useState<string>("");
  const [open, setOpen] = React.useState<boolean>(false);
  const [categoryname, setCategoryName] = React.useState<string>("");
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getCategoryList());
  }, []);
  return (
    <>
      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        <div className="h-[50px] border-b border-neutral-300 bg-neutral-50 flex items-center j px-[10px] gap-[10px]">
          <IconButton onClick={() => setOpen(false)}>
            <Icons.close />
          </IconButton>
          <Typography variant="inherit">{categoryname}</Typography>
        </div>
        <div className="w-[400px]">
          <MasterSubCategoryListTable />
        </div>
      </Drawer>
      <div className="h-[calc(100vh-50px)] bg-white grid grid-cols-[400px_1fr]">
        <div className="h-full border-r border-neutral-400/70 p-[20px]">
          <Typography fontSize={18} fontWeight={500}>
            Master Category
          </Typography>
          <div className="flex flex-col gap-[20px] mt-[20px]">
            <FormControl fullWidth>
              <Select value={type} onChange={(e) => setType(e.target.value)} defaultValue={"category"}>
                <MenuItem value={"category"}>Category</MenuItem>
                <MenuItem value={"Subcategory"}>Subcategory</MenuItem>
              </Select>
            </FormControl>
            {type === "category" ? (
              <TextField value={name} onChange={(e) => setName(e.target.value)} label="Category Name" />
            ) : (
              <>
                <SelectCategory label="Parent Category" value={category} onChange={setCategory} />
                <TextField value={name} onChange={(e) => setName(e.target.value)} label="Subcategory Name" />
              </>
            )}
          </div>
          <div className="mt-[20px]">
            <LoadingButton
              loading={createCategoryLoading || createSubCategoryLoading}
              loadingPosition="start"
              onClick={() => {
                if (type === "category") {
                  if (!name) return showToast("Please enter category name", "error");
                  dispatch(createCategory(name)).then((res: any) => {
                    if (res.payload?.data?.success) {
                      setName("");
                      dispatch(getCategoryList());
                    }
                  });
                } else {
                  if (!category) return showToast("Please select parent category", "error");
                  if (!name) return showToast("Please enter subcategory name", "error");
                  dispatch(createSubCategory({ catId: category.catId, subCategory: name })).then((res: any) => {
                    if (res.payload?.data?.success) {
                      setName("");
                      setCategory(null);
                    }
                  });
                }
              }}
              variant="contained"
              startIcon={<Icons.add />}
            >
              Create
            </LoadingButton>
          </div>
        </div>
        <div>
          <MasterCategoryList setOpen={setOpen} setCategoryName={setCategoryName} />
        </div>
      </div>
    </>
  );
};

export default MasterCategory;
