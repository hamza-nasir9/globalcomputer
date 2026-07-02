/**
 * Admission model
 * Database: global | Collection: admissions
 */
import mongoose from 'mongoose';

const AdmissionSchema = new mongoose.Schema(
  {
    /* Tracking ID — unique human-readable identifier */
    trackingId:    { type: String, default: '', trim: true, index: true },

    /* Link to registered user — optional (local mode users not in DB) */
    userId:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, index: true },
    userEmail:     { type: String, default: '', lowercase: true, trim: true, index: true },

    /* Core required fields */
    fullName:      { type: String, required: [true, 'Full name is required'], trim: true },
    fatherName:    { type: String, default: '', trim: true },
    course:        { type: String, default: 'Not specified', trim: true },
    phone:         { type: String, default: '', trim: true },
    email:         { type: String, default: '', lowercase: true, trim: true },

    /* CNIC / Reg No */
    cnic:          { type: String, default: '', trim: true },
    regNo:         { type: String, default: '', trim: true },

    /* Personal details */
    address:       { type: String, default: '', trim: true },
    gender:        { type: String, default: '' },
    dob:           { type: String, default: '' },
    qualification: { type: String, default: '', trim: true },

    /* Extended fields from the physical form */
    profession:      { type: String, default: '', trim: true },
    guardianPhone:   { type: String, default: '', trim: true },
    whatsapp:        { type: String, default: '', trim: true },
    timing:          { type: String, default: '', trim: true },
    courseToJoin:    { type: String, default: '', trim: true },
    howKnew:         { type: String, default: '', trim: true },
    selectedCourses: { type: String, default: '', trim: true },

    /* Fee section */
    dateOfAdmission: { type: String, default: '' },
    monthlyFee:      { type: String, default: '' },
    admissionFee:    { type: String, default: '' },
    totalFee:        { type: String, default: '' },

    /* Photo */
    image:         { type: String, default: '' },

    /* Status managed by admin */
    status: {
      type: String,
      enum: ['Pending', 'Under Review', 'Approved', 'Rejected'],
      default: 'Pending',
      index: true,
    },
  },
  {
    timestamps: true,
    collection: 'admissions',
  }
);

AdmissionSchema.index({ createdAt: -1 });
AdmissionSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.models.Admission || mongoose.model('Admission', AdmissionSchema);
