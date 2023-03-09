const express = require("express");
const {StatusCodes} = require("http-status-codes");
const fs = require("fs");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.static("public"));

app.get("/combination", async (req, res) => {
    var comb = combination();
    res.cookie("comb", jwt.sign({comb}, "ojeasklafnsklaew"));
    res.status(StatusCodes.OK).json({ok: true});
});

app.post("/check", async (req, res, next) => {
    const comb = req.cookies.comb;
    req.comb = comb;
    next();
}, async (req, res) => {
    const comb = req.comb;
    if(comb != undefined){
        const yourcomb = req.body.yourcomb;
        console.log(yourcomb);
        const comb_v = jwt.verify(comb.toString(), "ojeasklafnsklaew");
        console.log(comb_v);
        let k = 0;
         for(let i = 0; i < yourcomb.length; i++){
            if(comb_v.comb.find(element => element == yourcomb[i])!=undefined)
            k++;
        }
        res.status(StatusCodes.OK).json({comb:comb_v.comb, dobitak: k, ok: true});
    }
    else{
        res.status(StatusCodes.OK).json({ok: false});
    }
    
});

app.get("/reset", async (req, res) => {
    res.cookie("comb", {
        expires: new Date(Date.now() - 24 * 60 * 60 * 1000)
    });
    res.status(StatusCodes.OK).json({ok: true});
});

app.listen(5000, () => {console.log("Server slusa na portu 5000...");});

function combination(){
    let comb = [];
    while(comb.length < 7){
        var r = Math.floor(Math.random() * 40);
        if(comb.indexOf(r) === -1 && r!=0) comb.push(r);
    }
    fs.writeFile("kombinacije.txt", comb.toString() + "\n",{ flag: 'a+' }, (err) => {
        if(err){
            throw err;
        }
    });
    comb.sort((a, b) => a - b);
    return comb;
}