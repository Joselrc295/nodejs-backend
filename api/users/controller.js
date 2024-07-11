const User = require("./model");
const Flats = require("../flats/model")
const favoritesModel = require("../favorites/favoritesModel");
const sendEmail = require("../../service/email")

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
    const dateMin = new Date(today);
    dateMin.setFullYear(dateMin.getFullYear() - ageMin);
    queryfilter.birthday = { ...queryfilter.birthday, $lte: dateMin };
  }
  if (ageMax) {
    const dateMax = new Date(today);
    dateMax.setFullYear(dateMax.getFullYear() - ageMax);
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
          _id: 1
        },
      },
    ]).collation({ locale: "en", strength: 2 });

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
    
    const flatsIds = await Flats.find({ownerID: userId})
    const ids = flatsIds.map(doc => doc._id);
    const flatsDeleted = await Flats.updateMany({ownerID: userId}, {status: false}, {
      new: true,
      runValidators: true
    })
    const deleteFavorites = await favoritesModel.deleteMany({flatID: {$in: ids}})

    const result = await User.deleteOne({ _id: userId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully", data: result });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(400).json({ message: "fail", data: err });
  }

exports.forgotPassword = async (req, res) => {
  const email = req.body.email;
  const validationEmail = await User.findOne({ email });

  if (!validationEmail) {
    return res.status(400).json({ message: "Email not found" });
  }

  const token = validationEmail.generatePasswordResetToken();
  await validationEmail.save();

  const htmlMessage = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Password</title>
    <style>
      @import url('https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css');
      body {
        font-family: 'Arial', sans-serif;
        background-color: #f8fafc;
        color: #333;
        padding: 20px;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        background-color: #ffffff;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }
      .header {
        text-align: center;
        padding: 20px;
        background-color: #333A93;
        color: white;
        border-radius: 8px 8px 0 0;
      }
      .content {
        padding: 20px;
      }
      .button {
        background-color: #3490dc;
        color: white;
        padding: 10px 20px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        margin: 20px 0;
        border-radius: 5px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Flat-Finder</h1>
      </div>
      <div class="content">
        <p>Hi,</p>
        <p>You have requested to reset your password. Use the following token to reset it:</p>
        <p ><strong>${token}</strong></p>
        <p>If you have not requested to reset your password, please ignore this email.</p>
        <p>Thanks,<br>The Flat-Finder Team</p>
      </div>
    </div>
  </body>
  </html>
  `;

  await sendEmail({
    email: email,
    subject: "Reset Password",
    message: htmlMessage, 
  });

  return res.status(200).json({ message: "Email sent successfully" });
};
exports.resetPassword = async(req, res) => {
    const token = req.body.token;
    const password =  req.body.password;
    const user = await User.findOne({resetPasswordToken:token});
    if (!user) {
        return res.status(400).json({ message: "Invalid token" });
    }
    user.resetPassword (password);
    user.save();
    return res.status(200).json({message:"Password reset successfully"})
}
