const alertService = require("../services/alertService");

const getAll = async (req, res, next) => {
  try {
    const data = await alertService.getAll();
    res.status(200).json({ status: "success", count: data.length, data });
  } catch (err) {
    next(err);
  }
};

const getOne = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const data = await alertService.getById(id);
    res.status(200).json({ status: "success", data });
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const data = await alertService.create(req.body);
    res.status(201).json({ status: "success", data });
  } catch (err) {
    next(err);
  }
};

const resolve = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const data = await alertService.resolve(id);
    res.status(200).json({ status: "success", data });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, getOne, create, resolve };