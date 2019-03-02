import { config } from 'dotenv';

config();

const jwtSecret = process.env.JWT_SECRET;

export default jwtSecret;
