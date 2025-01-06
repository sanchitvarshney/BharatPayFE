import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import MasterClientBranchShippingDetailTable from "@/table/master/MasterClientBranchShippingDetailTable";
import { Icons } from "@/components/icons";
import { useAppDispatch } from "@/hooks/useReduxHook";
import { getClientAddressDetail } from "@/features/master/client/clientSlice";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<unknown>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});
type Props = {
  open: boolean;
  handleClose: () => void;
  addressId: string;
  addAddress: React.Dispatch<React.SetStateAction<boolean>>;
};

const ShippingAddressDetail: React.FC<Props> = ({ open, handleClose, addAddress, addressId }) => {
  const dispatch = useAppDispatch();
  return (
    <React.Fragment>
      <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
        <div className="bg-amber-50 h-[50px] border-b border-neutral-300 flex items-center justify-between px-[20px]">
          <Typography fontWeight={600} fontSize={18}>
            Shipping Address Detail
          </Typography>
          <div className="flex items-center gap-[10px]">
            <Button variant="text" size="small" startIcon={<Icons.add />} color="primary" onClick={() => addAddress(true)}>
              Add Shipping Address
            </Button>
            <IconButton onClick={() => dispatch(getClientAddressDetail(addressId))}>
              <Icons.refresh fontSize="small" />
            </IconButton>
            <IconButton onClick={handleClose}>
              <Icons.close fontSize="small" />
            </IconButton>
          </div>
        </div>
        <div>
          <MasterClientBranchShippingDetailTable />
        </div>
      </Dialog>
    </React.Fragment>
  );
};

export default ShippingAddressDetail;
