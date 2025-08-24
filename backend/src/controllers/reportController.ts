import { Request, Response } from 'express';
import * as XLSX from 'xlsx';
import { getVehicleStatusForReport } from '../services/vehicleService';
import { z } from 'zod';

const reportSchema = z.object({
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/)
});

export const generateVehicleReport = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = reportSchema.parse(req.query);
    
    console.log('📊 Generating report from', startDate, 'to', endDate);

    const data = await getVehicleStatusForReport(startDate, endDate);
    
    if (data.length === 0) {
      return res.status(404).json({ error: 'No data found for the selected date range' });
    }

    // Create workbook
    const workbook = XLSX.utils.book_new();
    
    // Prepare data for Excel
    const excelData = data.map((item: { vehicle_name: any; license_plate: any; status: any; location: any; date: any; timestamp: string | number | Date; })  => ({
      'Vehicle Name': item.vehicle_name,
      'License Plate': item.license_plate,
      'Status': item.status,
      'Location': item.location || 'N/A',
      'Date': item.date,
      'Time': new Date(item.timestamp).toLocaleTimeString(),
      'Timestamp': new Date(item.timestamp).toISOString()
    }));
    
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Vehicle Report');
    
    // Generate buffer
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    
    // Set headers for file download
    res.setHeader('Content-Disposition', `attachment; filename="vehicle-report-${startDate}-to-${endDate}.xlsx"`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Length', buffer.length);
    
    console.log('✅ Report generated successfully:', data.length, 'records');
    res.send(buffer);

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD' });
    }
    console.error('Report generation error:', error);
    res.status(500).json({ error: 'Failed to generate report' });
  }
};