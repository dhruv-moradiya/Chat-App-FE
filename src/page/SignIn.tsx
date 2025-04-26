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
  email: string;
  password: string;
};

type FromError = {
  email: string;
  password: string;
};

const SignIn = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });

  const [formError, setFormError] = useState<FromError>({
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

    const { ...dataToSubmit } = formData;

    dispatch(loginUserThunk(dataToSubmit));
  };

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-2">
      {/* <Squares
        speed={0.5}
        squareSize={40}
        direction="diagonal"
        borderColor="#2b2b2b"
        hoverFillColor="#222"
      /> */}
      <div className="absolute flex flex-col items-center justify-center gap-6 rounded-xl p-4 shadow-lg">
        <div className="flex flex-col items-center gap-1">
          <h2 className="my-2 text-center text-2xl font-bold">💬 Welcome to DM ChatZone! 🚀</h2>
          <p className="flex flex-col gap-1 text-center text-sm text-gray-400">
            <span>👋 Hey, ready to jump back into the conversation?</span>
            <span>Enter your details to start chatting with your friends! 🗨️✨</span>
          </p>
        </div>

        <form
          className="flex min-w-52 flex-col items-center gap-6 sm:min-w-72 md:min-w-96"
          onSubmit={handleSubmit}
        >
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

          <div className="flex w-full flex-col gap-4">
            <Button
              className="rounded-xl transition-transform duration-150 active:scale-95"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? <Loader className="animate-spin" size={20} /> : "Sign In"}
            </Button>
            <p className="text-center">OR</p>
            <Button
              className="rounded-xl transition-transform duration-150 active:scale-95"
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
