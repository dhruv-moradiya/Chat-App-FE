import { showErrorToast } from "@/components/common/ToastProvider";
import { Button } from "@/components/ui/button";
import { IconInput } from "@/components/ui/icon-input";
import { loginUserThunk } from "@/store/auth/AuthThunks";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { Key, Mail, User } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

type FormData = {
  username: string;
  email: string;
  password: string;
};

const SignIn = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    password: "",
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

    const { username, ...dataToSubmit } = formData;

    dispatch(loginUserThunk(dataToSubmit));
  };

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center gap-2">
      <h2 className="text-2xl font-bold my-2">Sign In</h2>

      <form className="w-96 flex flex-col gap-4" onSubmit={handleSubmit}>
        <IconInput
          icon={<User />}
          placeholder="Username"
          name="username"
          onChange={handleChange}
          value={formData.username}
        />

        <IconInput
          type="email"
          icon={<Mail />}
          placeholder="Email"
          name="email"
          onChange={handleChange}
          value={formData.email}
        />

        <IconInput
          icon={<Key />}
          placeholder="Password"
          name="password"
          onChange={handleChange}
          value={formData.password}
        />

        <Button className="rounded-xl" type="submit" disabled={isLoading}>
          {isLoading ? "Loading..." : "Sign In"}
        </Button>
        <p>OR</p>
        <Button
          className="rounded-xl"
          type="button"
          onClick={() => navigate("/signup")}
        >
          Sign Up
        </Button>
      </form>
    </div>
  );
};

export default SignIn;
