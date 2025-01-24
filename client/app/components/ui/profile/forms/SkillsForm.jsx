"use client";
import { useRef, useState } from "react";
import { useToast } from "@shadcn/use-toast";
import { useParams, useRouter } from "next/navigation";
import Loader from "@loaders/Loader";
import { LuImagePlus } from "react-icons/lu";

function SkillsForm({ skillState, setSkill }) {
  const router = useRouter();
  const { userId } = useParams();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setErrorMessage] = useState("");
  const [skillLogoImage, setUploadedSkillLogo] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const skillFormRef = useRef(null);
  const handleAddNewSkill = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();

    formData.append("file", skillLogoImage);
    formData.append("skillName", skillState.skillName);

    // console.log(formData.get("skillLogo"));
    // console.log(formData.get("skillName"));

    try {
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

      console.log(formData.get("skillName"));
      const request = await fetch(
        `http://localhost:4000/api/${userId}/skills`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await request.json();
      if (request.status === 201) {
        setLoading(false);
        toast({
          title: "a new skill was added",
          description: data.message,
        });
        skillFormRef?.current.reset();
        setErrorMessage(null);
        setSuccessMessage("uploaded done successful");
        setTimeout(() => {
          setSuccessMessage("");
        }, 1000);
        router.refresh();
        return;
      }
    } catch (error) {
      setLoading(false);
      toast({
        variant: "destructive",
        title: "can't add a new skill",
        description: error.message,
      });
      setErrorMessage(error.message);
      return;
    }
  };
  return (
    <form
      ref={skillFormRef}
      onSubmit={handleAddNewSkill}
      className="bg-card w-1/2 max-sm:w-full max-md:w-full flex flex-col justify-start items-start gap-2 p-4 rounded-md border "
    >
      <label
        className="cursor-pointer hover:bg-secondary duration-150 w-full border-2 border-dashed bg-primary-foreground rounded-md p-4 flex flex-col justify-center items-center gap-4p"
        htmlFor="skillLogo"
      >
        <span className="text-muted-foreground">
          <LuImagePlus size={20} />
        </span>
        <p className="text-center text-sm w-3/4 max-sm:w-full max-md:w-full p-2 text-muted-foreground flex flex-col justify-center items-center gap-1">
          upload your skill logo here
          <br />
          supported formats, JPEG | PNG | JPG | GIF & Max Size (4MB)
        </p>
      </label>
      <input
        type="file"
        onChange={(e) => {
          setUploadedSkillLogo(e.target.files[0]);
          setSkill({
            ...skillState,
            skillLogo: URL.createObjectURL(e.target.files[0]),
          });
        }}
        id="skillLogo"
        name="skillLogo"
        className={
          skillLogoImage ? "p-2 w-full bg-secondary rounded-md" : "hidden"
        }
        accept="image/png, image/jpeg, image/jpg, image/gif"
        required
      />
      <div>
        {successMessage && (
          <div className="success_message w-full">{successMessage}</div>
        )}
        {error && <div className="error_message w-full">{error}</div>}
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
        value={skillState.skillName}
        onChange={(e) => setSkill({ ...skillState, skillName: e.target.value })}
        type="text"
        readOnly={loading}
        name="skillName"
        className="input"
        placeholder="enter skill name "
      />

      <input
        type="submit"
        disabled={loading}
        value={loading ? "creating..." : "add"}
        className="submit_button"
      />
    </form>
  );
}
export default SkillsForm;
