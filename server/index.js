const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql2/promise')
const app = express()
const cors = require('cors')
app.use(bodyParser.json())
const port = 8000

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

// path = get /users

/*
GET /users สำหรับ get users ทั้งหมดที่บันทึกเข้าไปออกมา
POST /users สำหรับการสร้าง users ใหม่บันทึกเข้าไป
GET /users/:id สำหรับการดึง users รายคนออกมา
PUT /users/:id สำหรับการแก้ไข users รายคน (ตาม id ที่บันทึกเข้าไป)
DELETE /users/:id สำหรับการลบ users รายคน (ตาม id ที่บันทึกเข้าไป)
*/


// path = GET /users
app.get('/users', (req,res)=>{
  const filterUsers = users.map(user =>{
    return {
          name :user.name,
          age :user.age ,
          id : user.id
        }
  })
  res.json(filterUsers)
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
app.post('/user',(req,res)=>{
  let user = req.body
  user.id = counter
  counter++

  users.push(user)
  console.log ('users', users)
  res.json({
    message : "add ok",
    user : user
  })
})

// path = GET /user/:id
app.get('/user/:id', (req,res)=>{
  let id = req.params.id
  let selectedIndex = users.findIndex(user => {
    return user.id == id
  })
  res.json(users[selectedIndex])
})

//path = PUT /user/:id
app.put('/user/:id', (req,res)=>{
  let id = req.params.id
  let updateUser = req.body

  let selectedIndex = users.findIndex(user=>{
    return user.id == id
    // if (user.id == id) {
    //   return true 
    // }
    //   else {
    //     return false
    //   }
  })
  users[selectedIndex].name = updateUser.name || users[selectedIndex].name
  users[selectedIndex].age = updateUser.age || users[selectedIndex].age
  users[selectedIndex].gender = updateUser.gender || users[selectedIndex].gender
  // users[selectedIndex].id = users[selectedIndex].id  //ไม่ต้องมีก็ได้ id ไม่หาย เพราะกำหนดฟิลด์ name age แล้ว

  res.json({
    message : "updated complete",
    data : {
      user : updateUser,
      indexUpdate : selectedIndex
    }
  })
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
app.delete('/user/:id', (req,res)=>{
  let id = req.params.id
  //หา indext by id 
  let selectedIndex = users.findIndex(user => user.id == id)
  // delete users[selectedIndex]
  users.splice(selectedIndex,1)

  res.json({
    message : "delete completed",
    indexUpdate : selectedIndex
  })
})

// The server will start and listen on port 8000, awaiting requests. 
// It will first initialize the MySQL connection before starting.
app.listen(port, async(req,res) =>{
  await initMySQL()
  console.log('http server run at '+ port)
})