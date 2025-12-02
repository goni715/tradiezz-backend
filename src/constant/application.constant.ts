import { TApplicationStatus, TWorkStatus } from "../interfaces/application.interface";

export const APPLICATION_STATUS_VALUES : TApplicationStatus[] = ["applied", "accepted", "rejected", "cancelled"];
export const WORK_STATUS_VALUES : TWorkStatus[] = ["pending", "running", "completed", "completed"];