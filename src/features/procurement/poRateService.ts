import axiosInstance from "@/api/axiosInstance";
import publicAxiosInstance from "@/api/publicAxiosInstance";

export type RateApprovalStatus = "pending" | "approved" | "rejected";

export type RateApprovalItem = {
  id: string;
  componentKey: string;
  componentLabel: string;
  initialRate: number;
  enteredRate: number;
};

type RequestPriceApprovalResponse = {
  success: boolean;
  status: string;
  message: string;
  req_id: string;
  approval_link: string;
  data: {
    vendor_id: string;
    requested_by: string;
  };
};

export const requestPriceApproval = async (vendorId: string, items: RateApprovalItem[]): Promise<RequestPriceApprovalResponse> => {
  const response = await axiosInstance.post("/po/requestPriceApproval", {
    vendor_id: vendorId,
    components: items.map((item) => ({
      component_key: item.componentKey,
      requested_rate: item.enteredRate,
    })),
  });
  return response.data;
};

export type RefreshApprovalItem = {
  id: number;
  req_id: string;
  vendor_id: string;
  component_key: string;
  part_code: string;
  component_name: string;
  requested_rate: string;
  status: string;
  remarks: string | null;
};

export type RefreshApprovalDataResponse = {
  success: boolean;
  message: string;
  data: {
    req_id: string;
    vendor_id: string;
    vendor_name: string;
    requested_by: string;
    isPending: boolean;
    status: string;
    items: RefreshApprovalItem[];
  };
};

export const refreshApprovalData = async (reqId: string): Promise<RefreshApprovalDataResponse> => {
  const response = await axiosInstance.get(`/po/refreshApprovalData?req_id=${reqId}`);
  return response.data;
};


export const fetchAdminApprovalRequest = async (reqId: string, token: string): Promise<RefreshApprovalDataResponse> => {
  const response = await publicAxiosInstance.get(`/po/refreshApprovalData?req_id=${reqId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export type AdminApprovalDecision = {
  id: number;
  status: "APPROVED" | "REJECTED";
};

type SubmitAdminApprovalResponse = {
  success: boolean;
  message: string;
};

export const submitAdminApproval = async (
  reqId: string,
  token: string,
  decisions: AdminApprovalDecision[],
  remarks?: string
): Promise<SubmitAdminApprovalResponse> => {
  const response = await publicAxiosInstance.post(
    "/po/submitAdminApproval",
    {
      req_id: reqId,
      remarks: remarks || "",
      decisions,
    },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};
