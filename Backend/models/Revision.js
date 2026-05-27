import mongoose from 'mongoose';

const revisionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true,
    index: true
  },
  revisionDate: {
    type: Date,
    required: true,
    index: true
  },
  dayOffset: {
    type: Number,
    required: true // 1, 3, 7, 14, 21 etc.
  },
  status: {
    type: String,
    enum: ['pending', 'revised'],
    default: 'pending',
    index: true
  },
  revisedAt: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound indexes for efficient queries
revisionSchema.index({ userId: 1, revisionDate: 1, status: 1 });
revisionSchema.index({ userId: 1, questionId: 1, dayOffset: 1 }, { unique: true });

const Revision = mongoose.model('Revision', revisionSchema);

export default Revision;
