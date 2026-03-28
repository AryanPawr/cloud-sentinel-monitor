const { alerts } = require("../data/store");
const AppError = require("../utils/appError");

const getAll = async () => alerts;

const getById = async (id) => {
  const alert = alerts.find((a) => a.id === id);
  if (!alert) throw new AppError(`Alert with id ${id} not found`, 404);
  return alert;
};

const create = async (data) => {
  const newAlert = {
    id: Date.now(),
    service: data.service,
    severity: data.severity,
    title: data.title,
    status: data.status || "Open",
    duration: data.duration || "0m",
    timestamp: new Date().toISOString(),
  };
  alerts.push(newAlert);
  return newAlert;
};

const resolve = async (id) => {
  const index = alerts.findIndex((a) => a.id === id);
  if (index === -1) throw new AppError(`Alert with id ${id} not found`, 404);

  alerts[index].status = "Resolved";
  return alerts[index];
};

module.exports = { getAll, getById, create, resolve };