import { Icons } from "@/components/icons";
import { LoadingButton } from "@mui/lab";
import { ListItemText, TextField } from "@mui/material";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineOppositeContent, { timelineOppositeContentClasses } from "@mui/lab/TimelineOppositeContent";
import TimelineDot from "@mui/lab/TimelineDot";
import Typography from "@mui/material/Typography";
import ReceiptIcon from "@mui/icons-material/Receipt";
import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { getQ6Data } from "@/features/query/query/querySlice";

const Q6Statement: React.FC = () => {
  const [input, setInput] = useState("");
  const { q6Statement, q6StatementLoading } = useAppSelector((state) => state.query);
  const dispatch = useAppDispatch();
  return (
    <div className="h-[calc(100vh-100px)] bg-white">
      <div className="h-[90px] flex items-center gap-[10px] px-[20px] border-b border-neutral-300">
        <TextField
          size="small"
          label="IMEI / Serial Number"
          sx={{ width: "400px" }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              if (input) {
                dispatch(getQ6Data(input));
              }
            }
          }}
          inputProps={{ maxLength: 15 }}
        />
        <LoadingButton
          loadingPosition="start"
          onClick={() => {
            if (input) {
              dispatch(getQ6Data(input));
            }
          }}
          loading={q6StatementLoading}
          startIcon={<Icons.search />}
          variant="contained"
        >
          Search
        </LoadingButton>
      </div>
      <div className="h-[calc(100vh-190px)] p-[20px] overflow-y-auto">
        {q6Statement ? (
          <div className="flex ">
            <div className="w-full">
              <Timeline
                position="right"
                sx={{
                  [`& .${timelineOppositeContentClasses.root}`]: {
                    flex: 0.2,
                  },
                }}
              >
                {q6Statement.map((item, index) => (
                  <TimelineItem key={index}>
                    <TimelineOppositeContent sx={{ m: "auto 0" }} align="right" variant="body2" color="text.secondary">
                      {item.time}
                    </TimelineOppositeContent>
                    <TimelineSeparator>
                      {index !== 0 && <TimelineConnector />}
                      <TimelineDot color="primary">
                        <ReceiptIcon fontSize="small" />
                      </TimelineDot>
                      {index !== q6Statement.length - 1 && <TimelineConnector />}
                    </TimelineSeparator>
                    <TimelineContent sx={{ py: "12px", px: 2 }}>
                      <Typography variant="h6" component="span">
                        {item.transactionType}
                      </Typography>
                      <Typography>TXN ID: {item.minNo}</Typography>
                      <Typography>User: {item.user || ""}</Typography>
                      <Typography>Location: {item.location || ""}</Typography>
                    </TimelineContent>
                  </TimelineItem>
                ))}
              </Timeline>
            </div>
            <div className="max-w-max">
              <ListItemText
                primary={"IMEI"}
                secondary={q6Statement[0]?.imei}
                primaryTypographyProps={{ fontSize: "18px", fontWeight: "bold" }} // Increase primary text size
                secondaryTypographyProps={{ fontSize: "1rem", color: "gray" }} // Increase secondary text size
              />
              <ListItemText
                primary={"Serial No."}
                secondary={q6Statement[0]?.serial}
                primaryTypographyProps={{ fontSize: "1.5rem", fontWeight: "bold" }} // Increase primary text size
                secondaryTypographyProps={{ fontSize: "1rem", color: "gray" }} // Increase secondary text size
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <img src="/search.svg" className="w-[300px] opacity-60 " alt="" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Q6Statement;
