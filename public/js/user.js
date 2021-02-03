document
  .querySelector("#createUser")
  .addEventListener("click", async function () {
    try {
      let data = {
        name: document.querySelector("#UserName").value.toLowerCase(),
        password: document.querySelector("#UserPassword").value.toLowerCase(),
        status: document.querySelector("#UserStatus").value,
      };
      //document.querySelector("#UserStatus").value
      let Fetch = await fetch("/auth/createUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify(data),
      });
      let json = await Fetch.json();
      if (Fetch.ok) {
        document.querySelector("#UserName").value = "";
        document.querySelector("#UserPassword").value = "";
      }
    } catch (e) {
      console.log(e);
    }
  });
