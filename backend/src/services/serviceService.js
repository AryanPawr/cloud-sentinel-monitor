const { services } = require("../data/store");
const AppError = require("../utils/appError");

const getAll = async () => services;

const getById = async (id) => {
  const service = services.find((s) => s.id === id);
  if (!service) throw new AppError(`Service with id ${id} not found`, 404);
  return service;
};

const create = async (data) => {
  const newService = {
    id: Date.now(),
    name: data.name,
    status: data.status || "UP",
    responseTime: data.responseTime ?? null,
    region: data.region,
    type: data.type,
  };
  services.push(newService);
  return newService;
};

const update = async (id, data) => {
  const index = services.findIndex((s) => s.id === id);
  if (index === -1) throw new AppError(`Service with id ${id} not found`, 404);

  services[index] = { ...services[index], ...data };
  return services[index];
};

const remove = async (id) => {
  const index = services.findIndex((s) => s.id === id);
  if (index === -1) throw new AppError(`Service with id ${id} not found`, 404);

  const [deleted] = services.splice(index, 1);
  return deleted;
};

module.exports = { getAll, getById, create, update, remove };