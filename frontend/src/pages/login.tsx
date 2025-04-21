/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Card, CardFooter, CardTitle } from "@/components/ui/card";
import SubmitButton from "@/components/submit-button";

import { useAuth } from "@/contexts/AuthProvider";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useTheme } from "@/contexts/ThemeProvider";

const URL_SERVER = import.meta.env.VITE_URL_SERVER as string;

function LoginPage() {
  const navigate = useNavigate();
  const { isLogged, user, login } = useAuth();
  const { activeTheme } = useTheme();
  const [pending, setPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loginUser, setUser] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setPending(true);

      const response = await fetch(`${URL_SERVER}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginUser),
      });
      if (!response.ok)
        throw new Error("can't login your email or passowrd is Wrong!!");
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
      console.error(err);
      setError("your email or password is wrong!!");
      return;
    } finally {
      setPending(false);
    }
  };

  if (isLogged) return <Navigate to={`/${user.id}`} />;

  return (
    <div
      style={{
        backgroundColor: activeTheme.borderColor,
        color: activeTheme.secondaryText,
      }}
      className="w-full min-h-screen flex items-center justify-center"
    >
      <Card className="p-">
        <CardTitle>
          <h1 className="text-2xl font-bold">Login To your Account</h1>
        </CardTitle>
        <form
          className="w-[400px] flex flex-col items-start gap-4"
          onSubmit={handleLogin}
        >
          {error && (
            <p className="text-red-500 p-2 border border-red-500 rounded-md w-full bg-red-100">
              {error}
            </p>
          )}
          <input
            style={{ color: activeTheme.primaryText }}
            className="w-full p-2 rounded-md border"
            onChange={(e) => setUser({ ...loginUser, email: e.target.value })}
            type="email"
            placeholder="email"
          />
          <div className="w-full flex items-center justify-between  rounded-md border">
            <input
              style={{ color: activeTheme.primaryText }}
              className="w-full h-full  p-2 rounded-md"
              onChange={(e) =>
                setUser({ ...loginUser, password: e.target.value })
              }
              type={showPassword ? "text" : "password"}
              placeholder="password"
            />
            <span
              className="hover:opacity-75 duration-150 cursor-pointer p-2 rounded-md"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
          </div>

          <SubmitButton className="w-full" loading={pending} type="submit">
            Login
          </SubmitButton>
        </form>
        <CardFooter className="w-full">
          <div className="w-full flex items-center justify-start gap-2">
            <p
              className="text-sm text-start w-full 
          "
            >
              I don't have an account yet
              <Link
                className="text-nowrap hover:opacity-75 text-sm ml-1
                  hover:underline duration-150"
                to={"/signup"}
              >
                Sign Up
              </Link>
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export default LoginPage;
