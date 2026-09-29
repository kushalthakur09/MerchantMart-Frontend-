import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  forgotPasswordSchema,
  resetPasswordSchema,
} from "@/validation/authSchema";

import authService from "@/services/auth/authService";

const ForgotPasswordForm = ({ onBack }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const emailForm = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const resetForm = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      otp: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const startCooldown = () => {
    setCooldown(60);

    const interval = setInterval(() => {
      setCooldown((current) => {
        if (current <= 1) {
          clearInterval(interval);
          return 0;
        }

        return current - 1;
      });
    }, 1000);
  };

  const sendOtp = async (data) => {
    try {
      setLoading(true);

      await authService.forgotPassword(data.email);

      setEmail(data.email);
      setStep(2);
      startCooldown();

      toast.success("OTP sent to your email.");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to send OTP. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    if (cooldown > 0 || resending) return;

    try {
      setResending(true);

      await authService.forgotPassword(email);

      startCooldown();

      toast.success("OTP resent successfully.");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to resend OTP. Please try again.",
      );
    } finally {
      setResending(false);
    }
  };

  const resetPassword = async (data) => {
    try {
      setLoading(true);

      await authService.resetPassword({
        email,
        otp: data.otp,
        newPassword: data.newPassword,
      });

      toast.success(
        "Password reset successfully. You can now login.",
      );

      onBack();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to reset password. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (step === 1) {
    return (
      <form
        onSubmit={emailForm.handleSubmit(sendOtp)}
        className="space-y-5"
      >
        <div>
          <h2 className="text-xl font-semibold">
            Forgot Password
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Enter your email address and we'll send you an OTP.
          </p>
        </div>

        <div className="space-y-2">
          <label htmlFor="reset-email">Email</label>

          <Input
            id="reset-email"
            type="email"
            placeholder="Enter your email"
            {...emailForm.register("email")}
          />

          {emailForm.formState.errors.email && (
            <p className="text-sm text-destructive">
              {emailForm.formState.errors.email.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={loading}
        >
          {loading ? "Sending OTP..." : "Send OTP"}
        </Button>

        <Button
          type="button"
          variant="ghost"
          className="w-full"
          onClick={onBack}
        >
          Back to Login
        </Button>
      </form>
    );
  }

  return (
    <form
      onSubmit={resetForm.handleSubmit(resetPassword)}
      className="space-y-5"
    >
      <div>
        <h2 className="text-xl font-semibold">
          Reset Password
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Enter the OTP sent to{" "}
          <span className="font-medium">{email}</span>.
        </p>
      </div>

      <div className="space-y-2">
        <label htmlFor="reset-otp">OTP</label>

        <Input
          id="reset-otp"
          inputMode="numeric"
          maxLength={6}
          placeholder="Enter 6-digit OTP"
          {...resetForm.register("otp")}
        />

        {resetForm.formState.errors.otp && (
          <p className="text-sm text-destructive">
            {resetForm.formState.errors.otp.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="new-password">New Password</label>

        <Input
          id="new-password"
          type="password"
          placeholder="Enter new password"
          {...resetForm.register("newPassword")}
        />

        {resetForm.formState.errors.newPassword && (
          <p className="text-sm text-destructive">
            {resetForm.formState.errors.newPassword.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="confirm-password">
          Confirm Password
        </label>

        <Input
          id="confirm-password"
          type="password"
          placeholder="Confirm new password"
          {...resetForm.register("confirmPassword")}
        />

        {resetForm.formState.errors.confirmPassword && (
          <p className="text-sm text-destructive">
            {resetForm.formState.errors.confirmPassword.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={loading}
      >
        {loading ? "Resetting Password..." : "Reset Password"}
      </Button>

      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="ghost"
          onClick={onBack}
        >
          Back to Login
        </Button>

        <Button
          type="button"
          variant="ghost"
          disabled={cooldown > 0 || resending}
          onClick={resendOtp}
        >
          {resending
            ? "Sending..."
            : cooldown > 0
              ? `Resend in ${cooldown}s`
              : "Resend OTP"}
        </Button>
      </div>
    </form>
  );
};

export default ForgotPasswordForm;