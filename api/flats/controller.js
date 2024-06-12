const Flat = require('./model')

exports.createFlats = async (req , res) =>{
    try{
        const flat = new Flat(req.body) ;
        flat.created = new Date() ;
        flat.modified = new Date() ;
        flat.ownerID = req.user._id ;
        await flat.save()
        res.status(201).json({
            message : 'flat created' ,
            data: flat
        })
    }catch(err){
        res.status(400).json({
            message: err.message
        })
    }
}

exports.getAllFlats = async (req , res) =>{
    const flats= await Flat.find().populate("ownerID").exec();
    res.status(200).json({
        message: "Flats",
        data: flats
    })
}