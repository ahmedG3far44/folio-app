import { useState } from "react";
import { Card, CardFooter, CardTitle } from "@/components/ui/card";

import { useAuth } from "@/contexts/AuthProvider";
import { useTheme } from "@/contexts/ThemeProvider";

import { Link, Navigate, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

import Logo from "@/components/Logo";
import SubmitButton from "@/components/submit-button";
import ErrorMessage from "@/components/ErrorMessage";

const URL_SERVER = import.meta.env.VITE_URL_SERVER as string;

function LoginPage() {
  const navigate = useNavigate();
  const { isLogged, user, login } = useAuth();
  const { defaultTheme } = useTheme();
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
          "The email & password field is required, make sure you fill it with correct data!!"
        );

      const response = await fetch(`${URL_SERVER}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginUser),
      });
      if (!response.ok)
        throw new Error("can't login your email or password is Wrong!!");
      const data = await response.json();
      if (!data)
        throw new Error("can't login your email or password is Wrong!!");
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
        backgroundColor: defaultTheme.backgroundColor,
      }}
      className="w-full min-h-screen flex items-center justify-center p-4"
    >
      <Card
        style={{
          backgroundColor: defaultTheme.cardColor,
          borderColor: defaultTheme.borderColor,
        }}
        className="w-full max-w-md lg:p-8 p-4 shadow-2xl border-2 rounded-2xl"
      >
        <CardTitle className="flex items-center justify-center flex-col gap-4 mb-8">
          <div className="transform hover:scale-105 transition-transform duration-200 text-white">
            <Logo />
          </div>
          <div className="text-center space-y-2">
            <h1
              style={{ color: defaultTheme.secondaryText }}
              className="text-2xl font-bold tracking-tight"
            >
              Welcome Back
            </h1>
            <p
              style={{ color: defaultTheme.secondaryText }}
              className="text-sm opacity-70"
            >
              Sign in to continue to your account
            </p>
          </div>
        </CardTitle>

        <form className="w-full flex flex-col gap-4" onSubmit={handleLogin}>
          {error && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              <ErrorMessage message={error} className="text-center" />
            </div>
          )}

          <div className="space-y-2">
            <label
              style={{ color: defaultTheme.secondaryText }}
              className="text-sm font-medium opacity-90"
            >
              Email Address
            </label>
            <div className="relative group">
              <Mail
                size={18}
                style={{ color: defaultTheme.secondaryText }}
                className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50 group-focus-within:opacity-100 transition-opacity"
              />
              <input
                style={{
                  borderColor: defaultTheme.borderColor,
                  backgroundColor: defaultTheme.backgroundColor,
                  color: defaultTheme.secondaryText,
                }}
                className="w-full pl-10 pr-4 py-3 border-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:border-opacity-80"
                onChange={(e) =>
                  setUser({ ...loginUser, email: e.target.value })
                }
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label
                style={{ color: defaultTheme.secondaryText }}
                className="text-sm font-medium opacity-90"
              >
                Password
              </label>
            </div>
            <div className="relative group">
              <Lock
                size={18}
                style={{ color: defaultTheme.secondaryText }}
                className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50 group-focus-within:opacity-100 transition-opacity"
              />
              <input
                style={{
                  borderColor: defaultTheme.borderColor,
                  backgroundColor: defaultTheme.backgroundColor,
                  color: defaultTheme.secondaryText,
                }}
                className="w-full pl-10 pr-12 py-3 border-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:border-opacity-80"
                onChange={(e) =>
                  setUser({ ...loginUser, password: e.target.value })
                }
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                autoComplete="current-password"
              />
              <button
                type="button"
                style={{ color: defaultTheme.secondaryText }}
                className="absolute right-3 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100 transition-opacity p-1 rounded-md"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <SubmitButton
            className="w-full mt-2 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
            loading={pending}
            type="submit"
          >
            Sign In
          </SubmitButton>
        </form>

        <div className="flex items-center gap-4 my-8">
          <div
            style={{ backgroundColor: defaultTheme.secondaryText }}
            className="flex-1 h-px opacity-20"
          />
          <span
            style={{ color: defaultTheme.secondaryText }}
            className="text-xs opacity-50 font-medium"
          >
            OR
          </span>
          <div
            style={{ backgroundColor: defaultTheme.secondaryText }}
            className="flex-1 h-px opacity-20"
          />
        </div>

        <CardFooter className="p-0">
          <div
            style={{ color: defaultTheme.secondaryText }}
            className="w-full text-center"
          >
            <p className="text-sm opacity-70">
              Don't have an account?{" "}
              <Link
                className="font-medium opacity-100 hover:underline transition-all duration-150"
                to="/signup"
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
