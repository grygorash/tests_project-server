module.exports = function handleResponse(
  res,
  data = { success: false },
  status = 200,
) {
  return res.status(status).json(data);
};
