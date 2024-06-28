const favoriteFlat = require('./favoritesModel')

exports.getFavorites = async (req, res) =>{
    let favorites = await favoriteFlat.find({userID: req.user._id})
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
