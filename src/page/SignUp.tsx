import { showErrorToast } from "@/components/common/ToastProvider";
import { Button } from "@/components/ui/button";
import { IconInput } from "@/components/ui/icon-input";
import { registerUserThunk } from "@/store/auth/AuthThunks";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { Key, Mail, User } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

type FormData = {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const formValues = Object.values(formData);
    return formValues.every((value) => value !== "");
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      showErrorToast("Please fill out all the fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      showErrorToast("Passwords do not match");
      return;
    }

    const { confirmPassword, ...dataToSubmit } = formData;

    dispatch(registerUserThunk(dataToSubmit));
  };

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center gap-2">
      <h2 className="text-2xl font-bold my-2">Sign Up</h2>

      <form
        className="min-w-52 sm:min-w-72 md:min-w-96 flex flex-col items-center gap-4"
        onSubmit={handleSubmit}
      >
        <IconInput
          icon={<User size={18} />}
          placeholder="Username"
          name="username"
          onChange={handleChange}
          value={formData.username}
        />

        <IconInput
          type="email"
          icon={<Mail size={18} />}
          placeholder="Email"
          name="email"
          onChange={handleChange}
          value={formData.email}
        />

        <IconInput
          icon={<Key size={18} />}
          placeholder="Password"
          name="password"
          onChange={handleChange}
          value={formData.password}
        />
        <IconInput
          icon={<Key size={18} />}
          placeholder="Confirm Password"
          name="confirmPassword"
          onChange={handleChange}
          value={formData.confirmPassword}
        />

        <Button
          className="w-full rounded-xl"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Sign Up"}
        </Button>

        <p className="w-full text-center">OR</p>

        <Button
          className="w-full rounded-xl"
          type="button"
          onClick={() => navigate("/signin")}
        >
          Sign In
        </Button>
      </form>
    </div>
  );
};

export default SignUp;
