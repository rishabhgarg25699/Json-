const express = require('express');
const jwt = require('jsonwebtoken');
const fs = require('fs')
const app = express();

app.use(express.json())

//get the user data from json file
const getUserData = () => {
  const jsonData = fs.readFileSync('db.json')
  return JSON.parse(jsonData)    
}

//read the user data from json file
const saveUserData = (data) => {
  const stringifyData = JSON.stringify(data)
  fs.writeFileSync('db.json', stringifyData)
}

app.get('/user/list', (req, res) => {
  const users = getUserData()
  res.send(users)
})

/* ********************** Filtering GET /posts?title=title1&author=CIQ - GET method ********************* */
app.get('/user/list?title=title1&author=CIQ', (req, res) => {
  const existusers = getUserData();
})

/* ********************** Filtering GET /posts?_sort=views&_order=asc - GET method ********************* */
app.get('/user/list?title=title1&author=CIQ', (req, res) => {
  const existusers = getUserData();
})

/* ********************** Filtering GET /posts?q=IQ - GET method ********************* */
app.get('/user/list?title=title1&author=CIQ', (req, res) => {
  const existusers = getUserData();
})

app.post('/user/add', (req, res) => {
  const existUsers = getUserData()
  const userData = req.body
  //check if the username exist already
  const findExist = existUsers.find( user => user.ID === userData.ID )
  if (findExist) {
      return res.status(409).send({error: true, msg: 'ID already exist'})
  }
  existUsers.push(userData)
  saveUserData(existUsers);
  res.send({success: true, msg: 'User data added successfully'})
})

app.patch('/user/update/:username', (req, res) => {
  const username = req.params.username
  const userData = req.body
  const existUsers = getUserData()
  //check if the username exist or not       
  const findExist = existUsers.find( user => user.ID === username )
  console.log(findExist);
  if (!findExist) {
      return res.status(409).send({error: true, msg: 'username not exist'})
  }
  //filter the userdata
  const updateUser = existUsers.filter( user => user.ID !== username )
  updateUser.push(userData)
  saveUserData(updateUser)
  res.send({success: true, msg: 'User data updated successfully'})
})

app.delete('/user/delete/:username', (req, res) => {
  const username = req.params.username
  const existUsers = getUserData()
  const filterUser = existUsers.filter( user => user.ID !== username )
  if ( existUsers.length === filterUser.length ) {
      return res.status(409).send({error: true, msg: 'username does not exist'})
  }
  saveUserData(filterUser)
  res.send({success: true, msg: 'User removed successfully'})
  
})

app.listen(5000, () => console.log('Server started on port 5000'));