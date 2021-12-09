import './App.css';
import {PageHeader} from "antd";

function App() {
  return (
    <div className="App">
        <PageHeader
            onBack={() => null}
            title="My Portfolio"
            backIcon={false}
        />
    </div>
  );
}

export default App;
