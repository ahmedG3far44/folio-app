import { IContactType } from "@/lib/types";
import { Github, Linkedin, Twitter, Youtube } from "lucide-react";
import { Link } from "react-router-dom";

function ShowUserContacts({ contacts }: { contacts?: IContactType }) {
  return (
    <div className="flex justify-start items-start gap-2">
      {/* {contacts?.id} */}
      {contacts?.github && (
        <Link
          className="p-2 border rounded-lg bg-zinc-50 border-zinc-300 hover:bg-zinc-200 cursor-pointer"
          target="_blank"
          to={contacts.github}
        >
          <span>
            <label className="hidden">Github Profile Link</label>
            <Github size={20} />
          </span>
        </Link>
      )}
      {contacts?.youtube && (
        <Link
          className="p-2 border rounded-lg bg-zinc-50 border-zinc-300 hover:bg-zinc-200 cursor-pointer"
          target="_blank"
          to={contacts.youtube}
        >
          <span>
            <label className="hidden">Youtube Channel Url Link</label>
            <Youtube size={20} />
          </span>
        </Link>
      )}
      {contacts?.twitter && (
        <Link
          className="p-2 border rounded-lg bg-zinc-50 border-zinc-300 hover:bg-zinc-200 cursor-pointer"
          target="_blank"
          to={contacts.twitter}
        >
          <span>
            <label className="hidden">Twitter Profile Link</label>
            <Twitter size={20} />
          </span>
        </Link>
      )}
      {contacts?.linkedin && (
        <Link
          className="p-2 border rounded-lg bg-zinc-50 border-zinc-300 hover:bg-zinc-200 cursor-pointer"
          target="_blank"
          to={contacts.linkedin}
        >
          <span>
            <label className="hidden">Linkedin Profile Link</label>
            <Linkedin size={20} />
          </span>
        </Link>
      )}
    </div>
  );
}

export default ShowUserContacts;
