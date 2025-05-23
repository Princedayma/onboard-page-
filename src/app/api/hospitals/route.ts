import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/app/lib/dbConnect'; // Adjust path if your lib folder is elsewhere
import mongoose from 'mongoose';
import type { IHospital } from '@/app/models/Hospital';
const Hospital = mongoose.models.Hospital || require('@/app/models/Hospital').default;
import { z, ZodError } from 'zod';

// Zod schema for validating OperatingHours
const OperatingHoursZodSchema = z.object({
  from: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format for 'from'. Use HH:MM (e.g., 09:00)"),
  to: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format for 'to'. Use HH:MM (e.g., 17:00)"),
  days: z.array(z.enum(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]))
    .min(1, "At least one operating day is required."),
});

// Zod schema for validating Service
const ServiceZodSchema = z.object({
  name: z.string().min(1, "Service name cannot be empty."),
  description: z.string().min(1, "Service description cannot be empty."),
});

// Zod schema for validating the request body for creating a hospital
const CreateHospitalZodSchema = z.object({
  name: z.string().min(1, "Hospital name cannot be empty."),
  size: z.enum(["Small", "Medium", "Large"], { errorMap: () => ({ message: "Size must be Small, Medium, or Large."}) }),
  location: z.string().min(1, "Location cannot be empty."),
  totalBeds: z.number().int().positive("Total beds must be a positive integer and greater than 0."),
  operatingHours: OperatingHoursZodSchema,
  services: z.array(ServiceZodSchema).min(1, "At least one service is required."),
});

export type CreateHospitalRequestBody = z.infer<typeof CreateHospitalZodSchema>;

export async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  switch (req.method) {
    case 'GET':
      try {
        const hospitals: IHospital[] = await Hospital.find({});
        res.status(200).json({ success: true, data: hospitals });
      } catch (error) {
        console.error("GET /api/hospitals error:", error);
        res.status(500).json({ success: false, error: 'Server error fetching hospitals.' });
      }
      break;

    case 'POST':
      try {
        // Validate request body using Zod
        const validationResult = CreateHospitalZodSchema.safeParse(req.body);

        if (!validationResult.success) {
          return res.status(400).json({
            success: false,
            error: 'Validation failed.',
            details: validationResult.error.flatten().fieldErrors,
          });
        }

        // Type assertion after successful validation
        const hospitalData = validationResult.data as CreateHospitalRequestBody;

        // Mongoose will handle unique 'name' check and other schema validations
        const newHospital = await Hospital.create(hospitalData);
        res.status(201).json({ success: true, data: newHospital });

      } catch (error) {
        console.error("POST /api/hospitals error:", error);

        if (error instanceof ZodError) { // Should be caught by safeParse, but as a fallback
          return res.status(400).json({
            success: false,
            error: 'Validation error (Zod).',
            details: error.flatten().fieldErrors,
          });
        }

        // Handle Mongoose validation errors (e.g. from schema constraints)
        if ((error as any).name === 'ValidationError') {
          return res.status(400).json({
            success: false,
            error: 'Database validation failed.',
            details: (error as any).errors,
          });
        }

        // Handle Mongoose duplicate key error for 'name'
        if ((error as any).code === 11000) {
          // Extract the field that caused the duplicate key error if possible
          const field = Object.keys((error as any).keyPattern || {})[0];
          const value = (error as any).keyValue ? (error as any).keyValue[field] : 'unknown';
          return res.status(409).json({
            success: false,
            error: `Conflict: A record with this ${field || 'field'} ('${value}') already exists.`,
          });
        }

        // Generic server error
        res.status(500).json({ success: false, error: 'Server error creating hospital.' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` });
      break;
  }
}