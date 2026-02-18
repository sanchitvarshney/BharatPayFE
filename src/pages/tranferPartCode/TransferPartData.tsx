import {
  getAvailableQty,
  getFromLocation,
  getPartCode,
  getDropLocation,
  submitPartCodeTransfer,
  
} from "@/features/areaSlice/areaSlice";
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useDebounce from "@/hooks/useDebounce";
import { showToast } from "@/utils/toasterContext";

type formDataType = {
  fromLocation: string;
  partCode: any;
  tranferQty: number | string;
  toLocation: string;
  remarks: string;
};

const TransferPartData = () => {
  const dispatch = useDispatch<any>();
  const {
    fromLocationList,
    fromLocationLoading,
    partCodeList,
    partCodeLoading,
    totalQty,
    QtyLoading,
    toLocationList,
    toLocationLoading,
    submitLoading,
  } = useSelector((state: any) => state.placeMaster);
  const [formData, setFormData] = useState<formDataType | null | any>(null);
  const [searchInput, setSearchInput] = useState<string>("");
  const debouncedSearch = useDebounce(searchInput, 300);


  const fetchFromLocationData = () => {
    dispatch(getFromLocation());
  };

  const fetchDropLocationData = () => {
    dispatch(getDropLocation());
  };

  const fetchPartCodeData = (searchQuery?: string) => {
    dispatch(getPartCode(searchQuery));
  };

  const fetchAvilableQty = (itemkey: any, fromLocation: any) => {
 
    if (!itemkey || !fromLocation) {
      return;
    }
    const payload: any = {
      itemKey: itemkey,
      fromLocation: fromLocation,
    };
    //@ts-ignore
    dispatch(getAvailableQty(payload));
  };

  const handleChangeData = (value: any, name: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    if (!formData?.fromLocation) {
      showToast("Please select From Location", "error");
      return;
    }
    if (!formData?.partCode) {
      showToast("Please select Part Code", "error");
      return;
    }
    if (!formData?.tranferQty || formData.tranferQty <= 0) {
      showToast("Please enter valid Transfer Quantity", "error");
      return;
    }
    if (Number(formData.tranferQty) > Number(totalQty)) {
      showToast("Transfer Quantity cannot exceed Available Quantity", "error");
      return;
    }
    if (!formData?.toLocation) {
      showToast("Please select To Location", "error");
      return;
    }

    const payload = {
      fromLocation: formData.fromLocation,
      item: formData.partCode?.code ,
      issueQty: formData.tranferQty,
      dropLocation: formData.toLocation,
      remarks: formData.remarks || "",
    };

    dispatch(submitPartCodeTransfer(payload)).then((res: any) => {
     
      if (res.payload?.data?.success) {
        showToast(
          res.payload.data.message || "Transfer submitted successfully",
          "success"
        );
        handleReset();
      } else {
        showToast(
          res.payload?.data?.message || "Failed to submit transfer",
          "error"
        );
      }
    });
  };

  const handleReset = () => {
    setFormData({
      fromLocation: "",
      partCode: null,
      tranferQty: "",
      toLocation: "",
      remarks: "",
    });
    setSearchInput("");
  };

  useEffect(() => {
    fetchFromLocationData();
    fetchDropLocationData();
  }, []);

  useEffect(() => {
    fetchAvilableQty(formData?.partCode?.code, formData?.fromLocation);
  }, [formData?.partCode, formData?.fromLocation]);

  useEffect(() => {
    if (!debouncedSearch || debouncedSearch === undefined) {
      return;
    }

    fetchPartCodeData(debouncedSearch);
  }, [debouncedSearch]);

  return (
    <Box sx={{ width: "100%", p: 3, backgroundColor: "#ffffff", maxHeight: "calc(100vh - 100px)", minHeight: "calc(100vh - 100px)", overflowY: "auto" }}>

      <Card elevation={2} sx={{ mb: 3 }}>
        <CardContent>
          <Typography
            variant="h6"
            sx={{ mb: 3, fontWeight: 500, color: "text.secondary" }}
          >
            Transfer Details
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="loc-select-label">From Location *</InputLabel>
                <Select
                  labelId="loc-select-label"
                  id="loc-select"
                  value={formData?.fromLocation || ""}
                  onChange={(e: any) =>
                    handleChangeData(e?.target?.value, "fromLocation")
                  }
                  label="From Location *"
                  disabled={fromLocationLoading}
                >
                  {fromLocationLoading ? (
                    <MenuItem disabled>
                      <CircularProgress size={20} />
                      <span style={{ marginLeft: 8 }}>Loading...</span>
                    </MenuItem>
                  ) : (
                    fromLocationList.map((item: any) => (
                      <MenuItem key={item.code} value={item.code}>
                        {item.name}
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth variant="outlined">
                <Autocomplete
                  options={partCodeList || []}
                  value={formData?.partCode || null}
                  onChange={(__: any, newvalue) => {
                    handleChangeData(newvalue, "partCode");
                  }}
                  loading={partCodeLoading}
                  onInputChange={(__, newInputValue, reason) => {
                    if (reason === "input" || reason === "clear") {
                      setSearchInput(newInputValue);
                    }
                  }}
                  getOptionLabel={(option: any) => {
                    return `${option.part_no} - ${option.name}`;
                  }}
                  isOptionEqualToValue={(option: any, value: any) => {
                    if (!option || !value) return false;
                    return (
                      option?.code === value?.code ||
                      option?.part_no === value?.part_no
                    );
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Part Code *"
                      variant="outlined"
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {partCodeLoading ? (
                              <CircularProgress color="inherit" size={20} />
                            ) : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                  filterOptions={(x) => x}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="to-loc-select-label">To Location *</InputLabel>
                <Select
                  labelId="to-loc-select-label"
                  id="to-loc-select"
                  value={formData?.toLocation || ""}
                  onChange={(e: any) =>
                    handleChangeData(e?.target?.value, "toLocation")
                  }
                  label="To Location *"
                  disabled={toLocationLoading}
                >
                  {toLocationLoading ? (
                    <MenuItem disabled>
                      <CircularProgress size={20} />
                      <span style={{ marginLeft: 8 }}>Loading...</span>
                    </MenuItem>
                  ) : (
                    toLocationList.map((item: any) => (
                      <MenuItem key={item.code} value={item.code}>
                        {item.name}
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card elevation={2}>
        <CardContent>
          <Typography
            variant="h6"
            sx={{ mb: 3, fontWeight: 500, color: "text.secondary" }}
          >
            Quantity & Remarks
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Paper
                elevation={0}
                sx={{
                  p: 1,
                  border: "2px solid #ccc",
               
                  borderRadius: 1,
                  bgcolor: "background.paper",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",      
                         }}
              >
                <Typography
                  variant="body2"
                  sx={{ mr:1,color: "text.secondary", fontWeight: 500 }}
                >
                  Available Quantity : 
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  {QtyLoading ? (
                    <CircularProgress size={20} />
                  ) : (
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        color:
                          totalQty > 0 ? "success.main" : "text.secondary",
                      }}
                    >
                      {totalQty || 0}
                    </Typography>
                  )}
                </Box>
              </Paper>
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Transfer Quantity *"
                variant="outlined"
                type="number"
                value={formData?.tranferQty || ""}
                onChange={(e: any) =>
                  handleChangeData(e.target.value, "tranferQty")
                }
                inputProps={{ min: 0, step: 1 }}
                error={
                  formData?.tranferQty &&
                  Number(formData.tranferQty) > Number(totalQty)
                }
                helperText={
                  formData?.tranferQty &&
                  Number(formData.tranferQty) > Number(totalQty)
                    ? "Cannot exceed available quantity"
                    : ""
                }
              />
            </Grid>

        
          </Grid>
           
              <TextField
                fullWidth
                label="Remarks"
                variant="outlined"
                value={formData?.remarks || ""}
                onChange={(e: any) => handleChangeData(e.target.value, "remarks")}
                multiline
                rows={2}
                placeholder="Enter any additional remarks..."
                sx={{ mt: 2, maxWidth: "70%" }}
              />
          
        </CardContent>
      </Card>

      <Box sx={{ display: "flex", gap: 2, mt: 3, justifyContent: "flex-end" }}>
        <Button
          variant="outlined"
        color="error"
          onClick={handleReset}
          size="large"
          sx={{ minWidth: 120 }}
        >
          Reset
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={submitLoading}
          size="large"
          sx={{ minWidth: 120 }}
        >
          {submitLoading ? (
            <>
              <CircularProgress size={20} sx={{ mr: 1 }} color="inherit" />
              Submitting...
            </>
          ) : (
            "Submit"
          )}
        </Button>
      </Box>
    </Box>
  );
};

export default TransferPartData;
