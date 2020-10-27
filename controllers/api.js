let express = require("express")
let router = express.Router()

let nonce

let helpUsers = [
]

let availableMachines = require("./servers")

// Register            | post | /user/register
// Login               | put  | /user/login
// Logout              | put  | /user/logout
// Add to help         | put  | /help/add
// Remove from help    | put  | /help/remove
// Get help list       | get  | /help

function getSmallUser(user) {
  return {
    name: user.name,
    zoom: user.zoom,
    subject: user.subject,
    in_lab: user.in_lab || false,
    date: user.date
  }
}

function makeNonce() {
  nonce = process.env.ADMIN_SECRET || Math.random().toString(36).substring(2, 6)
  console.info(`Admin passphrase: ${nonce}`)
}

makeNonce()

// nonce
router.get("/admin/nonce", async (req, res) => {
  makeNonce()
  res.sendStatus(200)
})

// Login
router.put("/admin/login", async (req, res) => {
  let u_nonce = req.body.nonce
  if (!u_nonce) {
    res.sendStatus(401)
    return
  }
  if (nonce !== u_nonce) {
    makeNonce()
    res.sendStatus(403)
    return
  }
  makeNonce()
  req.session.authorized = true
  res.sendStatus(200)
})

router.get("/admin/test", async (req, res) => {
  if (req.session.authorized) {
    res.sendStatus(200)
  } else {
    res.sendStatus(401)
  }
})

// Logout              | put  | /user/logout
router.put("/admin/logout", async (req, res) => {
  if (req.session.authorized === true) {
    req.session.authorized = false
    // let netid = req.session.netid
    res.sendStatus(200)
    return
  }
  res.sendStatus(401)
})

// Add to help         | put  | /help/add
router.put("/help/add", async (req, res) => {
  let name = req.body.name
  if (helpUsers.some(item => item.name === name)) {
    res.sendStatus(500)
    return
  }
  helpUsers.push(getSmallUser(req.body))
  res.sendStatus(200)
})

// Remove from help    | put  | /help/remove
router.put("/help/remove", async (req, res) => {
  let name = req.body.name
  helpUsers = helpUsers.filter(item => item.name !== name)
  res.sendStatus(200)
})

// Get help list       | get  | /help
router.get("/help", async (req, res) => {
  res.send(JSON.stringify(helpUsers))
})

// Get help list       | get  | /help
router.get("/available", async (req, res) => {
  res.send(JSON.stringify(availableMachines))
})

module.exports = router
