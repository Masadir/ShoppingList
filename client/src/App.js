import './App.css';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import {Home} from "./pages/home.js";
import {Authorization} from "./pages/authorization.js";
import {CreateList} from "./pages/create-list.js";
import {SavedLists} from "./pages/lists.js";
import {Navbar} from "./components/navbar.js";

function App() {
  return (
    <div className="App">
      <Router> 
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/authorization" element={<Authorization />} />
          <Route path="/create-list" element={<CreateList />} />
          <Route path="/lists" element={<SavedLists />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
