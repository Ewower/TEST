const { Router } = require("express");
const router = Router();
let Product = require("./models/Product");
let Check = require("./models/Check");
let Money = require("./models/Money");
let User = require("./models/User");
let mouthName = [
  "Января",
  "Февраля",
  "Марта",
  "Апреля",
  "Маия",
  "Июня",
  "Июля",
  "Августа",
  "Сентября",
  "Октярбя",
  "Ноября",
  "Декабря",
];
router.get("/", async (req, res) => {
  let product = await Product.find({}).lean();
  let money = await Money.find({}).lean();
  let check = await Check.find({}).lean();
  let user = await User.find({}).lean();
  let types = new Set();
  product.forEach(function (item) {
    types.add(item.type);
  });
  money.forEach((item) => {
    item.time = item.times.getHours() + ":" + item.times.getMinutes();
    item.date =
      item.times.getDate() + " " + mouthName[item.times.getMonth() + 1];
  });
  let moneyDate = [];
  money.forEach(function (item, i) {
    let obj = {
      mouth: item.times.getMonth(),
      year: item.times.getFullYear(),
      plus: 0,
      minus: 0,
      itog: 0,
      arr: [item],
    };

    if (
      moneyDate.find((item) => item.year == obj.year) &&
      moneyDate.find((item) => item.mouth == obj.mouth)
    ) {
      moneyDate[moneyDate.length - 1].arr.push(item);
    } else {
      moneyDate.push(obj);
    }
  });

  moneyDate.forEach((item) => {
    item.mouth = mouthName[item.mouth];
    item.arr.forEach((elems) => {
      if (elems.profit) {
        item.plus += elems.money;
      } else {
        item.minus += elems.money;
      }
    });
    item.itog = item.plus - item.minus;
  });
  let isItog = { plus: 0, minus: 0 };
  money.forEach((item) => {
    if (item.profit) {
      isItog.plus += item.money;
    } else {
      isItog.minus += item.money;
    }
  });
  isItog.itog = isItog.plus - isItog.minus;
  check.forEach(function (item) {
    let dat = item.date;

    let day = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
    let list =
      day[dat.getDay()] +
      " " +
      dat.getMonth() +
      "." +
      dat.getDate() +
      " " +
      dat.getHours() +
      ":" +
      dat.getMinutes();

    item.date = list;
  });
  product.forEach(function (item) {
    item.possibleIncome = item.que * item.lastPrise;
  });
  product.forEach(function (item) {
    item.xyz = item.que * item.firstPrise;
  });
  let main = false;
  if (req.cookies.status === "Admin" || req.cookies.status === "programmin")
    main = true;
  if (!main) {
    res.redirect("/cashier");
  }

  res.render("index", {
    product,
    check,
    main,
    moneyDate,
    isItog,
    types,
    user,
  });
});
router.post("/purchase", async function (req, res) {
  let product = await Product.find({});
  arrFor(req, res);
  let { dateTime } = req.body;
  let itog = 0;
  req.body.purchase.forEach(function (item) {
    itog += item.que * parseInt(item.fist);
  });
  let money = new Money({
    times: dateTime,
    comment: "Закупка",
    arrivalDeparture: "Закупка",
    money: itog,
    type: "Закупка",
    profit: false,
  }).save();
  console.log(money);
  res.status(200).send(req.body.purchase);
});
router.post("/createProduct", async function (req, res) {
  let productSave = new Product({
    name: req.body.name,
    firstPrise: req.body.firstPrise,
    lastPrise: req.body.lastPrise,
    type: req.body.type,
    que: req.body.que,
  });
  await productSave.save();
  res.redirect("/");
});
router.put("/fixed", async function (req, res) {
  await Product.findByIdAndUpdate(req.body.id, req.body);
  res.status(200).json(req.body);
});
async function arrFor(req, res) {
  let arr = req.body.purchase;
  try {
    arr.forEach(async function (item) {
      let id = item.id;

      let mongoId = await Product.findById(id);
      let que = item.que + mongoId.que;

      try {
        await Product.findByIdAndUpdate(id, { que: parseInt(que) });
        res.status(200);
      } catch (e) {
        console.log(e);
      }
    });
  } catch (e) {
    console.log(e);
  }
}
module.exports = router;
