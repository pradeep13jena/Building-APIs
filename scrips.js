import express from "express"
const app = express()

let people = [
  {
    "id": 1,
    "firstName": "Anshika",
    "lastName": "Agarwal",
    "hobby": "Teaching"
  },
  {
    "id": 2,
    "firstName": "Rohit",
    "lastName": "Sharma",
    "hobby": "Cricket"
  }
]

// This is inbuilt middleware to be able to use it...
app.use(express.json()) 

// This middleware is used to console the method, url, statusCode but after finishing the res
app.use((req, res, next) => { 
  res.on('finish', () => {
    console.log({ 
      "Method": req.method,
      "URL": req.originalUrl,
      "Status": res.statusCode
    });
  });
  next()
}) 

// This middleware checks for the post method to check if the data incoming contains all the required feild
// if contains good to go, if not it will return a status code 401 & "Please provide all the feilds"
const validatePostUser = (req, res, next) => {
  const {firstName, lastName, hobby} = req.body
  if(!(firstName && lastName && hobby)){
    return res.status(401).send({message: 'Please provide all the feilds'})
  }
  next()
}

// This middleware checks for the put method to check if the incoming data is empty or not
// if not empty good to go, if not it will return a status code 401 & "No details provided to update"
const validatePutUser = (req, res, next) => {
  const { id } = req.params  
  const userUpdate = people.find(peeps => peeps.id == id)
  const keys = Object.keys(req.body)

  if (!userUpdate){
    return res.status(404).json({"message": "User not found"})
  }

  if(keys.length == 0){
    return res.status(401).json({message: 'No details provided to update'})
  }

  next()
}

// This middleware will check if the given id is present or not in delete
const validateDelteUser = (req, res, next) => {
  const { id } = req.params  
  const userUpdate = people.find(peeps => peeps.id == id)

  if (!userUpdate){
    return res.status(404).json({"message": "User not found"})
  }

  next()
}

// Creating server with the post "3010"
app.listen(3010, () => {
  console.log('Port listening to 3010')
})

// Get req with the url "/users" to print all the users
app.get("/users", (req, res) => {
  res.status(200).send(people)
})

// Get req with the url "/users:id" to print the user accord to id
app.get("/users/:id", (req, res) => {
  const {id} = req.params
  const found = people.find(peeps => peeps.id == id)
  // if user with id found then status code return 200
  // if not then status (404) with message "User not found"
  found ? res.status(200).send(found) : res.status(404).json({"message": "User not found"})
})

app.post("/user", validatePostUser, (req, res) => { 
  // validatePostUser will check if the request is empty/incomplete or not if empty it will return error 
  // if not then new user will create and displayed with status of 201.
  const { firstName, lastName, hobby } = req.body
  const newUser = {id: people.length + 1, firstName: firstName, lastName: lastName, hobby: hobby}
  people.push(newUser)
  return res.status(201).send(people)
})

app.put("/user/:id", validatePutUser, (req, res) => {
  // validatePutUser will check if the id thorugh the array if not found the return error with status (404) with message "User not found" 
  // if request is empty/incomplete or not if empty it will return error 
  // if not then update the user and displayed with status of 200.
  const { id } = req.params
  const userUpdate = people.find(peeps => peeps.id == id)
    const keys = Object.keys(req.body)
    keys.forEach(key => {
      if(!userUpdate[key]){
        return res.status(401).json({"message": `Invalid key ${key}`})
      }
      userUpdate[key] = req.body[key]
    })
    res.send(people)
})

app.delete("/user/:id", validateDelteUser, (req, res) => {
  const { id } = req.params
  let deletedList = people.filter(peeps => peeps.id != id)
  people = deletedList
  res.send(deletedList)
})