const inputBox = document.getElementById('inputBox');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
document.addEventListener("DOMContentLoaded", function () {
    loadTodos();
    loadExpenses();
    loadLendBorrow();
});

let editTodo = null;

// Function to add todo
const addTodo = () => {
    const inputText = inputBox.value.trim();
    if (inputText.length <= 0) {
        alert("You must write something in your to do");
        return false;
    }

    if (addBtn.value === "Edit") {
        // Passing the original text to editLocalTodos function before edit it in the todoList
        editLocalTodos(editTodo.target.previousElementSibling.innerHTML);
        editTodo.target.previousElementSibling.innerHTML = inputText;
        addBtn.value = "Add";
        inputBox.value = "";
    }
    else {
        //Creating p tag
        const li = document.createElement("li");
        const p = document.createElement("p");
        p.innerHTML = inputText;
        li.appendChild(p);


        // Creating Edit Btn
        const editBtn = document.createElement("button");
        editBtn.innerText = "Edit";
        editBtn.classList.add("btn", "editBtn");
        li.appendChild(editBtn);

        // Creating Delete Btn
        const deleteBtn = document.createElement("button");
        deleteBtn.innerText = "Remove";
        deleteBtn.classList.add("btn", "deleteBtn");
        li.appendChild(deleteBtn);

        todoList.appendChild(li);
        inputBox.value = "";

        saveLocalTodos(inputText);
    }
}

// Function to update : (Edit/Delete) todo
const updateTodo = (e) => {
    if (e.target.innerHTML === "Remove") {
        todoList.removeChild(e.target.parentElement);
        deleteLocalTodos(e.target.parentElement);
    }

    if (e.target.innerHTML === "Edit") {
        inputBox.value = e.target.previousElementSibling.innerHTML;
        inputBox.focus();
        addBtn.value = "Edit";
        editTodo = e;
    }
}

// Function to save local todo
const saveLocalTodos = (todo) => {
    let todos;
    if (localStorage.getItem("todos") === null) {
        todos = [];
    }
    else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }
    todos.push(todo);
    localStorage.setItem("todos", JSON.stringify(todos));
}

// Function to get local todo
const getLocalTodos = () => {
    let todos;
    if (localStorage.getItem("todos") === null) {
        todos = [];
    }
    else {
        todos = JSON.parse(localStorage.getItem("todos"));
        todos.forEach(todo => {

            //Creating p tag
            const li = document.createElement("li");
            const p = document.createElement("p");
            p.innerHTML = todo;
            li.appendChild(p);


            // Creating Edit Btn
            const editBtn = document.createElement("button");
            editBtn.innerText = "Edit";
            editBtn.classList.add("btn", "editBtn");
            li.appendChild(editBtn);

            // Creating Delete Btn
            const deleteBtn = document.createElement("button");
            deleteBtn.innerText = "Remove";
            deleteBtn.classList.add("btn", "deleteBtn");
            li.appendChild(deleteBtn);

            todoList.appendChild(li);
        });
    }
}

// Function to delete local todo
const deleteLocalTodos = (todo) => {
    let todos;
    if (localStorage.getItem("todos") === null) {
        todos = [];
    }
    else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }

    let todoText = todo.children[0].innerHTML;
    let todoIndex = todos.indexOf(todoText);
    todos.splice(todoIndex, 1);
    localStorage.setItem("todos", JSON.stringify(todos));
    // Array functions : slice / splice
    console.log(todoIndex);
}

const editLocalTodos = (todo) => {
    let todos = JSON.parse(localStorage.getItem("todos"));
    let todoIndex = todos.indexOf(todo);
    todos[todoIndex] = inputBox.value;
    localStorage.setItem("todos", JSON.stringify(todos));
}

document.addEventListener('DOMContentLoaded', getLocalTodos);
addBtn.addEventListener('click', addTodo);
todoList.addEventListener('click', updateTodo); 

/* ---------------- NAVBAR FUNCTIONALITY ---------------- */
window.addEventListener("scroll", function () {
    let navbar = document.querySelector("header");
    if (window.scrollY > 50) {
        navbar.style.background = "#222";
    } else {
        navbar.style.background = "rgba(0, 0, 0, 0.8)";
    }
});

/* ---------------- SMOOTH SCROLLING ---------------- */
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener("click", function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute("href")).scrollIntoView({
            behavior: "smooth"
        });
    });
});

/* ---------------- LEND/BORROW TRACKER ---------------- */
function addLendBorrow() {
    let person = document.getElementById("personName").value;
    let amount = parseFloat(document.getElementById("lendAmount").value);
    let type = document.getElementById("lendType").value;
    let lendList = document.getElementById("lendList");

    if (person === "" || isNaN(amount) || amount <= 0) {
        alert("Enter valid lend/borrow details!");
        return;
    }

    let li = document.createElement("li");
    li.innerHTML = `${person} - ₹${amount} <span>(${type})</span>
        <button class="delete" onclick="deleteLendBorrow(this)">❌</button>`;
    
    lendList.appendChild(li);
    saveLendBorrow();
}

function deleteLendBorrow(button) {
    button.parentElement.remove();
    saveLendBorrow();
}

function saveLendBorrow() {
    let lendList = document.getElementById("lendList").innerHTML;
    localStorage.setItem("lendBorrow", lendList);
}

function loadLendBorrow() {
    let savedLendBorrow = localStorage.getItem("lendBorrow");
    if (savedLendBorrow) {
        document.getElementById("lendList").innerHTML = savedLendBorrow;
    }
}


/* ---------------- EXPENSE TRACKER ---------------- */

const balance = document.getElementById("balance");
const money_plus = document.getElementById("money-plus");
const money_minus = document.getElementById("money-minus");
const list = document.getElementById("list");
const form = document.getElementById("form");
const text = document.getElementById("text");
const amount = document.getElementById("amount");

const localStorageTransactions = JSON.parse(
    localStorage.getItem("transactions")
);

let transactions =
    localStorage.getItem("transactions") !== null
        ? localStorageTransactions
        : [];

// Add Transactions
function addTransaction(e) {
    e.preventDefault();

    if (text.value.trim() === "" || amount.value.trim() === "") {
        alert("Please add a expense and amount");
    } else {
        const transaction = {
            id: generateId(),
            text: text.value,
            amount: +amount.value,
        };

        transactions.push(transaction);

        addTransactionToDOM(transaction);

        updateLocalStoarge();

        updateValues();

        text.value = "";
        amount.value = "";
    }
}

// Add Transactions To The DOM List
function addTransactionToDOM(transaction) {
    // Get the sign plus or minus
    const sign = transaction.amount < 0 ? "-" : "+";
    const item = document.createElement("li");

    // Add classes based on the value
    item.classList.add(transaction.amount < 0 ? "minus" : "plus");
    item.innerHTML = `
        ${transaction.text} <span>${sign}${Math.abs(
        transaction.amount
    )}</span> <button class="delete-btn" onClick="removeTransaction(${
        transaction.id
    })">x</button>
    `;
    list.appendChild(item);
}

// Update the balance, income and expenses
function updateValues() {
    const amounts = transactions.map((transaction) => transaction.amount);
    const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
    const income = amounts
        .filter((item) => item > 0)
        .reduce((acc, item) => (acc += item), 0)
        .toFixed(2);
    const expense = (
        amounts
            .filter((item) => item < 0)
            .reduce((acc, item) => (acc += item), 0) * -1
    ).toFixed(2);

    balance.innerText = `${total}`;
    money_plus.innerText = `$${income}`;
    money_minus.innerText = `$${expense}`;
}

// Delete The Transactions by ID
function removeTransaction(id) {
    transactions = transactions.filter((transaction) => transaction.id !== id);

    updateLocalStoarge();

    init();
}

// Update The Local Storage
function updateLocalStoarge() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Initialize the App
function init() {
    list.innerHTML = "";

    transactions.forEach(addTransactionToDOM);
    updateValues();
}

init();

// Generate a Random ID
function generateId() {
    return Math.floor(Math.random() * 100000000);
}

form.addEventListener("submit", addTransaction);


