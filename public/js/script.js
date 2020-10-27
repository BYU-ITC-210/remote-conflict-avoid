let app = new Vue({
  el: "#app",

  data: {
    error_message: "",
    helpUsers: [],
    machines: [],
    set: false,
    user: {
      zoom: "",
      name: "",
      subject: "",
      in_lab: false,
    },
    student: {
      zoom: "",
      name: "",
      subject: "",
      in_lab: false,
    },
    ta: {
      name: "The TA",
      zoom: "example.com",
      in_lab: false,
    },
    admin: false,
    audio: new Audio('audio/chime.mp3'),
    modal: undefined,
  },

  methods: {

    setSubject(subject) {
      console.debug(`setSubject(${subject})`)
      this.user.subject = subject
    },

    getHelpList() {
      url = "api/help"
      fetch(url).then(response => {
        return response.json()
      }).then(json => {
        this.helpUsers = json
      }).catch(err => {
        console.error(err)
      })
    },

    getMachineList() {
      url = "api/available"
      fetch(url).then(response => {
        return response.json()
      }).then(json => {
        this.machines = json
      }).catch(err => {
        console.error(err)
      })
    },

    getLists() {
      this.getHelpList()
      this.getMachineList()
    },

    adminRemoveHelp(name) {
      this.helpUsers.map(item => {
        if (item.name === name) {
          this.student = item
          console.info(`Removing %c${item.name} %cfrom list`, 'font-weight: bold;', '')

        }
      })
      url = "api/help/remove"
      fetch(url, {
        method: "PUT",
        body: JSON.stringify({name: name}),
        headers: {"Content-Type": "application/json"}
      }).then(response => {
        if (response.status !== 200) {
          throw new Error("Bad remove")
        }
        socket.emit("updateList")
        socket.emit("removed", {
          name: name,
          ta: this.user,
        })
      }).catch(err => {
        console.error(err)
      })
    },

    joinHelp() {
      url = "api/help/add"
      console.log(this.user)
      fetch(url, {
        method: "PUT",
        body: JSON.stringify({...this.user, date: new Date().toString()}),
        headers: {"Content-Type": "application/json"}
      }).then(response => {
        socket.emit("updateList")
        socket.emit("playSound")
      }).catch(err => {
        console.error(err)
      })
    },

    removeHelp() {
      url = "api/help/remove"
      fetch(url, {
        method: "PUT",
        body: JSON.stringify(this.user),
        headers: {"Content-Type": "application/json"}
      }).then(response => {
        if (response.status !== 200) {
          throw new Error("Bad")
        }
        socket.emit("updateList")
      }).catch(err => {
        console.error(err)
      })
    },

    getStorage() {
      this.user = JSON.parse(localStorage.getItem("user")) || { name: "", zoom: "", in_lab: false }
      this.set = false
      if (this.user.name) {
        this.set = true
      }
    },

    getAdmin() {
      url = "api/admin/test"
      fetch(url).then(response => {
        if (response.status === 200) {
          this.admin = true
        }
      }).catch(err => {
        console.error(err)
      })
    },

    setStorage() {
      localStorage.setItem("user", JSON.stringify(this.user))
    },

    setup() {
      this.setStorage()
      this.getStorage()
    },

  },

  computed: {

    availableMachines: function() {
      return this.machines.map(machine => {
        return {
          "name": machine,
          "available": !this.helpUsers.some(user => user.subject === machine),
        }
      })
    },

    onHelpList: function() {
      return this.helpUsers.some(item => item.name === this.user.name)
    },

    onList: function() {
      return this.onHelpList
    },

    in_lab: function() {
      return this.user.in_lab
    }

  },

  created: function() {
    this.getStorage()
    this.getLists()
    this.getAdmin()
  },

  watch: {
    in_lab: function(val) {
      this.setStorage()
    },

    'user.subject': function(val) {
      if (val) {
        this.joinHelp()
      }
    }
  }

})

let socket = io.connect("/")
socket.on("updateList", (data) => {
  app.getLists()
})

socket.on("playSound", (data) => {
  // app.playAdd()
})

socket.on("removed", (data) => {
  // app.playRemove(data)
})

document.addEventListener('DOMContentLoaded', function() {
  let elems = document.querySelectorAll('.modal')
  let options = {}
  M.Modal.init(elems, options)
  //
  let modal = document.querySelector("#modal")
  app.modal = M.Modal.getInstance(modal)

  let selects = document.querySelectorAll('select');
  instances = M.FormSelect.init(selects, options);
})

function leave() {
  localStorage.clear()
  window.location.href = "/logout"
}
