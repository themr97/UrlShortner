const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var randomstring = require('randomstring');


// const mongodb = require('mongodb');

const {UrlModel} = require('./models/urlshort');

mongoose.connect("mongodb+srv://admin:mahesh123@cluster0.e59j9.mongodb.net/urlshort?retryWrites=true&w=majority")

app.set('view engine',"ejs");
app.use(bodyParser.urlencoded({enxtended: true}))

app.get("/",function(req,res){
    let allUrl = UrlModel.find(function(req,result){
        res.render('home',{
            urlResult : result
       })
    })
})


app.post('/create',function(req,res){
    let urlShort = new UrlModel({
        lurl : req.body.lurl,
        surl : randomstring.generate(7),
    })

    urlShort.save(function(err,data){
        if(err) throw err;
        console.log(data);
        res.redirect('/')
    });

})


app.get('/:urlId', function (req, res) {
    UrlModel.findOne({ surl: req.params.urlId }, function (err, data) {
        if (err) throw err;

        UrlModel.findByIdAndUpdate({ _id: data.id }, { $inc: { clickCount: 1 } }, function (err, updatedData) {
            if (err) throw err;
            res.redirect(data.lurl)
        })


    })
})


app.get('/delete/:id',function(req,res){
    UrlModel.findByIdAndDelete({_id:req.params.id},function(err,deleteData){
        if(err) throw err;
        res.redirect('/')
    })
})
app.listen(process.env.PORT || 3000, () => console.log("Server is listening on port "));
