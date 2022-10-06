const express = require('express')
const mongoose = require('mongoose')
mongoose.connect("mongodb+srv://HarshilJetani:987654321@cluster0.bq3ljih.mongodb.net/AppDB?retryWrites=true&w=majority");
const PORT = process.env.PORT || 5000;

const app = express();
// app.route("/").get((req,resp)=>{                        
//     resp.json("first api")
// });

const connection = mongoose.connection;
connection.once("open", () => {
    console.log("connected");
});

//middleware
app.use(express.json());
const userRoute = require("./routes/user");
app.use("/user", userRoute);
app.get('/', (req, resp) => {
    resp.json("first api")
})


app.listen(PORT , () => console.log(`server is running on ${PORT}`)); 