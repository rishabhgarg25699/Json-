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

app.get('/post', (req, res) => {
  const len = Object.keys(req.query).length;
  const ob = Object.keys(req.query);
  if(len === 0)
  {
    const users = getUserData()
    return res.send(users)
  }
  else if(len === 2)
  {
    if(ob[0] === "title" && ob[1] === "author")
    {
      const existUsers = getUserData();
      const findExist = existUsers.find( user => user.title === req.query.title && user.author === req.query.author)
      if (!findExist) {
        return res.status(409).send({error: true, msg: 'Entry Not exist'})
      }
      else
      {
        return res.send(findExist);
      }
    }
    else if(ob[0] === "_sort" && ob[1] === "_order")
    {
      const existUsers = getUserData();
      let key1 = req.query._sort;
      let key2 = req.query._order;
      let x;
      if(key2 == "asc")
        x = existUsers.sort((a,b)=>(a.key1 > b.key1 ? 1 : -1));
      else
        x = existUsers.sort((a,b)=>(a.key1 > b.key1 ? -1 : 1));
      return res.send(x);
    }
    else
    {
      return res.status(409).send({error: true, msg: 'URL is Wrong'})
    }
  }
})

app.get('/post/:id', (req, res) => {
  const id = req.params.id;
  const existUsers = getUserData()
  const findExist = existUsers.find( user => user.ID === id)
  if (!findExist) {
    return res.status(409).send({error: true, msg: 'ID not exist'})
  }
  return res.send(findExist);
})

app.post('/post', (req, res) => {
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

app.patch('/post/:ID', (req, res) => {
  const ID = req.params.ID
  const userData = req.body
  const existUsers = getUserData()
  //check if the username exist or not       
  const findExist = existUsers.find( user => user.ID === ID)
  if (!findExist) {
      return res.status(409).send({error: true, msg: 'username not exist'})
  }
  //filter the userdata
  if(userData.ID != findExist.ID){
    return res.status(409).send({error: true, msg: 'You can not change ID'});
  }
  
  const updateUser = existUsers.filter( user => user.ID !== ID )
  updateUser.push(userData)
  saveUserData(updateUser)
  res.send({success: true, msg: 'User data updated successfully'})
})

app.delete('/post/:username', (req, res) => {
  const username = req.params.username
  const existUsers = getUserData()
  const filterUser = existUsers.filter( user => user.ID !== username )
  if ( existUsers.length === filterUser.length ) {
      return res.status(409).send({error: true, msg: 'username does not exist'})
  }
  saveUserData(filterUser)
  res.send({success: true, msg: 'User removed successfully'})
})

app.listen(3000, () => console.log('Server started on port 3000'));