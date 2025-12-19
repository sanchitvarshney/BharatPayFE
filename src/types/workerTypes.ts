import { Dayjs } from "dayjs";

export type AreaType = {
  id: string;
  text: string;

};

export type DepartmentType = {
  id: string;
  text: string;
 
};

export type EmployeeType = {
  id: string;
  name: string;
  code?: string;
  email?: string;
};

export type Props = {
  onclick: () => void;
  placeEndpoint?: string;
  departmentEndpoint?: string;
  employeeEndpoint?: string;
  onFormChange?: (data: {
    area: AreaType | null;
    department: DepartmentType | null;
    employees: EmployeeType[];
    date: Dayjs;
  }) => void;
  initialArea?: AreaType | null;
  initialDepartment?: DepartmentType | null;
  initialEmployees?: EmployeeType[];
  initialDate?: Dayjs;
};