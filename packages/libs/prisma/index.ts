import { PrismaClient } from '@prisma/client';

// declare global {
//   namespace globalThis {
//     var prismadb: PrismaClient ;
//   }
// }

// const prisma =  new PrismaClient();

// if (process.env.NODE_ENV !== 'production') {
//   global.prismadb = prisma;
// }

// export default prisma;

const prisma = new PrismaClient();

prisma
  .$connect()
  .then(() => {
    console.log('✅ Prisma connected successfully');
  })
  .catch((err) => {
    console.error('❌ Prisma connection failed:', err);
  });

if (process.env.NODE_ENV !== 'production') {
  global.prismadb = prisma;
}

export default prisma;
