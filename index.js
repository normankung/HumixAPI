var redis = require('redis');
var config = ("./config.js");
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
                       
                       client.end(true);
                         reject(err);
                    }
                    else {
                      
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


module.exports={

    setUserContext: setUserContext,
    getUserContext: getUserContext



}

