import { parse } from 'fast-csv';
import { Readable } from 'stream';
import { User } from 'src/models';
import axios from 'axios';

export const parseCSV = async (fileUrl: string): Promise<User[]> => {
  const response = await axios.get(fileUrl);

  const csvData = response.data;

  const csvStream = new Readable();
  csvStream.push(csvData);
  csvStream.push(null);
  return new Promise<User[]>((resolve, reject) => {
    const jsonArray: User[] = [];

    const parser = parse({ headers: true });

    parser.on('data', (data) => {
      jsonArray.push(data);
    });

    parser.on('end', () => {
      resolve(jsonArray);
    });

    parser.on('error', (error) => {
      reject(error);
    });

    csvStream.pipe(parser);
  });
};
