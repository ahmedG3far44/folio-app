/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Card, CardFooter, CardTitle } from "@/components/ui/card";
import SubmitButton from "@/components/submit-button";

import { useAuth } from "@/contexts/AuthProvider";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useTheme } from "@/contexts/ThemeProvider";
import ErrorMessage from "@/components/ErrorMessage";
import Logo from "@/components/Logo";

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
      setError(null);
      setPending(true);
      const { email, password } = loginUser;

      if (!email || !password)
        throw new Error(
          "The email & password field is required, makre sure you fill it with correct data!!"
        );

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

      login({ user, token });
      setError(null);
      navigate(`/${user.id}`);
      return;
    } catch (err: any) {
      setError((err as Error).message);
      return;
    } finally {
      setPending(false);
    }
  };

  if (isLogged) return <Navigate to={`/${user.id}`} />;

  return (
    <div
      style={{
        backgroundColor: activeTheme.backgroundColor,
        color: activeTheme.secondaryText,
      }}
      className="w-full min-h-screen flex items-center justify-center"
    >
      <Card className="p-8">
        <CardTitle className="flex items-center justify-center flex-col gap-2 my-2">
          <Logo />
          <h1 className="text-2xl font-semibold text-center">
            login to your account
          </h1>
        </CardTitle>
        <form
          className="w-[400px] flex flex-col items-start gap-4"
          onSubmit={handleLogin}
        >
          {error && <ErrorMessage message={error} className={"text-center"} />}
          <input
            style={{
              backgroundColor: activeTheme.backgroundColor,
              color: activeTheme.primaryText,
              borderColor: activeTheme.borderColor,
            }}
            className="w-full p-2 rounded-md "
            onChange={(e) => setUser({ ...loginUser, email: e.target.value })}
            type="email"
            placeholder="email"
          />
          <div
            style={{
              backgroundColor: activeTheme.backgroundColor,
              color: activeTheme.primaryText,
              borderColor: activeTheme.borderColor,
            }}
            className="w-full flex items-center justify-between  rounded-md"
          >
            <input
              style={{
                backgroundColor: activeTheme.backgroundColor,
                color: activeTheme.primaryText,
                borderColor: activeTheme.borderColor,
              }}
              className="w-full h-full  p-2 rounded-tl-md rounded-bl-md"
              onChange={(e) =>
                setUser({ ...loginUser, password: e.target.value })
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
              className="hover:opacity-75 duration-150 cursor-pointer p-2 rounded-tr-md rounded-br-md"
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
          <div
            style={{ color: activeTheme.secondaryText }}
            className="w-full flex items-center justify-start gap-2"
          >
            <p
              className="text-sm text-start w-full 
          "
            >
              I don't have an account yet
              <Link
                className="underline text-nowrap hover:opacity-75 text-sm ml-1
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
