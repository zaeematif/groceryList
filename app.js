// ****** SELECT ITEMS **********
const alert = document.querySelector(".alert")
const form = document.querySelector(".grocery-form")

//input of the grocery input
const grocery = document.getElementById("grocery")

const submitBtn = document.querySelector(".submit-btn");

//the container with the list & clear all button
const container = document.querySelector(".grocery-container")

//the container with the list of all items & edit-delete button
const list = document.querySelector(".grocery-list")

const clearBtn = document.querySelector(".clear-btn")




//EDIT OPTIONS 
let editElement
let editFlag = false
let editId = ''






// ****** EVENT LISTENERS **********
//sumbit button
form.addEventListener("submit", addItem)

clearBtn.addEventListener('click', clearItem)

window.addEventListener('DOMContentLoaded', loadAllItems())








// ****** FUNCTIONS **********

function addItem(e){
    e.preventDefault()
    const value = grocery.value
    const id = new Date().getTime().toString()

    if(value && !editFlag){
        createListItems(id, value)

        //display alert
        displayAlert('Item Added to List', 'success')

        //show container
        container.classList.add('show-container')

        //add to local Storage
        addToLocalStorage(id, value)

        //set to default
        setToDefault()
    }
    //editing the items
    else if(value && editFlag){
        editElement.innerHTML = value
        displayAlert('Value Changed', 'success')

        editFromLocalStorage(editId, value)

        setToDefault()
    }
    //no value entered
    else{
        displayAlert('Empty Value', 'danger')
    }
}


//display Alert
function displayAlert(text, action){
    alert.textContent = text;
    alert.classList.add(`alert-${action}`)

    //remove alert
    setTimeout(function(){
        alert.textContent = '';
        alert.classList.remove(`alert-${action}`)
    }, 1000)
}

//clear all the items
function clearItem(){
    const items = document.querySelectorAll('.grocery-item')

    if(items.length > 0){
        items.forEach(function(it){
            list.removeChild(it)
        })

        container.classList.remove('show-container')
        displayAlert('Empty List', 'success')
        setToDefault()
        localStorage.removeItem('list')
    }
}


//delete item function
function deleteItem(e){
    const element = e.currentTarget.parentElement.parentElement
    const id = element.dataset.id
    list.removeChild(element)
    if(list.children.length === 0){
        container.classList.remove('show-container')
    }
    displayAlert('Item Deleted', 'danger')
    setToDefault()
    //remove from localStorage
    removeFromLocalStorage(id)
}

//edit item function
function editItem(e){
    const element = e.currentTarget.parentElement.parentElement
    editElement = e.currentTarget.parentElement.previousElementSibling;

    grocery.value = editElement.innerHTML

    editFlag = true
    editId = element.dataset.id
    submitBtn.textContent = 'Edit'
}

//set to default
function setToDefault(){
    grocery.value = ''
    editFlag = false
    editId = ''
    submitBtn.textContent = 'Submit'
}








// ****** LOCAL STORAGE **********
function getFromLocalStorage(){
    return localStorage.getItem('list')?JSON.parse(localStorage.getItem('list')):[]
}

function addToLocalStorage(id, value){
    const grocery = {id: id, value: value}
    let item = getFromLocalStorage()
    console.log(item)

    item.push(grocery)

    localStorage.setItem('list', JSON.stringify(item))
}


function removeFromLocalStorage(id){
    let items = getFromLocalStorage()

    items = items.filter(function(it){
        if(it.id !== id){
            return it;
        }
    })

    localStorage.setItem('list', JSON.stringify(items))

}

function editFromLocalStorage(id, value){
    //local storage API
    //set item
    //get item
    //remove item
    //save as strings
    
    let items = getFromLocalStorage()
    items = items.map(function(it){
        if(it.id === id){
            it.value = value
        }
        return it;
    })

    localStorage.setItem('list', JSON.stringify(items))
}






// ****** SETUP ITEMS **********
function loadAllItems(){
    let items = getFromLocalStorage()
    if(items.length > 0){
        items.forEach(function(it){
            createListItems(it.id, it.value)
        })

        container.classList.add('show-container')
    }

}

function createListItems(id, value){
        const element = document.createElement('article')
        //add class
        element.classList.add('grocery-item')

        //add id
        const attr = document.createAttribute('data-id')
        attr.value = id

        //add attr to the element
        element.setAttributeNode(attr)
        element.innerHTML = `<p class="title">${value}</p>
                            <div class="button-container">
                            <button type="button" class="edit-btn">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button type="button" class="delete-btn">
                                <i class="fas fa-trash"></i>
                            </button>
                            </div>`

        //delete & edit button
        const deleteBtn = element.querySelector('.delete-btn')
        const editBtn = element.querySelector('.edit-btn')

        deleteBtn.addEventListener('click', deleteItem)
        editBtn.addEventListener('click', editItem)

        //append child
        list.appendChild(element);

}