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

router.get("/:id", async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await User.findOne({
      where: { id: userId },
    });
    if (user) {
      res.status(200).json(user);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const userId = req.params.id;
    await User.update(
      {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
      },
      { where: { id: userId } }
    );
    if (!userId) {
      res.sendStatus(500);
    } else {
      const updatedUser = await User.findOne({ where: { id: userId } });
      if (updatedUser) {
        res
          .status(200)
          .json({ message: "User updated successfully", user: updatedUser });
      } else {
        res.sendStatus(404);
      }
    }
  } catch (error) {
    next(error);
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

router.delete("/:id", async (req, res, next) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      res.sendStatus(500);
    } else {
      const user = await User.findOne({
        where: { id: userId },
      });
      if (!user) {
        res.sendStatus(404);
      } else {
        User.destroy({
          where: {
            id: userId,
          },
        });
        res.status(200).json({
          message: "User removed successfully",
        });
      }
    }
  } catch (error) {
    next(error);
  }
});
