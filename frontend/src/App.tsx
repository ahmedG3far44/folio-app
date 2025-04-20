import LandingPage from "./pages/home";
import UserPage from "./pages/user";
import LoginPage from "./pages/login";
import SignUpPage from "./pages/signup";
import ProtectedAdminRoute from "./pages/ProtectedAdminRoute";
import ProtectedUserRoute from "./pages/ProtectedUserRoute";
import { Routes, Route } from "react-router-dom";
import NotFoundPage from "./pages/error";
import BioForm from "./components/forms/BioForm";
import ExperienceForm from "./components/forms/ExperienceForm";
import ProjectForm from "./components/forms/ProjectForm";
import SkillForm from "./components/forms/SkillForm";
import ProjectDetails from "./components/ProjectDetails";

function App() {
  return (
    <Routes>
      <Route index path="/" element={<LandingPage />} />

      <Route path="/:userId" element={<UserPage />} />
      <Route path="/project/:projectId" element={<ProjectDetails />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />

      <Route path="/dashboard" element={<ProtectedAdminRoute />}>
        <Route path="insights" element={<h1>Dashboard Admin Insights</h1>} />
        <Route path="users" element={<h1>Dashboard Admin Insights</h1>} />
        <Route path="themes" element={<h1>Dashboard Admin Insights</h1>} />
      </Route>

      <Route path="/profile" element={<ProtectedUserRoute />}>
        <Route path="bio" element={<BioForm />} />
        <Route path="experiences" element={<ExperienceForm />} />
        <Route path="projects" element={<ProjectForm />} />
        <Route path="skills" element={<SkillForm />} />
        <Route path="testimonials" element={<h1>Profile feedbacks</h1>} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
