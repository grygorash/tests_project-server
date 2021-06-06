module.exports = function validateBody(res, { errors, isValid }) {
	if (!isValid) {
		return res.status(400).json({ success: false, errors });
	}
};
