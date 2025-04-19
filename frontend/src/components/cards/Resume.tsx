import { useAuth } from "@/contexts/AuthProvider";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";

const BUCKET_DOMAIN = import.meta.env.VITE_BUCKET_DOMAIN as string;

function Resume() {
  const { user } = useAuth();
  const resumeUrl = `${BUCKET_DOMAIN}/${user.resume}`;

  return (
    <div className="w-full">
      {user.resume && (
        <Button className="w-full">
          <Link target="_blank" to={resumeUrl} download={resumeUrl}>
            Resume
          </Link>
        </Button>
      )}
    </div>
  );
}

export default Resume;
