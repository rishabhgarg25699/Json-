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

app.post('/user/add', (req, res) => {
  const existUsers = getUserData()
  //get the new user data from post request
  const userData = req.body
  
  //check if the username exist already
  const findExist = existUsers.find( user => user.ID === userData.ID )
  if (findExist) {
      return res.status(409).send({error: true, msg: 'ID already exist'})
  }
  //append the user data
  existUsers.push(userData)
  //save the new user data
  saveUserData(existUsers);
  res.send({success: true, msg: 'User data added successfully'})
})


/* Read - GET method */
app.get('/user/list', (req, res) => {
  const users = getUserData()
  res.send(users)
})

app.listen(5000, () => console.log('Server started on port 5000'));