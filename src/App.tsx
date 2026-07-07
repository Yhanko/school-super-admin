import { Routers } from "./routes/routes";

import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <Routers />
    </>
  );
}

export default App;
