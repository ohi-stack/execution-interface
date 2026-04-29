import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const products = [
  { id: 'product_pdf_foundations', name: 'Onegodian Foundations PDF', type: 'pdf', priceCents: 1900 },
  { id: 'product_course_alignment', name: 'Alignment Mastery Course', type: 'course', priceCents: 4900 },
  { id: 'product_toolkit_builder', name: 'Builder Toolkit', type: 'toolkit', priceCents: 9900 }
] as const;

const adminEmail = process.env.SEED_ADMIN_EMAIL?.toLowerCase();
const adminPasswordHash = process.env.SEED_ADMIN_PASSWORD_HASH;
const adminName = process.env.SEED_ADMIN_NAME ?? 'ONEGODIAN Admin';

async function seedProducts() {
  for (const product of products) {
    await prisma.product.upsert({
      where: { id: product.id },
      update: {
        name: product.name,
        type: product.type,
        priceCents: product.priceCents
      },
      create: product
    });
  }
}

async function seedAdmin() {
  if (!adminEmail || !adminPasswordHash) {
    return;
  }

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      name: adminName,
      passwordHash: adminPasswordHash,
      role: 'admin'
    },
    create: {
      email: adminEmail,
      name: adminName,
      passwordHash: adminPasswordHash,
      role: 'admin'
    }
  });
}

async function main() {
  await seedProducts();
  await seedAdmin();
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
