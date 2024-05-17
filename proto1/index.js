const exp = require('constants');
const express=require('express');
const path=require('path')
const app=express();
const passport=require('passport')
const session=require('express-session')
const mysql=require('mysql')
require('./auth')
app.use(express.json());
//app.use(express.static(path.join(__dirname,'client')))
// Assuming your CSS files are in a directory named 'public'
app.use(express.static(path.join(__dirname, '')));

app.use(session({
    secret: 'mysecret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}))

app.use(passport.initialize());
app.use(passport.session());

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/auth/google'); // Redirect to Google sign-in page
}

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'home.html'))
})

app.get('/profile',ensureAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'profile.html'));
});

app.get('/slotbooking',ensureAuthenticated,(req,res)=>{
    res.sendFile(path.join(__dirname,"SB.html"))
})

app.get('/aboutUs',ensureAuthenticated,(req,res)=>{
    res.sendFile(path.join(__dirname,"about.html"))
})


app.get('/auth/google',
  passport.authenticate('google', { scope:
      [ 'email', 'profile' ] }
));

app.get( '/auth/google/callback',
    passport.authenticate( 'google', {
        successRedirect: '/auth/google/success',
        failureRedirect: '/auth/google/failure'
}));

app.get('/auth/google/failure',isLoggedIn,(req,res)=>{
    res.send('Something wrong')
});

app.get('/logout', (req, res) => {
    req.logout(() => {
        res.redirect('/');
    });
});

app.get('/check-auth', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({ isAuthenticated: true });
    } else {
        res.json({ isAuthenticated: false });
    }
});

let Name=""
let mail=""
let roll_no=""

app.get('/auth/google/success',isLoggedIn,(req,res)=>{
    
    // Name=req.user.name.familyName;
    // //console.log(name)
    // mail=req.user.email
    // roll_no=req.user.given_name
    // console.log(roll_no)
    // queryUser(Name,mail,roll_no)
    res.redirect('/profile');
});

function isLoggedIn(req, res, next) {
    req.isAuthenticated() ? next() : res.sendStatus(401);
}

// Route for fetching user details as JSON
app.get('/profile/data', isLoggedIn, async (req, res) => {
    const u = req.user;
    const  given_name = u.given_name; 
    const familyName  = u.family_name;
    // console.log(u.familyName);
    // console.log(given_name);
    const roll_no = given_name; // Assuming given_name is used as roll_no
    // console.log(req.user);
    // console.log(roll_no);

    const email = u.email;

    try {
        // console.log("hello");
        const timing = await queryUser(familyName, roll_no);
        // console.log("bye");
        res.json({
            name: familyName,
            email: email,
            photo: u.picture,
            timing: timing || 'N/A'
        });
    } catch (error) {
        console.error('Error querying user:', error);
        res.status(500).send('Server error');
    }
});

let timing = "";

function findNumbersInString(inputString) {
    // Regular expression to match numbers
    var numberPattern = /\d+/g;
    
    // Use match method to find numbers in the input string
    var numbersArray = inputString.match(numberPattern);
    if(numbersArray==null)
        numbersArray=[]
    // Return the array of numbers found in the string
    return numbersArray;
}

async function queryUser(Name, roll_no) {
    const con = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'veeresh123',
        database: 'Sports'
    });

    return new Promise((resolve, reject,) => {
        con.connect((err) => {
            if (err) {
                console.log("Error connecting to the database");
                return reject(err);
            }
            console.log("Connected to the database");
            console.log(roll_no);
            // Check if user exists
            con.query(`SELECT * FROM (people LEFT JOIN plays on people.id=plays.id) left join slots on slots.slotid = plays.slotid WHERE people.id=?;`, [roll_no], (err, results) => {
                if (err) {
                    console.log("Error querying the database");
                    return reject(err);
                }
                if (results.length > 0) {
                    timing = results[0].timing;
                    console.log("User exists, timing: ", timing);
                    resolve(timing);
                } else {
                    // User does not exist, insert into people table
                    var role = "student";
                    // console.log(roll_no);
                    var array = findNumbersInString(roll_no);

                    if(array.length==0)
                        role = 'faculty'

                    con.query(`INSERT INTO people (id, name, role) VALUES (?, ?, ?)`, [roll_no, Name, role], (err, results) => {
                        if (err) {
                            console.log("Error inserting into people table");
                            return reject(err);
                        }
                        console.log("Inserted new user into people table");
                        resolve(null);
                    });
                }
            });
        });
    });
}


app.listen(5500,()=>{
    console.log('Listening on port 5500')
});