var redis = require('redis');
var config = ("./config.js");
var context= { "question": "請問bluemix如何計費", "conversation_id": "168b620d-37d0-49bd-b657-73e3b9eaa956", "system": { "dialog_stack": [ "node_1_1471853227574" ], "dialog_turn_counter": 1, "dialog_request_counter": 1 } };
var redisPort = config.redisPort || "6379";
var redisIP = config.redisIP || "127.0.0.1";
var dbSelect=config.dbSelect||"0";

function getUserContext(userName){
   
    return new Promise(function(resolve , reject){
    var client = redis.createClient(redisPort,redisIP);
    client.select(dbSelect,function(err){
    var userPrefix="user."+userName;
    if(err)
    {
        client.end(true);
        console.log(err);
        reject(err);
    }else{

          client.hgetall(userPrefix,function(err,res){

                    if(err)
                    {
                       // console.log(err);
                       client.end(true);
                         reject(err);
                    }
                    else {
                        //console.log(res);
                        if(res){
                            client.end(true);
                            resolve(res);
                        }
                            reject('can not query this user');
                        
                    }

                });
       
        

    }


});
    });
}


var setUserContext= function (userName,context){

return new Promise(function(resolve,reject){
var client = redis.createClient(redisPort,redisIP);
 var userPrefix='user.'+userName;
 client.select(dbSelect,function(err){
     if(err){
         client.end(true);
         reject (err);
     }else{
 

         for(var i in context) {
             if(typeof(context[i])!='string'){
             
             context[i]  = JSON.stringify(context[i]);
             }
         }
      
        client.hmset( userPrefix,context,function(err,res){
            if(err) {
                client.end(true);
                reject(err);
            }
            else {
                client.end(true);
               resolve(res);
              
                
            }
        });
     }
 }

);


});
}
// setUserContext('apple',context).then(function(res){

//     console.log(res);
//     getUserContext('apple').then(function(res){console.log(res.question)});

// },function(err){
//     console.log(err);
// });


module.exports={

    setUserContext: setUserContext,
    getUserContext: getUserContext



}

