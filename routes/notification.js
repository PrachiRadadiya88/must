const express = require('express');
const router = express.Router();
 const fetch = require('node-fetch');
 const routes = require('../routes/routes');
 var admin = require("firebase-admin");

//  const router = express.Router();
 router.route("/sendToAll").post(async (req, resp) =>{
    var notification = {
        'title':"title of notification",
        'text': "subtitle",
    };
    var fcm_tokens = [];
    var notification_body = {
        'notification': notification,
        'registration_ids': fcm_tokens
    }

    fetch('https://fcm.googleapis.com/fcm/send',{
        'method': 'POST',
        'headers': {
            'Authorization': 'key='+'BNuaXxZ2FYtEJwUbZt1UcTLKpqp30Y6-_eUKmJAdQ9fZiHDk_b7aTvT_C8ln-TkuWrfADA7KcDv4teWJlwpNQ0Q',
            'Content-Type': 'application/json'

        },
        'body':JSON.stringify(notification_body)
    }).then(()=>{
        resp.status(200).send('nortification sent successfully');
    }).catch(err=>{
        resp.status(400).send('something went wron ');
        console.log(err);
    })
  
});

module.exports = router;