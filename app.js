const unicore = require("unixwebcore")
const moment = require("moment")
const ejs = require("ejs")
const http = require("http")
process.on('uncaughtException', (e) => console.log(e))
app = new unicore()
app.setupInfo()
app.loadModules(__dirname + '/modules/', '', (e, d) => {
  if (e) {
    console.log("Error: ")
    console.log(e)
  } else {
    console.log("Loaded " + d.length + " module(s)")
  }
  app.app.use("/", require("./index"))
  app.app.get("*", (req, res) => {
      res.end("404")
  })
})

app.use(unicore.static(__dirname + "/static"))
app.app.engine('html', ejs.renderFile);
app.app.set('view engine', 'html');
let httpServer = http.createServer(app.app);
httpServer.listen(9958, (e) => {
})

