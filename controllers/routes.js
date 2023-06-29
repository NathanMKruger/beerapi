const router = require("express").Router()
const Beer = require("../models/Beer")

router.post("/create", async (req, res) => {
    try {

        const newBeer = new Beer(req.body)

        newBeer.save()

        res.status(201).json({
            message: "Beer added",
            newBeer
        })

    } catch(err) {
        res.status(500).json({
            message: `${err}`
        })
    }
})

router.get("/", async (req, res) => {
    try {
        console.log(req)
        const findAll = await Beer.find({})
        if(findAll.length === 0) throw Error("No entries found")
        res.status(200).json(findAll)
    } catch(err) {
        console.log(err)
        res.status(500).json({
            message: `${err}`
        })
    }
})

router.get("/:id", async (req, res) => {
    try {
        /* 
            This is an example of an alias within destructure assignment
            Allows us to "rename" id to match _id key within db
        */
       const { id: _id } = req.params
       const findOne = await Beer.findOne({_id})

       if (!findOne) throw Error("No item found")

       res.status(200).json(findOne)
       
    } catch (err) {
        console.log(err.message)
        res.status(500).json({
            message: `${err}`
        })
    }
    
})

router.put("/update/:id", async (req, res) => {
    try {
        const { id: _id } = req.params
        const newBeer = req.body

        const updatedOne = await Beer.updatedOne({_id}, { $set: newBeer })
        if(updatedOne.matchedCount === 0) throw Error("ID not found")

        res.status(200).json({
            message: "Entry updated"
        })

    } catch(err) {
        console.log(err)
        res.status(500).json({
            message: `${err}`
        })
    }

})

router.delete("/delete/:id", async (req, res) => {
    try {
        const { id: _id } = req.params
        const deleteOne = await Beer.findByIdAndDelete(_id)

        if(!deleteOne) throw Error("ID not found")

        res.status(200).json({
            message: "Item deleted",
            deleteOne
        })
 
    } catch(err) {
        console.log(err)
        res.status(500).json({
            message: `${err}`
        })
    }
})

module.exports = router