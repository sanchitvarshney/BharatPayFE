import { Outlet } from "react-router-dom";
import "./App.css";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import BugAndChat from "./components/shared/BugAndChat";
dayjs.extend(customParseFormat);
function App() {
  return (
    <>
      <Outlet />
      <BugAndChat />
    </>
  );
}

export default App;
