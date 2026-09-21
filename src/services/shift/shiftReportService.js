import api from "@/services/api/axios";

const getCurrent = async () => {
  const response = await api.get("/api/shift-reports/current");
  return response.data;
};

const startShift = async () => {
  const response = await api.post("/api/shift-reports/start");
  return response.data;
};

const endShift = async () => {
  const response = await api.patch("/api/shift-reports/end");
  return response.data;
};

const getByBranch = async (branchId) => {
  const response = await api.get(
    `/api/shift-reports/branch/${branchId}`
  );
  return response.data;
};

const getByCashier = async (cashierId) => {
  const response = await api.get(
    `/api/shift-reports/cashier/${cashierId}`
  );
  return response.data;
};

const getByCashierAndDate = async (cashierId, date) => {
  const response = await api.get(
    `/api/shift-reports/cashier/${cashierId}/by-date`,
    {
      params: { date },
    }
  );

  return response.data;
};

const getAll = async () => {
  const response = await api.get("/api/shift-reports");
  return response.data;
};

const getById = async (id) => {
  const response = await api.get(
    `/api/shift-reports/${id}`
  );

  return response.data;
};

const shiftReportService = {
  getCurrent,
  startShift,
  endShift,
  getByBranch,
  getByCashier,
  getByCashierAndDate,
  getAll,
  getById,
};

export default shiftReportService;