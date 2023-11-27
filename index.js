const express=require("express");
const moongose=require("mongoose");
const bodyParser=require("body-parser");
const dotenv=require("dotenv");

const app=express();
dotenv.config();
const port=process.env.PORT || 3000;

const username=process.env.MONGODB_USERNAME;
const password=process.env.MONGODB_PASSWORD;


moongose.connect(`mongodb+srv://${username}:${password}@cluster0.xh7e5tp.mongodb.net/registrationFormDB`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const registrationSchema = new moongose.Schema({
    name:String,
    email:String,
    password:String
});

const Registration= moongose.model("Registration",registrationSchema);

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.get("/",(req,res) =>{
    res.sendFile(__dirname +"/pages/index.html");
})

app.post("/register",async (req,res) =>{
    try{
        const {name,email,password} = req.body;
        const existinguser = await Registration.findOne({email:email});
        if(!existinguser){
            const registrationData= new Registration({
                name,
                email,
                password
    
            });
            await registrationData.save();
            res.redirect("/success");

        }
        else {
            console.log("User already exist");
            res.redirect("/error");
        }

        
    }
    catch (error) {
        console.log(error);
        res.redirect("error");

    }
})

app.get("/success",(req,res) => {
    res.sendFile(__dirname+"/pages/success.html");
})
app.get("/error",(req,res) => {
    res.sendFile(__dirname+"/pages/success.html");

})

app.listen(port,()=>{
    console.log(`server is running on port ${port}`);
})