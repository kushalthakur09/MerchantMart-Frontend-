import api from "@/services/api/axios";

const create = async (refund) => {
  const response = await api.post("/api/refund", refund);
  return response.data;
};

const update = async (id, refund) => {
  const response = await api.patch(`/api/refund/${id}`, refund);
  return response.data;
};

const approve = async (id) => {
  const response = await api.patch(`/api/refund/${id}/approve`);
  return response.data;
};

const reject = async (id, reason) => {
  const response = await api.patch(`/api/refund/${id}/reject`, null, {
    params: { reason },
  });
  return response.data;
};

const getAll = async () => {
  const response = await api.get("/api/refund");
  return response.data;
};

const getById = async (id) => {
  const response = await api.get(`/api/refund/${id}`);
  return response.data;
};

const getByBranch = async (branchId) => {
  const response = await api.get(`/api/refund/branch/${branchId}`);
  return response.data;
};

const getByCashier = async (cashierId) => {
  const response = await api.get(`/api/refund/cashier/${cashierId}`);
  return response.data;
};

const getByShift = async (shiftReportId) => {
  const response = await api.get(`/api/refund/shift/${shiftReportId}`);
  return response.data;
};

const refundService = {
  create,
  update,
  approve,
  reject,
  getAll,
  getById,
  getByBranch,
  getByCashier,
  getByShift,
};

export default refundService;