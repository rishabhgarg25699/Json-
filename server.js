const express = require('express');
const jwt = require('jsonwebtoken');
const fs = require('fs')
const app = express();

app.use(express.json())

//*********** util function ***********//

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

//*********** **************** ***********//


/* Read - GET method */
app.get('/user/list', (req, res) => {
  const users = getUserData()
  res.send(users)
})

/* Create - POST method */
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

/* Update - Patch method */
app.patch('/user/update/:username', (req, res) => {
  //get the username from url
  const username = req.params.username
  //get the update data
  const userData = req.body
  //get the existing user data
  const existUsers = getUserData()
  //check if the username exist or not       
  const findExist = existUsers.find( user => user.ID === username )
  console.log(findExist);
  if (!findExist) {
      return res.status(409).send({error: true, msg: 'username not exist'})
  }
  //filter the userdata
  const updateUser = existUsers.filter( user => user.ID !== username )
  //push the updated data
  updateUser.push(userData)
  //finally save it
  saveUserData(updateUser)
  res.send({success: true, msg: 'User data updated successfully'})
})

/* Delete - Delete method */
app.delete('/user/delete/:username', (req, res) => {
  const username = req.params.username
  //get the existing userdata
  const existUsers = getUserData()
  //filter the userdata to remove it
  const filterUser = existUsers.filter( user => user.ID !== username )
  if ( existUsers.length === filterUser.length ) {
      return res.status(409).send({error: true, msg: 'username does not exist'})
  }
  //save the filtered data
  saveUserData(filterUser)
  res.send({success: true, msg: 'User removed successfully'})
  
})

app.listen(5000, () => console.log('Server started on port 5000'));