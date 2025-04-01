"use client";
import { useState, useEffect } from "react";

import { useParams } from "next/navigation";
import UploadCvForm from "@profileForms/UploadCvForm";
import ContactsForm from "@profileForms/ContactsForm";
import BioForm from "@profileForms/BioForm";
import HeroLayout from "@cards/HeroLayout";
import Skeleton from "@/app/components/ui/cards/Skeleton";


function BioPage() {
  const localUrl = "http://localhost:4000/api";
  const productionUrl = "";
  const { userId } = useParams();
  const [bio, setBio] = useState();
  const [contacts, setContacts] = useState();
  const [switcher, setSwitcher] = useState("bio");
  const [pending, setPending] = useState(false);
  useEffect(() => {
    async function getUserBio(userId) {
      console.log("URL:", localUrl);
      console.log("URL:", productionUrl);
      try {
        const request = await fetch(
          `${
            process.env.NODE_ENV === "development" ? localUrl : productionUrl
          }/${userId}/bio`
        );

        if (!request.ok) throw new Error("can't get user bio");

        const userBio = await request.json();
        setBio({ ...userBio, layoutStyle: "4" });
      } catch (error) {
        console.log(error.message);
      }
    }
    async function getUserContacts(userId) {
      try {
        const request = await fetch(
          `${
            process.env.NODE_ENV === "development" ? localUrl : productionUrl
          }/${userId}/contacts`
        );
        if (!request.ok) throw new Error("can't get user contacts");
        const userContacts = await request.json();
        console.log(userContacts);
        setContacts(userContacts);
      } catch (error) {
        console.log(error.message);
      }
    }
    try {
      setPending(true);
      getUserBio(userId);
      getUserContacts(userId);
    } catch (error) {
      console.log(error);
    } finally {
      setPending(false);
    }
  }, []);
  return (
    <div className="w-full flex flex-col justify-start items-start gap-4 overflow-x-hidden overflow-y-scroll no-scrollbar p-4">
      <div className="bg-card border-2 border-dashed border-secondary w-full max-sm:w-full max-md:w-full  m-auto mt-4  rounded-md p-8 ">
        {pending ? (
          <div className="min-h-full min-w-full w-full h-full p-4 flex justify-center items-center">
            <Skeleton />
          </div>
        ) : (
          <HeroLayout
            name={bio?.bioName}
            summary={bio?.bio}
            jobTitle={bio?.jobTitle}
            img={bio?.heroImage}
            layoutStyle={bio?.layoutStyle}
            contacts={contacts}
          />
        )}
      </div>
      <div className="w-full max-sm:w-full max-md:w-full m-auto ">
        <div className="w-full m-auto py-4 rounded-md flex gap-4 ">
          <button
            className={`px-4 py-2 w-40  max-w-40  max-sm:px-2  max-sm:py-1 border-primary-foreground  border rounded-md text-primary cursor-pointer duration-150 ${
              switcher === "bio" ? "bg-card" : "bg-secondary"
            }`}
            onClick={() => setSwitcher("bio")}
          >
            Bio
          </button>
          <button
            className={`px-4 py-2  w-40  max-w-40 max-sm:px-2  max-sm:py-1 border-primary-foreground  border rounded-md text-primary cursor-pointer duration-150 ${
              switcher === "contacts" ? "bg-card" : "bg-secondary"
            }`}
            onClick={() => setSwitcher("contacts")}
          >
            Contacts
          </button>
          <button
            className={`px-4 py-2  w-40  max-w-40 max-sm:px-2  max-sm:py-1  border-primary-foreground border rounded-md text-primary cursor-pointer duration-150 ${
              switcher === "uploadCv" ? "bg-card" : "bg-secondary"
            }`}
            onClick={() => setSwitcher("uploadCv")}
          >
            Upload CV
          </button>
        </div>
        <div className="w-full">
          {switcher === "bio" && <BioForm bio={bio} setBio={setBio} />}
          {switcher === "contacts" && (
            <ContactsForm contacts={contacts} setContacts={setContacts} />
          )}
          {switcher === "uploadCv" && <UploadCvForm />}
        </div>
      </div>
    </div>
  );
}

export default BioPage;
