import { useState } from "react";
import { useUser } from "@/contexts/UserProvider";
import { useAuth } from "@/contexts/AuthProvider";
import { useTheme } from "@/contexts/ThemeProvider";

import { ClipboardCheck, Copy, Link2, MessageCircleMore } from "lucide-react";

import { Button } from "../ui/button";

import Loader from "../loader";
import ShowListCard from "../cards/ShowListCard";

function TestimonialsForm() {
  const { host, protocol } = window.location;
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
        setUrl(null);
      }, 3000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        {feedbackUrl ? (
          <div className="flex items-center gap-3">
            <div
              className="flex-1 rounded-lg border px-4 py-2.5 text-sm truncate"
              style={{
                backgroundColor: activeTheme.cardColor,
                borderColor: activeTheme.borderColor,
                color: activeTheme.secondaryText,
              }}
            >
              {feedbackUrl}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="cursor-pointer shrink-0"
              onClick={handleCopyFeedBackUrl}
            >
              {copied ? <ClipboardCheck size={16} /> : <Copy size={16} />}
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            className="cursor-pointer"
            onClick={() => setUrl(`${protocol}//${host}/feedback/${user.id}`)}
          >
            <Link2 size={16} />
            Generate Feedback Link
          </Button>
        )}
      </div>

      {pending ? (
        <div className="w-full min-h-[300px] flex items-center justify-center">
          <Loader size="md" />
        </div>
      ) : (
        <>
          {testimonials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {testimonials.map(({ id, name, profile, position, feedback, video }) => (
                <ShowListCard
                  key={id}
                  id={id}
                  title={name}
                  image={profile}
                  position={position}
                  feedback={feedback}
                  video={video}
                  vertical={true}
                  sectionName={"feedback"}
                />
              ))}
            </div>
          ) : (
            <div
              className="w-full min-h-[300px] flex flex-col items-center justify-center gap-3 rounded-xl border"
              style={{
                backgroundColor: activeTheme.backgroundColor,
                borderColor: activeTheme.borderColor,
              }}
            >
              <MessageCircleMore size={32} className="opacity-30" />
              <p className="text-sm opacity-50">No testimonials yet</p>
              <p
                className="text-xs"
                style={{ color: activeTheme.secondaryText }}
              >
                Share your feedback link above to collect testimonials
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default TestimonialsForm;
