import React, { useState } from 'react'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import CustomSelect from '@/components/reusable/CustomSelect'
import CustomInput from '@/components/reusable/CustomInput'
import { CustomButton } from '@/components/reusable/CustomButton'
import { IoCheckmark } from 'react-icons/io5'
import { HiOutlineRefresh } from 'react-icons/hi'
import MasterProductSFgTable from '@/table/master/MasterProductSFgTable'
import MasterSFGproductUpdateDrawer from '@/components/Drawers/master/MasterSFGproductUpdateDrawer'
import MasterSFGproductViewDrawer from '@/components/Drawers/master/MasterSFGproductViewDrawer'

const MasterProductSFg:React.FC = () => {
  const [viewProduct,setViwProduct] = useState<boolean>(false)
  const [editProduct,setEditProduct] = useState<boolean>(false)
  return (
   <>
   <MasterSFGproductUpdateDrawer open={editProduct} setOpen={setEditProduct}/>
   <MasterSFGproductViewDrawer open={viewProduct} setOpen={setViwProduct}/>
    <div className='h-[calc(100vh-100px)] grid grid-cols-[550px_1fr]'>
      <div className='p-[10px]'>
      <Card className="overflow-hidden rounded-md ">
            <CardHeader className="h-[60px] p-0 flex flex-col justify-center px-[20px] bg-zinc-200">
              <CardTitle className="text-slate-600 font-[500]">Add New SFG</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-[30px] mt-[30px]">
                <div>
                  <CustomSelect required placeholder={"Product Type"} />
                </div>
                <div>
                  <CustomSelect required placeholder={"UOM"} />
                </div>
                <div>
                  <CustomInput label="Product SKU" required />
                </div>
                <div>
                  <CustomInput label="Product Name" required />
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
          </Card>
      </div>
      <div>
        <MasterProductSFgTable setUpdateProduct={setEditProduct} setViewProduct={setViwProduct}/>
      </div>
    </div>
   </>
  )
}

export default MasterProductSFg
