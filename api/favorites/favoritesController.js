const favoriteFlat = require('./favoritesModel')

exports.getFavorites = async (req, res) =>{
    try{
    let favorites = await favoriteFlat.find({userID: req.user._id}).populate({
        path:'flatID'
    })
    res.status(200).json({
        message: 'Success' ,
        data: favorites
    })
    }catch(err){
        console.log(err)
    }
}
exports.addFavorites = async (req, res)=>{
    try{
    console.log(req.body)
    const favorite = new favoriteFlat(req.body);
    favorite.userID = req.user._id
    await favorite.save()
    res.status(201).json({
        message: 'Saved',
        data: favorite 
    })
    }catch(err){
        console.log(err)
    }
}

exports.removeFavorites = async (req, res)=>{
    try{
    const userId = req.user._id ;
    const data = req.params.id;
    console.log(userId , data)
    const response = await favoriteFlat.deleteOne({userID: userId, flatID: data})
    res.status(200).json({
        status: 'succes' ,
        data : response
    })
    }catch(err){
        console.log(err)
    }
}

exports.getFavoritesHome = async (req, res) =>{
    try{
    let favorites = await favoriteFlat.find({userID: req.user._id})
    res.status(200).json({
        message: 'Success' ,
        data: favorites
    })
    }catch(err){
        console.log(err)
    }
}