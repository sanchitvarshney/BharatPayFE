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
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import { Dayjs } from "dayjs";
import { AreaType, DepartmentType, EmployeeType } from "@/types/workerTypes";

export interface PreviewData {
  area: AreaType | null;
  department: DepartmentType | null;
  employees: EmployeeType[];
  date: Dayjs;
  id?: string;
}

interface WorkerFormPreviewModalProps {
  open: boolean;
  previewData: PreviewData | null;
  submitLoading: boolean;
  onClose: () => void;
  onDelete: () => void;
  onUpdate: () => void;
  onConfirm: () => void;
}

const WorkerFormPreviewModal: React.FC<WorkerFormPreviewModalProps> = ({
  open,
  previewData,
  submitLoading,
  onClose,
  onDelete,
  onUpdate,
  onConfirm,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <div className="flex justify-between items-center">
          <Typography variant="h6" component="div">
            Preview Worker Data
          </Typography>
          <IconButton
            aria-label="close"
            onClick={onClose}
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
                    <TableCell
                      component="th"
                      sx={{ fontWeight: "bold" }}
                    >
                      Department
                    </TableCell>
                    <TableCell>
                      {previewData.department?.text || "N/A"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      component="th"
                      sx={{ fontWeight: "bold" }}
                    >
                      Date
                    </TableCell>
                    <TableCell>
                      {previewData.date.format("DD/MM/YYYY")}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      component="th"
                      sx={{ fontWeight: "bold" }}
                    >
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
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {previewData.employees.map((emp:any) => (
                                <TableRow key={emp.id}>
                                  <TableCell>{emp.id}</TableCell>
                                  <TableCell>{emp.text}</TableCell>
                                   <TableCell>{emp.department}</TableCell>
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
          onClick={onDelete}
          color="error"
          variant="outlined"
          startIcon={<DeleteIcon />}
        >
          Delete
        </Button>
        <Button
          onClick={onUpdate}
          color="primary"
          variant="outlined"
          startIcon={<EditIcon />}
        >
          Update
        </Button>
        <LoadingButton
          onClick={onConfirm}
          variant="contained"
          color="primary"
          loading={submitLoading}
          className="bg-cyan-400 hover:bg-cyan-600"
        >
          Confirm Submit
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default WorkerFormPreviewModal;

