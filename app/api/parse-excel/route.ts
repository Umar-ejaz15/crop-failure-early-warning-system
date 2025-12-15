import { NextRequest, NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const filename = searchParams.get('file');

  if (!filename) {
    return NextResponse.json({ error: 'File parameter required' }, { status: 400 });
  }

  try {
    const filePath = path.join(process.cwd(), filename);
    
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    const workbook = XLSX.readFile(filePath);
    const sheetNames = workbook.SheetNames;
    
    const data: any = {};
    
    sheetNames.forEach(sheetName => {
      const worksheet = workbook.Sheets[sheetName];
      data[sheetName] = XLSX.utils.sheet_to_json(worksheet);
    });

    return NextResponse.json({
      filename,
      sheets: sheetNames,
      data
    });
  } catch (error: any) {
    console.error('Error parsing Excel file:', error);
    return NextResponse.json(
      { error: 'Failed to parse Excel file', details: error.message },
      { status: 500 }
    );
  }
}
