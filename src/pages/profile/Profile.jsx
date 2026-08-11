import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import profileService from "@/services/profile/profileService";
import {
  profileSchema,
  passwordSchema,
} from "@/validation/profileSchema";

const Profile = () => {
  const [loading, setLoading] = useState(true);

  const [profileDialogOpen, setProfileDialogOpen] =
    useState(false);

  const [passwordDialogOpen, setPasswordDialogOpen] =
    useState(false);

  const [pendingProfileData, setPendingProfileData] =
    useState(null);

  const [pendingPasswordData, setPendingPasswordData] =
    useState(null);

  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullUserName: "",
      email: "",
      phoneNo: "",
    },
  });

  const passwordForm = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await profileService.getProfile();

        profileForm.reset({
          fullUserName: response.fullUserName || "",
          email: response.email || "",
          phoneNo: response.phoneNo || "",
        });
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            "Failed to load profile."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const onProfileInvalid = () => {
    toast.error("Please fix the highlighted fields.");
  };

  const onPasswordInvalid = () => {
    toast.error("Please fix the password fields.");
  };

  /*
   * First step:
   * Validate profile and open confirmation dialog.
   */
  const requestProfileUpdate = (data) => {
    setPendingProfileData(data);
    setProfileDialogOpen(true);
  };

  /*
   * Actual profile update after confirmation.
   */
  const updateProfile = async () => {
    if (!pendingProfileData) {
      return;
    }

    try {
      const response = await profileService.updateProfile(
        pendingProfileData
      );

      profileForm.reset({
        fullUserName: response.fullUserName || "",
        email: response.email || "",
        phoneNo: response.phoneNo || "",
      });

      toast.success("Profile updated successfully.");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to update profile."
      );
    } finally {
      setProfileDialogOpen(false);
      setPendingProfileData(null);
    }
  };

  /*
   * First step:
   * Validate password and open confirmation dialog.
   */
  const requestPasswordChange = (data) => {
    setPendingPasswordData(data);
    setPasswordDialogOpen(true);
  };

  /*
   * Actual password change after confirmation.
   */
  const changePassword = async () => {
    if (!pendingPasswordData) {
      return;
    }

    try {
      await profileService.changePassword(
        pendingPasswordData
      );

      passwordForm.reset();

      toast.success("Password changed successfully.");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to change password."
      );
    } finally {
      setPasswordDialogOpen(false);
      setPendingPasswordData(null);
    }
  };

  const cancelProfileUpdate = () => {
    setProfileDialogOpen(false);
    setPendingProfileData(null);
  };

  const cancelPasswordChange = () => {
    setPasswordDialogOpen(false);
    setPendingPasswordData(null);
  };

  if (loading) {
    return <div>Loading profile...</div>;
  }

  return (
    <>
      <div className="max-w-3xl space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">
            My Profile
          </h1>

          <p className="text-muted-foreground">
            Manage your personal information and password.
          </p>
        </div>

        {/* Personal Information */}

        <div className="rounded-xl border bg-background p-6">
          <h2 className="mb-6 text-lg font-semibold">
            Personal Information
          </h2>

          <form
            onSubmit={profileForm.handleSubmit(
              requestProfileUpdate,
              onProfileInvalid
            )}
            className="space-y-5"
          >
            <div className="space-y-2">
              <label htmlFor="fullUserName">
                Full Name
              </label>

              <Input
                id="fullUserName"
                {...profileForm.register("fullUserName")}
              />

              {profileForm.formState.errors.fullUserName && (
                <p className="text-sm text-destructive">
                  {
                    profileForm.formState.errors
                      .fullUserName.message
                  }
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="email">Email</label>

              <Input
                id="email"
                type="email"
                {...profileForm.register("email")}
              />

              {profileForm.formState.errors.email && (
                <p className="text-sm text-destructive">
                  {
                    profileForm.formState.errors.email
                      .message
                  }
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="phoneNo">
                Phone Number
              </label>

              <Input
                id="phoneNo"
                {...profileForm.register("phoneNo")}
              />

              {profileForm.formState.errors.phoneNo && (
                <p className="text-sm text-destructive">
                  {
                    profileForm.formState.errors.phoneNo
                      .message
                  }
                </p>
              )}
            </div>

            <Button type="submit">
              Save Changes
            </Button>
          </form>
        </div>

        {/* Password */}

        <div className="rounded-xl border bg-background p-6">
          <h2 className="mb-6 text-lg font-semibold">
            Change Password
          </h2>

          <form
            onSubmit={passwordForm.handleSubmit(
              requestPasswordChange,
              onPasswordInvalid
            )}
            className="space-y-5"
          >
            <div className="space-y-2">
              <label htmlFor="currentPassword">
                Current Password
              </label>

              <Input
                id="currentPassword"
                type="password"
                {...passwordForm.register(
                  "currentPassword"
                )}
              />

              {passwordForm.formState.errors
                .currentPassword && (
                <p className="text-sm text-destructive">
                  {
                    passwordForm.formState.errors
                      .currentPassword.message
                  }
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="newPassword">
                New Password
              </label>

              <Input
                id="newPassword"
                type="password"
                {...passwordForm.register("newPassword")}
              />

              {passwordForm.formState.errors.newPassword && (
                <p className="text-sm text-destructive">
                  {
                    passwordForm.formState.errors.newPassword
                      .message
                  }
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword">
                Confirm New Password
              </label>

              <Input
                id="confirmPassword"
                type="password"
                {...passwordForm.register(
                  "confirmPassword"
                )}
              />

              {passwordForm.formState.errors
                .confirmPassword && (
                <p className="text-sm text-destructive">
                  {
                    passwordForm.formState.errors
                      .confirmPassword.message
                  }
                </p>
              )}
            </div>

            <Button type="submit">
              Change Password
            </Button>
          </form>
        </div>
      </div>

      {/* Profile Update Confirmation */}

      <AlertDialog
        open={profileDialogOpen}
        onOpenChange={setProfileDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Save profile changes?
            </AlertDialogTitle>

            <AlertDialogDescription>
              Are you sure you want to update your profile
              information?
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={cancelProfileUpdate}
            >
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction onClick={updateProfile}>
              Save Changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Password Confirmation */}

      <AlertDialog
        open={passwordDialogOpen}
        onOpenChange={setPasswordDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Change your password?
            </AlertDialogTitle>

            <AlertDialogDescription>
              Are you sure you want to change your
              password? You will need to use the new
              password the next time you log in.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={cancelPasswordChange}
            >
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction onClick={changePassword}>
              Change Password
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Profile;