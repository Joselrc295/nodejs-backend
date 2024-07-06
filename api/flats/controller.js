const Flat = require('./model')
const FavoriteRef = require('../favorites/favoritesModel')

exports.createFlats = async (req , res) =>{
    try{
        const flat = new Flat(req.body) ;
        flat.created = new Date() ;
        flat.modified = new Date() ;
        flat.ownerID = req.user._id ;
        flat.flatCreator = req.user.firstName ;
        flat.flatCreatorEmail = req.user.email ; 
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

exports.deleteFlat = async (req ,res) =>{
    const id = req.params.id
    const flatForDelete = await  Flat.findByIdAndUpdate(id , {status: false}, {
        new: true, 
        runValidators: true
    })
    const flatsDeleted = await FavoriteRef.deleteMany({flatID: id}) ;
    res.status(200).json({
        message: 'Success', 
        response: flatForDelete
    })


}

exports.getAllFlats = async (req , res) =>{
    const filters = req.query.filter || {}
    const queryfilter = {}
    if(filters.status){
        const statusP = filters.status =='true' ? true: false;
        queryfilter.status = {$eq: statusP}
    }
    console.log(queryfilter)
    if(filters.city){
        queryfilter.city = {$eq: filters.city}
    }
    if(filters.rentPriceMin && !filters.rentPriceMax){
        queryfilter.rentPrice = { $gte: parseInt(filters.rentPriceMin)}
    }
    if(filters.rentPriceMin && filters.rentPriceMax){
        queryfilter.rentPrice = { $gte: parseInt(filters.rentPriceMin), $lte: parseInt(filters.rentPriceMax)}
    }
    if(filters.areaSizeMin && !filters.areaSizeMax){
        queryfilter.areaSize = { $gte: parseInt(filters.areaSizeMin)}
    }
    if(filters.areaSizeMin && filters.areaSizeMax){
        queryfilter.areaSize = { $gte: parseInt(filters.areaSizeMin), $lte: parseInt(filters.areaSizeMax)}
    }
    const flats= await Flat.aggregate([
    {
        $match: queryfilter,
    },
    ])./*populate("ownerID")*/exec();
    res.status(200).json({
        message: "Flats",
        data: flats
    })
}

exports.getMyFlats = async (req ,res) =>{
    const filters = req.query.filter || {}
    const queryfilter = {}
    if(filters.status){
        const statusP = filters.status =='true' ? true: false;
        queryfilter.status = {$eq: statusP}
    }
    queryfilter.ownerID = req.user._id
    const myFlats = await Flat.aggregate([
        {
            $match: queryfilter
        }
    ])
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

exports.updateFlatById = async (req, res) =>{
    const id = req.params.id
    console.log(id)
    const updateData = req.body
    const updateFlat = await Flat.findByIdAndUpdate(id, updateData, {
        new: true, 
        runValidators: true
    })
    res.status(200).json({
        message: 'Success',
        data: updateFlat
    })
}