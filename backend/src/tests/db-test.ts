import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testConnection() {
  try {
    // Create a test user
    const user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        password: 'test123',
        firstName: 'Test',
        lastName: 'User',
        role: 'JOB_SEEKER'
      }
    });
    console.log('✅ Successfully created test user:', user);

    // Create a test company
    const company = await prisma.company.create({
      data: {
        name: 'Test Company',
        description: 'A test company',
        website: 'https://testcompany.com',
        location: 'Test Location'
      }
    });
    console.log('✅ Successfully created test company:', company);

    // Create a test job posting
    const jobPosting = await prisma.jobPosting.create({
      data: {
        title: 'Test Job',
        description: 'A test job posting',
        location: 'Remote',
        salary: '$100k-$150k',
        type: 'FULL_TIME',
        companyId: company.id,
        userId: user.id
      }
    });
    console.log('✅ Successfully created test job posting:', jobPosting);

    // Clean up test data
    await prisma.jobPosting.delete({ where: { id: jobPosting.id } });
    await prisma.company.delete({ where: { id: company.id } });
    await prisma.user.delete({ where: { id: user.id } });
    console.log('✅ Successfully cleaned up test data');

  } catch (error) {
    console.error('❌ Database test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection(); 