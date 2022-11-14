let employees = [];
const urlAPI = `https://randomuser.me/api/?results=12&inc=name, picture,
email, location, phone, dob &noinfo &nat=US`;
const gridContainer = document.querySelector(".grid-container");
const overlay = document.querySelector(".overlay");
const modalContainer = document.querySelector(".modal-content");
const modalClose = document.querySelector(".modal-close");

fetch(urlAPI)
  .then((res) => res.json())
  .then(displayEmployees)
  .catch((err) => console.log(err));

function displayEmployees(employeeData) {
  employees = employeeData.results;
  // store the employee HTML as we create it
  let employeeHTML = "";
  // loop through each employee and create HTML markup
  employees.forEach((employee, index) => {
    let name = employee.name;
    let email = employee.email;
    let city = employee.location.city;
    let picture = employee.picture;
    // template literals make this so much cleaner!
    employeeHTML += `
        <div class="card" data-index="${index}">
          <img class="avatar" src="${picture.large}" />
          <div class="text-container">
            <h2 class="name">${name.first} ${name.last}</h2>
            <p class="email">${email}</p>
            <p class="address">${city}</p>
          </div>
        </div>
  `;
  });
  gridContainer.innerHTML = employeeHTML;
}

function displayModal(index) {
  // use object destructuring make our template literal cleaner
  let {
    name,
    dob,
    /*     year = dob.slice(0,4),
     month = dob.slice(5,7),
    day = dob.slice(8,10), */
    phone,
    email,
    location: { city, street, state, postcode },
    picture,
  } = employees[index];

  let date = new Date(dob.date);

  const modalHTML = `
      <img class="avatar" src="${picture.large}" />
      <div class="text-container">
        <h2 class="name">${name.first} ${name.last}</h2>
        <p class="email">${email}</p>
        <p class="address">${city}</p>
        <hr />
        <p>${phone}</p>
        <p class="address">${street.number} ${
    street.name
  }, ${state} ${postcode}</p>
        <p>Birthday:
  ${date.getMonth()}/${date.getDate()}/${date.getFullYear()}</p>
      </div>
  `;
  overlay.classList.remove("hidden");
  modalContainer.innerHTML = modalHTML;
}

// ● Event Listeners
// ○ gridContainer click event

// ■ Check if the grid container itself was clicked, or a child element.

// ■ Use the closest() function to find the correct card that was clicked
// ■ Get the data-index attribute from the card to pass to the displayModal , and pass in the card index.
// ■ Call and pass in the card index.

// gridContainer.addEventListener('click', e => {
// make sure the click is not on the gridContainer itself
// select the card element based on its proximity to actual element clicked
gridContainer.addEventListener("click", (e) => {
  // make sure the click is not on the gridContainer itself
  if (e.target !== gridContainer) {
    const card = e.target.closest(".card");
    index = card.getAttribute("data-index");
    displayModal(index);
  }
});
modalClose.addEventListener("click", () => {
  overlay.classList.add("hidden");
});

const popup = document.getElementById("popcard");
function openPopup() {
  popup.classList.add("open-popup");
}
function closePopup() {
  popup.classList.remove("open-popup");
}

const leftArrow = document.querySelector(".arrow-left");
const rightArrow = document.querySelector(".arrow-right");

leftArrow.addEventListener("click", () => {
  if (index != 11) {
    index = Number.parseInt(index, 10) + 1;
    displayModal(index);
  } else {
    index = 0;
    displayModal(0);
  }
});

rightArrow.addEventListener("click", () => {
  if (index != 0) {
    index = Number.parseInt(index, 10) - 1;
    displayModal(index);
  } else {
    index = 11;
    displayModal(11);
  }
});

const input = document.getElementById("search-input");
input.addEventListener("keyup", searchEmployees);

function searchEmployees() {
  filterVal = document.getElementById("search-input").value.toLowerCase();
  let anchors = document.querySelectorAll(".card .name");

  for (let i = 0; i < anchors.length; i++) {
    let captions = anchors[i].innerHTML.toLowerCase();
    let filter = captions.includes(filterVal);

    if (filter === true) {
      anchors[i].parentNode.parentNode.style.display = "flex";
    } else {
      anchors[i].parentNode.parentNode.style.display = "none";
    }
  }
}

