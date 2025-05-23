import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOperatingHours {
  from: string;
  to: string;
  days: Array<'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday'>;
}

export interface IService {
  name: string;
  description: string;
}

export interface IHospital extends Document {
  name: string;
  size: 'Small' | 'Medium' | 'Large';
  location: string;
  totalBeds: number;
  operatingHours: IOperatingHours;
  services: IService[];
  createdAt: Date;
  updatedAt: Date;
}

const OperatingHoursSchema = new Schema<IOperatingHours>({
  from: { type: String, required: [true, "Operating hours 'from' time is required."], match: [/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid 'from' time format. Use HH:MM (e.g., 09:00)."] },
  to: { type: String, required: [true, "Operating hours 'to' time is required."], match: [/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid 'to' time format. Use HH:MM (e.g., 17:00)."] },
  days: {
    type: [String],
    required: [true, "Operating days are required."],
    enum: {
        values: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        message: '{VALUE} is not a supported day.'
    },
    validate: {
        validator: (v: string[]) => Array.isArray(v) && v.length > 0,
        message: 'At least one operating day must be specified.'
    },
  },
}, { _id: false });

const ServiceSchema = new Schema<IService>({
  name: { type: String, required: [true, "Service name is required."], trim: true },
  description: { type: String, required: [true, "Service description is required."], trim: true },
}, { _id: false });

const HospitalSchema = new Schema<IHospital>({
  name: { type: String, required: [true, "Hospital name is required."], trim: true, unique: true },
  size: { type: String, required: [true, "Hospital size is required."], enum: { values: ['Small', 'Medium', 'Large'], message: '{VALUE} is not a supported hospital size.'} },
  location: { type: String, required: [true, "Hospital location is required."], trim: true },
  totalBeds: { type: Number, required: [true, "Total beds count is required."], min: [1, 'Total beds must be at least 1.'] },
  operatingHours: { type: OperatingHoursSchema, required: [true, "Operating hours are required."] },
  services: {
    type: [ServiceSchema],
    required: [true, "At least one service must be provided."],
    validate: {
        validator: (v: IService[]) => Array.isArray(v) && v.length > 0,
        message: 'Services array cannot be empty. At least one service is required.'
    },
  },
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

// Prevent model recompilation in Next.js dev mode
const Hospital: Model<IHospital> = mongoose.models.Hospital || mongoose.model<IHospital>('Hospital', HospitalSchema);

export default Hospital;