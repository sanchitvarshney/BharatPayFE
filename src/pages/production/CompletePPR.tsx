import { CustomButton } from "@/components/reusable/CustomButton";
import CustomSelect from "@/components/reusable/CustomSelect";
import { Input } from "@/components/ui/input";
import CompletePPRTable from "@/table/production/CompletePPRTable";
import { Download, Search } from "lucide-react";
import React from "react";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { rangePresets } from "@/utils/rangePresets";
dayjs.extend(customParseFormat);

const { RangePicker } = DatePicker;

const dateFormat = "YYYY/MM/DD";
const CompletePPR: React.FC = () => {
  const [wise, setWise] = React.useState<string>("sku");

  
  return (
    <div className="h-[calc(100vh-100px)]">
      <div className="h-[50px] flex justify-between items-center px-[20px] bg-white">
        <div className="flex gap-[20px]">
          <CustomSelect
            onChange={(e) => setWise(e!.value)}
            placeholder={"Product SKU Wise"}
            className="w-[300px] z-100"
            options={[
              { value: "sku", label: "Product SKU Wise" },
              { value: "pprs", label: "PPR Status" },
              { value: "pprn", label: "PPR No." },
              { value: "date", label: "Date Wise" },
            ]}
          />
          {wise === "sku" ? (
            <CustomSelect className="w-[300px]" placeholder="Product SKU" />
          ) : wise === "pprs" ? (
            <CustomSelect className="w-[300px]" placeholder="PPR Status" />
          ) : wise === "pprn" ? (
            <Input className="w-[300px]" />
          ) : wise === "date" ? (
            <RangePicker presets={rangePresets} defaultValue={[dayjs("2015/01/01", dateFormat), dayjs("2015/01/01", dateFormat)]} format={dateFormat} />
          ) : null}
          {/* <Input className='w-[300px]'/> */}
          <CustomButton className="bg-cyan-700 hover:bg-cyan-800" icon={<Search className="h-[18px] w-[18px]" />}>
            Search
          </CustomButton>
        </div>
        <div>
          <CustomButton className="bg-cyan-700 hover:bg-cyan-800" icon={<Download className="h-[18px] w-[18px]" />}>
            Download
          </CustomButton>
        </div>
      </div>
      <div className="h-[calc(100vh-150px)]">
        <CompletePPRTable />
      </div>
    </div>
  );
};

export default CompletePPR;
