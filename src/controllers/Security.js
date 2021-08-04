exports.antiSQLInjection = (req, res, next) => {
  // FIXME esto no sirve
  const regex = /^((?!('"\$\\—%;)).)*$/;
  if (regex.test(Object.values(req.body).join())) {
    next();
  } else {
    res.sendStatus(400);
  }
};

exports.NotFound = (req, res) => { res.sendStatus(404); };
