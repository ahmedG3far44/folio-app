import { useTheme } from "@/contexts/ThemeProvider";
import { IContactType } from "@/lib/types";
import { Github, Linkedin, Twitter, Youtube } from "lucide-react";
import { Link } from "react-router-dom";

function ShowUserContacts({ contacts }: { contacts?: IContactType }) {
  return (
    <div className="flex items-center gap-2">
      {contacts?.github && (
        <ContactIcon
          path={contacts.github}
          label="GitHub"
        >
          <Github size={18} />
        </ContactIcon>
      )}
      {contacts?.youtube && (
        <ContactIcon
          path={contacts.youtube}
          label="YouTube"
        >
          <Youtube size={18} />
        </ContactIcon>
      )}
      {contacts?.twitter && (
        <ContactIcon
          path={contacts.twitter}
          label="Twitter"
        >
          <Twitter size={18} />
        </ContactIcon>
      )}
      {contacts?.linkedin && (
        <ContactIcon
          path={contacts.linkedin}
          label="LinkedIn"
        >
          <Linkedin size={18} />
        </ContactIcon>
      )}
    </div>
  );
}

function ContactIcon({ path, label, children }: { path: string; label: string; children: React.ReactNode }) {
  const { activeTheme } = useTheme();
  return (
    <Link
      style={{
        color: activeTheme.secondaryText,
      }}
      className="p-2 rounded-lg hover:opacity-70 hover:scale-110 transition-all duration-200 cursor-pointer"
      target="_blank"
      to={path}
      aria-label={label}
    >
      {children}
    </Link>
  );
}

export default ShowUserContacts;
