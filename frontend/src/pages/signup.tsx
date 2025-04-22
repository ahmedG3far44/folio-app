/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeEvent, useState } from "react";
import { Card, CardTitle } from "@/components/ui/card";
import SubmitButton from "@/components/submit-button";

import { useAuth } from "@/contexts/AuthProvider";
import { Link, useNavigate } from "react-router-dom";

import { EyeOff, Eye, LucideUser, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeProvider";
import ErrorMessage from "@/components/ErrorMessage";

const URL_SERVER = import.meta.env.VITE_URL_SERVER as string;

function SignUpPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { activeTheme } = useTheme();
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
    <div
      style={{
        backgroundColor: activeTheme.backgroundColor,
        color: activeTheme.primaryText,
      }}
      className="w-full min-h-screen flex items-center justify-center"
    >
      <Card className="p-4 ">
        <CardTitle className="self-center text-2xl font-bold">
          Create A New Account
        </CardTitle>
        <form
          className="w-[400px] flex flex-col items-start gap-4"
          onSubmit={handleLogin}
        >
          <div className="self-center">
            {profile ? (
              <div
                style={{ borderColor: activeTheme.borderColor }}
                className="w-20 h-20 rounded-full  flex items-center justify-center border-2 relative"
              >
                <img
                  loading="lazy"
                  className="w-full h-full rounded-full object-cover"
                  src={URL.createObjectURL(profile)}
                  alt="profile picture"
                />
                {!pending && (
                  <Button
                    onClick={() => setProfile(null)}
                    variant={"destructive"}
                    type="button"
                    className="absolute -right-4 -top-1 hover:opacity-75 duration-150 cursor-pointer"
                  >
                    <XIcon size={15} />
                  </Button>
                )}
              </div>
            ) : (
              <>
                <label
                  style={{
                    backgroundColor: activeTheme.backgroundColor,
                    color: activeTheme.primaryText,
                    borderColor: activeTheme.borderColor,
                  }}
                  className="w-20 h-20 rounded-full   border border-dashed   flex items-center justify-center cursor-pointer hover:opacity-70 duration-150"
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
            style={{
              backgroundColor: activeTheme.backgroundColor,
              color: activeTheme.primaryText,
              borderColor: activeTheme.borderColor,
            }}
            className="w-full p-2 rounded-md "
            onChange={(e) =>
              setRegisterUser({ ...registerUser, name: e.target.value })
            }
            type="text"
            placeholder="Full Name"
          />

          <input
            style={{
              backgroundColor: activeTheme.backgroundColor,
              color: activeTheme.primaryText,
              borderColor: activeTheme.borderColor,
            }}
            className="w-full p-2 rounded-md "
            onChange={(e) =>
              setRegisterUser({ ...registerUser, email: e.target.value })
            }
            type="email"
            placeholder="email"
          />
          <div
            style={{
              backgroundColor: activeTheme.backgroundColor,
              color: activeTheme.primaryText,
              borderColor: activeTheme.borderColor,
            }}
            className="w-full flex items-center justify-between  rounded-md "
          >
            <input
              style={{
                backgroundColor: activeTheme.backgroundColor,
                color: activeTheme.primaryText,
                borderColor: activeTheme.borderColor,
              }}
              className="w-full h-full p-2 rounded-tl-md rounded-bl-md"
              onChange={(e) =>
                setRegisterUser({ ...registerUser, password: e.target.value })
              }
              type={showPassword ? "text" : "password"}
              placeholder="password"
            />
            <span
              style={{
                backgroundColor: activeTheme.backgroundColor,
                color: activeTheme.primaryText,
                borderColor: activeTheme.borderColor,
              }}
              className="hover:opacity-80 duration-150 cursor-pointer p-2 rounded-tr-md rounded-br-md"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
          </div>
          <SubmitButton className="w-full" loading={pending} type="submit">
            Create Account
          </SubmitButton>
          <div
            style={{ color: activeTheme.secondaryText }}
            className="p-2 text-sm"
          >
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
