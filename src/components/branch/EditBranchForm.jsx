import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { branchSchema } from "@/validation/branchSchema";
import branchService from "@/services/branch/branchService";

const EditBranchForm = ({ branch, onSuccess, onCancel }) => {
  const form = useForm({
    resolver: zodResolver(branchSchema),
    defaultValues: {
      name: "",
      address: "",
      phoneNo: "",
      email: "",
      workingDays: [],
      openTime: "",
      closeTime: "",
      managerId: "",
    },
  });

  useEffect(() => {
    if (!branch) return;

    form.reset({
      name: branch.name || "",
      address: branch.address || "",
      phoneNo: branch.phoneNo || "",
      email: branch.email || "",
      workingDays: branch.workingDays || [],
      openTime: branch.openTime || "",
      closeTime: branch.closeTime || "",
      managerId: "",
    });
  }, [branch, form]);

  const onInvalid = () => {
    toast.error("Please fix the highlighted fields.");
  };

  const onSubmit = async (data) => {
    try {
      const request = {
        name: data.name,
        address: data.address,
        phoneNo: data.phoneNo,
        email: data.email || null,
        workingDays: data.workingDays,
        openTime: data.openTime || null,
        closeTime: data.closeTime || null,
        storeId: branch.store?.id || branch.storeId,
      };

      const response = await branchService.updateBranch(branch.id, request);

      toast.success("Branch updated successfully.");

      onSuccess?.(response);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update branch.");
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit, onInvalid)}
      className="space-y-5"
    >
      <div className="space-y-2">
        <label htmlFor="edit-name">Branch Name</label>

        <Input
          id="edit-name"
          placeholder="Enter branch name"
          {...form.register("name")}
        />

        {form.formState.errors.name && (
          <p className="text-sm text-destructive">
            {form.formState.errors.name.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="edit-address">Address</label>

        <Input
          id="edit-address"
          placeholder="Enter branch address"
          {...form.register("address")}
        />

        {form.formState.errors.address && (
          <p className="text-sm text-destructive">
            {form.formState.errors.address.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="edit-phoneNo">Phone Number</label>

        <Input
          id="edit-phoneNo"
          placeholder="10 digit phone number"
          {...form.register("phoneNo")}
        />

        {form.formState.errors.phoneNo && (
          <p className="text-sm text-destructive">
            {form.formState.errors.phoneNo.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="edit-email">Email</label>

        <Input
          id="edit-email"
          type="email"
          placeholder="Enter branch email"
          {...form.register("email")}
        />

        {form.formState.errors.email && (
          <p className="text-sm text-destructive">
            {form.formState.errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="edit-openTime">Opening Time</label>

        <Input id="edit-openTime" type="time" {...form.register("openTime")} />
      </div>

      <div className="space-y-2">
        <label htmlFor="edit-closeTime">Closing Time</label>

        <Input
          id="edit-closeTime"
          type="time"
          {...form.register("closeTime")}
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>

        <Button type="submit">Save Changes</Button>
      </div>
    </form>
  );
};

export default EditBranchForm;
