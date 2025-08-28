import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Navbar from "./components/layout/Navbar.jsx";
import Footer from "./components/layout/Footer.jsx";
import HomePage from "./pages/HomePage.jsx";
import JobPage from "./pages/JobsPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import Login from "./pages/Login.jsx";
import RegisterPage from "./pages/Register.jsx";
import UnauthorizedPage from "./pages/UnauthorizedPage.jsx";
import JobDetailPage from "./pages/JobDetailPage.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import CandidateProfile from "./pages/CandidateProfile.jsx";
import RecruiterDashboard from "./pages/RecruiterDashboard.jsx";

function App() {
  return (
    <Router data-oid="65tedse">
      <div className="flex flex-col min-h-screen" data-oid="7qe1ack">
        <Navbar data-oid="cyxgsf9" />
        <main className="flex-grow " data-oid="89z3tor">
          <Routes data-oid="ybm:g35">
            <Route
              path="/"
              element={<HomePage data-oid="45okzi1" />}
              data-oid="yeh.t.f"
            />
            <Route
              path="/jobs"
              element={<JobPage data-oid="46nksro" />}
              data-oid="jzlejlo"
            />
            <Route
              path="/jobs/:id"
              element={<JobDetailPage data-oid="-_zlc8q" />}
              data-oid="w8dsbv-"
            />
            <Route
              path="/login"
              element={<Login data-oid="lgo90bb" />}
              data-oid="8db8lt."
            />
            <Route
              path="/register"
              element={<RegisterPage data-oid="som6oq:" />}
              data-oid="ht6bv72"
            />
            <Route
              path="/forgot-password"
              element={<ForgotPassword data-oid="l6xw5jz" />}
              data-oid="x_p:ck9"
            />
            <Route
              path="/profile"
              element={<CandidateProfile data-oid="k5u30hx" />}
              data-oid="qdczvqw"
            />
            <Route
              path="/dashboard"
              element={<RecruiterDashboard data-oid="rec_dash_1" />}
              data-oid="rec_dash_route"
            />
            <Route
              path="/404"
              element={<NotFoundPage data-oid="trp3th:" />}
              data-oid="2rrlp8s"
            />
            <Route
              path="*"
              element={<UnauthorizedPage data-oid="p1g8kei" />}
              data-oid="z5z.tti"
            />
          </Routes>
        </main>
        <Footer data-oid="qbhp:3:" />
      </div>
    </Router>
  );
}

export default App;