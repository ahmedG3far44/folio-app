"use client";
import { useState } from "react";
import { useToast } from "@shadcn/use-toast";
import { useRouter } from "next/navigation";
import { bioSchema } from "@lib/schema";

function BioForm({ bio, setBio }) {
  const router = useRouter();
  const { toast } = useToast();
  const [updateBioState, setUpdateBioState] = useState(true);
  const [loading, setLoading] = useState(false);
  const updateBioAction = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log(bio);
    const validPayload = bioSchema.safeParse(bio);

    console.log(validPayload.data);

    if (!validPayload.success) {
      toast({
        variant: "destructive",
        title: "field action",
        description: "error data not valid",
      });
    }
    try {
      const request = await fetch(
        `http://localhost:4000/api/${bio?.usersId}/bio/${bio?.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: validPayload?.data?.bioName,
            jobTitle: validPayload?.data?.jobTitle,
            summary: validPayload?.data?.bio,
          }),
        }
      );
      if (request.status === 200) {
        toast({
          title: "updated bio info",
          description: "successful updated ",
        });
      }
      router.refresh();
      setUpdateBioState(true);
      return;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "updating info failed",
        description: error.message,
      });
      return;
    } finally {
      setLoading(false);
      return;
    }
  };

  return (
    <div>
      <button
        className={`${
          !updateBioState ? "bg-card " : "bg-primary-foreground"
        } px-4 py-2 hover:bg-primary-foreground border  rounded-md`}
        onClick={() => setUpdateBioState(!updateBioState)}
      >
        {updateBioState ? "update" : "updating..."}
      </button>
      <form
        onSubmit={updateBioAction}
        className="lg:w-1/2 w-3/4 max-sm:w-full max-md:w-full bg-card  mt-4 flex flex-col justify-start items-start gap-2 p-4 rounded-md border"
      >
        <input
          onChange={(e) => setBio({ ...bio, bioName: e.target.value })}
          className="input"
          type="text"
          name={"name"}
          placeholder="your name"
          readOnly={updateBioState}
          defaultValue={bio?.bioName}
        />
        <textarea
          maxLength={500}
          minLength={10}
          name={"bio"}
          onChange={(e) => setBio({ ...bio, bio: e.target.value })}
          className="input"
          placeholder="enter your summary here"
          readOnly={updateBioState}
          defaultValue={bio?.bio}
        ></textarea>
        <input
          onChange={(e) => setBio({ ...bio, jobTitle: e.target.value })}
          className="input"
          type="text"
          name={"jobTitle"}
          placeholder="current job title"
          readOnly={updateBioState}
          defaultValue={bio?.jobTitle}
        />
        <select
          onChange={(e) => setBio({ ...bio, layoutStyle: e.target.value })}
          required
          name="layout"
          className="appearance-none w-full p-2 rounded-md bg-card border cursor-pointer disabled:bg-secondary hover:bg-secondary disabled:cursor-not-allowed"
          placeholder="select your layout"
          disabled={updateBioState}
        >
          <option value="1">Align Center</option>
          <option value="2">Align Start</option>
          <option value="3">Align Row</option>
          <option value="4">Align Row Reverse</option>
          <option value="5">Align Between</option>
        </select>
        <input
          type="submit"
          aria-disabled={loading}
          value={loading ? "updating..." : "save changes"}
          className="submit_button"
        />
      </form>
    </div>
  );
}

export default BioForm;
