import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema(
  {
    name:  {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,   /* never returned in queries unless explicitly .select('+password') */
    },
    phone: { type: String, default: '', trim: true },
    role:  { type: String, enum: ['student', 'admin'], default: 'student' },
  },
  {
    timestamps: true,
    collection: 'users',   /* explicit collection name inside 'global' database */
  }
);

/* Hash password only when it is modified */
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

/** Compare a plain-text candidate against the stored hash */
UserSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

/** Return a safe user object — strips password and __v */
UserSchema.methods.toSafeObject = function () {
  const { password, __v, ...safe } = this.toObject({ virtuals: false });
  safe.id = safe._id.toString();
  return safe;
};

/* Prevent model recompilation in Next.js hot-reload */
export default mongoose.models.User || mongoose.model('User', UserSchema);
