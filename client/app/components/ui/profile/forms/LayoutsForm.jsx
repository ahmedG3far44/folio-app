"use client";
import { useToast } from "@shadcn/use-toast";
import { useFormStatus } from "react-dom";
import { updateLayoutsAction } from "@actions/update/actions";
import { LuSave } from "react-icons/lu";

export function ChangeExperiencesLayoutForm({ layouts, setLayouts }) {
  const { toast } = useToast();
  const { pending } = useFormStatus();

  return (
    <form
      action={async () => {
        await updateLayoutsAction(layouts)
          .then((data) => {
            console.log(data);
            toast({
              title: "experiences layouts was changed",
            });
          })
          .catch((error) => {
            toast({
              variants: "destructive",
              title: error.message,
              description: "not updated layouts",
            });
          });
      }}
      className={
        "w-full max-w-full flex justify-start items-center gap-2 flex-wrap p-4 my-8"
      }
    >
      <div
        className={`change_layout_input ${
          layouts.expLayout === "1" && "bg-primary-foreground"
        } `}
      >
        <input
          type="radio"
          id="expLayout-1"
          name={"expLayout"}
          value="1"
          checked={layouts.expLayout === "1"}
          className="cursor-pointer"
          onChange={(e) =>
            setLayouts({ ...layouts, expLayout: e.target.value })
          }
        />
        <label className="cursor-pointer" htmlFor="expLayout-1">
          Exp 1
        </label>
      </div>

      <div
        className={`change_layout_input ${
          layouts.expLayout === "2" && "bg-primary-foreground"
        } `}
      >
        <input
          type="radio"
          id="expLayout-2"
          name={"expLayout"}
          value="2"
          checked={layouts.expLayout === "2"}
          className="cursor-pointer"
          onChange={(e) =>
            setLayouts({ ...layouts, expLayout: e.target.value })
          }
        />
        <label className="cursor-pointer" htmlFor="expLayout-2">
          Exp 2
        </label>
      </div>

      <div
        className={`change_layout_input ${
          layouts.expLayout === "3" && "bg-primary-foreground"
        } `}
      >
        <input
          type="radio"
          id="expLayout-3"
          name={"expLayout"}
          value="3"
          checked={layouts.expLayout === "3"}
          className="cursor-pointer"
          onChange={(e) =>
            setLayouts({ ...layouts, expLayout: e.target.value })
          }
        />
        <label className="cursor-pointer" htmlFor="expLayout-3">
          Exp 3
        </label>
      </div>
      <SubmitBtn pending={pending} />
    </form>
  );
}
export function ChangeProjectsLayoutForm({ layouts, setLayouts }) {
  const { toast } = useToast();
  const { pending } = useFormStatus();
  return (
    <form
      action={async () => {
        await updateLayoutsAction(layouts);
        toast({
          title: "projects layout was changed !!",
        });
      }}
      className={
        "w-full max-w-full flex justify-start items-center gap-2 flex-wrap p-4 my-8"
      }
    >
      <div
        className={`change_layout_input ${
          layouts.projectsLayout === "1" && "bg-primary-foreground"
        } `}
      >
        <input
          type="radio"
          id="project-1"
          name={"projectsLayouts"}
          value="1"
          checked={layouts.projectsLayout === "1"}
          className="cursor-pointer"
          onChange={(e) =>
            setLayouts({ ...layouts, projectsLayout: e.target.value })
          }
        />
        <label className="cursor-pointer" htmlFor="project-1">
          Project 1
        </label>
      </div>
      <div
        className={`change_layout_input ${
          layouts.projectsLayout === "2" && "bg-primary-foreground"
        } `}
      >
        <input
          type="radio"
          id="project-2"
          name={"projectsLayouts"}
          value="2"
          checked={layouts.projectsLayout === "2"}
          className="cursor-pointer"
          onChange={(e) =>
            setLayouts({ ...layouts, projectsLayout: e.target.value })
          }
        />
        <label className="cursor-pointer" htmlFor="project-2">
          Project 2
        </label>
      </div>
      <div
        className={`change_layout_input ${
          layouts.projectsLayout === "3" && "bg-primary-foreground"
        } `}
      >
        <input
          type="radio"
          id="project-3"
          name={"projectsLayouts"}
          value="3"
          checked={layouts.projectsLayout === "3"}
          className="cursor-pointer"
          onChange={(e) =>
            setLayouts({ ...layouts, projectsLayout: e.target.value })
          }
        />
        <label className="cursor-pointer" htmlFor="project-3">
          Project 3
        </label>
      </div>
      <div
        className={`change_layout_input ${
          layouts.projectsLayout === "4" && "bg-primary-foreground"
        } `}
      >
        <input
          type="radio"
          id="project-4"
          name={"projectsLayouts"}
          value="4"
          className="cursor-pointer"
          checked={layouts.projectsLayout === "4"}
          onChange={(e) =>
            setLayouts({ ...layouts, projectsLayout: e.target.value })
          }
        />
        <label className="cursor-pointer" htmlFor="project-4">
          Project 4
        </label>
      </div>
      <SubmitBtn pending={pending} />
    </form>
  );
}

export function ChangeSkillsLayoutForm({ layouts, setLayouts }) {
  const { toast } = useToast();
  const { pending } = useFormStatus();
  return (
    <form
      action={async () => {
        await updateLayoutsAction(layouts);
        toast({
          title: "skills layout was changed !!",
        });
      }}
      className={
        "w-full max-w-full flex justify-start items-center gap-2 flex-wrap p-4 my-8"
      }
    >
      <div
        className={`change_layout_input ${
          layouts.skillsLayout === "1" && "bg-primary-foreground"
        }`}
      >
        <input
          type="radio"
          id="skillsLayouts-1"
          name={"skillsLayouts"}
          value="1"
          className="cursor-pointer"
          checked={layouts.skillsLayout === "1"}
          onChange={(e) =>
            setLayouts({ ...layouts, skillsLayout: e.target.value })
          }
        />
        <label className="cursor-pointer" htmlFor="skillsLayouts-1">
          skills 1
        </label>
      </div>

      <div
        className={`change_layout_input ${
          layouts.skillsLayout === "2" && "bg-primary-foreground"
        }`}
      >
        <input
          type="radio"
          id="skillsLayouts-2"
          name={"skillsLayouts"}
          value="2"
          className="cursor-pointer"
          checked={layouts.skillsLayout === "2"}
          onChange={(e) =>
            setLayouts({ ...layouts, skillsLayout: e.target.value })
          }
        />
        <label className="cursor-pointer" htmlFor="skillsLayouts-2">
          skills 2
        </label>
      </div>

      <div
        className={`change_layout_input ${
          layouts.skillsLayout === "3" && "bg-primary-foreground"
        } `}
      >
        <input
          type="radio"
          id="skillsLayouts-3"
          name={"skillsLayouts"}
          value="3"
          className="cursor-pointer"
          checked={layouts.skillsLayout === "3"}
          onChange={(e) =>
            setLayouts({ ...layouts, skillsLayout: e.target.value })
          }
        />
        <label className="cursor-pointer" htmlFor="skillsLayouts-3">
          skills 3
        </label>
      </div>
      <div
        className={`change_layout_input ${
          layouts.skillsLayout === "4" && "bg-primary-foreground"
        } `}
      >
        <input
          type="radio"
          id="skillsLayouts-4"
          name={"skillsLayouts"}
          value="4"
          className="cursor-pointer"
          checked={layouts.skillsLayout === "4"}
          onChange={(e) =>
            setLayouts({ ...layouts, skillsLayout: e.target.value })
          }
        />
        <label className="cursor-pointer" htmlFor="skillsLayouts-4">
          skills 4
        </label>
      </div>
      <div
        className={`change_layout_input ${
          layouts.skillsLayout === "5" && "bg-primary-foreground"
        } `}
      >
        <input
          type="radio"
          id="skillsLayouts-5"
          name={"skillsLayouts"}
          value="5"
          className="cursor-pointer"
          checked={layouts.skillsLayout === "5"}
          onChange={(e) =>
            setLayouts({ ...layouts, skillsLayout: e.target.value })
          }
        />
        <label className="cursor-pointer" htmlFor="skillsLayouts-5">
          skills 5
        </label>
      </div>

      <SubmitBtn pending={pending} />
    </form>
  );
}

export function ChangeHeroLayoutForm({ layouts, setLayouts }) {
  const { toast } = useToast();
  const { pending } = useFormStatus();
  return (
    <form
      action={async () => {
        await updateLayoutsAction(layouts);
        toast({
          title: "hero layout was changed !!",
        });
      }}
      className={
        "w-full max-w-full flex justify-start items-center gap-2 flex-wrap p-4 my-8"
      }
    >
      <div
        className={`change_layout_input ${
          layouts.heroLayout === "1" && "bg-primary-foreground"
        } `}
      >
        <input
          type="radio"
          id="heroLayout-1"
          name={"heroLayouts"}
          value="1"
          checked={layouts.heroLayout === "1"}
          className="cursor-pointer"
          onChange={(e) =>
            setLayouts({ ...layouts, heroLayout: e.target.value })
          }
        />
        <label className="cursor-pointer" htmlFor="heroLayout-1">
          Hero 1
        </label>
      </div>

      <div
        className={`change_layout_input ${
          layouts.heroLayout === "2" && "bg-primary-foreground"
        } `}
      >
        <input
          type="radio"
          id="heroLayout-2"
          name={"heroLayouts"}
          value="2"
          checked={layouts.heroLayout === "2"}
          className="cursor-pointer"
          onChange={(e) =>
            setLayouts({ ...layouts, heroLayout: e.target.value })
          }
        />
        <label className="cursor-pointer" htmlFor="heroLayout-2">
          Hero 2
        </label>
      </div>

      <div
        className={`change_layout_input ${
          layouts.heroLayout === "3" && "bg-primary-foreground"
        }  `}
      >
        <input
          type="radio"
          id="heroLayout-3"
          name={"heroLayouts"}
          value="3"
          className="cursor-pointer"
          checked={layouts.heroLayout === "3"}
          onChange={(e) =>
            setLayouts({ ...layouts, heroLayout: e.target.value })
          }
        />
        <label className="cursor-pointer" htmlFor="heroLayout-3">
          Hero 3
        </label>
      </div>
      <div
        className={`change_layout_input ${
          layouts.heroLayout === "4" && "bg-primary-foreground"
        } `}
      >
        <input
          type="radio"
          id="heroLayout-4"
          name={"heroLayouts"}
          value="4"
          className="cursor-pointer"
          checked={layouts.heroLayout === "4"}
          onChange={(e) =>
            setLayouts({ ...layouts, heroLayout: e.target.value })
          }
        />
        <label className="cursor-pointer" htmlFor="heroLayout-4">
          Hero 4
        </label>
      </div>
      <div
        className={`change_layout_input ${
          layouts.heroLayout === "5" && "bg-primary-foreground"
        }  `}
      >
        <input
          type="radio"
          id="heroLayout-5"
          name={"heroLayouts"}
          value="5"
          className="cursor-pointer"
          checked={layouts.heroLayout === "5"}
          onChange={(e) =>
            setLayouts({ ...layouts, heroLayout: e.target.value })
          }
        />
        <label className="cursor-pointer" htmlFor="heroLayout-5">
          Hero 5
        </label>
      </div>
      <SubmitBtn pending={pending} />
    </form>
  );
}

function SubmitBtn({ pending }) {
  return (
    <button
      disabled={pending}
      type="submit"
      className="p-4 py-2 hover:border-primary border-transparent border  rounded-md bg-primary-foreground"
    >
      {pending ? (
        <div className="loader"></div>
      ) : (
        <>
          <span>
            <LuSave size={20} />
          </span>
        </>
      )}
    </button>
  );
}
