/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Card, CardTitle } from "@/components/ui/card";
import SubmitButton from "@/components/submit-button";

import { useAuth } from "@/contexts/AuthProvider";
import { useNavigate } from "react-router-dom";

import { EyeOff, Eye } from "lucide-react";
// import UploadImages from "../components/uploadImages";
// import { useUpload } from "@/contexts/UploadProvider";

const URL_SERVER = import.meta.env.VITE_URL_SERVER as string;

function SignUpPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  // const { uploadedInfo } = useUpload();
  const [pending, setPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [registerUser, setRegisterUser] = useState({
    name: "",
    email: "",
    password: "",
    picture: "",
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setPending(true);
      console.log("User register:");
      console.log(registerUser.picture);
      const response = await fetch(`${URL_SERVER}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registerUser),
      });
      if (!response.ok) throw new Error("This email is already exist!!");
      const data = await response.json();
      if (!data)
        throw new Error("can't login your email or passowrd is Wrong!!");
      const { user, token } = data.data;
      console.log(user);
      console.log(token);
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
    <div className="w-full min-h-screen flex items-center justify-center">
      <Card className="p-4 ">
        <CardTitle>Create A New Account</CardTitle>
        <form
          className="w-[400px] flex flex-col items-start gap-4"
          onSubmit={handleLogin}
        >
          {error && (
            <p className="text-red-500 p-2 border border-red-500 rounded-md w-full bg-red-100">
              {error}
            </p>
          )}
          {/* <UploadImages status="single" /> */}
          <input
            className="w-full p-2 rounded-md border"
            onChange={(e) =>
              setRegisterUser({ ...registerUser, name: e.target.value })
            }
            type="text"
            placeholder="Full Name"
          />
          <input
            className="w-full p-2 rounded-md border"
            onChange={(e) =>
              setRegisterUser({ ...registerUser, picture: e.target.value })
            }
            type="url"
            placeholder="Profile Picture"
          />
          <input
            className="w-full p-2 rounded-md border"
            onChange={(e) =>
              setRegisterUser({ ...registerUser, email: e.target.value })
            }
            type="email"
            placeholder="email"
          />
          <div className="w-full flex items-center justify-between  rounded-md border">
            <input
              className="w-full h-full text-zinc-700 p-2 rounded-md"
              onChange={(e) =>
                setRegisterUser({ ...registerUser, password: e.target.value })
              }
              type={showPassword ? "text" : "password"}
              placeholder="password"
            />
            <span
              className="hover:text-black duration-150 cursor-pointer text-zinc-500 p-2 rounded-md"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
          </div>
          <SubmitButton className="w-full" loading={pending} type="submit">
            Create Account
          </SubmitButton>
        </form>
      </Card>
    </div>
  );
}

export default SignUpPage;
