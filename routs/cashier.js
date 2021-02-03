const { Router } = require("express");
const router = Router();
let Product = require("./models/Product");
let Check = require("./models/Check");
let Money = require("./models/Money");
router.get("/", async function (req, res) {
  let product = await Product.find({}).lean();
  product.sort((a, b) => (a.que > b.que ? 1 : -1));
  product = product.reverse();
  let worker = req.cookies.name;
  console.log(worker);
  res.render("cashier", {
    cashier: true,
    product: product,
    worker: worker,
  });
});

router.post("/", async (req, res) => {
  res.send(req.body);
  let check = new Check({
    seller: req.body.seller,
    comment: req.body.comment,
    product: req.body.product,
    date: req.body.date,
    type: req.body.type,
    itog: req.body.itog,
  });
  await checkFor(req);
  let money = new Money({
    times: new Date(),
    arrivalDeparture: "Продажа",
    money: req.body.itog,
    type: req.body.type,
    comment: req.body.comment,
    profit: true,
  });
  await money.save();
  console.log(check);
  await check.save();
});
async function checkFor(req) {
  let { product } = req.body;
  product.forEach(async function (item) {
    let id = item.id;
    let items = await Product.findById(id);
    let que = items.que - item.que;
    await Product.findByIdAndUpdate(id, { que: que });
  });
}
module.exports = router;
