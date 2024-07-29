// load user from API

const Base_URL = 'http://localhost:8000'

window.onload = async() => {
    loadData()
}

const loadData = async() => {
    const response = await axios.get(`${Base_URL}/users`)
    console.log(response.data)
    const userDOM = document.getElementById('users')
    let htmlData = '<div>'
    for (let i=0; i<response.data.length; i++) {
        let user = response.data[i]
        htmlData += `<div>
            ${user.firstname} ${user.lastname} 
            <a href="index.html?id=${user.id}"><button>Edit</button></a> 
            <button class="delete" data-id=${user.id}>Delete</button>
            </div>
        `
        // edit button use 'query params' technique
        // delete button use 'event target dataset' technique
    }
    htmlData += '</div>'
    userDOM.innerHTML = htmlData
    //button class delete
    const deleteDOM = document.getElementsByClassName('delete')
    console.log(deleteDOM)
    for (i=0; i< deleteDOM.length ; i++) {
        deleteDOM[i].addEventListener('click',async (event) => {
            //get id  // dataset <-> data-id 
            const id = event.target.dataset.id  
            try {
                await axios.delete(`${Base_URL}/user/${id}`)
                loadData()
            } catch (error) {
                console.log('error' , error)
            }

        })
    }
}



// let loaded user to html
