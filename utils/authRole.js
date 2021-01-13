// middleware to check the role
const authRole = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      const error = new Error('Not authorized');
      error.statusCode = 401;
      next(error);
    }
    next();
  };
};

module.exports = authRole;
