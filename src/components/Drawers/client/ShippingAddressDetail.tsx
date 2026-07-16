import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import MasterClientBranchShippingDetailTable from "@/table/master/MasterClientBranchShippingDetailTable";
import { Icons } from "@/components/icons";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { getClientAddressDetail } from "@/features/master/client/clientSlice";
import { Tooltip } from "@mui/material";
import * as XLSX from "xlsx";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<unknown>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});
type Props = {
  open: boolean;
  handleClose: () => void;
  addressId: string;
  addAddress: React.Dispatch<React.SetStateAction<boolean>>;
};

const ShippingAddressDetail: React.FC<Props> = ({
  open,
  handleClose,
  addAddress,
  addressId,
}) => {
  const dispatch = useAppDispatch();
  const { addressDetail } = useAppSelector((state) => state.client);

  const handleDownloadExcel = () => {
    const shippingAddress = addressDetail?.data?.shippingAddress || [];
    if (shippingAddress.length === 0) return;

    const worksheet = XLSX.utils.json_to_sheet(
      shippingAddress.map((item: any, index: number) => ({
        "#": index + 1,
        Label: item?.label,
        GST: item?.gst,
        "PAN No.": item?.panno,
        Company: item?.company,
        City: item?.city,
        "State Name": item?.state?.stateName,
        "Country Name": item?.country?.countryName,
        "Address Line 1": item?.addressLine1,
        "Address Line 2": item?.addressLine2,
        Pincode: item?.pinCode,
      })),
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Shipping Address");
    XLSX.writeFile(workbook, "Shipping_Address_Detail.xlsx");
  };

  return (
    <React.Fragment>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <div className="bg-amber-50 h-[50px] border-b border-neutral-300 flex items-center justify-between px-[20px]">
          <Typography fontWeight={600} fontSize={18}>
            Shipping Address Detail
          </Typography>
          <div className="flex items-center gap-[10px]">
            <Button
              variant="text"
              size="small"
              startIcon={<Icons.add />}
              color="primary"
              onClick={() => addAddress(true)}
            >
              Add Shipping Address
            </Button>
            <Tooltip title="Download Excel">
              <IconButton onClick={handleDownloadExcel}>
                <Icons.download fontSize="small" />
              </IconButton>
            </Tooltip>

            <IconButton
              onClick={() => dispatch(getClientAddressDetail(addressId))}
            >
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
