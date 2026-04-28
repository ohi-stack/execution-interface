import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.product.createMany({
    data: [
      { id: 'product_pdf_foundations', name: 'Onegodian Foundations PDF', type: 'pdf', priceCents: 1900 },
      { id: 'product_course_alignment', name: 'Alignment Mastery Course', type: 'course', priceCents: 4900 },
      { id: 'product_toolkit_builder', name: 'Builder Toolkit', type: 'toolkit', priceCents: 9900 }
    ],
    skipDuplicates: true
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
const products = [
  { id: 'product_pdf_foundations', name: 'Onegodian Foundations PDF', type: 'pdf', priceCents: 1900 },
  { id: 'product_course_alignment', name: 'Alignment Mastery Course', type: 'course', priceCents: 4900 },
  { id: 'product_toolkit_builder', name: 'Builder Toolkit', type: 'toolkit', priceCents: 9900 }
] as const;

async function main() {
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

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
