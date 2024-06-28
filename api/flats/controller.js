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

exports.getMyFlats = async (req ,res) =>{
    const myFlats = await Flat.find({ownerID: req.user._id})
    res.status(200).json({
        message: "your flats" ,
        data: myFlats
    })
}

exports.getFlatByID = async (req , res) =>{
    const id = req.params.id
    const flat = await Flat.findById(id)
    res.status(200).json({
        status: 'success',
        data: flat
      });
}