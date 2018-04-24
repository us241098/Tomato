var express = require('express');
var app = express();
var bcrypt = require('bcryptjs');
var MongoClient = require('mongodb').MongoClient; 
var bodyParser = require('body-parser');
var db = null;
var ObjectId = require('mongodb').ObjectId;

MongoClient.connect("mongodb://localhost:27017/tomato",function(err,dbconn){
    if (!err){
        console.log("connected");
        db = dbconn;
    }
});
app.use(bodyParser.json());
app.use(express.static('public'));


app.get('/fruits',function(req,res,next){
    db.collection('fruits', function(err, fruitCollection){
        fruitCollection.find().toArray(function(err,fruits){
            return res.json(fruits);
        });
    });
});


app.post('/fruits',function(req,res,next){
    db.collection('fruits', function(err, fruitCollection){
        var newfruit={
            text:req.body.newfruit
        };
        fruitCollection.insert(newfruit,{w:1},function(err,fruits){
            return res.send();
        });
    });
});




app.put('/fruits/remove',function(req,res,next){
    db.collection('fruits',function(err, fruitCollection){
        var fruitId= req.body.fruit._id;

        fruitCollection.remove({_id: ObjectId(fruitId)},{w:1}, function(err){
            return res.send();  
        });
    });
});


app.put('/users/signin',function(req,res,next){
    db.collection('users', function(err, usersCollection){
        usersCollection.findOne({username: req.body.username}, function(err,user){
            bcrypt.compare(req.body.password, user.password,function(err,result){
                if (result){
                    return res.send();
                    console.log('broooo');
                }
                else{
                    return res.status(400).send()
                    console.log('nnnnnnnnooooooooo');
                }
            });
        });
    
});
});


app.post('/users',function(req,res,next){
    db.collection('users', function(err, usersCollection){
        bcrypt.genSalt(10,function(err,salt){
            bcrypt.hash(req.body.password,salt,function(err,hash){
                var newUser={
                    username: req.body.username,
                    password:hash
                };

                usersCollection.insert(newUser,{w:1}, function(err){
                    return res.send();
                })
});
});
});
});







app.listen(8000 , function(){
    console.log('jfsajdfjjsdfj');
});
