const app = require("express").Router()
const ejs = require("ejs")
const db = require("mysql").createPool(require("./credentials.json").sql)
const uuid = require("uuid")
app.get("/", (req, res) => {
    db.query("SELECT * FROM nlp_dic WHERE type IS NULL LIMIT 50", (e, d) => {
        if (e) {
            console.log(e)
            res.send("SQL ERROR")
        } else {
            ejs.renderFile("./views/index.ejs", { data: d }, {}, (e, d) => {
                if (e) {
                    console.log(e)
                    res.status(500)
                    res.send(e)
                } else
                    res.send(d)
            })
        }
    })

})
app.post("/update", (req, res) => {
    let cid = uuid.v1()
    db.query("UPDATE `common`.`nlp_dic` SET `type` = ?, `remark` = ? WHERE `id` = ?", ["A", cid, req.body.a], (e, d) => {
        db.query("UPDATE `common`.`nlp_dic` SET `type` = ?, `remark` = ? WHERE `id` = ?", ["B", cid, req.body.b], (e, d) => {
            res.json({})
        })
    })

})
app.post("/delete", (req, res) => {
    db.query("UPDATE `common`.`nlp_dic` SET `type` = ? WHERE `id` = ?", ["DEL", req.body.id], (e, d) => {
        res.json({})
    })
})
app.get("/:group.conv", (req, res) => {
    let arrA = []
    let arrB = []
    let arr = {}
    let out = ""
    db.query("SELECT * FROM `common`.`nlp_dic` WHERE `group`=? AND type='A'", [req.params.group], (e, d) => {
        if (e) {
            console.log(e)
            res.send(e)
            return;
        }
        arrA = d
        db.query("SELECT * FROM `common`.`nlp_dic` WHERE `group`=? AND type='B'", [req.params.group], (e, d) => {
            if (e) {
                console.log(e)
                res.send(e)
                return;
            }
            arrB = d
            res.writeHead(200, {
                "Content-Disposition": `attachment; filename=\"${req.params.group}.conv\"`,
                "Content-Type": "text/plain; charset=utf-8"
            })
            if (arrA.length != arrB.length) {
                out += "### ARRAY LENGTH DOES NOT MATCH ###\n"
            }
            for (i in arrA) {
                arr[arrA[i].remark] = {
                    a: arrA[i].content
                }
            }
            for (i in arrB) {
                arr[arrB[i].remark].b = arrB[i].content
            }
            let keys = Object.keys(arr)
            for (i in keys) {
                out += "E\nM "
                out += arr[keys[i]].a
                out += "\nM "
                out += arr[keys[i]].b
                out += "\n"
            }
            res.write(out)
            res.end()
        })
    })
})

app.get("/unified/.conv", (req, res) => {
    let arrA = []
    let arrB = []
    let arr = {}
    let out = ""
    db.query("SELECT * FROM `common`.`nlp_dic` WHERE  type='A'", [], (e, d) => {
        if (e) {
            console.log(e)
            res.send(e)
            return;
        }
        arrA = d
        db.query("SELECT * FROM `common`.`nlp_dic` WHERE  type='B'", [], (e, d) => {
            if (e) {
                console.log(e)
                res.send(e)
                return;
            }
            arrB = d
            res.writeHead(200, {
                "Content-Disposition": `attachment; filename=\"unified.conv\"`,
                "Content-Type": "text/plain; charset=utf-8"
            })
            if (arrA.length != arrB.length) {
                out += "### ARRAY LENGTH DOES NOT MATCH ###\n"
            }
            for (i in arrA) {
                arr[arrA[i].remark] = {
                    a: arrA[i].content
                }
            }
            for (i in arrB) {
                arr[arrB[i].remark].b = arrB[i].content
            }
            let keys = Object.keys(arr)
            for (i in keys) {
                out += "E\nM "
                out += arr[keys[i]].a
                out += "\nM "
                out += arr[keys[i]].b
                out += "\n"
            }
            res.write(out)
            res.end()
        })
    })
})
module.exports = app