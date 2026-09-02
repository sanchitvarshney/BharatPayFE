import React, { useMemo, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import ApiIcon from "@mui/icons-material/Api";
import BoltIcon from "@mui/icons-material/Bolt";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import SaveIcon from "@mui/icons-material/Save";
import SettingsEthernetIcon from "@mui/icons-material/SettingsEthernet";
import { showToast } from "@/utils/toasterContext";
import {
  getApiBaseUrl,
  getSavedApiUrls,
  getSavedSocketUrls,
  getSocketUrl,
  setApiBaseUrl,
  setSocketUrl,
} from "@/utils/endpointConfig";

const isValidUrl = (value: string) => {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
};

interface EndpointCardProps {
  icon: React.ReactNode;
  title: string;
  helper: string;
  value: string;
  options: string[];
  envValue: string;
  onChange: (value: string) => void;
}

const EndpointCard: React.FC<EndpointCardProps> = ({
  icon,
  title,
  helper,
  value,
  options,
  envValue,
  onChange,
}) => {
  const trimmed = value.trim();
  const invalid = trimmed.length > 0 && !isValidUrl(trimmed);
  const usingCustom = trimmed !== "" && trimmed !== envValue;

  return (
    <Paper
      variant="outlined"
      sx={{ p: 3, borderRadius: 2, borderColor: "#e5e7eb" }}
    >
      <Stack direction="row" spacing={1.5} alignItems="flex-start">
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 40,
            height: 40,
            borderRadius: 1.5,
            bgcolor: "#eff6ff",
            color: "#2563eb",
            flexShrink: 0,
          }}
        >
          {icon}
        </Box>
        <Box flex={1}>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            flexWrap="wrap"
            useFlexGap
          >
            <Typography variant="subtitle1" fontWeight={600}>
              {title}
            </Typography>
            <Chip
              size="small"
              label={usingCustom ? "Custom" : "Default"}
              color={usingCustom ? "warning" : "default"}
              variant={usingCustom ? "filled" : "outlined"}
            />
          </Stack>
          <Typography variant="body2" color="text.secondary" mt={0.25}>
            {helper}
          </Typography>
        </Box>
      </Stack>

      <Autocomplete
        freeSolo
        options={options}
        value={value}
        onInputChange={(_, newValue) => onChange(newValue)}
        sx={{ mt: 2 }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="URL"
            placeholder="https://example.com"
            error={invalid}
            helperText={invalid ? "Enter a valid URL (including https://)" : " "}
            InputProps={{
              ...params.InputProps,
              sx: { fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 13 },
            }}
          />
        )}
      />

      <Typography variant="caption" color="text.secondary">
        Environment default:{" "}
        <Box component="span" sx={{ fontFamily: "ui-monospace, monospace" }}>
          {envValue || "—"}
        </Box>
      </Typography>
    </Paper>
  );
};

const SettingsPage: React.FC = () => {
  const envApiUrl = import.meta.env.VITE_REACT_APP_API_BASE_URL as string;
  const envSocketUrl = import.meta.env.VITE_SOKET_URL as string;

  const [apiUrl, setApiUrl] = useState<string>(() => getApiBaseUrl());
  const [socketUrl, setSocketUrlState] = useState<string>(() => getSocketUrl());

  const savedApiUrls = useMemo(getSavedApiUrls, []);
  const savedSocketUrls = useMemo(getSavedSocketUrls, []);

  const initialApiUrl = useMemo(getApiBaseUrl, []);
  const initialSocketUrl = useMemo(getSocketUrl, []);

  const dirty =
    apiUrl.trim() !== initialApiUrl || socketUrl.trim() !== initialSocketUrl;

  const handleReset = () => {
    setApiUrl(initialApiUrl);
    setSocketUrlState(initialSocketUrl);
  };

  const handleSave = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedApi = apiUrl.trim();
    const trimmedSocket = socketUrl.trim();

    if (!trimmedApi || !trimmedSocket) {
      showToast("Both API URL and Socket URL are required.", "error");
      return;
    }
    if (!isValidUrl(trimmedApi) || !isValidUrl(trimmedSocket)) {
      showToast("Please enter valid URLs (including https://).", "error");
      return;
    }

    setApiBaseUrl(trimmedApi);
    setSocketUrl(trimmedSocket);
    showToast("Endpoints updated. Reloading…", "success");
    // Reload so the axios instance and socket service pick up the new URLs.
    setTimeout(() => window.location.reload(), 600);
  };

  return (
    <Box sx={{ maxWidth: 720, mx: "auto", px: 3, py: 4 }}>
      <Stack direction="row" spacing={1.5} alignItems="center" mb={0.5}>
        <SettingsEthernetIcon color="primary" />
        <Typography variant="h5" fontWeight={700}>
          Endpoint Settings for Development
        </Typography>
      </Stack>

      <Box component="form" onSubmit={handleSave} sx={{ mt: 3 }}>
        <Stack spacing={2.5}>
          <EndpointCard
            icon={<ApiIcon />}
            title="API Base URL"
            helper="Used for all HTTP requests and file links."
            value={apiUrl}
            options={savedApiUrls}
            envValue={envApiUrl}
            onChange={setApiUrl}
          />
          <EndpointCard
            icon={<BoltIcon />}
            title="Socket URL"
            helper="Used for the realtime Socket.IO connection and downloads."
            value={socketUrl}
            options={savedSocketUrls}
            envValue={envSocketUrl}
            onChange={setSocketUrlState}
          />
        </Stack>

        <Divider sx={{ my: 2 }} />

        <Stack direction="row" spacing={1.5} justifyContent="flex-end">
          <Button
            type="button"
            color="inherit"
            startIcon={<RestartAltIcon />}
            onClick={handleReset}
            disabled={!dirty}
          >
            Reset
          </Button>
          <Button
            type="submit"
            variant="contained"
            startIcon={<SaveIcon />}
            disabled={!dirty}
          >
            Save &amp; Reload
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default SettingsPage;
