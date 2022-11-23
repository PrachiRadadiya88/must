const mongoose = require('mongoose');

mongoose.connect(process.env.DB1_URI)
    .then(() => {
        console.log('Conected to db1');
    }).catch((err) => {
        console.log('db1 error: ', err);    
    })

module.exports = mongoose