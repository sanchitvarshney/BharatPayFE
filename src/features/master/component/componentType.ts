export type Components = {
  c_part_no: string;
  c_new_part_no: string;
  c_name: string;
  units_name: string;
  component_key: string;
  c_attr_category: string;
  is_enabled: string;
  c_approver_reason: string;
  approval_status: string;
};
export type ComponentDetails = {
  component: string;
  part: string;
  uom: string;
  group: string;
  notes: string;
};


type Approvers = string[];

type ComponentData = {
  approvers: Approvers;
  components: Components[];
}
export type ComponentsApiResponse = {
  success: boolean;
  data: ComponentData;
};

export type Groupdata = {
  id:string;
  text:string;
}

export type GroupApiResponse = {
  success: boolean;
  data: Groupdata[];
}
export type UpdateconpinentDetail = {
  
}
  export interface ComponnetState {
    component: ComponentData | null;
    getComponentLoading: boolean;
    createComponentLoading: boolean;
    groupList:Groupdata[] | null;
    getGroupListLoading: boolean;
  }