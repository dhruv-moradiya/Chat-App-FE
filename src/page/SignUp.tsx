import { showErrorToast } from "@/components/common/ToastProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { registerUserThunk } from "@/store/auth/AuthThunks";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { Loader, Lock, Mail, User } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

type FormData = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type FromError = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const SignUp = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [formError, setFormError] = useState<FromError>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    // const formValues = Object.values(formData);
    // return formValues.every((value) => value !== "");

    const errors = {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
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

    if (!formData.confirmPassword) {
      errors.confirmPassword = "Confirm Password is required";
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

    if (formData.password !== formData.confirmPassword) {
      showErrorToast("Password and confirm password do not match");
      return;
    }

    const { confirmPassword, ...dataToSubmit } = formData;

    dispatch(registerUserThunk(dataToSubmit));
  };

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center gap-2">
      <div className="absolute flex flex-col gap-6 items-center justify-center p-4 rounded-xl shadow-lg">
        <div className="flex flex-col items-center gap-1">
          <h2 className="text-2xl font-bold my-2">🌟 Join ChatZone! 💬</h2>
          <p className="text-sm text-gray-400 flex flex-col gap-1 text-center">
            <span>🎉 Ready to start amazing conversations?</span>
            <span>Sign up now and connect with friends instantly! 🚀</span>
          </p>
        </div>

        <form
          className="min-w-52 sm:min-w-72 md:min-w-96 flex flex-col items-center gap-6"
          onSubmit={handleSubmit}
        >
          <Input
            type="text"
            icon={User}
            label="Username"
            name="username"
            onChange={handleChange}
            value={formData.username}
            error={formError.username}
          />

          <Input
            type="text"
            icon={Mail}
            label="Email"
            name="email"
            onChange={handleChange}
            value={formData.email}
            error={formError.email}
          />

          <Input
            icon={Lock}
            label="Password"
            name="password"
            onChange={handleChange}
            value={formData.password}
            error={formError.password}
          />

          <Input
            icon={Lock}
            label="Confirm Password"
            name="confirmPassword"
            onChange={handleChange}
            value={formData.confirmPassword}
            error={formError.confirmPassword}
          />

          <div className="w-full flex flex-col gap-4">
            <Button
              className="w-full rounded-xl active:scale-95 transition-transform duration-150"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader className="animate-spin" size={20} />
              ) : (
                "Sign Up"
              )}
            </Button>

            <p className="w-full text-center">OR</p>

            <Button
              className="w-full rounded-xl active:scale-95 transition-transform duration-150"
              type="button"
              onClick={() => navigate("/signin")}
            >
              Sign In
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
