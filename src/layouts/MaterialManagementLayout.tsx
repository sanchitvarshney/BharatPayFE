import React from "react";
import {
  Typography,
  Breadcrumbs,
  Link,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Home, Inventory } from "@mui/icons-material";

interface MaterialManagementLayoutProps {
  children: React.ReactNode;
}

const MaterialManagementLayout: React.FC<MaterialManagementLayoutProps> = ({
  children,
}) => {
  const navigate = useNavigate();

  const breadcrumbItems = [
    {
      label: "Home",
      path: "/",
      icon: <Home fontSize="small" />,
    },
    {
      label: "Material Management",
      path: "/material-management",
      icon: <Inventory fontSize="small" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <Breadcrumbs aria-label="breadcrumb" className="text-sm">
          {breadcrumbItems.map((item, index) => (
            <div key={index} className="flex items-center gap-1">
              {item.icon}
              {index === breadcrumbItems.length - 1 ? (
                <Typography
                  color="text.primary"
                  className="text-sm font-medium"
                >
                  {item.label}
                </Typography>
              ) : (
                <Link
                  component="button"
                  variant="body2"
                  onClick={() => navigate(item.path)}
                  className="text-blue-600 hover:text-blue-800 no-underline"
                >
                  {item.label}
                </Link>
              )}
            </div>
          ))}
        </Breadcrumbs>
      </div>

      {/* Main Content */}
      <div className="flex-1">{children}</div>
    </div>
  );
};

export default MaterialManagementLayout;
