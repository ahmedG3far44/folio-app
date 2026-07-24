import { useAuth } from "@/contexts/AuthProvider";
import { Button } from "../ui/button";

function Resume() {
  const { isLogged, user } = useAuth();

  return (
    <>
      {isLogged && user?.resume && (
        <Button asChild>
          <a href={user.resume} target="_blank" rel="noopener noreferrer" download>
            Resume
          </a>
        </Button>
      )}
    </>
  );
}

export default Resume;
