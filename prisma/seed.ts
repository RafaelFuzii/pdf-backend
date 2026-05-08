
import bcrypt from 'bcryptjs';
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminEmail = 'admin@admin.com';

  // 1. Gera o hash da senha usando o bcrypt
  const hashedPassword = await bcrypt.hash('admin123', 8);

  // 2. O comando upsert procura pelo email. 
  // Se achar, não faz nada (update vazio). Se não achar, cria.
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {}, 
    create: {
      // O ID (uuid) será gerado automaticamente pelo Prisma conforme seu schema
      name: 'Administrador',
      email: adminEmail,
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log('✅ Usuário Admin verificado/criado');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });