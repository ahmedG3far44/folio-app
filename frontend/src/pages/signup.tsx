/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeEvent, useState } from "react";
import { Card, CardTitle } from "@/components/ui/card";
import SubmitButton from "@/components/submit-button";

import { useAuth } from "@/contexts/AuthProvider";
import { Link, useNavigate } from "react-router-dom";

import { EyeOff, Eye, LucideUser, XIcon } from "lucide-react";

import ErrorMessage from "@/components/ErrorMessage";
import Logo from "@/components/Logo";

const URL_SERVER = import.meta.env.VITE_URL_SERVER as string;

function SignUpPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<File | null>(null);
  const [pending, setPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [registerUser, setRegisterUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      setPending(true);
      const formData = new FormData();
      const { name, email, password } = registerUser;

      if (!profile)
        throw new Error("Profile picture is required to register!!");
      if (!email || !password || !name)
        throw new Error(
          "The email or passowrd field is required, make sure to fill all the fields correctly!!"
        );

      if (password.length <= 8)
        throw new Error(
          "Your password is less than 8 character, please enter a strong!!"
        );

      formData.append("profile", profile!);
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);

      const response = await fetch(`${URL_SERVER}/auth/register`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("This email is already exist!!");

      const data = await response.json();

      if (!data)
        throw new Error("can't login your email or passowrd is Wrong!!");
      const { user, token } = data.data;
      login({ user, token });
      setError(null);
      navigate(`/${user.id}`);
      return;
    } catch (err: any) {
      console.error(err?.message);
      setError(err?.message);
      return;
    } finally {
      setPending(false);
    }
  };
  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-zinc-950 ">
      <Card className="p-8 bg-zinc-700 text-white">
        <CardTitle className="flex items-center justify-center flex-col gap-2 my-8">
          <Logo />
          <h1 className="text-lg font-bold text-start">
            Welcome, create new account now
          </h1>
        </CardTitle>
        <form
          className="w-[400px] flex flex-col items-start gap-4 mt-4"
          onSubmit={handleLogin}
        >
          <div className="self-center">
            {profile ? (
              <div className="w-20 h-20 rounded-full  flex items-center justify-center border-2 relative">
                <img
                  loading="lazy"
                  className="w-full h-full rounded-full object-cover"
                  src={URL.createObjectURL(profile)}
                  alt="profile picture"
                />
                {!pending && (
                  <button
                    onClick={() => setProfile(null)}
                    type="button"
                    className="bg-red-600 text-white p-2 rounded-full absolute -right-4 -top-1 hover:bg-red-700 duration-150 cursor-pointer"
                  >
                    <XIcon size={15} />
                  </button>
                )}
              </div>
            ) : (
              <>
                <label
                  className="w-20 h-20 rounded-full bg-zinc-950   border border-dashed   flex items-center justify-center cursor-pointer hover:opacity-70 duration-150"
                  htmlFor="profile"
                >
                  <LucideUser size={40} />
                </label>
                <input
                  id="profile"
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setProfile(e.target.files ? e.target.files[0] : null)
                  }
                  type="file"
                  accept="image/*"
                  className="hidden"
                />
              </>
            )}
          </div>

          {error && <ErrorMessage className={"text-center"} message={error} />}
          <input
            className="w-full p-2 rounded-md  border border-zinc-800 bg-zinc-950  "
            onChange={(e) =>
              setRegisterUser({ ...registerUser, name: e.target.value })
            }
            type="text"
            placeholder="name"
          />

          <input
            className="w-full p-2 rounded-md  border border-zinc-800 bg-zinc-950  "
            onChange={(e) =>
              setRegisterUser({ ...registerUser, email: e.target.value })
            }
            type="email"
            placeholder="email"
          />
          <div className="w-full flex items-center justify-between  rounded-md relative">
            <input
              className="w-full h-full p-2 rounded-md relative border border-zinc-800 bg-zinc-950  "
              onChange={(e) =>
                setRegisterUser({ ...registerUser, password: e.target.value })
              }
              type={showPassword ? "text" : "password"}
              placeholder="password"
            />
            <span
              className="hover:opacity-80 duration-150 cursor-pointer p-2 rounded-md  absolute right-0"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
          </div>
          <SubmitButton className="w-full" loading={pending} type="submit">
            Create Account
          </SubmitButton>
          <div className="w-full flex items-center justify-center">
            <div className="w-full h-[1px] bg-zinc-700"></div>
            <p className="text-sm text-zinc-500 px-4">Or</p>
            <div className="w-full h-[1px] bg-zinc-700"></div>
          </div>
          <div className="p-2 text-sm text-center self-center">
            <p>
              I have already account{" "}
              <Link
                className={"underline duration-150 hover:opacity-70"}
                to={"/login"}
              >
                Login
              </Link>{" "}
            </p>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default SignUpPage;
