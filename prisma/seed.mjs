import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const requiredUsers = [1, 2, 3].map((index) => ({
  fullName: process.env[`SEED_USER_${index}_NAME`],
  email: process.env[`SEED_USER_${index}_EMAIL`]?.toLowerCase(),
  password: process.env[`SEED_USER_${index}_PASSWORD`],
}));

function assertUserConfig(user, index) {
  if (!user.fullName || !user.email || !user.password) {
    throw new Error(`Faltan variables SEED_USER_${index}_NAME, SEED_USER_${index}_EMAIL o SEED_USER_${index}_PASSWORD`);
  }
}

async function main() {
  for (const [index, user] of requiredUsers.entries()) {
    assertUserConfig(user, index + 1);
    const passwordHash = await bcrypt.hash(user.password, 12);

    await prisma.user.upsert({
      where: {
        email: user.email,
      },
      update: {
        fullName: user.fullName,
        passwordHash,
        isActive: true,
      },
      create: {
        fullName: user.fullName,
        email: user.email,
        passwordHash,
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
