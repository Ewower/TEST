const { Router, response } = require("express");
let User = require("./models/User");
const router = Router();
router.get("/", function (req, res) {
  console.log(req.session);
  res.render("auth", { navFalse: false });
});
router.post("/", async function (req, res) {
  let { name, password } = req.body;

  let okay = await User.findOne({ name: name });

  if (
    okay.name == name.toLowerCase() &&
    okay.password == password.toLowerCase()
  ) {
    console.log(true);
    res.cookie("name", okay.name).cookie("status", okay.status).redirect("/");
  } else {
    res.status(500).send("хуйня");
  }
});
router.post("/createUser", async function (req, res) {
  let { name, password, status } = req.body;

  let user = new User({
    name: name.toLowerCase(),
    password: password.toLowerCase(),
    status: status.toLowerCase(),
    visibility: true,
  })
    .save()
    .then(async (okay) => {
      let user = await User.find({}).lean();
      res.status(200).json(user);
    });
  console.log(req.body);
});
module.exports = router;
