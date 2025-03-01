import { showErrorToast } from "@/components/common/ToastProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Squares from "@/components/ui/squares";
import { loginUserThunk } from "@/store/auth/AuthThunks";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { Loader, Lock, Mail, User } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

type FormData = {
  username: string;
  email: string;
  password: string;
};

type FromError = {
  username: string;
  email: string;
  password: string;
};

const SignIn = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    password: "",
  });

  const [formError, setFormError] = useState<FromError>({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (formError?.[name as keyof FromError]) {
      setFormError((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const errors = {
      username: "",
      email: "",
      password: "",
    };

    let isValid = true;

    if (!formData.username) {
      errors.username = "Username is required";
      isValid = false;
    }

    if (!formData.email) {
      errors.email = "Email is required";
      isValid = false;
    }

    if (!formData.password) {
      errors.password = "Password is required";
      isValid = false;
    }

    setFormError(errors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const { username, ...dataToSubmit } = formData;

    dispatch(loginUserThunk(dataToSubmit));
  };

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center gap-2">
      {/* <Squares
        speed={0.5}
        squareSize={40}
        direction="diagonal"
        borderColor="#2b2b2b"
        hoverFillColor="#222"
      /> */}
      <div className="absolute flex flex-col gap-6 items-center justify-center p-4 rounded-xl shadow-lg">
        <div className="flex flex-col items-center gap-1">
          <h2 className="text-2xl font-bold my-2 text-center">
            💬 Welcome to DM ChatZone! 🚀
          </h2>
          <p className="text-sm text-gray-400 flex flex-col gap-1 text-center">
            <span>👋 Hey, ready to jump back into the conversation?</span>
            <span>
              Enter your details to start chatting with your friends! 🗨️✨
            </span>
          </p>
        </div>

        <form
          className="min-w-52 sm:min-w-72 md:min-w-96 flex flex-col items-center gap-6"
          onSubmit={handleSubmit}
        >
          <Input
            icon={User}
            name="username"
            label="Username"
            onChange={handleChange}
            value={formData.username}
            error={formError?.username}
          />

          <Input
            type="email"
            icon={Mail}
            label="Email"
            name="email"
            onChange={handleChange}
            value={formData.email}
            error={formError?.email}
          />

          <Input
            icon={Lock}
            label="Password"
            name="password"
            onChange={handleChange}
            value={formData.password}
            error={formError?.password}
          />

          <div className="w-full flex flex-col gap-4">
            <Button
              className="rounded-xl active:scale-95 transition-transform duration-150"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader className="animate-spin" size={20} />
              ) : (
                "Sign In"
              )}
            </Button>
            <p className="text-center">OR</p>
            <Button
              className="rounded-xl active:scale-95 transition-transform duration-150"
              type="button"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
