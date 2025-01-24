"use client";
import { useToast } from "@shadcn/use-toast";
import { contactsSchema } from "@/lib/schema";
import { useState } from "react";

function ContactsForm({ contacts, setContacts }) {
  const { toast } = useToast();
  const [pending, setPending] = useState(false);
  const [updateContactsState, setUpdateContacts] = useState(true);
  const updateContactsUrl = async (e) => {
    e.preventDefault();
    setPending(true);
    console.log(contacts);
    try {
      const validContactsData = contactsSchema.safeParse(contacts);
      if (!validContactsData?.success) {
        console.log(validContactsData.error.flatten().fieldErrors);
        return {
          errors: validContactsData.error.flatten().fieldErrors,
        };
      }
      const request = await fetch(
        `http://localhost:4000/api/${contacts?.usersId}/contacts/${contacts?.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(validContactsData?.data),
        }
      );
      if (!request.status === 200) {
        toast({
          title: "update contacts request error",
        });
      }
      const data = await request.json();

      // setUpdateContacts(true);

      toast({
        description: data.message,
      });

      setPending(false);
      setUpdateContacts(true);
      return data;
    } catch (error) {
      toast({
        title: "connection error",
        description: error.message,
      });
    }
  };
  return (
    <>
      <button
        className={`${
          !updateContactsState ? "bg-card " : "bg-primary-foreground"
        } px-4 py-2 hover:bg-primary-foreground border  rounded-md`}
        onClick={() => setUpdateContacts(!updateContactsState)}
      >
        {updateContactsState ? "update" : "updating..."}
      </button>
      <form
        onSubmit={updateContactsUrl}
        className="w-1/2 bg-card max-sm:w-full max-md:w-full border p-4 mt-4 rounded-md flex flex-col justify-start items-center gap-2"
      >
        <input
          readOnly={updateContactsState}
          onChange={(e) => setContacts({ ...contacts, github: e.target.value })}
          className="input"
          type="url"
          placeholder="Github profile link"
          defaultValue={contacts?.github}
        />
        <input
          readOnly={updateContactsState}
          onChange={(e) =>
            setContacts({ ...contacts, linkedin: e.target.value })
          }
          className="input"
          type="url"
          placeholder="Linkedin profile link"
          defaultValue={contacts?.linkedin}
        />
        <input
          readOnly={updateContactsState}
          onChange={(e) =>
            setContacts({ ...contacts, youtube: e.target.value })
          }
          className="input"
          type="url"
          placeholder="Youtube channel link "
          defaultValue={contacts?.youtube}
        />
        <input
          readOnly={updateContactsState}
          onChange={(e) =>
            setContacts({ ...contacts, twitter: e.target.value })
          }
          className="input"
          type="url"
          placeholder="twitter profile link "
          defaultValue={contacts?.twitter}
        />
        <input
          type="submit"
          disabled={pending}
          value={pending ? "updating..." : "save changes"}
          className="submit_button"
        />
      </form>
    </>
  );
}

export default ContactsForm;
