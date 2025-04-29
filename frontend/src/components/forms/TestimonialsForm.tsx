import { useState } from "react";
import { Button } from "../ui/button";
import { useAuth } from "@/contexts/AuthProvider";
import { useTheme } from "@/contexts/ThemeProvider";
import { ClipboardCheck, Copy } from "lucide-react";
import { Card } from "../ui/card";
import { useUser } from "@/contexts/UserProvider";
import ShowListCard from "../cards/ShowListCard";
import Loader from "../loader";

const LOCAL_DOMAIN = import.meta.env.VITE_LOCAL_DOMAIN as string;
const PRODUCTION_DOMAIN = import.meta.env.VITE_PRODUCTION_DOMAIN as string;
const ENV = import.meta.env.VITE_ENV as string;

function TestimonialsForm() {
  const { user } = useAuth();
  const { testimonials, pending } = useUser();
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
                setUrl(`${ENV === "development"? LOCAL_DOMAIN: PRODUCTION_DOMAIN}/feedback/${user.id}`);
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
        {pending ? (
          <div className="w-full min-h-[400px] flex items-center justify-center">
            <Loader size="md" />
          </div>
        ) : (
          <>
            {testimonials.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 grid-flow-row">
                {testimonials.map((testimonial) => {
                  return (
                    <ShowListCard
                      id={testimonial?.id}
                      key={testimonial?.id}
                      title={testimonial?.name}
                      image={testimonial?.profile}
                      position={testimonial?.position}
                      feedback={testimonial?.feedback}
                      vertical={true}
                      sectionName={"feedback"}
                    />
                  );
                })}
              </div>
            )}
          </>
        )}
      </Card>
    </>
  );
}

export default TestimonialsForm;
