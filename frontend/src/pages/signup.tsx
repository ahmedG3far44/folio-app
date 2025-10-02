import { ChangeEvent, useState } from "react";
import { Card, CardTitle } from "@/components/ui/card";

import { useAuth } from "@/contexts/AuthProvider";
import { useTheme } from "@/contexts/ThemeProvider";
import { Link, useNavigate } from "react-router-dom";

import {
  EyeOff,
  Eye,
  User,
  Mail,
  Lock,
  Camera,
  XIcon,
  Upload,
} from "lucide-react";

import Logo from "@/components/Logo";
import SubmitButton from "@/components/submit-button";
import ErrorMessage from "@/components/ErrorMessage";

const URL_SERVER = import.meta.env.VITE_URL_SERVER as string;

function SignUpPage() {
  const { login } = useAuth();
  const { defaultTheme } = useTheme();
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

      if (!profile) {
        throw new Error("Profile picture is required to register!!");
      }
      if (!email || !password || !name) {
        throw new Error(
          "The email or password field is required, make sure to fill all the fields correctly!!"
        );
      }

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

      if (!response.ok)
        throw new Error("connection server error, check your network status!!");

      const data = await response.json();

      if (!data) {
        throw new Error("can't login your email or password is Wrong!!");
      }

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
      style={{ backgroundColor: defaultTheme.backgroundColor }}
      className="w-full min-h-screen flex items-center justify-center p-4"
    >
      <Card
        style={{
          backgroundColor: defaultTheme.cardColor,
          borderColor: defaultTheme.borderColor,
          color: defaultTheme.primaryText,
        }}
        className="w-full max-w-md p-8 shadow-2xl border-2 rounded-2xl"
      >
        
        <CardTitle className="flex items-center justify-center flex-col gap-4 mb-8">
          <div className="transform hover:scale-105 transition-transform duration-200">
            <Logo />
          </div>
          <div className="text-center space-y-2">
            <h1
              style={{ color: defaultTheme.secondaryText }}
              className="text-2xl font-bold tracking-tight"
            >
              Create Account
            </h1>
            <p
              style={{ color: defaultTheme.secondaryText }}
              className="text-sm opacity-70"
            >
              Sign up to get started with your new account
            </p>
          </div>
        </CardTitle>

        
        <form className="w-full flex flex-col gap-2" onSubmit={handleLogin}>
          
          <div className="flex flex-col items-center gap-2">
            {profile ? (
              <div className="relative group">
                <div
                  style={{ borderColor: defaultTheme.borderColor }}
                  className="w-24 h-24 rounded-full flex items-center justify-center border-2 overflow-hidden"
                >
                  <img
                    className="w-full h-full object-cover"
                    src={URL.createObjectURL(profile)}
                    alt="profile picture"
                  />
                </div>
                {!pending && (
                  <button
                    onClick={() => setProfile(null)}
                    type="button"
                    className="bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full absolute -right-1 -top-1 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-110"
                    aria-label="Remove profile picture"
                  >
                    <XIcon size={14} />
                  </button>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <label
                  style={{
                    backgroundColor: defaultTheme.backgroundColor,
                    borderColor: defaultTheme.borderColor,
                  }}
                  className="w-24 h-24 rounded-full border-2 border-dashed flex items-center justify-center cursor-pointer hover:border-opacity-60 transition-all duration-200 group relative overflow-hidden"
                  htmlFor="profile"
                >
                  <div className="flex flex-col items-center justify-center gap-1">
                    <Camera
                      size={28}
                      style={{ color: defaultTheme.secondaryText }}
                      className="opacity-50 group-hover:opacity-70 transition-opacity"
                    />
                    <Upload
                      size={16}
                      style={{ color: defaultTheme.secondaryText }}
                      className="opacity-40 group-hover:opacity-60 transition-opacity"
                    />
                  </div>
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
                <p
                  style={{ color: defaultTheme.secondaryText }}
                  className="text-xs opacity-60"
                >
                  Upload profile picture
                </p>
              </div>
            )}
          </div>

          {error && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              <ErrorMessage className="text-center" message={error} />
            </div>
          )}

          
          <div className="space-y-2">
            <label
              style={{ color: defaultTheme.secondaryText }}
              className="text-sm font-medium opacity-90"
            >
              Full Name
            </label>
            <div className="relative group">
              <User
                size={18}
                style={{ color: defaultTheme.secondaryText }}
                className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50 group-focus-within:opacity-100 transition-opacity"
              />
              <input
                style={{
                  backgroundColor: defaultTheme.backgroundColor,
                  borderColor: defaultTheme.borderColor,
                  color: defaultTheme.secondaryText,
                }}
                className="w-full pl-10 pr-4 py-3 border-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:border-opacity-80"
                onChange={(e) =>
                  setRegisterUser({ ...registerUser, name: e.target.value })
                }
                type="text"
                placeholder="John Doe"
                autoComplete="name"
              />
            </div>
          </div>

          
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
                  backgroundColor: defaultTheme.backgroundColor,
                  borderColor: defaultTheme.borderColor,
                  color: defaultTheme.secondaryText,
                }}
                className="w-full pl-10 pr-4 py-3 border-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:border-opacity-80"
                onChange={(e) =>
                  setRegisterUser({ ...registerUser, email: e.target.value })
                }
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>
          </div>

          
          <div className="space-y-2">
            <label
              style={{ color: defaultTheme.secondaryText }}
              className="text-sm font-medium opacity-90"
            >
              Password
            </label>
            <div className="relative group">
              <Lock
                size={18}
                style={{ color: defaultTheme.secondaryText }}
                className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50 group-focus-within:opacity-100 transition-opacity"
              />
              <input
                style={{
                  backgroundColor: defaultTheme.backgroundColor,
                  borderColor: defaultTheme.borderColor,
                  color: defaultTheme.secondaryText,
                }}
                className="w-full pl-10 pr-12 py-3 border-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:border-opacity-80"
                onChange={(e) =>
                  setRegisterUser({ ...registerUser, password: e.target.value })
                }
                type={showPassword ? "text" : "password"}
                placeholder="Minimum 8 characters"
                autoComplete="new-password"
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
            <p
              style={{ color: defaultTheme.secondaryText }}
              className="text-xs opacity-60 mt-1"
            >
              Must be at least 8 characters long
            </p>
          </div>

          
          <SubmitButton
            className="w-full mt-2 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
            loading={pending}
            type="submit"
          >
            Create Account
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

        
        <div
          style={{ color: defaultTheme.secondaryText }}
          className="w-full text-center"
        >
          <p className="text-sm opacity-70">
            Already have an account?{" "}
            <Link
              className="font-medium opacity-100 hover:underline transition-all duration-150"
              to="/login"
            >
              Sign In
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}

export default SignUpPage;
