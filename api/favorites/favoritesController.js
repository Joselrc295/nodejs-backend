const favoriteFlat = require('./favoritesModel')

exports.getFavorites = async (req, res) =>{
    let favorites = await favoriteFlat.find({userID: req.user._id}).populate({
        path:'flatID'
    })
    res.status(200).json({
        message: 'Success' ,
        data: favorites
    })
}
exports.addFavorites = async (req, res)=>{
    console.log(req.body)
    const favorite = new favoriteFlat(req.body);
    favorite.userID = req.user._id
    await favorite.save()
    res.status(201).json({
        message: 'Saved',
        data: favorite 
    })
}

exports.removeFavorites = async (req, res)=>{
    const userId = req.user._id ;
    const data = req.params.id;
    console.log(userId , data)
    const response = await favoriteFlat.deleteOne({userID: userId, flatID: data})
    res.status(200).json({
        status: 'succes' ,
        data : response
    })
}

exports.getFavoritesHome = async (req, res) =>{
    let favorites = await favoriteFlat.find({userID: req.user._id})
    res.status(200).json({
        message: 'Success' ,
        data: favorites
    })
}