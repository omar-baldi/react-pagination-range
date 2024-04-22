import "./App.css";
import Pagination from "./components/Pagination";

function App() {
  return (
    <Pagination
      totalAmountElements={50}
      siblingCount={2}
      boundaryCount={2}
      initialPage={6}
    />
  );
}

export default App;
