import api from "@/services/api/axios";

const getByBranch = async (branchId) => {
  const response = await api.get(
    `/api/inventory/branch/${branchId}`
  );
  return response.data;
};

const create = async (inventory) => {
  const response = await api.post(
    "/api/inventory",
    inventory
  );
  return response.data;
};

const update = async (id, inventory) => {
  const response = await api.put(
    `/api/inventory/${id}`,
    inventory
  );
  return response.data;
};

const remove = async (id) => {
  const response = await api.delete(
    `/api/inventory/${id}`
  );
  return response.data;
};

const inventoryService = {
  getByBranch,
  create,
  update,
  remove,
};

export default inventoryService;