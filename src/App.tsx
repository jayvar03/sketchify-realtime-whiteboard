import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { RecoilRoot } from "recoil";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Modal from "./common/components/Modal";
import Home from "./modules/home/components/Home";
import Room from "./modules/room/components/Room";

function App() {
  return (
    <RecoilRoot>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/room/:roomId" element={<Room />} />
        </Routes>
        <Modal />
        <ToastContainer />
      </Router>
    </RecoilRoot>
  );
}

export default App;
