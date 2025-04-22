import { useState } from "react";
import { Button } from "../ui/button";
import { useAuth } from "@/contexts/AuthProvider";

const DOMAIN = import.meta.env.VITE_DOMAIN as string;

function TestimonialsForm() {
  const { user } = useAuth();
  const [copied, setCopy] = useState<boolean>(false);
  const handleCopyFeedBackUrl = () => {
    navigator.clipboard.writeText(`${DOMAIN}/feedback/${user.id}`);
    setCopy(true);
    setTimeout(() => {
      setCopy(false);
    }, 2000);
  };
  return (
    <div>
      <Button onClick={handleCopyFeedBackUrl}>
        {copied ? "copied" : "copy"}
      </Button>
    </div>
  );
}

export default TestimonialsForm;
