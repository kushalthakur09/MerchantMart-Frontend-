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

const shiftReportService = {
  getCurrent,
  startShift,
  endShift,
};

export default shiftReportService;