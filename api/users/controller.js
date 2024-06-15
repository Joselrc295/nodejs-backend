const User = require("./model");
exports.update = (req, res) => {
  res.status(200).json({ message: "user updated" });
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
};
