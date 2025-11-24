import { Types } from "mongoose";

type TJobType = 'full_time' | 'part_time' | 'freelance' | 'contact';


export interface IJob {
    title: string;
    categoryId: Types.ObjectId;
    jobType: TJobType;
    experience: 'apprentice' | 'newly_qualified' | '1_3_years' | '3_5_years' | '5_years_plus' | 'n/a';
    startDate: Date;
    endDate?: Date;
    skills: string[];
    benefits?: string;
    rateType: 'hourly' | 'daily' | 'weekly' | 'monthly' | 'annual';
    minRange: number;
    maxRange: number;
    location: {
        type: 'Point';
        coordinates: [number, number]; // [longitude, latitude]
    };
    address: string;
    postalCode: string;
    description: string;
}