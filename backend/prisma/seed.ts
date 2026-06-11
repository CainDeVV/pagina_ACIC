import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin@acic.local';
  
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const saltRounds = 10;
    // Definindo a senha inicial como 'admin123'
    const passwordHash = await bcrypt.hash('admin123', saltRounds);

    await prisma.user.create({
      data: {
        name: 'Administrador ACIC',
        email: adminEmail,
        passwordHash,
        role: UserRole.ADMIN,
        active: true,
      },
    });

    console.log(`[Seed] Usuário ADMIN inicial criado com sucesso: ${adminEmail} (senha: admin123)`);
  } else {
    console.log(`[Seed] Usuário ADMIN inicial já existe: ${adminEmail}`);
  }
}

main()
  .catch((e) => {
    console.error('[Seed] Erro ao popular banco de dados:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
