import axiosInstance from "@/api/axiosInstance";

export type ComponentOption = {
  key: string;
  partNo: string;
  name: string;
};

export type VendorOption = {
  code: string;
  name: string;
};

export const loadAllComponents = async (): Promise<ComponentOption[]> => {
  const response = await axiosInstance.get("/component");
  if (!response.data?.success) return [];
  return (response.data.data?.components ?? []).map((item: any) => ({
    key: item.component_key,
    partNo: item.c_new_part_no || item.c_part_no,
    name: item.c_name,
  }));
};

export const loadAllVendors = async (): Promise<VendorOption[]> => {
  const response = await axiosInstance.get("/vendor/vendorList");
  if (!response.data?.success) return [];
  return (response.data.data ?? []).map((item: any) => ({
    code: item.vendor_code,
    name: item.vendor_name,
  }));
};
