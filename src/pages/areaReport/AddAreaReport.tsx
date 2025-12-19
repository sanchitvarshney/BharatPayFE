import { useState } from "react";

import dayjs, { Dayjs } from "dayjs";

import {
  AreaType,
  DepartmentType,
  EmployeeType,
} from "@/types/workerTypes";

import { showToast } from "@/utils/toasterContext";
import { useDispatch } from "react-redux";
import { submitData } from "@/features/areaSlice/areaSlice";
import WorkerForm from "@/components/reusable/WorkerForm";

export const AddAreaReport = () => {
  const dispatch = useDispatch<any>();

  const [formKey, setFormKey] = useState<any>(0);
  const [formData, setFormData] = useState<{
    area: AreaType | null;
    department: DepartmentType | null;
    employees: EmployeeType[];
    date: Dayjs;
  } | null>(null);

   const reset = () => {
      setFormData(null);
      setFormKey(formKey + 1);
    };

  const handleFormChange = (data: {
    area: AreaType | null;
    department: DepartmentType | null;
    employees: EmployeeType[];
    date: Dayjs;
  }) => {
    setFormData(data);
  };

  const handleSubmit = async () => {
    if (!formData) {
      console.log(formData)
      showToast("Please fill all the fields", "error");
      return;
    }
    const payload: any = {
      place: formData.area ? formData.area.id : null,
      department: formData.department ? formData.department.id : null,
      code: formData.employees ? formData.employees.map((item) => item.id) : [],
      date: dayjs(formData.date).format("DD-MM-YYYY"),
    };
    //@ts-ignore

    dispatch(submitData(payload))
      .then((res: any) => {
        if (res.payload.data.success) {
          showToast(res.payload.data.message, "success");
          reset();
        } else {
          showToast(res.payload.data.message, "error");
        }
      })
      .catch((error: any) => {
        showToast(error, "error");
      });
  };

  return (
    <div className="h-[calc(100vh-100px)] p-[20px] overflow-y-auto bg-white">
      <WorkerForm
      key={formKey}
        onFormChange={handleFormChange}
        onclick={handleSubmit}
      />
    </div>
  );
};
