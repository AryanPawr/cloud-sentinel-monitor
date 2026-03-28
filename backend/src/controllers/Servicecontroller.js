const serviceService = require("../services/serviceService");

const getAll = async (req, res, next) => {
  try {
    const data = await serviceService.getAll();
    res.status(200).json({ status: "success", count: data.length, data });
  } catch (err) {
    next(err);
  }
};

const getOne = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const data = await serviceService.getById(id);
    res.status(200).json({ status: "success", data });
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const data = await serviceService.create(req.body);
    res.status(201).json({ status: "success", data });
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const data = await serviceService.update(id, req.body);
    res.status(200).json({ status: "success", data });
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    await serviceService.remove(id);
    res.status(200).json({ status: "success", message: `Service ${id} deleted` });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, getOne, create, update, remove };