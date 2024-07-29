const Base_URL = 'http://localhost:8000'

let mode = 'CREATE' //default
let selectedID = ''

window.onload = async() => {
  //get query params
  const urlParams = new URLSearchParams(window.location.search)
  console.log(urlParams)
  const id = urlParams.get('id')
  console.log(id)
  if (id) {
    mode = 'EDIT'
    selectedID = id
    //1. pull formal user data
    try{
      const response = await axios.get(`${Base_URL}/user/${id}`)
      console.log(response.data)
      users = response.data
      let firstNameDOM = document.querySelector("input[name=firstname]");
      let lastNameDOM = document.querySelector("input[name=lastname]");
      let ageDOM = document.querySelector("input[name=age]");
      let descriptionDOM = document.querySelector("textarea[name=description]");
      firstNameDOM.value = users.firstname
      lastNameDOM.value = users.lastname
      ageDOM.value = users.age
      descriptionDOM.value = users.description

      let genderDOM = document.querySelector("input[name=gender]") ;
      let interestDOMs = document.querySelectorAll("input[name=interest]");
      for(i=0; i<genderDOM.length; i++){
        if (genderDOM[i].value == users.gender) {
          genderDOM[i].checked = true
        }
      }
      for(i=0; i<interestDOMs.length; i++){
        if (users.interests.includes(interestDOMs[i].value)) {
          interestDOMs[i].checked = true
        }
      }

    } catch (error) {
      console.log('error',error)
    }

    //2. put formal user data to input
  }
}

const validateData = (userData) => {
  let errors = [];
  if (!userData.firstname) {
    errors.push("กรุณาใส่ชื่อ");
  }
  if (!userData.lastname) {
    errors.push("กรุณาใส่นามสกุล");
  }
  if (!userData.age) {
    errors.push("กรุณาใส่อายุ");
  }
  if (!userData.gender) {
    errors.push("กรุณาใส่เพศ");
  }
  if (!userData.interests) {
    errors.push("กรุณาใส่ความสนใจ");
  }
  if (!userData.description) {
    errors.push("กรุณาใส่รายละเอียด");
  }
  return errors;
};

const submitData = async () => {
  let firstNameDOM = document.querySelector("input[name=firstname]");
  let lastNameDOM = document.querySelector("input[name=lastname]");
  let ageDOM = document.querySelector("input[name=age]");

  let genderDOM = document.querySelector("input[name=gender]:checked") || {};
  let interestDOMs = document.querySelectorAll("input[name=interest]:checked") || {};
  let messageDOM = document.getElementById("message");
  let descriptionDOM = document.querySelector("textarea[name=description]");

  try {
    let interest = "";
    for (let i = 0; i < interestDOMs.length; i++) {
      interest += interestDOMs[i].value;
      if (i != interestDOMs.length - 1) {
        interest += ", ";
      }
    }

    let userData = {
      firstname: firstNameDOM.value,
      lastname: lastNameDOM.value,
      age: ageDOM.value,
      gender: genderDOM.value,
      description: descriptionDOM.value,
      interests: interest,
    };

    console.log("submit data", userData);

    const errors = validateData(userData)
    if (errors.length > 0){
      //มี error
      throw {
        message : 'กรอกข้อมูลไม่ครบ',
        errors : errors
      }
    }
    let message = 'บันทึกข้อมูลเรียบร้อย'
    if (mode === 'CREATE'){
      const response = await axios.post(`${Base_URL}/user`, userData);
      console.log('response',response.data)
    } else {
      const response = await axios.put(`${Base_URL}/user/${selectedID}`, userData);
      console.log('response',response.data)
      message = 'แก้ไขข้อมูลเรียบร้อย';
      messageDOM.className = "message success";
    }
    messageDOM.innerHTML = message;
    messageDOM.className = "message success";


  } catch (error) {
    console.log('message', error.message)
    console.log('error', error.errors)
    if (error.response) {
      console.log(error.response);
      error.message = error.response.data.message
      error.errors = error.response.data.errors
    }
    let htmlData = '<div>'
    htmlData += `<div>${error.message}</div>`
    htmlData += '</div>'
    htmlData += '<ul>'
    for (let i =0; i< error.errors.length; i++){
      htmlData += `<li>${error.errors[i]}</li>`
    }
    htmlData += '</ul>'
    htmlData += '</div>';
    messageDOM.innerHTML = htmlData;
    messageDOM.className = "message danger";
    console.log(error.response)
  }
};
