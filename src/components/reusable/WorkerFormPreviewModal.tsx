import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Box,
  Tooltip,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import { Dayjs } from "dayjs";
import { AreaType, DepartmentType, EmployeeType } from "@/types/workerTypes";

export interface PreviewData {
  area: AreaType | null;
  department: DepartmentType | null;
  employees: EmployeeType[];
  date: Dayjs;
  startTime: Dayjs | null;
  endTime: Dayjs | null;
  id?: string;
}

interface WorkerFormPreviewModalProps {
  open: boolean;
  previewData: PreviewData | null;
  submitLoading: boolean;
  onClose: () => void;
  onDeleteEmployee: (employeeId: string) => void;
  onUpdate: () => void;
  onConfirm: () => void;
}

const WorkerFormPreviewModal: React.FC<WorkerFormPreviewModalProps> = ({
  open,
  previewData,
  submitLoading,
  onClose,
  onDeleteEmployee,
  onUpdate,
  onConfirm,
}) => {
  return (
    <Dialog 
      open={open} 
      onClose={submitLoading ? undefined : onClose} 
      maxWidth="md" 
      fullWidth
      disableEscapeKeyDown={submitLoading}
    >
      <DialogTitle>
        <div className="flex justify-between items-center">
          <Typography variant="h6" component="div">
            Preview Worker Data
          </Typography>
          <IconButton
            aria-label="close"
            onClick={onClose}
            disabled={submitLoading}
            sx={{ color: (theme) => theme.palette.grey[500] }}
          >
            <CloseIcon />
          </IconButton>
        </div>
      </DialogTitle>
      <DialogContent>
        {previewData && (
          <Box sx={{ mt: 2 }}>
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell
                      component="th"
                      sx={{ fontWeight: "bold", width: "40%" }}
                    >
                      Place
                    </TableCell>
                    <TableCell>{previewData.area?.text || "N/A"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" sx={{ fontWeight: "bold" }}>
                      Department
                    </TableCell>
                    <TableCell>
                      {previewData.department?.text || "N/A"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" sx={{ fontWeight: "bold" }}>
                      Date
                    </TableCell>
                    <TableCell>
                      {previewData.date.format("DD/MM/YYYY")}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" sx={{ fontWeight: "bold" }}>
                      Start Time
                    </TableCell>
                    <TableCell>
                      {previewData.startTime
                        ? previewData.startTime.format("hh:mm A")
                        : "N/A"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" sx={{ fontWeight: "bold" }}>
                      End Time
                    </TableCell>
                    <TableCell>
                      {previewData.endTime
                        ? previewData.endTime.format("hh:mm A")
                        : "N/A"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" sx={{ fontWeight: "bold" }}>
                      Selected Employees
                    </TableCell>
                    <TableCell>
                      <Box sx={{ maxHeight: "200px", overflowY: "auto" }}>
                        {previewData.employees.length > 0 ? (
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell sx={{ fontWeight: "bold" }}>
                                  Code
                                </TableCell>
                                <TableCell sx={{ fontWeight: "bold" }}>
                                  Name
                                </TableCell>
                                <TableCell sx={{ fontWeight: "bold" }}>
                                  Department
                                </TableCell>
                                <TableCell
                                  sx={{ fontWeight: "bold", width: "100px" }}
                                >
                                  Action
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {previewData.employees.map((emp: any) => (
                                <TableRow key={emp.id}>
                                  <TableCell>{emp.id}</TableCell>
                                  <TableCell>{emp.text}</TableCell>
                                  <TableCell>
                                    {emp.department || "N/A"}
                                  </TableCell>
                                  <TableCell>
                                    <Tooltip title="Delete Employee">
                                      <IconButton
                                        size="small"
                                        color="error"
                                        onClick={() => onDeleteEmployee(emp.id)}
                                        aria-label="delete employee"
                                      >
                                        <DeleteIcon fontSize="small" />
                                      </IconButton>
                                    </Tooltip>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            No employees selected
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button
          onClick={onUpdate}
          color="primary"
          variant="outlined"
          startIcon={<EditIcon />}
          disabled={submitLoading}
        >
          Update
        </Button>
        <LoadingButton
          onClick={() => {
            if (!submitLoading) {
              onConfirm();
            }
          }}
          variant="contained"
          color="primary"
          loading={submitLoading}
          className="bg-cyan-400 hover:bg-cyan-600"
          disabled={!previewData || previewData.employees.length === 0}
        >
          Confirm Submit
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default WorkerFormPreviewModal;
