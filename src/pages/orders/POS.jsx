import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import useAuth from "@/hooks/useAuth";
import productService from "@/services/product/productService";
import customerService from "@/services/customer/customerService";
import orderService from "@/services/order/orderService";

const POS = () => {
  const { user } = useAuth();

  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  const [productSearch, setProductSearch] = useState("");
  const [customerSearch, setCustomerSearch] = useState("");

  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    fullName: "",
    phoneNo: "",
    email: "",
  });

  const [paymentType, setPaymentType] = useState("CASH");

  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);

  // =========================
  // Load Products
  // =========================

  useEffect(() => {
    const loadProducts = async () => {
      if (!user?.storeId) return;

      try {
        setLoadingProducts(true);

        const data = await productService.getByStore(user.storeId);

        setProducts(
          data.filter((product) => product.status === "ACTIVE")
        );
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to load products."
        );
      } finally {
        setLoadingProducts(false);
      }
    };

    loadProducts();
  }, [user?.storeId]);

  // =========================
  // Product Search
  // =========================

  useEffect(() => {
    const searchProducts = async () => {
      if (!user?.storeId) return;

      if (!productSearch.trim()) {
        try {
          const data = await productService.getByStore(user.storeId);

          setProducts(
            data.filter((product) => product.status === "ACTIVE")
          );
        } catch {
          toast.error("Failed to load products.");
        }

        return;
      }

      try {
        setLoadingProducts(true);

        const data = await productService.search(
          user.storeId,
          productSearch
        );

        setProducts(
          data.filter((product) => product.status === "ACTIVE")
        );
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Product search failed."
        );
      } finally {
        setLoadingProducts(false);
      }
    };

    const timer = setTimeout(searchProducts, 300);

    return () => clearTimeout(timer);
  }, [productSearch, user?.storeId]);

  // =========================
  // Cart
  // =========================

  const addToCart = (product) => {
    setCart((currentCart) => {
      const existing = currentCart.find(
        (item) => item.productId === product.id
      );

      if (existing) {
        const newQuantity = existing.quantity + 1;

        if (
          product.inventoryQuantity != null &&
          newQuantity > product.inventoryQuantity
        ) {
          toast.error("Insufficient inventory.");
          return currentCart;
        }

        return currentCart.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: newQuantity }
            : item
        );
      }

      return [
        ...currentCart,
        {
          productId: product.id,
          name: product.name,
          price: product.sellingPrice,
          quantity: 1,
        },
      ];
    });
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart((currentCart) =>
      currentCart.map((item) =>
        item.productId === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const removeFromCart = (productId) => {
    setCart((currentCart) =>
      currentCart.filter((item) => item.productId !== productId)
    );
  };

  const clearCart = () => {
    setCart([]);
    setSelectedCustomer(null);
    setCustomers([]);
    setCustomerSearch("");
    setPaymentType("CASH");
  };

  const totalAmount = useMemo(
    () =>
      cart.reduce(
        (total, item) =>
          total + Number(item.price) * item.quantity,
        0
      ),
    [cart]
  );

  // =========================
  // Customer Search
  // =========================

  useEffect(() => {
    const searchCustomers = async () => {
      if (!customerSearch.trim()) {
        setCustomers([]);
        return;
      }

      try {
        setLoadingCustomers(true);

        const data = await customerService.searchForOrder(
          customerSearch
        );

        setCustomers(data);
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Customer search failed."
        );
      } finally {
        setLoadingCustomers(false);
      }
    };

    const timer = setTimeout(searchCustomers, 300);

    return () => clearTimeout(timer);
  }, [customerSearch]);

  const selectCustomer = (customer) => {
    setSelectedCustomer(customer);
    setCustomerSearch("");
    setCustomers([]);
  };

  // =========================
  // Create Customer
  // =========================

  const handleCustomerChange = (event) => {
    const { name, value } = event.target;

    setNewCustomer((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const createCustomer = async (event) => {
    event.preventDefault();

    if (!newCustomer.fullName.trim()) {
      toast.error("Customer name is required.");
      return;
    }

    if (!/^[0-9]{10}$/.test(newCustomer.phoneNo)) {
      toast.error("Phone number must contain exactly 10 digits.");
      return;
    }

    try {
      const customer =
        await customerService.createForOrder(newCustomer);

      setSelectedCustomer(customer);
      setShowCustomerForm(false);

      setNewCustomer({
        fullName: "",
        phoneNo: "",
        email: "",
      });

      toast.success("Customer registered successfully.");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to register customer."
      );
    }
  };

  // =========================
  // Activate Customer
  // =========================

  const activateCustomer = async (customer) => {
    try {
      await customerService.activateForOrder(customer.id);

      const updatedCustomer = {
        ...customer,
        status: "ACTIVE",
      };

      setSelectedCustomer(updatedCustomer);

      toast.success("Customer activated successfully.");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to activate customer."
      );
    }
  };

  // =========================
  // Place Order
  // =========================

  const placeOrder = async () => {
    if (!user?.branchId) {
      toast.error("No branch is assigned to the current user.");
      return;
    }

    if (cart.length === 0) {
      toast.error("Add at least one product.");
      return;
    }

    if (!selectedCustomer) {
      toast.error("Please select or register a customer.");
      return;
    }

    if (selectedCustomer.status !== "ACTIVE") {
      toast.error(
        "Please activate the customer before placing the order."
      );
      return;
    }

    try {
      setPlacingOrder(true);

      const order = {
        branchId: user.branchId,
        customerId: selectedCustomer.id,
        paymentType,
        items: cart.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      };

      await orderService.create(order);

      toast.success("Order placed successfully.");

      clearCart();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to place order."
      );
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Point of Sale</h1>
        <p className="text-muted-foreground">
          Create a new customer order
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">

        {/* =========================
            PRODUCTS
        ========================= */}

        <div className="rounded-lg border bg-card p-4 lg:col-span-2">
          <h2 className="mb-4 text-lg font-semibold">
            Products
          </h2>

          <input
            type="text"
            placeholder="Search products..."
            value={productSearch}
            onChange={(event) =>
              setProductSearch(event.target.value)
            }
            className="mb-4 w-full rounded-md border bg-background px-3 py-2 outline-none"
          />

          {loadingProducts ? (
            <p className="text-muted-foreground">
              Loading products...
            </p>
          ) : products.length === 0 ? (
            <p className="text-muted-foreground">
              No products found.
            </p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {products.map((product) => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => addToCart(product)}
                  className="rounded-lg border p-4 text-left transition hover:bg-muted"
                >
                  <div className="font-medium">
                    {product.name}
                  </div>

                  <div className="mt-2 text-sm text-muted-foreground">
                    ₹{Number(product.sellingPrice).toFixed(2)}
                  </div>

                  <div className="mt-2 text-xs text-muted-foreground">
                    Click to add
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* =========================
            CART
        ========================= */}

        <div className="rounded-lg border bg-card p-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              Cart
            </h2>

            {cart.length > 0 && (
              <button
                type="button"
                onClick={clearCart}
                className="text-sm text-destructive"
              >
                Clear
              </button>
            )}
          </div>

          {cart.length === 0 ? (
            <p className="text-muted-foreground">
              Cart is empty.
            </p>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.productId}
                  className="border-b pb-3"
                >
                  <div className="flex justify-between gap-2">
                    <span className="font-medium">
                      {item.name}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        removeFromCart(item.productId)
                      }
                      className="text-sm text-destructive"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(
                            item.productId,
                            item.quantity - 1
                          )
                        }
                        className="h-7 w-7 rounded border"
                      >
                        -
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(
                            item.productId,
                            item.quantity + 1
                          )
                        }
                        className="h-7 w-7 rounded border"
                      >
                        +
                      </button>
                    </div>

                    <span>
                      ₹
                      {(
                        Number(item.price) * item.quantity
                      ).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}

              <div className="flex justify-between border-t pt-4 text-lg font-bold">
                <span>Total</span>
                <span>
                  ₹{totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* =========================
            CUSTOMER
        ========================= */}

        <div className="rounded-lg border bg-card p-4 lg:col-span-2">
          <h2 className="mb-4 text-lg font-semibold">
            Customer
          </h2>

          {selectedCustomer ? (
            <div className="rounded-md border p-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-semibold">
                    {selectedCustomer.fullName}
                  </div>

                  <div className="text-sm text-muted-foreground">
                    {selectedCustomer.phoneNo}
                  </div>

                  {selectedCustomer.email && (
                    <div className="text-sm text-muted-foreground">
                      {selectedCustomer.email}
                    </div>
                  )}
                </div>

                <span className="text-sm">
                  {selectedCustomer.status}
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedCustomer(null);
                  setCustomerSearch("");
                }}
                className="mt-3 text-sm underline"
              >
                Change customer
              </button>
            </div>
          ) : (
            <>
              <input
                type="text"
                placeholder="Search by name, phone or email..."
                value={customerSearch}
                onChange={(event) =>
                  setCustomerSearch(event.target.value)
                }
                className="w-full rounded-md border bg-background px-3 py-2 outline-none"
              />

              {loadingCustomers && (
                <p className="mt-2 text-sm text-muted-foreground">
                  Searching...
                </p>
              )}

              {customers.length > 0 && (
                <div className="mt-2 rounded-md border">
                  {customers.map((customer) => (
                    <div
                      key={customer.id}
                      className="flex items-center justify-between border-b p-3 last:border-b-0"
                    >
                      <button
                        type="button"
                        onClick={() => selectCustomer(customer)}
                        className="text-left"
                      >
                        <div className="font-medium">
                          {customer.fullName}
                        </div>

                        <div className="text-sm text-muted-foreground">
                          {customer.phoneNo}
                        </div>
                      </button>

                      {customer.status === "INACTIVE" && (
                        <button
                          type="button"
                          onClick={() =>
                            activateCustomer(customer)
                          }
                          className="text-sm font-medium"
                        >
                          Activate
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <button
                type="button"
                onClick={() => setShowCustomerForm(true)}
                className="mt-4 rounded-md border px-4 py-2"
              >
                + Register New Customer
              </button>
            </>
          )}

          {/* Customer Form */}

          {showCustomerForm && (
            <form
              onSubmit={createCustomer}
              className="mt-4 space-y-3 rounded-md border p-4"
            >
              <h3 className="font-semibold">
                Register Customer
              </h3>

              <input
                name="fullName"
                placeholder="Full name"
                value={newCustomer.fullName}
                onChange={handleCustomerChange}
                className="w-full rounded-md border bg-background px-3 py-2"
              />

              <input
                name="phoneNo"
                placeholder="Phone number"
                maxLength={10}
                value={newCustomer.phoneNo}
                onChange={handleCustomerChange}
                className="w-full rounded-md border bg-background px-3 py-2"
              />

              <input
                name="email"
                type="email"
                placeholder="Email (optional)"
                value={newCustomer.email}
                onChange={handleCustomerChange}
                className="w-full rounded-md border bg-background px-3 py-2"
              />

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="rounded-md bg-primary px-4 py-2 text-primary-foreground"
                >
                  Register
                </button>

                <button
                  type="button"
                  onClick={() => setShowCustomerForm(false)}
                  className="rounded-md border px-4 py-2"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        {/* =========================
            PAYMENT
        ========================= */}

        <div className="rounded-lg border bg-card p-4">
          <h2 className="mb-4 text-lg font-semibold">
            Payment
          </h2>

          <select
            value={paymentType}
            onChange={(event) =>
              setPaymentType(event.target.value)
            }
            className="w-full rounded-md border bg-background px-3 py-2"
          >
            <option value="CASH">Cash</option>
            <option value="UPI">UPI</option>
            <option value="CARD">Card</option>
          </select>

          <button
            type="button"
            onClick={placeOrder}
            disabled={placingOrder}
            className="mt-4 w-full rounded-md bg-primary px-4 py-3 font-semibold text-primary-foreground disabled:opacity-50"
          >
            {placingOrder
              ? "Placing Order..."
              : `Place Order • ₹${totalAmount.toFixed(2)}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default POS;