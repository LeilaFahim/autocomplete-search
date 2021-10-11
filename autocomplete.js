const searchInput = document.querySelector(".search__input");
const searchIcon = document.querySelector(".search-icon");
const clearIcon = document.querySelector(".clear-icon");
const historyList = document.querySelector(".history-list");
const suggestionListContainer = document.querySelector(
  ".suggestion__list-container"
);
const historyListContainer = document.querySelector(".history__list-container");
let historyArray = [];
let timeOut = null;

const createHistoryList = (selectedItem) => {
  let IsRepetitive = false;

  searchInput.value = selectedItem;

  historyListContainer.classList.remove("hide");

  if (historyArray.length) {
    IsRepetitive = historyArray.includes(selectedItem);
  }

  if (!IsRepetitive) {
    historyArray.push(selectedItem);

    const newItem = `
        <li class="search__list-item search__list-item--inline history-item">
          <span class="history-title">${selectedItem}</span>
          <div>
            <time class="search__text">${new Date().toLocaleString()}</time>
            <button>
              <img
                class="search__icon search__icon--small clear-item"
                src="./icons/delete-2.png"
                alt="search-icon"
              />
            </button>
          </div>
        </li>`;
    historyList.innerHTML += newItem;
  }
};

const onClearHistory = () => {
  for (let item of document.querySelectorAll(".history-item")) {
    item.remove();
  }

  historyArray = [];
  historyListContainer.classList.add("hide");
};

const clearHistoryItem = (listItem, listItemTitle) => {
  listItem.remove();
  historyArray = historyArray.filter((item) => item !== listItemTitle);

  if (!historyArray.length) historyListContainer.classList.add("hide");
};

const createSuggestionList = (data) => {
  suggestionListContainer.classList.remove("hide");

  if (data.length) {
    const list = `<ul class="search__list suggestion-list"></ul>`;
    suggestionListContainer.innerHTML += list;

    data.map(({ name }) => {
      const newItem = `
        <li class="search__list-item">
          <span class="suggestion-title">${name}</span>
        </li>`;
      const container = document.querySelector(".suggestion-list");
      container.innerHTML += newItem;
    });
  } else {
    const list = `
          <ul class="search__list suggestion-list">
            <li><span>Unfortunately no results found</span></li>
          </ul>`;
    suggestionListContainer.innerHTML += list;
  }
};

const removeSuggestionList = () => {
  suggestionListContainer.classList.add("hide");
  if (document.querySelector(".suggestion-list"))
    document.querySelector(".suggestion-list").remove();
};

const fetchData = (value) => {
  const spinner = document.querySelector(".spinner-icon");
  spinner.classList.remove("hide");

  fetch(`https://gorest.co.in/public/v1/users?name=${value}`)
    .then((response) => response.json())
    .then(({ data }) => {
      spinner.classList.add("hide");
      removeSuggestionList();
      createSuggestionList(data);
    })
    .catch((error) => console.warn(error));
};

const showSearchIcon = () => {
  clearIcon.classList.add("hide");
  searchIcon.classList.remove("hide");
};

const onInputChange = (event) => {
  const inputValue = searchInput.value.trim();

  if (inputValue) {
    clearIcon.classList.remove("hide");
    searchIcon.classList.add("hide");

    clearTimeout(timeOut);

    if (
      (event.keyCode > 48 && event.keyCode < 90) ||
      (event.keyCode > 96 && event.keyCode < 105) ||
      event.keyCode === 8
    )
      timeOut = setTimeout(() => fetchData(inputValue), 500);
  } else {
    showSearchIcon();
  }
};

const onClearClick = () => {
  searchInput.value = "";
  showSearchIcon();
  removeSuggestionList();
};

searchInput.addEventListener("keyup", (event) => onInputChange(event));

clearIcon.addEventListener("click", onClearClick);

document.addEventListener("click", (event) => {
  if (event.target.classList.contains("suggestion-title")) {
    createHistoryList(event.target.innerHTML);
  }

  if (event.target.classList.contains("clear-history")) {
    onClearHistory();
  }

  if (event.target.classList.contains("clear-item")) {
    clearHistoryItem(
      event.target.closest(".search__list-item--inline"),
      event.target.closest(".search__list-item--inline").firstChild.nextSibling
        .innerHTML
    );
  }
});
