import { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Drawer,
  FormControlLabel,
  Grid,
  IconButton,
  MenuItem,
  Select,
  Skeleton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ChatIcon from "@mui/icons-material/Chat";
import BrushIcon from "@mui/icons-material/Brush";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import CloseIcon from "@mui/icons-material/Close";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import imsAxios from "@/api/axiosInstance";
import { showToast } from "@/utils/toasterContext";
import { customColor } from "@/utils/uniqueid";
import { getDiagnostics } from "@/utils/tokenUtills";

const axiosLink = "https://support.mscorpres.com";

export default function TicketsModal({ open, handleClose }: any) {
  const [loading, setLoading] = useState<any>(false);
  const [tickets, setTickets] = useState<any>([]);
  const [activeMenu, setActiveMenu] = useState<any>("create");
  const user: any = localStorage.getItem("user");

  const [topicOptions, setTopicOptions] = useState<any>([]);
  const [priorityOptions, setPriorityOptions] = useState<any>([]);
  const [languageOptions, setLanguageOptions] = useState<any>([]);

  const [feedbackData, setFeedbackData] = useState<any>({
    topic: null,
    priority: null,
    language: null,
    subject: "",
    description: "",
    emailConsent: false,
    screenshot: null,
  });
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [capturingScreen, setCapturingScreen] = useState(false);

  const [annotationOpen, setAnnotationOpen] = useState(false);
  const [activeTool, setActiveTool] = useState("highlight");
  const [shapeCount, setShapeCount] = useState(0);
  const [redoCount, setRedoCount] = useState(0);
  const canvasRef = useRef<any>(null);
  const baseImgRef = useRef<any>(null);
  const shapesRef = useRef<any>([]);
  const redoStackRef = useRef<any>([]);
  const isDrawingRef = useRef(false);
  const startPosRef = useRef({ x: 0, y: 0 });

  const handleSubmitFeedback = async () => {
    const ALLOWED = /^[A-Za-z0-9@%&()\-[\]:?.,/ ]*$/;
    const len = feedbackData.description.length;
    if (
      len < 10 ||
      len > 500 ||
      !ALLOWED.test(feedbackData.description) ||
      !feedbackData.emailConsent
    )
      return;
    setFeedbackLoading(true);
    try {
      const diagnostics = getDiagnostics();
      const payload = new FormData();
      payload.append("email", user?.email || "");
      payload.append("name", user?.userName || user?.name || "");
      payload.append("message", feedbackData.description);
      payload.append("email_consent", feedbackData.emailConsent ? "1" : "0");

      payload.append("browser_info", JSON.stringify(diagnostics.browser));
      payload.append(
        "console_logs",
        JSON.stringify(
          diagnostics.console.filter((l: any) =>
            ["error", "warn", "info"].includes(l.level),
          ),
        ),
      );
      payload.append(
        "network_requests",
        JSON.stringify(diagnostics.network.requests.slice(-20)),
      );
      payload.append(
        "network_sockets",
        JSON.stringify(diagnostics.network.sockets),
      );
      payload.append(
        "local_storage",
        JSON.stringify(diagnostics.application.localStorage),
      );
      payload.append(
        "session_storage",
        JSON.stringify(diagnostics.application.sessionStorage),
      );
      payload.append(
        "cookies",
        JSON.stringify(diagnostics.application.cookies),
      );
      payload.append("captured_at", diagnostics.capturedAt);

      if (feedbackData.screenshot) {
        const res = await fetch(feedbackData.screenshot);
        const blob = await res.blob();
        payload.append("screenshot", blob, "screenshot.png");
      }

      await imsAxios.post("/ticket/feedback", payload);
      showToast("Feedback sent successfully!");
      setFeedbackData({
        topic: null,
        priority: null,
        language: null,
        subject: "",
        description: "",
        emailConsent: false,
        screenshot: null,
      });
      setActiveMenu("create");
    } catch {
      showToast("Failed to send feedback", "error");
    } finally {
      setFeedbackLoading(false);
    }
  };

  const initAnnotationCanvas = (src: any) => {
    const canvas: any = canvasRef.current;
    if (!canvas || !src) return;
    shapesRef.current = [];
    redoStackRef.current = [];
    setShapeCount(0);
    setRedoCount(0);
    const img = new Image();
    img.onload = () => {
      baseImgRef.current = img;
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      canvas.getContext("2d").drawImage(img, 0, 0);
    };
    img.src = src;
  };

  const drawHideShape = (ctx: any, s: any) => {
    const lx = Math.min(s.x, s.x2);
    const ly = Math.min(s.y, s.y2);
    const w = Math.abs(s.x2 - s.x);
    const h = Math.abs(s.y2 - s.y);
    ctx.save();
    ctx.fillStyle = "#111111";
    ctx.fillRect(lx, ly, w, h);
    ctx.restore();
  };

  const redrawAnnotation = (shapes?: any, preview?: any) => {
    const canvas: any = canvasRef.current;
    const img = baseImgRef.current;
    if (!canvas || !img) return;
    const ctx = canvas.getContext("2d");
    const cw = canvas.width;
    const allShapes = preview ? [...shapes, preview] : shapes;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);

    const highlights = allShapes.filter((s: any) => s.type === "highlight");
    if (highlights.length > 0) {
      ctx.fillStyle = "rgba(80, 80, 80, 0.55)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      highlights.forEach((s: any) => {
        const lx = Math.min(s.x, s.x2);
        const ly = Math.min(s.y, s.y2);
        const w = Math.abs(s.x2 - s.x);
        const h = Math.abs(s.y2 - s.y);
        ctx.save();
        ctx.beginPath();
        ctx.rect(lx, ly, w, h);
        ctx.clip();
        ctx.drawImage(img, 0, 0);
        ctx.restore();
        ctx.strokeStyle = "#FFD700";
        ctx.lineWidth = Math.max(2, cw / 300);
        ctx.strokeRect(lx, ly, w, h);
      });
    }

    allShapes
      .filter((s: any) => s.type === "hide")
      .forEach((s: any) => drawHideShape(ctx, s));
  };

  const getCanvasPos = (e: any) => {
    const canvas: any = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (canvas.width / rect.width),
      y: (e.clientY - rect.top) * (canvas.height / rect.height),
    };
  };

  const onCanvasMouseDown = (e: any) => {
    isDrawingRef.current = true;
    startPosRef.current = getCanvasPos(e);
    redoStackRef.current = [];
    setRedoCount(0);
  };

  const onCanvasMouseMove = (e: any) => {
    if (!isDrawingRef.current) return;
    const pos = getCanvasPos(e);
    redrawAnnotation(shapesRef.current, {
      type: activeTool,
      x: startPosRef.current.x,
      y: startPosRef.current.y,
      x2: pos.x,
      y2: pos.y,
    });
  };

  const onCanvasMouseUp = (e: any) => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    const pos = getCanvasPos(e);
    const shape = {
      type: activeTool,
      x: startPosRef.current.x,
      y: startPosRef.current.y,
      x2: pos.x,
      y2: pos.y,
    };
    shapesRef.current = [...shapesRef.current, shape];
    setShapeCount(shapesRef.current.length);
    redrawAnnotation(shapesRef.current);
  };

  const undoAnnotation = () => {
    if (shapesRef.current.length === 0) return;
    const last = shapesRef.current[shapesRef.current.length - 1];
    redoStackRef.current = [...redoStackRef.current, last];
    shapesRef.current = shapesRef.current.slice(0, -1);
    setShapeCount(shapesRef.current.length);
    setRedoCount(redoStackRef.current.length);
    redrawAnnotation(shapesRef.current);
  };

  const redoAnnotation = () => {
    if (redoStackRef.current.length === 0) return;
    const last = redoStackRef.current[redoStackRef.current.length - 1];
    redoStackRef.current = redoStackRef.current.slice(0, -1);
    shapesRef.current = [...shapesRef.current, last];
    setShapeCount(shapesRef.current.length);
    setRedoCount(redoStackRef.current.length);
    redrawAnnotation(shapesRef.current);
  };

  useEffect(() => {
    if (!annotationOpen) return;
    const onKey = (e: any) => {
      if (e.ctrlKey && e.key === "z") {
        e.preventDefault();
        undoAnnotation();
      } else if (e.ctrlKey && (e.key === "y" || e.key === "Y")) {
        e.preventDefault();
        redoAnnotation();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [annotationOpen]);

  const saveAnnotation = () => {
    const canvas: any = canvasRef.current;
    if (!canvas) return;
    setFeedbackData((prev: any) => ({
      ...prev,
      screenshot: canvas.toDataURL("image/png"),
    }));
    setAnnotationOpen(false);
  };

  const captureScreenshot = async () => {
    try {
      setCapturingScreen(true);
      await new Promise((r) => setTimeout(r, 150));

      const canvas = await html2canvas(document.body, {
        useCORS: true,
        allowTaint: true,
        scale: 1,
        scrollX: 0,
        scrollY: 0,
        width: document.documentElement.scrollWidth,
        height: document.documentElement.scrollHeight,
        ignoreElements: (el) =>
          el.classList.contains("ant-drawer-mask") ||
          el.classList.contains("ant-drawer") ||
          el.getAttribute("data-capture-ignore") === "true",
      });

      setFeedbackData((prev: any) => ({
        ...prev,
        screenshot: canvas.toDataURL("image/png"),
      }));
    } catch (err) {
      console.error("Screenshot failed:", err);
    } finally {
      setCapturingScreen(false);
    }
  };

  const [formData, setFormData] = useState({
    topic: null,
    subject: "",
    concern: "",
    priority: null,
    language: null,
    attachment: null,
  });
  const [fileList, setFileList] = useState<any[]>([]);

  const fetchMasters = async () => {
    try {
      const response: any = await imsAxios.get("/ticket/masters");
      if (response?.success && response?.data) {
        const { topics, priorities, languages } = response.data;
        if (topics && Array.isArray(topics)) {
          setTopicOptions(
            topics.map((t) => ({ label: t.text, value: t.value })),
          );
        }
        if (priorities && Array.isArray(priorities)) {
          setPriorityOptions(
            priorities.map((p) => ({ label: p.text, value: p.value })),
          );
        }
        if (languages && Array.isArray(languages)) {
          setLanguageOptions(
            languages.map((l) => ({ label: l.text, value: l.value })),
          );
        }
      }
    } catch (error) {
      console.error("Error fetching masters:", error);
    }
  };

  const getTickets = async () => {
    setLoading("fetching");
    try {
      const response: any = await imsAxios.get("/ticket/fetch", {
        params: { email: user?.email, topic: 18 },
      });
      setLoading(false);
      if (response?.success && response?.data) {
        setTickets(response.data || []);
      } else {
        showToast(response?.message || "Failed to fetch tickets", "error");
        setTickets([]);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching tickets:", error);
      setTickets([]);
    }
  };

  const handleFormChange = (field: any, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      topic: null,
      subject: "",
      concern: "",
      priority: null,
      language: null,
      attachment: null,
    });
    setFileList([]);
  };

  const handleSubmit = async () => {
    if (!formData.topic) {
      showToast("Please select a topic", "error");
      return;
    }
    if (!formData.subject.trim()) {
      showToast("Please enter a subject", "error");
      return;
    }
    if (!formData.concern.trim()) {
      showToast("Please describe your concern", "error");
      return;
    }

    try {
      setLoading("submitting");
      const submitFormData = new FormData();
      submitFormData.append("name", user?.userName || user?.name || "");
      submitFormData.append("email", user?.email || "");
      submitFormData.append("phone", user?.phone || "");
      submitFormData.append("subject", formData.subject);
      submitFormData.append("message", formData.concern);
      submitFormData.append("topic", formData.topic);
      if (formData.priority)
        submitFormData.append("priority", formData.priority);
      if (formData.language)
        submitFormData.append("language", formData.language);
      if (formData.attachment) {
        submitFormData.append("attachment[]", formData.attachment);
      } else {
        submitFormData.append("attachment[]", "");
      }

      const response: any = await imsAxios.post(
        "/ticket/create",
        submitFormData,
      );
      setLoading(false);
      if (response?.success) {
        showToast("Ticket created successfully!");
        resetForm();
        setActiveMenu("fetch");
        getTickets();
      } else {
        showToast(response?.message || "Failed to create ticket", "error");
      }
    } catch (error: any) {
      setLoading(false);
      showToast(error?.message || "Failed to create ticket", "error");
    }
  };

  const handleCancel = () => {
    resetForm();
    setActiveMenu("fetch");
  };

  useEffect(() => {
    if (open) {
      setActiveMenu("create");
      fetchMasters();
    } else {
      setTickets([]);
      resetForm();
    }
  }, [open]);

  return (
    <>
      <Drawer
        anchor="right"
        open={open}
        onClose={handleClose}
        sx={{ display: capturingScreen ? "none" : undefined }}
        PaperProps={{ sx: { width: 800, p: 0 } }}
      >
        {/* Drawer Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 2,
            py: 1.5,
            borderBottom: "1px solid #e0e0e0",
          }}
        >
          <Typography variant="h6">Your Tickets</Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        <Box sx={{ display: "flex", height: "calc(100% - 60px)" }}>
          {/* Left Vertical Icon Menu */}
          <Box
            sx={{
              width: 50,
              borderRight: "1px solid #cccccc",
              backgroundColor: "#eeeeee",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              pt: 1.5,
              gap: 1,
            }}
          >
            <Tooltip title="Create Ticket" placement="right">
              <Box
                onClick={() => setActiveMenu("create")}
                sx={{
                  width: 36,
                  height: 36,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 1,
                  cursor: "pointer",
                  backgroundColor:
                    activeMenu === "create"
                      ? customColor.newBgColor
                      : "transparent",
                  color: activeMenu === "create" ? "#fff" : "#666",
                  transition: "all 0.2s ease",
                }}
              >
                <AddIcon sx={{ fontSize: 18 }} />
              </Box>
            </Tooltip>

            <Tooltip title="My Tickets" placement="right">
              <Box
                onClick={() => {
                  setActiveMenu("fetch");
                  getTickets();
                }}
                sx={{
                  width: 36,
                  height: 36,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 1,
                  cursor: "pointer",
                  backgroundColor:
                    activeMenu === "fetch"
                      ? customColor.newBgColor
                      : "transparent",
                  color: activeMenu === "fetch" ? "#fff" : "#666",
                  transition: "all 0.2s ease",
                }}
              >
                <FormatListBulletedIcon sx={{ fontSize: 18 }} />
              </Box>
            </Tooltip>

            <Box sx={{ marginTop: "auto", pb: 1.5 }}>
              <Tooltip title="Send Feedback" placement="right">
                <Box
                  onClick={() => setActiveMenu("feedback")}
                  sx={{
                    width: 36,
                    height: 36,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 1,
                    cursor: "pointer",
                    backgroundColor:
                      activeMenu === "feedback"
                        ? customColor.newBgColor
                        : "transparent",
                    color: activeMenu === "feedback" ? "#fff" : "#666",
                    transition: "all 0.2s ease",
                  }}
                >
                  <ChatIcon sx={{ fontSize: 18 }} />
                </Box>
              </Tooltip>
            </Box>
          </Box>

          {/* Right Content Area */}
          <Box sx={{ flex: 1, p: 2.5, overflow: "auto" }}>
            {/* Create Ticket Form */}
            {activeMenu === "create" && (
              <Box sx={{ }}>
                <Typography variant="h6" sx={{ mb: 3 }}>
                  Create New Ticket
                </Typography>

                {/* Topic */}
                <Box sx={{ mb: 2.5 }}>
                  <Typography component="span" fontWeight={600}>
                    Topic <span style={{ color: "red" }}>*</span>
                  </Typography>
                  <Select
                    size="small"
                    fullWidth
                    displayEmpty
                    value={formData.topic || ""}
                    onChange={(e) =>
                      handleFormChange("topic", e.target.value || null)
                    }
                    sx={{ mt: 1 }}
                  >
                    <MenuItem value="" disabled>
                      Select Topic
                    </MenuItem>
                    {topicOptions.map((option: any) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </Box>

                {/* Priority & Language Row */}
                <Grid container spacing={2} sx={{ mb: 2.5 }}>
                  <Grid item xs={6}>
                    <Typography component="span" fontWeight={600}>
                      Priority
                    </Typography>
                    <Select
                      size="small"
                      fullWidth
                      displayEmpty
                      value={formData.priority || ""}
                      onChange={(e) =>
                        handleFormChange("priority", e.target.value || null)
                      }
                      sx={{ mt: 1 }}
                    >
                      <MenuItem value="">Select Priority</MenuItem>
                      {priorityOptions.map((option: any) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography component="span" fontWeight={600}>
                      Language
                    </Typography>
                    <Select
                      size="small"
                      fullWidth
                      displayEmpty
                      value={formData.language || ""}
                      onChange={(e) =>
                        handleFormChange("language", e.target.value || null)
                      }
                      sx={{ mt: 1 }}
                    >
                      <MenuItem value="">Select Language</MenuItem>
                      {languageOptions.map((option: any) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </Grid>
                </Grid>

                {/* Subject */}
                <Box sx={{ mb: 2.5 }}>
                  <Typography component="span" fontWeight={600}>
                    Subject <span style={{ color: "red" }}>*</span>
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Enter subject"
                    value={formData.subject}
                    onChange={(e) =>
                      handleFormChange("subject", e.target.value)
                    }
                    inputProps={{ maxLength: 100 }}
                    helperText={`${formData.subject.length}/100`}
                    FormHelperTextProps={{ sx: { textAlign: "right", mx: 0 } }}
                    sx={{ mt: 1 }}
                  />
                </Box>

                {/* Concern */}
                <Box sx={{ mb: 2.5 }}>
                  <Typography component="span" fontWeight={600}>
                    Describe Your Concern{" "}
                    <span style={{ color: "red" }}>*</span>
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={6}
                    placeholder="Please describe your issue or concern in detail..."
                    value={formData.concern}
                    onChange={(e) =>
                      handleFormChange("concern", e.target.value)
                    }
                    inputProps={{ maxLength: 1000 }}
                    helperText={`${formData.concern.length}/1000`}
                    FormHelperTextProps={{ sx: { textAlign: "right", mx: 0 } }}
                    sx={{ mt: 1 }}
                  />
                </Box>

                {/* Attachment */}
                <Box sx={{ mb: 3 }}>
                  <Typography component="span" fontWeight={600}>
                    Attachment
                  </Typography>
                  <Box
                    component="label"
                    htmlFor="ticket-file-upload"
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "2px dashed #d9d9d9",
                      borderRadius: 1,
                      p: 3,
                      mt: 1,
                      cursor: "pointer",
                      "&:hover": { borderColor: customColor.newBgColor },
                      transition: "border-color 0.2s",
                    }}
                  >
                    <input
                      id="ticket-file-upload"
                      type="file"
                      hidden
                      accept=".png,.jpg,.jpeg,.pdf,.doc,.docx,.xls,.xlsx"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setFileList([
                            { name: file.name, originFileObj: file },
                          ]);
                          setFormData((prev) => ({
                            ...prev,
                            attachment: file as any,
                          }));
                        } else {
                          setFileList([]);
                          setFormData((prev) => ({
                            ...prev,
                            attachment: null,
                          }));
                        }
                      }}
                    />
                    <CloudUploadIcon
                      sx={{ fontSize: 48, color: "#999", mb: 1 }}
                    />
                    <Typography>Click or drag file to upload</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Supported: PNG, JPG, PDF, DOC, XLS (Max 1 file)
                    </Typography>
                    {fileList.length > 0 && (
                      <Typography
                        variant="caption"
                        color="primary"
                        sx={{ mt: 1 }}
                      >
                        {fileList[0].name}
                      </Typography>
                    )}
                  </Box>
                </Box>

                <Divider />

                {/* Bottom Buttons */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 1.5,
                    mt: 2,
                  }}
                >
                  <Button variant="outlined" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={loading === "submitting"}
                    startIcon={
                      loading === "submitting" ? (
                        <CircularProgress size={16} color="inherit" />
                      ) : undefined
                    }
                  >
                    Submit
                  </Button>
                </Box>
              </Box>
            )}

            {/* Feedback Form */}
            {activeMenu === "feedback" && (
              <Box sx={{  }}>
                <Typography variant="h6" sx={{ mb: 0.5 }}>
                  Send Feedback
                </Typography>
                <Divider sx={{ mt: 1, mb: 2.5 }} />

                {(() => {
                  const ALLOWED = /^[A-Za-z0-9@%&()\-[\]:?.,/ ]*$/;
                  const len = feedbackData.description.length;
                  const tooShort = len > 0 && len < 10;
                  const hasInvalid =
                    len > 0 && !ALLOWED.test(feedbackData.description);
                  const showError = tooShort || hasInvalid;
                  return (
                    <>
                      {/* Topic */}
                      <Box sx={{ mb: 2.5 }}>
                        <Typography component="span" fontWeight={600}>
                          Topic <span style={{ color: "red" }}>*</span>
                        </Typography>
                        <Select
                          size="small"
                          fullWidth
                          displayEmpty
                          value={feedbackData.topic || ""}
                          onChange={(e) =>
                            setFeedbackData((prev: any) => ({
                              ...prev,
                              topic: e.target.value || null,
                            }))
                          }
                          sx={{ mt: 1 }}
                        >
                          <MenuItem value="" disabled>
                            Select Topic
                          </MenuItem>
                          {topicOptions.map((option: any) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </Box>

                      {/* Priority & Language Row */}
                      <Grid container spacing={2} sx={{ mb: 2.5 }}>
                        <Grid item xs={6}>
                          <Typography component="span" fontWeight={600}>
                            Priority
                          </Typography>
                          <Select
                            size="small"
                            fullWidth
                            displayEmpty
                            value={feedbackData.priority || ""}
                            onChange={(e) =>
                              setFeedbackData((prev: any) => ({
                                ...prev,
                                priority: e.target.value || null,
                              }))
                            }
                            sx={{ mt: 1 }}
                          >
                            <MenuItem value="">Select Priority</MenuItem>
                            {priorityOptions.map((option: any) => (
                              <MenuItem key={option.value} value={option.value}>
                                {option.label}
                              </MenuItem>
                            ))}
                          </Select>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography component="span" fontWeight={600}>
                            Language
                          </Typography>
                          <Select
                            size="small"
                            fullWidth
                            displayEmpty
                            value={feedbackData.language || ""}
                            onChange={(e) =>
                              setFeedbackData((prev: any) => ({
                                ...prev,
                                language: e.target.value || null,
                              }))
                            }
                            sx={{ mt: 1 }}
                          >
                            <MenuItem value="">Select Language</MenuItem>
                            {languageOptions.map((option: any) => (
                              <MenuItem key={option.value} value={option.value}>
                                {option.label}
                              </MenuItem>
                            ))}
                          </Select>
                        </Grid>
                      </Grid>

                      {/* Subject */}
                      <Box sx={{ mb: 2.5 }}>
                        <Typography component="span" fontWeight={600}>
                          Subject <span style={{ color: "red" }}>*</span>
                        </Typography>
                        <TextField
                          fullWidth
                          size="small"
                          placeholder="Enter subject"
                          value={feedbackData.subject}
                          onChange={(e) =>
                            setFeedbackData((prev: any) => ({
                              ...prev,
                              subject: e.target.value,
                            }))
                          }
                          inputProps={{ maxLength: 100 }}
                          helperText={`${feedbackData.subject.length}/100`}
                          FormHelperTextProps={{
                            sx: { textAlign: "right", mx: 0 },
                          }}
                          sx={{ mt: 1 }}
                        />
                      </Box>

                      {/* Description */}
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 0.75,
                        }}
                      >
                        <Typography component="span" fontWeight={600}>
                          Describe your feedback{" "}
                          <span style={{ color: "red" }}>(required)</span>
                        </Typography>
                        <Typography
                          component="span"
                          variant="caption"
                          sx={{
                            color:
                              len > 500
                                ? "error.main"
                                : len >= 10
                                  ? "#52c41a"
                                  : "text.secondary",
                          }}
                        >
                          {len}/500
                        </Typography>
                      </Box>
                      <TextField
                        fullWidth
                        multiline
                        rows={5}
                        placeholder="Tell us what prompted this feedback... (min 10 characters)"
                        value={feedbackData.description}
                        error={showError}
                        inputProps={{ maxLength: 500 }}
                        onChange={(e) => {
                          const filtered = e.target.value.replace(
                            /[^A-Za-z0-9@%&()\-[\]:?.,/ ]/g,
                            "",
                          );
                          setFeedbackData((prev: any) => ({
                            ...prev,
                            description: filtered,
                          }));
                        }}
                        sx={{ mb: 0.5 }}
                      />
                      {showError ? (
                        <Typography variant="caption" color="error">
                          {tooShort
                            ? `Minimum 10 characters required (${len} entered)`
                            : "Only A-Z a-z 0-9 @ % & ( ) - [ ] : ? . , / and spaces are allowed"}
                        </Typography>
                      ) : (
                        <Typography variant="caption" color="text.secondary">
                          Please don't include any sensitive information
                        </Typography>
                      )}
                    </>
                  );
                })()}

                <Divider sx={{ my: 2 }} />

                {/* Screenshot */}
                <Typography variant="body2" sx={{ display: "block", mb: 1 }}>
                  A screenshot will help us better understand your feedback.
                </Typography>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={
                    <svg
                      viewBox="0 0 24 24"
                      width="16"
                      height="16"
                      style={{ verticalAlign: "middle" }}
                      fill="currentColor"
                    >
                      <path d="M21 3H3a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm0 16H3V5h18v14zM5 15l3.5-4.5 2.5 3.01L14.5 9l4.5 6H5z" />
                    </svg>
                  }
                  onClick={captureScreenshot}
                  sx={{ mb: 1.5 }}
                >
                  Capture screenshot
                </Button>

                {feedbackData.screenshot && (
                  <Box sx={{ mb: 1.5 }}>
                    <Typography
                      variant="caption"
                      fontWeight={600}
                      sx={{ display: "block", mb: 0.75 }}
                    >
                      Attached screenshot
                    </Typography>
                    <Box
                      sx={{
                        position: "relative",
                        border: "1px solid #d9d9d9",
                        borderRadius: 1,
                        overflow: "hidden",
                      }}
                    >
                      <img
                        src={feedbackData.screenshot}
                        alt="screenshot preview"
                        style={{
                          width: "100%",
                          display: "block",
                          objectFit: "contain",
                          maxHeight: 200,
                        }}
                      />
                      <Button
                        size="small"
                        color="error"
                        variant="contained"
                        sx={{ position: "absolute", top: 6, right: 6 }}
                        onClick={() =>
                          setFeedbackData((prev: any) => ({
                            ...prev,
                            screenshot: null,
                          }))
                        }
                      >
                        Remove
                      </Button>
                    </Box>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<BrushIcon />}
                      sx={{
                        mt: 1,
                        color: customColor.newBgColor,
                        borderColor: customColor.newBgColor,
                      }}
                      onClick={() => {
                        setAnnotationOpen(true);
                        setTimeout(
                          () => initAnnotationCanvas(feedbackData.screenshot),
                          80,
                        );
                      }}
                    >
                      Highlight or Hide info on your screenshot
                    </Button>
                  </Box>
                )}

                <Divider sx={{ my: 2 }} />

                {/* Email consent */}
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={feedbackData.emailConsent}
                      onChange={(e) =>
                        setFeedbackData((prev: any) => ({
                          ...prev,
                          emailConsent: e.target.checked,
                        }))
                      }
                    />
                  }
                  label="We may email you for more information or updates"
                  sx={{ mb: 2 }}
                />

                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: "block", lineHeight: 1.5, mb: 3 }}
                >
                  Some account and system information may be sent to support. We
                  will use it to fix problems and improve our services, subject
                  to our Privacy Policy and Terms of Service. We may email you
                  for more information or updates.
                </Typography>

                {/* Actions */}
                <Box
                  sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}
                >
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setFeedbackData({
                        topic: null,
                        priority: null,
                        language: null,
                        subject: "",
                        description: "",
                        emailConsent: false,
                        screenshot: null,
                      });
                      setActiveMenu("create");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    disabled={(() => {
                      const ALLOWED = /^[A-Za-z0-9@%&()\-[\]:?.,/ ]*$/;
                      const len = feedbackData.description.length;
                      return (
                        len < 10 ||
                        len > 500 ||
                        !ALLOWED.test(feedbackData.description) ||
                        !feedbackData.emailConsent
                      );
                    })()}
                    onClick={handleSubmitFeedback}
                    startIcon={
                      feedbackLoading ? (
                        <CircularProgress size={16} color="inherit" />
                      ) : undefined
                    }
                  >
                    Send
                  </Button>
                </Box>
              </Box>
            )}

            {/* Fetch Tickets List */}
            {activeMenu === "fetch" && (
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Typography variant="h6">My Tickets</Typography>
                  <Button
                    component="a"
                    href={`${axiosLink}/open.php`}
                    target="_blank"
                    variant="text"
                  >
                    Open on Support Portal
                  </Button>
                </Box>

                {/* Skeleton Loading */}
                {loading === "fetching" && (
                  <Stack
                    direction="column"
                    spacing={1.5}
                    sx={{ width: "100%" }}
                  >
                    {[1, 2, 3].map((item) => (
                      <Card variant="outlined" key={item}>
                        <CardContent sx={{ py: 1, "&:last-child": { pb: 1 } }}>
                          <Skeleton variant="text" width="40%" />
                          <Skeleton variant="text" />
                          <Skeleton variant="text" width="60%" />
                        </CardContent>
                      </Card>
                    ))}
                  </Stack>
                )}

                {/* No Tickets */}
                {tickets.length === 0 && loading !== "fetching" && (
                  <Card sx={{ textAlign: "center", p: 5 }}>
                    <Typography color="text.secondary">
                      No tickets found
                    </Typography>
                  </Card>
                )}

                {/* Tickets List */}
                {!loading && tickets.length > 0 && (
                  <Stack
                    direction="column"
                    spacing={1.5}
                    sx={{ width: "100%" }}
                  >
                    {tickets.map((ticket: any, index: any) => (
                      <Card variant="outlined" key={ticket.ticket || index}>
                        <CardContent sx={{ py: 1, "&:last-child": { pb: 1 } }}>
                          <Grid container spacing={0.75}>
                            <Grid item xs={4}>
                              <Typography component="span" fontWeight={600}>
                                Date:{" "}
                              </Typography>
                              <Typography component="span">
                                {ticket.date}
                              </Typography>
                            </Grid>
                            <Grid item xs={4}>
                              <Typography component="span" fontWeight={600}>
                                Priority:{" "}
                              </Typography>
                              <Typography
                                component="span"
                                sx={{
                                  backgroundColor:
                                    ticket.priorityColor || "#f0f0f0",
                                  px: 1,
                                  py: 0.25,
                                  borderRadius: 0.5,
                                  fontSize: 12,
                                }}
                              >
                                {ticket.priority}
                              </Typography>
                            </Grid>
                            <Grid item xs={4}>
                              <Typography component="span" fontWeight={600}>
                                Ticket No.:{" "}
                              </Typography>
                              <a
                                target="_blank"
                                rel="noopener noreferrer"
                                href={`${axiosLink}/view.php?e=${user.email}&t=${ticket.ticket}`}
                              >
                                <Typography
                                  component="span"
                                  sx={{ color: customColor.newBgColor }}
                                >
                                  {ticket.ticket}
                                </Typography>
                              </a>
                              <Tooltip title="Copy ticket number">
                                <IconButton
                                  size="small"
                                  onClick={() =>
                                    navigator.clipboard.writeText(ticket.ticket)
                                  }
                                >
                                  <ContentCopyIcon sx={{ fontSize: 14 }} />
                                </IconButton>
                              </Tooltip>
                            </Grid>
                            <Grid item xs={12}>
                              <Typography component="span" fontWeight={600}>
                                Subject:{" "}
                              </Typography>
                              <Typography component="span">
                                {ticket.subject}
                              </Typography>
                            </Grid>
                            <Grid item xs={12}>
                              <Typography component="span" fontWeight={600}>
                                Status:{" "}
                              </Typography>
                              <Typography
                                component="span"
                                sx={{
                                  color:
                                    ticket.status === "O"
                                      ? "#faad14"
                                      : ticket.status === "R"
                                        ? "#52c41a"
                                        : ticket.status === "C"
                                          ? "#1890ff"
                                          : "#999",
                                }}
                              >
                                {ticket.status === "O"
                                  ? "Open"
                                  : ticket.status === "A"
                                    ? "Archived"
                                    : ticket.status === "C"
                                      ? "Closed"
                                      : ticket.status === "R"
                                        ? "Resolved"
                                        : ticket.status === "D"
                                          ? "Deleted"
                                          : ticket.status}
                              </Typography>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    ))}
                  </Stack>
                )}
              </Box>
            )}
          </Box>
        </Box>
      </Drawer>

      {/* Annotation Dialog */}
      <Dialog
        open={annotationOpen}
        onClose={() => setAnnotationOpen(false)}
        maxWidth={false}
        PaperProps={{
          sx: {
            width: "92vw",
            maxWidth: "92vw",
            mt: "20px",
            verticalAlign: "top",
          },
        }}
      >
        <DialogTitle>Highlight or Hide Info</DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          <Box
            sx={{
              overflow: "auto",
              maxHeight: "82vh",
              background: "#f0f0f0",
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-start",
              p: 2,
            }}
          >
            <canvas
              ref={canvasRef}
              style={{
                maxWidth: "100%",
                cursor: "crosshair",
                borderRadius: 4,
                boxShadow: "0 2px 12px rgba(0,0,0,0.18)",
                display: "block",
              }}
              onMouseDown={onCanvasMouseDown}
              onMouseMove={onCanvasMouseMove}
              onMouseUp={onCanvasMouseUp}
              onMouseLeave={onCanvasMouseUp}
            />
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 1,
            px: 2,
          }}
        >
          {/* Left — tools + undo/redo */}
          <Box sx={{ display: "flex", gap: 0.75, alignItems: "center" }}>
            {[
              {
                key: "highlight",
                icon: <BrushIcon fontSize="small" />,
                label: "Highlight",
              },
              {
                key: "hide",
                icon: <VisibilityOffIcon fontSize="small" />,
                label: "Hide",
              },
            ].map((tool) => (
              <Tooltip key={tool.key} title={tool.label}>
                <Button
                  size="small"
                  variant={activeTool === tool.key ? "contained" : "outlined"}
                  startIcon={tool.icon}
                  onClick={() => setActiveTool(tool.key)}
                  sx={
                    activeTool === tool.key
                      ? {
                          backgroundColor: customColor.newBgColor,
                          borderColor: customColor.newBgColor,
                          "&:hover": {
                            backgroundColor: customColor.newBgColor,
                          },
                        }
                      : {}
                  }
                >
                  {tool.label}
                </Button>
              </Tooltip>
            ))}

            <Divider orientation="vertical" flexItem sx={{ mx: 0.25 }} />

            <Tooltip title="Undo (Ctrl+Z)">
              <span>
                <IconButton
                  size="small"
                  onClick={undoAnnotation}
                  disabled={shapeCount === 0}
                >
                  <UndoIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Redo (Ctrl+Y)">
              <span>
                <IconButton
                  size="small"
                  onClick={redoAnnotation}
                  disabled={redoCount === 0}
                >
                  <RedoIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
          </Box>

          {/* Right — Cancel | Done */}
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button variant="outlined" onClick={() => setAnnotationOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={saveAnnotation}
              sx={{
                backgroundColor: customColor.newBgColor,
                "&:hover": { backgroundColor: customColor.newBgColor },
              }}
            >
              Done
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </>
  );
}
