const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main(){
  const email = 'placement@tiet.edu';
  const password = 'Admin@123';
  const hash = await bcrypt.hash(password, 10);

  await prisma.user.upsert({
    where: { email },
    update: { passwordHash: hash, role: 'PLACEMENT_CELL' },
    create: { email, passwordHash: hash, role: 'PLACEMENT_CELL' }
  });

  console.log('PlacementCell admin seeded:', email, 'password:', password);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
