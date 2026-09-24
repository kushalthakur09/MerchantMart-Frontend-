import { useState } from "react";
import { toast } from "sonner";

import { verifyOtp, resendOtp } from "@/service/api/otpApi";

const OtpVerification = ({ email, name, onVerified }) => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const verify = async () => {
    if (otp.length !== 6) {
      toast.error("Enter a valid 6-digit OTP.");
      return;
    }

    try {
      setLoading(true);

      await verifyOtp({
        email,
        otp,
      });

      toast.success("Email verified successfully.");

      onVerified();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Invalid or expired OTP."
      );
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    try {
      setResending(true);

      await resendOtp({
        email,
        name,
      });

      toast.success("OTP sent successfully.");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Failed to resend OTP."
      );
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">
          Verify your email
        </h2>

        <p className="text-sm text-muted-foreground">
          Enter the 6-digit OTP sent to {email}
        </p>
      </div>

      <input
        type="text"
        inputMode="numeric"
        maxLength={6}
        value={otp}
        onChange={(e) =>
          setOtp(e.target.value.replace(/\D/g, ""))
        }
        placeholder="Enter OTP"
        className="w-full rounded-md border px-3 py-2"
      />

      <button
        type="button"
        onClick={verify}
        disabled={loading}
        className="w-full rounded-md bg-primary px-4 py-2 text-primary-foreground"
      >
        {loading ? "Verifying..." : "Verify Email"}
      </button>

      <button
        type="button"
        onClick={resend}
        disabled={resending}
        className="w-full text-sm underline"
      >
        {resending ? "Sending..." : "Resend OTP"}
      </button>
    </div>
  );
};

export default OtpVerification;