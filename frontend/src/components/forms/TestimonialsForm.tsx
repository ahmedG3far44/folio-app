import { useState } from "react";
import { Button } from "../ui/button";
import { useAuth } from "@/contexts/AuthProvider";
import { useTheme } from "@/contexts/ThemeProvider";
import { ClipboardCheck, Copy } from "lucide-react";
import { Card } from "../ui/card";
import { useUser } from "@/contexts/UserProvider";

const DOMAIN = import.meta.env.VITE_DOMAIN as string;

function TestimonialsForm() {
  const { user } = useAuth();
  const { testimonials } = useUser();
  const { activeTheme } = useTheme();
  const [copied, setCopy] = useState<boolean>(false);
  const [feedbackUrl, setUrl] = useState<string | null>(null);
  const handleCopyFeedBackUrl = () => {
    if (feedbackUrl) {
      navigator.clipboard.writeText(feedbackUrl);
      setCopy(true);
      setTimeout(() => {
        setCopy(false);
      }, 2000);
    }
  };
  return (
    <>
      <div className="my-4 ">
        {feedbackUrl ? (
          <div
            style={{
              borderColor: activeTheme.borderColor,
              color: activeTheme.primaryText,
            }}
            className="flex justify-start items-center gap-4"
          >
            <p
              style={{
                borderColor: activeTheme.borderColor,
                color: activeTheme.secondaryText,
                backgroundColor: activeTheme.cardColor,
              }}
              className="border px-4 py-2 rounded-md"
            >
              {feedbackUrl}
            </p>
            <Button onClick={handleCopyFeedBackUrl}>
              {copied ? <ClipboardCheck size={20} /> : <Copy size={20} />}
            </Button>
          </div>
        ) : (
          <div className="flex justify-start items-center gap-4">
            <Button
              onClick={() => {
                setUrl(`${DOMAIN}/feedback/${user.id}`);
              }}
            >
              generate your link
            </Button>
          </div>
        )}
      </div>
      <Card
        className="p-4 border"
        style={{
          color: activeTheme.primaryText,
          backgroundColor: activeTheme.backgroundColor,
          borderColor: activeTheme.borderColor,
        }}
      >
        {JSON.stringify(testimonials)}
      </Card>
    </>
  );
}

export default TestimonialsForm;
