import pool from "../utils/database";

export const getVehicleStatusForReport = async (startDate: string, endDate: string) => {
  const result = await pool.query(
    `SELECT 
       v.name as vehicle_name,
       v.license_plate,
       vs.status,
       vs.location,
       vs.date,
       vs.timestamp
     FROM vehicle_status vs
     JOIN vehicles v ON vs.vehicle_id = v.id
     WHERE vs.date BETWEEN $1 AND $2
     ORDER BY v.name, vs.date, vs.timestamp`,
    [startDate, endDate]
  );
  
  return result.rows;
};