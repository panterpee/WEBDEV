const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql2/promise')
const cors = require('cors')
const app = express()
const port = 8000

app.use(bodyParser.json())
app.use(cors())


let users = []
let counter = 1


// Route handler for getting all users   //promise type

// app.get('/testdb', (req, res) => {
//   mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: 'root',
//     database: 'tutorials',
//     port : 3306
//   }).then((conn) => {    // promise
//     conn
//     .query('SELECT * FROM users')
//     .then((results) => {
//       res.json(results[0])
//     })
//     .catch((error) => {
//       console.error('Error fetching users:', error.message)
//       res.status(500).json({ error: 'Error fetching users' })
//     })
//   })
// })

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

//async await type // conn function create ให้ server listen แล้วเชื่อมต่อ mySQL ทันที
let conn = null
const initMySQL = async() => {  
    conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'tutorials',
    port : 3306
  })
}

app.get('/testdb-new', async (req, res) => {
  try {
    //   const conn = await mysql.createConnection({
    //   host: 'localhost',
    //   user: 'root',
    //   password: 'root',
    //   database: 'tutorials',
    //   port : 3306
    // }) //
      const results = await conn.query('SELECT * FROM users')
      res.json(results[0])
  } catch (error) {
    console.error('Error fetching users:', error.message)
    res.status(500).json({ error: 'Error fetching users' })
  }
})

// app.get('/test', (req,res) =>{
//   let user = {
//     firstname: 'test',
//     lastname: ' nam',
//     age : 14 
//     }
//     res.json(user)
// })


/*
GET /users สำหรับ get users ทั้งหมดที่บันทึกเข้าไปออกมา
POST /users สำหรับการสร้าง users ใหม่บันทึกเข้าไป
GET /users/:id สำหรับการดึง users รายคนออกมา
PUT /users/:id สำหรับการแก้ไข users รายคน (ตาม id ที่บันทึกเข้าไป)
DELETE /users/:id สำหรับการลบ users รายคน (ตาม id ที่บันทึกเข้าไป)
*/


// path = GET /users
app.get('/users', async (req,res)=>{
  // const filterUsers = users.map(user =>{
  //   return {
  //         name :user.name,
  //         age :user.age ,
  //         id : user.id
  //       }
  // })
  // res.json(filterUsers)
  const results = await conn.query('SELECT * FROM users')
  res.json(results[0])
})
  // let filterUsers = []
  // for (let i=0 ; i<users.length ; i++){
  //   filterUsers.push({
  //     id : users[i].id,
  //     name : users[i].name,
  //     age : users[i].age,

  //   })
  // }
  // res.json(filterUsers)

// path = POST /user
app.post('/user', async (req,res)=>{
  try {
  let user = req.body
  console.log(user)

  const errors = validateData(user)
  if (errors.length > 0){
    throw {
      message : 'กรอกข้อมูลไม่ครบ',
      errors : errors
    }
  }
  const results = await conn.query('INSERT INTO users SET ?', user)
  // user.id = counter
  // counter++
  // users.push(user)
  // console.log ('users', users)
  // res.json({
  //   message : "add ok",
  //   user : user
  // })
  console.log('results', results)
  res.json({
    message : 'insert ok',
    data: results[0]
  })
} catch (error) {
  const errorMessage = error.message || "Something went wrong"
  const errors = error.errors || []
  console.log(error.message)
  res.status(500).json({ 
    message: errorMessage,
    errors: errors
   })
}
})

// path = GET /user/:id
app.get('/user/:id', async(req,res)=>{
  try {
    let id = req.params.id
    const results = await conn.query('SELECT * FROM users WHERE id = ?',id)
    if (results[0].length == 0){
    throw { statusCode: 404 , message : 'Not found'}
    // throw new Error('หาไม่เจอ')
  } else {
    // res.status(404).json({
    //   message : "Not found"
    // }) 
    res.json(results[0][0])
  }
  } catch (error) {
    let statusCode = error.statusCode || 500
    console.error(error.message)
    res.status(statusCode).json({
      message: "SOmething went wrong",
      errorMessage: error.message
    })
  }
  // let selectedIndex = users.findIndex(user => {
  //   return user.id == id
  // })
  // res.json(users[selectedIndex])

})

//path = PUT /user/:id
app.put('/user/:id', async(req,res)=>{
  // let id = req.params.id
  // let updateUser = req.body
  try {
    let id = req.params.id
    let updateUser = req.body
    const results = await conn.query('UPDATE users SET ? WHERE id = ?', [updateUser,id])
    res.json({
      message : 'user updated ok',
      data : results[0]
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message :'Something went wrong',
    })
  }

  // ------------------------------
  // let id = req.params.id
  // let updateUser = req.body

  // let selectedIndex = users.findIndex(user=>{
  //   return user.id == id
  //   -------------------------------
    // if (user.id == id) {
    //   return true 
    // }
    //   else {
    //     return false
    //   }
  // })
  // users[selectedIndex].name = updateUser.name || users[selectedIndex].name
  // users[selectedIndex].age = updateUser.age || users[selectedIndex].age
  // users[selectedIndex].gender = updateUser.gender || users[selectedIndex].gender
  // users[selectedIndex].id = users[selectedIndex].id  //ไม่ต้องมีก็ได้ id ไม่หาย เพราะกำหนดฟิลด์ name age แล้ว

  // res.json({
  //   message : "updated complete",
  //   data : {
  //     user : updateUser,
  //     indexUpdate : selectedIndex
  //   }
  // })
}) 

// path = PATCH /user/:id
app.patch('/user/:id', (req,res)=>{
  let updateUser = req.body
// หา user จาก id ที่ส่งมา
  let id = req.params.id
  let selectedIndex = users.findIndex(user=> user.id == id  )
// update user นั้น  
  if (updateUser.name) { users[selectedIndex].name = updateUser.name }
  if (updateUser.age) { users[selectedIndex].age = updateUser.age  }
  if (updateUser.gender) { users[selectedIndex].gender = updateUser.gender  }

  res.json({
    message : "updated complete",
    data : {
      user : updateUser,
      indexUpdate : selectedIndex
    }
  })
})

// path = DELETE /user/:id
app.delete('/user/:id', async(req,res)=>{
  try {
    let id = req.params.id
    const results = await conn.query('DELETE FROM users WHERE id = ?', [id])
    if (results[0].length ==0){
      throw { statusCode : 404 , message : "Not found ID"}
    } else {
      res.json({
        message : 'Delete OK',
        results : results[0],
      })
    }
  } catch (error){
    console.log(error)
    let statusCode = error.statusCode || 500
    res.status(statusCode).json({
      message : "Something Wrong",
      errorMessage : error.message
    })
  }
  // let id = req.params.id
  // //หา indext by id 
  // let selectedIndex = users.findIndex(user => user.id == id)
  // // delete users[selectedIndex]
  // users.splice(selectedIndex,1)

  // res.json({
  //   message : "delete completed",
  //   indexUpdate : selectedIndex
  // })

})

// The server will start and listen on port 8000, awaiting requests. 
// It will first initialize the MySQL connection before starting.
app.listen(port, async(req,res) =>{
  await initMySQL()
  console.log('http server run at '+ port)
})