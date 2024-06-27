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
  const filter = req.query.filter || {};
  const queryfilter = {};
  const ageMin = filter.ageMin ? parseInt(filter.ageMin) : null;
  const ageMax = filter.ageMax ? parseInt(filter.ageMax) : null;
  const today = new Date();

  if (filter.role) {
    queryfilter.role = { $eq: filter.role };
  }
  if (filter.firstName) {
    queryfilter.firstName = { $eq: filter.firstName };
  }
  if (filter.lastName) {
    queryfilter.lastName = { $eq: filter.lastName };
  }
  if (filter.flatCountMin) {
    queryfilter.flatCount = { $gte: parseInt(filter.flatCountMin) };
  }
  if (filter.flatCountMax) {
    queryfilter.flatCount = { $lte: parseInt(filter.flatCountMax) };
  }
  if(filter.flatCountMin && filter.flatCountMax) {
    queryfilter.flatCount = { $gte: parseInt(filter.flatCountMin), $lte: parseInt(filter.flatCountMax) };
  }
  if (ageMin) {
    const dateMin = new Date(today.setFullYear(today.getFullYear() - ageMin));
    queryfilter.birthday = { ...queryfilter.birthday, $lte: dateMin };
  }
  if (ageMax) {
    const dateMax = new Date(today.setFullYear(today.getFullYear() - ageMax));
    queryfilter.birthday = { ...queryfilter.birthday, $gte: dateMax };
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

exports.deleteUserById = async (req, res) => {
  try {
    const userId = req.params.id

    const result = await User.deleteOne({ _id: userId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully", data: result });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(400).json({ message: "fail", data: err });
  }
}
