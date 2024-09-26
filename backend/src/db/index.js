import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log('PostgreSQL connected successfully.');
  } catch (error) {
    console.error('Failed to connect to PostgreSQL:', error);
    process.exit(1); // Exit if the connection fails
  }
};

export { prisma, connectDB };
