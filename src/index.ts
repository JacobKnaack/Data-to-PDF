import server from './server';
import dotenv from 'dotenv';

dotenv.config();

const PORT: number | string = process.env.PORT || 3333;

server.listen(PORT, () => {
  console.log(`PDF Service running :: ${PORT}`);
});

