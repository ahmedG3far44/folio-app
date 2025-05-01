import { useAuth } from "@/contexts/AuthProvider";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeProvider";

const BUCKET_DOMAIN = import.meta.env.VITE_BUCKET_DOMAIN as string;

function Resume() {
  const { isLogged, user } = useAuth();
  const { activeTheme } = useTheme();
  const resumeUrl = `${BUCKET_DOMAIN}/${user && user?.resume}`;

  return (
    <>
      {isLogged && (
        <div className="w-3/4 lg:w-full md:w-full my-2">
          {user?.resume && (
            <Button
              style={{
                backgroundColor: activeTheme.cardColor,
                color: activeTheme.primaryText,
              }}
              className="w-full cursor-pointer hover:opacity-75 duration-150"
            >
              <Link target="_blank" to={resumeUrl} download={resumeUrl}>
                Resume
              </Link>
            </Button>
          )}
        </div>
      )}
    </>
  );
}

export default Resume;
