// * Get the necessary DOM elements
const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const clearBtn = document.querySelector('.btn-clear');
const itemFilter = document.getElementById('filter');
const formBtn = document.querySelector('.btn');
let isEditMode = false;

// * Display the items from local storage on page load
function displayItems() {
  const itemsFromStorage = getItemsFromStorage();
  itemsFromStorage.forEach((item) => {
    addItemToDOM(item);
  });

  resetUI();
}

// * Add items to the list via the form

function onAddItemSubmit(event) {
  event.preventDefault();

  const newItem = itemInput.value.trim();

  // ? Validate Input
  if (newItem === '') {
    alert('Please add an item');
    return;
  }

  // ? Check for edit mode
  if (isEditMode) {
    const itemToEdit = itemList.querySelector('.edit-mode');

    removeItemFromStorage(itemToEdit.textContent);
    itemToEdit.classList.remove('edit-mode');
    itemToEdit.remove();
    isEditMode = false;
  } else {
    if (checkIfItemExists(newItem)) {
      alert('That item already exists!');
      return;
    }
  }

  // ? Create item DOM element
  addItemToDOM(newItem);

  // ? Add item to local storage
  addItemToStorage(newItem);

  resetUI();

  // itemInput.value = '';
}

function addItemToDOM(item) {
  // ? Create list item
  const li = document.createElement('li');
  li.appendChild(document.createTextNode(item));

  const button = createButton('remove-item btn-link text-red');
  li.appendChild(button);

  // ? Add li to the DOM
  itemList.appendChild(li);
}

function createButton(classes) {
  const button = document.createElement('button');
  button.className = classes;

  const icon = createIcon('fa-solid fa-xmark');
  button.appendChild(icon);

  return button;
}

function createIcon(classes) {
  const icon = document.createElement('i');
  icon.className = classes;
  return icon;
}

// * Remove items from the list by clicking the "X" button

// ? This function is a event handler for the click event
function onClickItem(event) {
  if (event.target.parentElement.classList.contains('remove-item')) {
    removeItem(event.target.parentElement.parentElement);
  } else {
    setItemToEdit(event.target);
  }
}

function removeItem(item) {
  if (confirm('Are you sure?')) {
    // ? Remove item from DOM
    item.remove();
  }

  // ? Remove item from local storage
  removeItemFromStorage(item.textContent);
}

// * Clear all of the items from the list with the "Clear All" button

function clearItems() {
  while (itemList.firstChild) {
    itemList.removeChild(itemList.firstChild);
  }

  // ? Clear from local storage
  localStorage.removeItem('items');
  // ? this will clear everything in local storage
  // localStorage.clear();
}

// * Filter the items by typing into the filter input field

function filterItems(event) {
  const items = itemList.querySelectorAll('li');
  const text = event.target.value.toLowerCase();

  items.forEach((item) => {
    const itemName = item.firstChild.textContent.toLowerCase();

    if (itemName.indexOf(text) != -1) {
      item.style.display = 'flex';
    } else {
      item.style.display = 'none';
    }
  });
}

// * Add localStorage functionality to persist the list

function getItemsFromStorage() {
  let itemsFromStorage;
  if (localStorage.getItem('items') === null) {
    itemsFromStorage = [];
  } else {
    itemsFromStorage = JSON.parse(localStorage.getItem('items'));
  }

  return itemsFromStorage;
}

function addItemToStorage(item) {
  const itemsFromStorage = getItemsFromStorage();

  // ? Add new item to array
  itemsFromStorage.push(item);

  // ? Convert to JSON string and set to local storage
  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function removeItemFromStorage(item) {
  let itemsFromStorage = getItemsFromStorage();

  // ? Filter out item to be removed
  itemsFromStorage = itemsFromStorage.filter((i) => i !== item);

  // ? Re-set to localStorage
  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

// * Click on an item to put the text into the input field and change the button to "Update"
// * Update an item by clicking the "Update" button

function setItemToEdit(item) {
  isEditMode = true;
  itemList
    .querySelectorAll('li')
    .forEach((i) => i.classList.remove('edit-mode'));

  item.classList.add('edit-mode');
  formBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Update Item';
  formBtn.style.backgroundColor = '#228B22';
  itemInput.value = item.textContent;
}

// * Add validation and check to see if the item already exists in localStorage

function checkIfItemExists(item) {
  const itemsFromStorage = getItemsFromStorage();
  return itemsFromStorage.includes(item);
}

// * Check the UI and update the display of certain elements based on the number of items.

function resetUI() {
  itemInput.value = '';
  const items = itemList.querySelectorAll('li');

  if (items.length === 0) {
    clearBtn.style.display = 'none';
    itemFilter.style.display = 'none';
  } else {
    clearBtn.style.display = 'block';
    itemFilter.style.display = 'block';
  }

  formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
  formBtn.style.backgroundColor = '#333';

  isEditMode = false;
}

// * Initialize the application
function init() {
  // ? Event Listeners
  itemForm.addEventListener('submit', onAddItemSubmit);
  itemList.addEventListener('click', onClickItem);
  clearBtn.addEventListener('click', clearItems);
  itemFilter.addEventListener('input', filterItems);
  document.addEventListener('DOMContentLoaded', displayItems);

  resetUI();
}

init();
