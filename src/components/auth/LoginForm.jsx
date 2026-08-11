import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { loginSchema } from "@/validation/authSchema";
import useAuth from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const LoginForm = ({ isAdminLogin = false }) => {
  const { login, adminLogin } = useAuth();
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      if (isAdminLogin) {
        await adminLogin(data);
      } else {
        await login(data);
      }

      navigate("/dashboard");
    } catch (error) {
      const status = error.response?.status;

      if (status === 401) {
        toast.error("Invalid email or password");
      } else if (status === 403) {
        toast.error("You don't have permission to login here");
      } else {
        toast.error(
          error.response?.data?.message || "Unable to login. Please try again.",
        );
      }
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-2">
        <label htmlFor="email">Email</label>

        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          {...form.register("email")}
        />

        {form.formState.errors.email && (
          <p className="text-sm text-destructive">
            {form.formState.errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="password">Password</label>

        <Input
          id="password"
          type="password"
          placeholder="Enter your password"
          {...form.register("password")}
        />

        {form.formState.errors.password && (
          <p className="text-sm text-destructive">
            {form.formState.errors.password.message}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full">
        Login
      </Button>
    </form>
  );
};

export default LoginForm;
