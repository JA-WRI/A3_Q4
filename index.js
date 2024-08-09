import express from "express";
import { dirname } from "path";
import session from "express-session";
import { fileURLToPath } from "url";
import fs from "fs";
//import http from "http"

const __dirname = dirname(fileURLToPath(import.meta.url));
const port = 3001;
const app = express();
app.use(express.json(),express.urlencoded({ extended: true }));

app.use(session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true
}));

// Set EJS as the view engine
app.set("view engine", "ejs");

// Set the directory for EJS files
app.set("views", __dirname + "/views");

// Serve static files from the "public" directory
app.use(express.static("public"));

// Render the pages.ejs 
app.get("/", (req, res) => {
    res.render("home.ejs");
});

app.get("/home", (req, res) => {
    res.render("home.ejs");
});
app.get("/browse", (req, res) => {
    res.render("browse.ejs");
});
app.get("/find", (req, res) => {
    res.render("find.ejs");
});
app.get("/Dogcare", (req, res) => {
    res.render("Dogcare.ejs");
});
app.get("/catCare", (req, res) => {
    res.render("catCare.ejs");
});
app.get("/giveaway", (req, res) => {
    res.render("giveaway.ejs");
});
app.get("/contact", (req, res) => {
    res.render("contact.ejs");
});
app.get("/disclaimer", (req, res) => {
    res.render("disclaimer.ejs");
});
app.get("/createAccount", (req, res) => {
    res.render("createAccount");
});
app.get("/login", (req, res) => {
    res.render("login");
});
app.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.send("Error logging out.");
        }
        res.render("logout", { message: "Successfully logged out.You Will be Redirected To the Home Page" });
    });
});

app.post("/createAccount", (req, res) => {
    const {username, password}= req.body;
    const userString = `${username}:${password}\n`;

    if (!username || !password) {
        return res.render("createAccount", { message: "Username and password are required" });
    }

    fs.readFile("login.txt", "utf8", (err, data) => {
        if (err) {
            console.error("Error reading login.txt:", err);
            return res.render("createAccount", { message: "An error occurred while creating your account." });
        }

        if (data.includes(`${username}:`)) {
            return res.render("createAccount", { message: "Username already exists" });
        }

        fs.appendFile("login.txt", userString, (err) => {
            if (err) {
                console.error("Error appending to login.txt:", err);
                return res.render("createAnAccount", { message: "An error occurred while creating your account." });
            }
            res.render("createAccount", { message: "Account created successfully" });
        });
    });
});
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    fs.readFile("login.txt", "utf8",(err, data) => {
        if (err) {
            console.error("Error reading login.txt:", err);
            return res.status(500).send("Error logging in.");
        }

        const users = data.split("\n");
        const userExists = users.some(user => user === `${username}:${password}`);

        if (userExists) {
            req.session.username = req.body.username;
            res.redirect("/giveaway");
        } else {
            res.render("login", { message: "Invalid username or password" });
        }
    })
});
var lines=0;
app.post("/registerPet", (req, res) => {
    
  
    fs.readFile('availablePetInformation.txt', 'utf8', (err, data) => {
        if (err) throw err;
        if(lines ===0)
            lines =1;
        else{
            lines = data.split(/\r\n|\n/).length -1;
        }
        
    });
    const { animal, breed, age, gender, GetAlongWith, comments, fname,lname, email } = req.body;
    const petString = ++lines + + ":"+  req.session.username`:${animal}:${breed}:${age}:${gender}:${GetAlongWith}:${comments}:${fname}:${lname}:${email}\n`;

    fs.appendFile("availablePetInformation.txt", petString, (err) => {
        if (err) {
            console.error("Failed to write pet data:", err);
            return res.status(500).send("Failed to register pet.");
        }
        res.render("giveaway", { message: "Pet registered successfully." });
    });
});
app.post("/browse", (req, res) => {
    const { animal, breed, age, gender, GetAlongWith } = req.body;
 

    fs.readFile("availablePetInformation.txt", "utf8", (err, data) => {
        if (err) {
            console.error("Error reading availablePetInformation.txt:", err);
            return res.status(500).send("Error reading pet data file.");
        }
        const petsData = data.split("\n");
        const filteredPets = petsData.filter(line => {
            const parts = line.split(":");
            return (parts[0].toLowerCase() === animal.toLowerCase()) &&
                (!breed || breed === "mixedBreed" || parts[1].toLowerCase().includes(breed.toLowerCase())) &&
                (age === "No preference" || parts[2] === age) &&
                (gender === "No preference" || parts[3] === gender) &&
                (!GetAlongWith || parts[4] === GetAlongWith);
        });
        res.render("browse",{pets: filteredPets});
    });
});


app.listen(port, () => console.log(`Server listening on port ${port}`));