import { useTheme } from "@/contexts/ThemeProvider";
import { IContactType } from "@/lib/types";
import { Github, Linkedin, Twitter, Youtube } from "lucide-react";
import { ReactNode } from "react";
import { Link } from "react-router-dom";

function ShowUserContacts({ contacts }: { contacts?: IContactType }) {
  const { activeTheme } = useTheme();
  return (
    <div className="flex justify-start items-start gap-2">
      {/* {contacts?.id} */}
      {contacts?.github && (
        <ContactIcon
          path={contacts.github}
          icons={<Github color={activeTheme.primaryText} size={20} />}
        />
      )}
      {contacts?.youtube && (
        <ContactIcon
          path={contacts.youtube}
          icons={<Youtube color={activeTheme.primaryText} size={20} />}
        />
      )}
      {contacts?.twitter && (
        <ContactIcon
          path={contacts.twitter}
          icons={<Twitter color={activeTheme.primaryText} size={20} />}
        />
      )}
      {contacts?.linkedin && (
        <ContactIcon
          path={contacts.linkedin}
          icons={<Linkedin color={activeTheme.primaryText} size={20} />}
        />
      )}
    </div>
  );
}

function ContactIcon({ path, icons }: { path: string; icons: ReactNode }) {
  const { activeTheme } = useTheme();
  return (
    <Link
      style={{
        backgroundColor: activeTheme.cardColor,
        border: `1px solid ${activeTheme.borderColor}`,
      }}
      className="p-2 border rounded-lg hover:opacity-70 duration-150   cursor-pointer"
      target="_blank"
      to={path}
    >
      <span>
        <label className="hidden">Linkedin Profile Link</label>
        {icons}
      </span>
    </Link>
  );
}

export default ShowUserContacts;
