import React from "react";
import dayjs from "dayjs";
import { CalendarMonth } from "@mui/icons-material";

type Props = {
  dateRange?: [any, any] | null;
};

const DateRangeBadge: React.FC<Props> = ({ dateRange }) => {
  if (!dateRange || !dateRange[0] || !dateRange[1]) return null;

  return (
    <span className="flex items-center gap-1 text-sm text-gray-600">
      <CalendarMonth fontSize="inherit" />
      Displaying data from{" "}
      <span className="font-medium text-gray-800">
        {dayjs(dateRange[0]).format("DD-MM-YYYY")}
      </span>{" "}
      to{" "}
      <span className="font-medium text-gray-800">
        {dayjs(dateRange[1]).format("DD-MM-YYYY")}
      </span>
    </span>
  );
};

export default DateRangeBadge;
