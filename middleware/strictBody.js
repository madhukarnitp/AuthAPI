const strictBody = (allowedFields) => (req, res, next) => {
  const extraFields = Object.keys(req.body).filter(
    (field) => !allowedFields.includes(field)
  );

  if (extraFields.length > 0) {
    return res.status(400).json({
      success: false,
      message: `Unknown fields: ${extraFields.join(", ")}`
    });
  }
  next();
};

module.exports = strictBody;