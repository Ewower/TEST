let arr = [];
if (localStorage.getItem("delivery")) {
  arr = JSON.parse(localStorage.getItem("delivery"));
}
class Purchase {
  constructor(arr) {
    this.arr = arr;
  }
  li() {
    let arr = this.arr;
    let display = `
    <div class='row'>
       <div class='col-6 border'>Название</div>
       <div class='col-1 p-0 border'><input class='form-control text-center' value='Количество' disabled></div>
       <div class='col-2 p-0 border'><input class='form-control text-center' value='Цена закупки' disabled></div>
       <div class='col-2 p-0 border'><input class='form-control text-center' value='Цена продажи' disabled></div>
       <div class='col-1 p-0'><button class='btn btn-dark w-100'><i class="fas fa-trash-alt"></i></button></div>
    </div>
    `;
    arr.forEach((element) => {
      display += `
      <div class='row' data-id=${element.id}>
        <div class='col-6 border'>${element.name}</div>
        <div class='col-1 p-0 border'><input class='form-control queInput text-center' value='${element.que}'></div>
        <div class='col-2 p-0 border'><input class='form-control queFist text-center' value='${element.fist}'></div>
        <div class='col-2 p-0 border'><input class='form-control queLast text-center' value='${element.last}'></div>
        <div class='col-1 p-0'><button class='btn btn-dark w-100 delete'><i class="fas fa-trash-alt"></i></button></div>
      </div>
      `;
    });
    document.querySelector(".zavoz .listen").innerHTML = display;
    this.Fixed();
  }
  CreateLi(li, name) {
    let obj = {
      name: name,
      que: 1,
      fist: li.dataset.firstprise,
      last: li.dataset.lastprise,
      id: li.dataset.id,
    };
    if (this.arr.find((elems) => elems.id == obj.id)) {
      this.arr.find((elems) => elems.id == obj.id).que += 1;
      localStorage.setItem("delivery", JSON.stringify(this.arr));
    } else {
      this.arr.push(obj);
      localStorage.setItem("delivery", JSON.stringify(this.arr));
    }
    this.li();
  }
  Fixed() {
    document
      .querySelectorAll(".zavoz .listen .row .queInput")
      .forEach((item) => {
        item.onchange = function () {
          let id = this.parentNode.parentNode.dataset.id;

          arr.find((item) => item.id == id).que = parseInt(item.value);
          localStorage.setItem("delivery", JSON.stringify(arr));
        };
      });
    document
      .querySelectorAll(".zavoz .listen .row .queFist")
      .forEach((item) => {
        item.onchange = function () {
          let id = this.parentNode.parentNode.dataset.id;

          arr.find((item) => item.id == id).fist = parseInt(this.value);
          localStorage.setItem("delivery", JSON.stringify(arr));
        };
      });
    document
      .querySelectorAll(".zavoz .listen .row .queLast")
      .forEach((item) => {
        item.onchange = function () {
          let id = this.parentNode.parentNode.dataset.id;

          arr.find((item) => item.id == id).last = parseInt(this.value);
          localStorage.setItem("delivery", JSON.stringify(arr));
        };
      });
    document.querySelectorAll(".zavoz .listen .delete").forEach((item) => {
      item.onclick = function () {
        let id = this.parentNode.parentNode.dataset.id;
        let findId = arr.findIndex((elems) => elems.id == id);
        arr.splice(findId, 1);
        localStorage.setItem("delivery", JSON.stringify(arr));
        this.parentNode.parentNode.remove();
      };
    });
  }
  async fetchButton() {}
  searchInput(val) {
    val = val.toLowerCase();
    let list = document.querySelectorAll(".zavoz .liName");
    if (val != "" || val != " ") {
      list.forEach((item) => {
        if (item.innerHTML.toLowerCase().indexOf(val) > -1) {
          item.parentNode.classList.remove("hide");
        } else {
          item.parentNode.classList.add("hide");
        }
      });
    } else {
      list.forEach((item) => {
        item.parentNode.classList.remove("hide");
      });
    }
  }
}
let purchase = new Purchase(arr);

class feetch {
  constructor(arr) {}
  async postFetch() {
    let data = {
      purchase: JSON.parse(localStorage.getItem("delivery")),
      itog: 0,
      profit: false,
      dateTime: new Date(),
    };
    data.purchase.forEach(function (item) {
      data.itog = item.que * parseInt(item.last);
    });
    console.log(data);
    let xhr = await fetch("/purchase", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        //"Content-Type": "application/x-www-form-urlencoded",
      },
    });
    let json = await xhr.json();
    if (xhr.ok) {
      this.purchase = data.purchase;
      this.xhr = await json;
      localStorage.clear("delivery");
      purchase.arr = [];
      purchase.li();
      this.updateList();
    }
  }

  updateList() {
    let purchase123 = this.purchase;
    let data = [];
    document.querySelectorAll("#purchase .row").forEach((item, i) => {
      let obj = {
        name: document.querySelectorAll("#purchase .purchaseName")[i].innerHTML,
        que: parseInt(
          document.querySelectorAll("#purchase .purchaseQue")[i].innerHTML
        ),
        last: document.querySelectorAll("#purchase .purchaseLast")[i].innerHTML,
        id: item.dataset.id,
      };
      data.push(obj);
    });
    this.purchase.forEach((item) => {
      let elems = data.find((elems) => elems.id == item.id);
      data.find((elems) => elems.id == item.id).que = elems.que + item.que;
    });

    let Row = data.map(function (item) {
      return `
      <div class="row">
          <div class="col-md-6 border purchaseName">${item.name}</div>
          <div class="col-1 border text-center purchaseQue"> ${item.que}</div>
          <div class="col-1 border text-center purchaseLast">${item.last}</div>
      </div>     
      `;
    });
    document.querySelector("#purchase").innerHTML = Row.join("");
  }
  sorting(str) {
    let list = document.querySelectorAll(".skladSSS");
    list.forEach((item) => {
      if (item.dataset.type == str) {
        list.forEach((item) => {
          item.classList.remove("hide");
        });
        item.classList.remove("SortHide");
      } else {
        list.forEach((item) => {
          item.classList.remove("hide");
        });
        item.classList.add("SortHide");
      }
    });
  }
}
let Fetch = new feetch(1);

purchase.li();
document.querySelectorAll(".zavoz .createLi").forEach((item, i) => {
  item.addEventListener("click", function () {
    purchase.CreateLi(
      item,
      document.querySelectorAll(".zavoz .liName")[i].innerHTML
    );
  });
});
document.querySelector("#fetch").addEventListener("click", function () {
  Fetch.postFetch();
});
document
  .querySelector("#searchPurchase")
  .addEventListener("input", function () {
    purchase.searchInput(this.value);
  });

document.querySelectorAll(".inputFix").forEach((item) => {
  item.disabled = true;
});
document.querySelectorAll(".btnFix").forEach(function (item) {
  item.disabled = true;
});
document.querySelector("#fixedTrue").addEventListener("click", function () {
  document.querySelectorAll(".inputFix").forEach((item) => {
    if (item.disabled) {
      item.disabled = false;
    } else {
      item.disabled = true;
    }
  });
  document.querySelectorAll(".btnFix").forEach((item) => {
    if (item.disabled) {
      item.disabled = false;
    } else {
      item.disabled = true;
    }
  });
});

let put = async (number) => {
  let data = {
    id: document.querySelectorAll(".skladSSS")[number].dataset.id,
    name: document.querySelectorAll(".purchaseName")[number].innerText,
    lastPrise: document.querySelectorAll(".purchaseLastPrise")[number].value,
    firstPrise: document.querySelectorAll(".purchaseLast input")[number].value,
    type: document.querySelectorAll(".purchaseType")[number].value,
    que: document.querySelectorAll(".purchaseQue")[number].value,
  };
  console.log(data);
  let response = await fetch("/fixed", {
    method: "PUT",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
      //"Content-Type": "application/x-www-form-urlencoded",
    },
  });
  let json = await response.json();
  console.log(json);
};
document.querySelectorAll(".btnFix").forEach(function (item, i) {
  item.addEventListener("click", function () {
    put(i);
  });
});
