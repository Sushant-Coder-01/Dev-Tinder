const adminAuth = (req, res, next) => {
  console.log("Admin Auth Middleware");
  const password = "xyz";

  const isAuthenticated = "xyz" === password;
  if (isAuthenticated) {
    next();
  } else {
    res.status(401).send("Unauthorized");
  }
};

const userAuth = (req, res, next) => {
  console.log("User Auth Middleware");
  const password = "abc";

  const isAuthenticated = "xyz" === password;
  if (isAuthenticated) {
    next();
  } else {
    res.status(401).send("Unauthorized");
  }
};

module.exports = { adminAuth, userAuth };
