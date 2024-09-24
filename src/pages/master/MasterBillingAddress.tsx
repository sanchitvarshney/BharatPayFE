import AddBillingAddressDrawer from '@/components/Drawers/master/AddBillingAddressDrawer'
import { CustomButton } from '@/components/reusable/CustomButton'
import MsterBillingAddressTable from '@/table/master/MsterBillingAddressTable'
import { Download, Plus } from 'lucide-react'
import React from 'react'

const MasterBillingAddress:React.FC = () => {
  const [open, setOpen] = React.useState(false)
  return (
    <>
    <AddBillingAddressDrawer open={open} setOpen={setOpen}/>
      <div className='h-[50px] flex justify-end items-center px-[20px] gap-[10px]'>
        <CustomButton  icon={<Download className='h-[18px] w-[18px]'/>} className='text-slate-600' variant={"outline"}>Download</CustomButton>
        <CustomButton onClick={() => setOpen(true)} icon={<Plus className='h-[18px] w-[18px]'/>} className='bg-cyan-700 hover:bg-cyan-800'>Add Billing Address</CustomButton>
      </div>
      <div>
        <MsterBillingAddressTable/>
      </div>
    </>
  )
}

export default MasterBillingAddress
