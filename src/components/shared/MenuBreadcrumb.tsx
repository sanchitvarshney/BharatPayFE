import { useLocation } from "react-router-dom";
import { useAppSelector } from "@/hooks/useReduxHook";
import { Menu } from "@/features/menu/menuType";
import { Breadcrumbs, Typography } from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { Link } from "react-router-dom";

const findMenuPath = (menu: Menu[] | null, currentPath: string): Menu[] => {
  if (!menu) return [];

  const findPath = (items: Menu[], path: string, currentPath: Menu[] = []): Menu[] | null => {
    for (const item of items) {
      
      if (item.url === path) {
        return [...currentPath, item];
      }
      if (item.children) {
        const childPath = findPath(item.children, path, [...currentPath, item]);
        if (childPath) return childPath;
      }
    }
    return null;
  };

  return findPath(menu, currentPath) || [];
};

const MenuBreadcrumb = () => {
  const location = useLocation();
  
  const { menu } = useAppSelector((state) => state.menu);
  const path = findMenuPath(menu, location.pathname);

  if (path.length === 0) return "Dashboard";

  return (
    <Breadcrumbs 
      separator={<NavigateNextIcon fontSize="small" />} 
      aria-label="menu breadcrumb"
      className="text-white"
    >
      {path.map((item, index) => (
        <Typography
          key={item.menu_key}
          color={index === path.length - 1 ? "text.primary" : "text.secondary"}
          fontSize="14px"
          className={index === path.length - 1 ? "text-white" : "text-gray-300"}
        >
          {index === path.length - 1 ? (
            item.name
          ) : (
            <Link 
              to={item.url || "#"} 
              // className="hover:text-white transition-colors"
            >
              {item.name}
            </Link>
          )}
        </Typography>
      ))}
    </Breadcrumbs>
  );
};

export default MenuBreadcrumb; 