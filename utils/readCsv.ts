import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

export interface CsvEmployeeData {
  firstName: string;
  middleName: string;
  lastName: string;
  nationality: string;
  maritalStatus: string;
  dob: string;
  gender: 'Male' | 'Female';
  smoker: boolean;
  joinedDate: string;
  jobTitle: string;
  category: string;
  subUnit: string;
  location: string;
  status: string;
}

export function readPersonalDetailsFromCSV(filePath: string): CsvEmployeeData[] {
  const fullPath = path.resolve(filePath);
  const fileContent = fs.readFileSync(fullPath, 'utf8');

  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });

  return records.map((row: any): CsvEmployeeData => ({
    firstName: row.firstName,
    middleName: row.middleName,
    lastName: row.lastName,
    nationality: row.nationality,
    maritalStatus: row.maritalStatus,
    dob: row.dob,
    gender: row.gender as 'Male' | 'Female',
    smoker: row.smoker.toLowerCase() === 'true',
    joinedDate: row.joinedDate,
    jobTitle: row.jobTitle,
    category: row.category,
    subUnit: row.subUnit,
    location: row.location,
    status: row.status,
  }));
}
