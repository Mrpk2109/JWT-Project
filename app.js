require("dotenv").config();
require("./config/database").connect();
const express = require("express");

//importing user context
const User = require("./model/user");

const app = express();

//Register
app.post("/register",async(req,res)=>{
    //Our register logic starts here
    try{
        const{ first_name,last_name,email,password } = req.body;

        //Validate user input
        if(!(email && password && first_name && last_name)){
            res.status(400).send("All is required");
        }

        //check if user already exist
        //Validate if user exist in our database
        const oldUser = await User.findOne({ email });

        if (oldUser){
            return res.status(409).send("User Already Exist. Please login")
        }

        //Encrypt user password
        encryptedPassword = await bcrypt.hash(password, 10);

        //Create user in our database
        const user = await User.create({
            first_name,
            last_name,
            email: email.toLowerCase(), //sanitize: convert email to lower
            password: encryptedPassword,
        });

        //Create token
        const token = jwt.sign(
            { user_id: user.user_id,email },
            process.env.TOKEN_KEY,
            {
                expiresIN: "2h",
            }
        );
        // save user token
        user.token = token;
        
        //return new user
        res.status(201).json(user);
    }catch (err){
        console.log(err);
    }
});

//Login
app.post("/login",(req,res)=>{

})

app.use(express.json());

module.exports = app;