import "./App.css";
import AppRouter from "./routes/index.tsx";
import { ThemeProvider } from "./providers/ThemeProvider";

function App() {
  return (
    <>
      <ThemeProvider>
        <div className="h-screen">
          <AppRouter />
        </div>
      </ThemeProvider>
    </>
  );
}

export default App;
