import './App.css'
import { useRoutes } from "react-router-dom";
import routes from "./routes";

function AppContent() {
  const content = useRoutes(routes);
  return content;
}

function App() {
  return (
    <>
      <AppContent />
    </>
  )
}

export default App
