import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

const CustomerDialog = ({
  open,
  onOpenChange,
  title,
  loading = false,
  initialData = null,
  onSubmit,
}) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNo: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        fullName: initialData.fullName || "",
        email: initialData.email || "",
        phoneNo: initialData.phoneNo || "",
      });
    } else {
      setFormData({
        fullName: "",
        email: "",
        phoneNo: "",
      });
    }
  }, [initialData, open]);

  const handleChange = (field, value) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    onSubmit(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>
              {initialData
                ? "Update customer details."
                : "Add a new customer."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">
                Full Name
              </Label>

              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(event) =>
                  handleChange(
                    "fullName",
                    event.target.value
                  )
                }
                placeholder="Enter full name"
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNo">
                Phone Number
              </Label>

              <Input
                id="phoneNo"
                value={formData.phoneNo}
                onChange={(event) =>
                  handleChange(
                    "phoneNo",
                    event.target.value
                  )
                }
                placeholder="Enter 10-digit phone number"
                maxLength={10}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">
                Email
              </Label>

              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(event) =>
                  handleChange(
                    "email",
                    event.target.value
                  )
                }
                placeholder="Enter email address"
                disabled={loading}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={loading}>
              {loading
                ? "Saving..."
                : initialData
                  ? "Update Customer"
                  : "Add Customer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CustomerDialog;