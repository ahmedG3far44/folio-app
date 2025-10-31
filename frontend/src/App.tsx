import UserPage from "./pages/user";
import LoginPage from "./pages/login";
import LandingPage from "./pages/home";
import SignUpPage from "./pages/signup";
import NotFoundPage from "./pages/error";
import UserFeedBack from "./pages/feedback";
import BioForm from "./components/forms/BioForm";
import Insights from "./components/admin/Insights";
import UsersList from "./components/admin/UsersList";
import SkillForm from "./components/forms/SkillForm";
import ThemesList from "./components/admin/ThemesList";
import ThemesForm from "./components/forms/ThemesForm";
import ProjectForm from "./components/forms/ProjectForm";
import ProjectDetails from "./components/ProjectDetails";
import ProtectedUserRoute from "./pages/ProtectedUserRoute";
import ProtectedAdminRoute from "./pages/ProtectedAdminRoute";
import ExperienceForm from "./components/forms/ExperienceForm";
import TestimonialsForm from "./components/forms/TestimonialsForm";

import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route index path="/" element={<LandingPage />} />
      <Route path="/:userId" element={<UserPage />} />
      <Route path="/feedback/:userId" element={<UserFeedBack />} />
      <Route path="/project/:projectId" element={<ProjectDetails />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />

      <Route path="/dashboard" element={<ProtectedAdminRoute />}>
        <Route path="insights" element={<Insights />} />
        <Route path="users" element={<UsersList />} />
        <Route path="themes" element={<ThemesList />} />
      </Route>
      <Route path="/profile" element={<ProtectedUserRoute />}>
        <Route path="bio" element={<BioForm />} />
        <Route path="experiences" element={<ExperienceForm />} />
        <Route path="projects" element={<ProjectForm />} />
        <Route path="skills" element={<SkillForm />} />
        <Route path="testimonials" element={<TestimonialsForm />} />
        <Route path="themes" element={<ThemesForm />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
