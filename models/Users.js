const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const userSchema = Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, default: "user", enum: ["user", "admin"] },
    balance: { type: Number, default: 200000000 },
    avatarUrl: {
      type: String,
      require: true,
      default:
        "https://res.cloudinary.com/tanvo/image/upload/v1627371374/coderschool/anonymus_avatar_unisex_rogach.jpg",
    },
    cart: [
      {
        productId: { type: Schema.Types.ObjectId, ref: "Products" },
        quantity: { type: Number, default: 1, require: true },
      },
    ],
    orders: [{ type: Schema.Types.ObjectId }],
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);
userSchema.plugin(require("./plugins/isDeletedFalse"));

userSchema.methods.toJSON = function () {
  const obj = this._doc;
  delete obj.password;
  delete obj.emailVerified;
  delete obj.emailVerificationCode;
  delete obj.isDeleted;
  return obj;
};

userSchema.methods.generateToken = async function () {
  const accessToken = await jwt.sign({ _id: this._id }, JWT_SECRET_KEY, {
    expiresIn: "7d",
  });
  return accessToken;
};

const Users = mongoose.model("Users", userSchema);
module.exports = Users;
