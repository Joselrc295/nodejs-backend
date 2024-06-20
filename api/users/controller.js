const User = require("./model");

exports.updateUserById = async (req, res) => {
  try {
    const id = req.params.id;
    const userData = req.body;
    const user = await User.findByIdAndUpdate(id, userData, {
      new: true,
      runValidators: true
    });
    res.status(200).json({
      status: 'success',
      data: user,
      message: 'user updated'
    });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(400).json({
      status: 'fail',
      message: 'error' + err
    });
  }
};

exports.updateCurrentUser = async (req, res) => {
  try {
    const userId = req.user._id
    const userData = req.body;
    const user = await User.findByIdAndUpdate(userId, userData, {
      new: true,
      runValidators: true
    });
    res.status(200).json({
      status: 'success',
      data: user,
      message: 'user updated'
    });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(400).json({
      status: 'fail',
      message: 'error' + err
    });
  }
};
exports.getAllUsers = async (req, res) => {
  const filter = req.query || {};
  const queryfilter = {};

  if (filter.role) {
    queryfilter.role = { $eq: filter.role };
  }
  if (filter.flatCountMin) {
    queryfilter.flatCount = { $gte: parseInt(filter.flatCountMin) };
  }
  if (filter.flatCountMax) {
    queryfilter.flatCount = { $lte: parseInt(filter.flatCountMax) };
  }
  if (filter.ageMin) {
    queryfilter.age = { $gte: parseInt(filter.ageMin) };
  }
  if (filter.ageMax) {
    queryfilter.age = { $lte: parseInt(filter.ageMax) };
  }

  const orderBy = req.query.orderBy || "firstName";
  const order = parseInt(req.query.order) || 1;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  try {
    const users = await User.aggregate([
      {
        $lookup: {
          from: "flats",
          localField: "_id",
          foreignField: "ownerID",
          as: "flats",
        },
      },
      {
        $addFields: {
          flatCount: { $size: "$flats" },
        },
      },
      {
        $match: queryfilter,
      },
      {
        $skip: (page - 1) * limit,
      },
      {
        $limit: limit,
      },
      {
        $sort: {
          [orderBy]: order,
        },
      },
    ]);

    res.status(200).json({ message: "Users", data: users });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(400).json({
      status: 'fail',
      message: 'error' + err
    });
  }
};

exports.getUserById = async (req, res) => {
  try {
    let id = req.params.id;
    console.log("Fetching user with ID:", id);

    let user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: user
    });
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(400).json({
      status: 'fail',
      message: 'error' + err
    });
  }
};
