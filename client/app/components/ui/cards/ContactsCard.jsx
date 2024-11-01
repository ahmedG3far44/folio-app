import Link from "next/link";
import {
  AiOutlineGithub,
  AiOutlineLinkedin,
  AiOutlineYoutube,
} from "react-icons/ai";
import { RiTwitterXFill } from "react-icons/ri";

function ContactsCard({ contacts }) {
  return (
    <div className="flex   justify-start items-center gap-2 py-2 w-full max-sm:justify-center max-md:justify-center">
      {contacts?.twitter && (
        <div
          className={
            "flex hover:bg-card bg-secondary justify-center items-center p-1 rounded-md border   duration-150"
          }
        >
          <Link
            rel={"user twitter profile link"}
            target="_blank"
            href={contacts?.twitter}
          >
            <span>
              <RiTwitterXFill size={20} />
            </span>
          </Link>
        </div>
      )}
      {contacts?.linkedin && (
        <div
          className={
            "flex hover:bg-card bg-secondary justify-center items-center p-1 rounded-md border   duration-150"
          }
        >
          <Link
            rel={"user linkedin profile link"}
            target="_blank"
            href={contacts?.linkedin}
          >
            <span>
              <AiOutlineLinkedin size={20} />
            </span>
          </Link>
        </div>
      )}
      {contacts?.youtube && (
        <div
          className={
            "flex hover:bg-card bg-secondary justify-center items-center p-1 rounded-md border   duration-150"
          }
        >
          <Link
            rel={"user youtube link"}
            target="_blank"
            href={contacts?.youtube}
          >
            <span>
              <AiOutlineYoutube size={20} />
            </span>
          </Link>
        </div>
      )}
      {contacts?.github && (
        <div
          className={
            "flex hover:bg-card bg-secondary justify-center items-center p-1 rounded-md border   duration-150"
          }
        >
          <Link
            rel={"user github profile link"}
            target="_blank"
            href={contacts?.github}
          >
            <span>
              <AiOutlineGithub size={20} />
            </span>
          </Link>
        </div>
      )}
    </div>
  );
}

export default ContactsCard;
