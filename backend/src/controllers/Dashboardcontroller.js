const dashboardService = require("../services/dashboardService");

const getSummary = async (req, res, next) => {
  try {
    const data = await dashboardService.getSummary();
    res.status(200).json({ status: "success", data });
  } catch (err) {
    next(err);
  }
};

module.exports = { getSummary };