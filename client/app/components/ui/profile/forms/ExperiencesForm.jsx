"use client";

import { useToast } from "@shadcn/use-toast";
import { useRef, useState } from "react";
import { experienceSchema } from "@lib/schema";
import { useParams, useRouter } from "next/navigation";
import Loader from "@loaders/Loader";
import { LuImagePlus } from "react-icons/lu";

function ExperiencesForm({ experiencesObject, setExperiencesObject }) {
  const { toast } = useToast();
  const { userId } = useParams();
  const router = useRouter();
  const experienceFormRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setErrorMessage] = useState(null);
  const [expCompanyLogo, setExpCompanyLogo] = useState();

  const handleAddExperience = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    const result = experienceSchema.safeParse(experiencesObject);
    formData.append("file", expCompanyLogo);
    formData.append("cName", result?.data.cName);
    formData.append("start", result?.data.start);
    formData.append("end", result?.data.end);
    formData.append("location", result?.data.location);
    formData.append("role", result?.data.role);
    formData.append("position", result?.data.position);

    const file = formData.get("file");
    if (!file) {
      setLoading(false);
      setErrorMessage("not file found");
    }
    if (file.size >= 4194304) {
      setLoading(false);
      setErrorMessage(
        "the file that you uploaded is too large should be less than 4MB."
      );
    }
    const fileTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
    if (!fileTypes.includes(file.type)) {
      setLoading(false);
      setErrorMessage(
        "unsupported type file, please upload file with these supported formats JPEG | PNG | JPG | GIF."
      );
    }

    if (!result.success) {
      console.log(result.error.flatten().fieldErrors);
      result.error.issues.map((error) => {
        setLoading(false);
        setErrorMessage("data fields that your entered are not correct");
        toast({
          variant: "destructive",
          title: "not valid inputs",
          description: error.message,
        });
      });
    } else {
      try {
        const request = await fetch(
          `http://localhost:4000/api/${userId}/experiences`,
          {
            method: "POST",
            body: formData,
          }
        );
        if (request.status === 201) {
          setLoading(false);
          setErrorMessage(null);
          router.refresh();
          toast({
            title: `created success `,
            description: `your new experience in ${experiencesObject.cName} was added successful.`,
          });
          experienceFormRef?.current?.reset();
          return;
        } else {
          setLoading(false);
          toast({
            variant: "destructive",
            title: "adding error ",
            description: error.message,
          });
          setErrorMessage(error.message);
          return;
        }
      } catch (error) {
        setLoading(false);
        toast({
          variant: "destructive",
          title: "adding error ",
          description: error.message,
        });
        setErrorMessage(error.message);
        return;
      } finally {
        setLoading(false);
      }
    }
  };
  return (
    <form
      ref={experienceFormRef}
      onSubmit={handleAddExperience}
      className="bg-card lg:flex-1 min-w-96 w-full sm:w-full flex flex-col justify-start items-start gap-2 p-4 rounded-md border"
    >
      <label
        className="cursor-pointer hover:bg-secondary  duration-150 w-full border-2 border-dashed bg-primary-foreground rounded-md p-4 flex flex-col justify-center items-center gap-4p"
        htmlFor="expLogo"
      >
        <span className="text-muted-foreground">
          <LuImagePlus size={20} />
        </span>
        <p className="text-center text-sm w-3/4 max-md:w-full p-2 flex flex-col justify-center items-center gap-1">
          upload company logo here <br /> supported formats, JPEG | PNG | GIF |
          JPG (4MB).
        </p>
      </label>
      <input
        type="file"
        onChange={(e) => {
          setExpCompanyLogo(e.target.files[0]);
          setExperiencesObject({
            ...experiencesObject,
            cLogo: URL.createObjectURL(e.target.files[0]),
          });
        }}
        id="expLogo"
        name="expLogo"
        className={
          expCompanyLogo ? "w-full p-2 bg-secondary rounded-md" : "hidden"
        }
        accept="image/png, image/jpeg, image/jpg, image/gif"
        required
      />

      <div>
        {error && <div className="error_message">{error}</div>}

        {loading && (
          <div
            className={
              "w-full my-4 flex flex-col justify-start items-start gap-2"
            }
          >
            <h1 className="flex gap-2 justify-center items-center">
              <Loader />
              <span>Uploading...</span>
            </h1>
          </div>
        )}
      </div>
      <input
        className="input "
        type="text"
        name="cName"
        placeholder="company name"
        required
        onChange={(e) =>
          setExperiencesObject({ ...experiencesObject, cName: e.target.value })
        }
      />

      <input
        className="input"
        type="text"
        name="position"
        placeholder="your position or Job-title"
        onChange={(e) =>
          setExperiencesObject({
            ...experiencesObject,
            position: e.target.value,
          })
        }
        required
      />
      <textarea
        className="input"
        placeholder="my role "
        minLength="10"
        maxLength="300"
        name="role"
        onChange={(e) =>
          setExperiencesObject({ ...experiencesObject, role: e.target.value })
        }
        required
      ></textarea>
      <div className="w-full flex justify-start items-start gap-4 mb-1 md:flex-wrap">
        <label className="w-full text-sm">
          Start Date
          <input
            className="input "
            type="date"
            name="start"
            required
            onChange={(e) =>
              setExperiencesObject({
                ...experiencesObject,
                start: e.target.value,
              })
            }
          />
        </label>
        <label className="w-full text-sm ">
          End Date
          <input
            className="input "
            type="date"
            name="end"
            required
            onChange={(e) =>
              setExperiencesObject({
                ...experiencesObject,
                end: e.target.value,
              })
            }
          />
        </label>
      </div>
      <input
        className="input "
        type="text"
        name="location"
        required
        placeholder="enter the job location"
        onChange={(e) =>
          setExperiencesObject({
            ...experiencesObject,
            location: e.target.value,
          })
        }
      />
      <input
        className={`submit_button`}
        type="submit"
        disabled={loading}
        value={loading ? "creating..." : "add"}
      />
    </form>
  );
}

export default ExperiencesForm;
