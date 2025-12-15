import axios from 'axios';
import { NextResponse } from 'next/server';

export async function GET() {
  const options = {
    method: 'GET',
    url: 'https://meteostat.p.rapidapi.com/stations/daily',
    params: {
      station: '10637',
      start: '2020-01-01',
      end: '2020-01-31'
    },
    headers: {
      'x-rapidapi-key': '93714add56msh3fb690db6df11f6p16d7ffjsne1fd2ef6030f',
      'x-rapidapi-host': 'meteostat.p.rapidapi.com'
    }
  };

  try {
    const response = await axios.request(options);
    return NextResponse.json(response.data);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to fetch weather data' },
      { status: 500 }
    );
  }
}
