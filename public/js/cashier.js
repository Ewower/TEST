let cashier = {
  arr: [],
  createObj: function (card) {
    let obj = {
      name: card.childNodes[1].innerHTML,
      fistPrise: parseInt(card.childNodes[3].innerHTML),
      que: 1,
      discont: 0,
      lastPrise: parseInt(card.childNodes[3].innerHTML),
      id: card.dataset.id,
    };
    if (this.arr.find((item) => item.id == obj.id)) {
      this.arr.find((item) => item.id == obj.id).que =
        parseInt(this.arr.find((item) => item.id == obj.id).que) + 1;
    } else {
      this.arr.push(obj);
    }

    try {
      let itog = 0;
      this.arr.forEach((item) => {
        itog += item.que * item.lastPrise;
      });
      document.querySelector("#itog").innerText = itog;
    } catch (e) {
      console.log(e);
    }
    this.list();
    this.setLocas();
  },
  list: function () {
    let cashierList = this.arr;
    let listen = [
      `
    <div class="row">
        <div class="col-5 border">
            Название
        </div>
        <div class="col-2 border text-center">
            Цена
        </div>
        <div class="col-1 border text-center">
            Кол
        </div>
        <div class="col-1 border text-center">
            %
        </div>
        <div class="col-2 border text-center">
            Итог
        </div>
        <div class="col-1 border text-center">
            <button class="btn btn-dark"><i class="fas fa-times"></i></button>
        </div>
    </div>
    `,
    ];
    cashierList.forEach((item) => {
      item = `
    <div class="row" data-id=${item.id}>
        <div class="col-5 border aligin-self-center">
            <p>${item.name}</p>
        </div>
        <div class="col-2 border text-center">
            <p class='d-block text-center'>${item.fistPrise}</p>
        </div>
        <div class="col-1 border text-center">
            <input type="text" class="p-0 text-center form-control queInput bg-light" value=${item.que}>
        </div>
        <div class="col-1 border text-center">
            <input type="text" class="p-0 text-center form-control bg-light queDicont" value="${item.discont}">
        </div>
        <div class="col-2 border text-center text-middle">
            <p class='d-block'>${item.lastPrise}</p>
        </div>
        <div class="col-1 border text-center">
            <button class="btn btn-dark delete"><i class="fas fa-times"></i></button>
        </div>
    </div>    
    `;
      listen.push(item);
    });
    listen = listen.join("");
    document.querySelector("#check ").innerHTML = listen;
    this.fixed();
  },
  fixed: function () {
    document.querySelectorAll("#check .queInput").forEach((item) => {
      item.addEventListener("keyup", () => {
        let id = item.parentNode.parentNode.dataset.id;
        this.arr.find((elem) => elem.id == id).que = item.value;
        let items = this.arr.find((elem) => elem.id == id);
        if (items.discont == 100) {
          items.lastPrise = 0;
        } else {
          items.lastPrise =
            (items.fistPrise - (items.discont / 100) * items.fistPrise) *
            items.que;
        }
        this.setLocas();
        this.list();
      });
    });
    document.querySelectorAll("#check .queDicont").forEach((item) => {
      item.addEventListener("input", () => {
        let id = item.parentNode.parentNode.dataset.id;
        this.arr.find((elem) => elem.id == id).discont = item.value;
        let items = this.arr.find((elem) => elem.id == id);
        if (items.discont == 100) {
          items.lastPrise = 0;
        } else {
          items.lastPrise =
            (items.fistPrise - (items.discont / 100) * items.fistPrise) *
            items.que;
        }
        this.setLocas();
        this.list();
      });
    });
    document.querySelectorAll("#check .delete").forEach((item) => {
      item.addEventListener("click", () => {
        let id = item.parentNode.parentNode.dataset.id;
        let i = this.arr.findIndex((elems) => elems.id == id);
        this.arr.splice(i, 1);
        item.parentNode.parentNode.remove();
        this.setLocas();
        try {
          let itog = 0;
          let arr = JSON.parse(localStorage.getItem("cashier"));
          arr.forEach((item) => {
            itog += item.que * item.lastPrise;
          });
          document.querySelector("#itog").innerText = itog;
        } catch (e) {
          console.log(e);
        }
      });
    });
    try {
      let itog = 0;
      let arr = JSON.parse(localStorage.getItem("cashier"));
      arr.forEach((item) => {
        itog += item.que * item.lastPrise;
      });
      document.querySelector("#itog").innerText = itog;
    } catch (e) {
      console.log(e);
    }
  },
  setLocas: function () {
    localStorage.setItem("cashier", JSON.stringify(this.arr));
  },
  postFetch: async function () {
    let itog = 0;
    this.arr.forEach((item) => {
      itog += item.lastPrise;
    });
    let data = {
      seller: document.querySelector("#worker").value,
      comment: document.querySelector("#comment").value,
      product: this.arr,
      date: new Date(),
      type: document.querySelector("#types").value,
      worker: document.querySelector("#worker").value,
      itog: itog,
    };
    let response = await fetch("/cashier", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        //"Content-Type": "application/x-www-form-urlencoded",
      },
    });
  },
  sorting: function (str) {
    let card = document.querySelectorAll(".card");
    console.log(str);
    card.forEach((item) => {
      if (item.dataset.type == str) {
        item.classList.remove("hideType");
      } else {
        item.classList.add("hideType");
        console.log(2);
      }
    });
  },
};

if (localStorage.getItem("cashier")) {
  cashier.arr = JSON.parse(localStorage.getItem("cashier"));
  cashier.list();
}

document.querySelector("#search").addEventListener("input", function () {
  let input = document.querySelector("#search").value.toLowerCase();

  let list = document.querySelectorAll(".card .names");

  if (input != " " || input != "") {
    list.forEach((item) => {
      if (item.innerHTML.toLowerCase().indexOf(input) > -1) {
        if (!item.parentNode.classList.contains("SortHide")) {
          item.parentNode.classList.remove("hide");
        }
      } else {
        item.parentNode.classList.add("hide");
      }
    });
  } else {
    list.forEach((item) => {
      item.parentNode.classList.add("hide");
    });
  }
});
document.querySelectorAll(".card").forEach((item) => {
  item.addEventListener("click", () => {
    cashier.createObj(item);
  });
});
document.querySelector("#fetch").addEventListener("click", function () {
  cashier.postFetch();
});
document.querySelector("#fetch").addEventListener("click", function () {
  cashier.arr = [];
  cashier.setLocas();
  cashier.list();
});
let sort = document.querySelector("#sort");
sort.onchange = function () {
  cashier.sorting(this.value);
};
document.querySelector(".closeCheck").addEventListener("click", function () {
  document.querySelector("#checks").style.display = "none";
});
// document.querySelector("#openClose").addEventListener("click", function () {
//   document.querySelector("#checks").style.display = "block";
// });
