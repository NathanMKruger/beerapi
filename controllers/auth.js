const router = require("express").Router()
const User = require("../models/User")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
// Value specifying how many times we run the algorithm on the daya to be encrypted
const SALT = Number(process.env.SALT)
const JWT_KEY = process.env.JWT_KEY

router.post("/register", async (req, res) => {
    try {
       const { name, email, password } = req.body

        if (!name || !email || !password) throw Error("Incorrect schema values")

        // Initialize a new model using provided req.body object values
        // hash the password using .hashSync() with req.body.password and the SALT value
        // assign the password property to the value of .hashSync() return
        const newUser = new User({ name, email, password: bcrypt.hashSync(password, SALT) })
        //Save the model document into the collection
        await newUser.save()

        // Generate new JWT token
        const token = jwt.sign(
            // payload
            { _id: newUser._id },
            // secret key
            JWT_KEY,
            //options (24hr expiration)
            { expiresIn: 60 * 60 * 24}
        )

        res.status(201).json({
            message: "User created",
            newUser,
            token
        })
    } catch(err) {
        console.log(err)
        res.status(500).json({
            message: `${err}`
        })
    }
})

// TODO: creating a login.
/* 
    you will need to use a method you already know on the User model
    you will need to cross check if email and password match an entry within the user model
    have error handling in case someone doesn't put correct values
    if email doesn't match, create error handling for email
    if password doesn't match, create error handling for password
    return response back
*/
// http://localhost:4000/auth/login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body

        let foundUser = await User.findOne({ email })
        
        if (!foundUser) throw Error("User not found")

        // Async .compare() method which takes password from req.body
        // Compares it against password from the user found in the db
        const verifyPass = await bcrypt.compare(password, foundUser.password)

        if (!verifyPass) throw Error("Incorrect password")

        const token = jwt.sign(
            { _id: foundUser._id },
            JWT_KEY,
            { expiresIn: 60 * 60 * 24}
        )

        res.status(200).json({
            message: "Found user",
            foundUser,
            token
        })
    } catch(err) {
        console.log(err)
        res.status(500).json({
            message: `${err}`
        })
    }
})

module.exports = router