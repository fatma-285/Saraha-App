export const authorize = (roles=[]) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new Error("Unauthorized", { cause: 401 }));
    }

    if (!roles.includes(req.user.role)) {
      return next(new Error("Forbidden", { cause: 403 }));
    }

    next();
  };
};
