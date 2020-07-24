const router = require("express").Router();
const { User } = require("../db/models");
module.exports = router;

router.get("/", async (req, res, next) => {
  try {
    const users = await User
      .findAll
      // explicitly select only the id and email fields - even though
      // users' passwords are encrypted, it won't help if we just
      // send everything to anyone who asks!
      //   attributes: ["id", "email", ""],
      ();
    res.json(users);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const newUser = await User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
      userType: req.body.userType,
    });
    if (newUser) {
      res
        .status(200)
        .json({ message: "User Created Successfully ", user: newUser });
    } else {
      res.sendStatus(500);
    }
  } catch (error) {
    next(error);
  }
});
