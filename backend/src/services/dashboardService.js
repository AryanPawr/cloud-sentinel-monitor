const { services, alerts } = require("../data/store");

const getSummary = async () => {
  const totalServices = services.length;
  const activeServices = services.filter((s) => s.status === "UP").length;
  const openIncidents = alerts.filter((a) => a.status === "Open").length;

  const responseTimes = services
    .map((s) => s.responseTime)
    .filter((rt) => rt !== null);

  const avgResponseTime =
    responseTimes.length > 0
      ? Math.round(responseTimes.reduce((sum, rt) => sum + rt, 0) / responseTimes.length)
      : null;

  return {
    totalServices,
    activeServices,
    downServices: totalServices - activeServices,
    openIncidents,
    avgResponseTime,
    uptime: 99.3, // static placeholder — replace with real uptime calc
  };
};

module.exports = { getSummary };