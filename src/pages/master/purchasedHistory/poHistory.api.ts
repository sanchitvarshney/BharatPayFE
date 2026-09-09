import axiosInstance from "@/api/axiosInstance";

export type ComponentOption = {
  key: string;
  partNo: string;
  name: string;
};

// Matches SelectVendor's VendorData / the `/vendor/vendorOptions` response.
export type VendorOption = {
  id: string;
  text: string;
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

// Debounced server-side vendor search, same endpoint as SelectVendor.
export const searchVendors = async (
  query: string | null,
): Promise<VendorOption[]> => {
  const response = await axiosInstance.get(`/vendor/vendorOptions/${query ?? ""}`);
  return response.data?.success ? response.data.data ?? [] : [];
};
