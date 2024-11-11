import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

const languages = ['javascript', 'python', 'cpp', 'c', 'java'];

function getRandomLanguage() {
  return languages[Math.floor(Math.random() * languages.length)];
}

async function main() {
  // Create an admin and 5 additional users
  const admin = await prisma.user.create({
    data: {
      userName: 'adminUser',
      firstName: 'Alex',
      lastName: 'Morgan',
      email: 'admin@example.com',
      avatar: faker.image.avatar(),
      phoneNumber: faker.phone.number(),
      password: faker.internet.password(),
      role: 'admin',
    },
  });

  const users = await Promise.all(
    Array.from({ length: 5 }).map(() =>
      prisma.user.create({
        data: {
          userName: faker.internet.userName(),
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
          email: faker.internet.email(),
          avatar: faker.image.avatar(),
          phoneNumber: faker.phone.number(),
          password: faker.internet.password(),
          role: 'user',
        },
      })
    )
  );

  const allUsers = [admin, ...users];

  // Create Tags
  const tags = await Promise.all(
    ['JavaScript', 'Web Development', 'Machine Learning', 'Python', 'Data Science', 'Algorithms', 'Programming'].map((tag) =>
      prisma.tag.create({
        data: { name: tag },
      })
    )
  );

  // Create Code Templates with multiple tags and randomized languages
  const codeTemplates = await Promise.all(
    Array.from({ length: 28 }).map((_, i) =>
      prisma.codeTemplate.create({
        data: {
          title: `Code Snippet ${i + 1}`,
          explanation: faker.lorem.sentence(),
          code: `// Sample Code ${i + 1}\nconsole.log("Hello World ${i + 1}");`,
          language: getRandomLanguage(),
          tags: i % 2 === 0
            ? { connect: [tags[i % tags.length], tags[(i + 2) % tags.length]] }
            : undefined,
          createdUserId: allUsers[Math.floor(Math.random() * allUsers.length)].id,
        },
      })
    )
  );

  // Create Blog Posts with various combinations of Tags and Code Templates
  const blogPosts = await Promise.all(
    Array.from({ length: 22 }).map((_, i) =>
      prisma.blogPost.create({
        data: {
          title: `Blog Post Title ${i + 1}`,
          description: faker.lorem.sentence(),
          content: faker.lorem.paragraphs(),
          tags:
            i % 3 === 0
              ? { connect: [tags[i % tags.length], tags[(i + 1) % tags.length]] }
              : undefined,
          codeTemplates:
            i % 4 === 0
              ? { connect: [{ id: codeTemplates[i % codeTemplates.length].id }, { id: codeTemplates[(i + 3) % codeTemplates.length].id }] }
              : undefined,
          createdUserId: allUsers[Math.floor(Math.random() * allUsers.length)].id,
          rating: Math.floor(Math.random() * 5),
          reportcount: i % 5 === 0 ? Math.floor(Math.random() * 3) : 0,
          inappropriate: i % 10 === 0,
        },
      })
    )
  );

  // Create Nested Comment Threads with Multiple Layers and Replies
  const commentThreads = [];
  for (const blogPost of blogPosts.slice(0, 12)) {
    const baseComment = await prisma.comment.create({
      data: {
        content: faker.lorem.sentence(),
        createdUserId: allUsers[Math.floor(Math.random() * allUsers.length)].id,
        blogPostId: blogPost.id,
      },
    });
    commentThreads.push(baseComment);

    // Add nested replies in multiple layers
    let parentComment = baseComment;
    for (let layer = 1; layer < 4; layer++) {
      const reply = await prisma.comment.create({
        data: {
          content: `Nested reply layer ${layer}`,
          createdUserId: allUsers[layer % allUsers.length].id,
          blogPostId: blogPost.id,
          repliedToId: parentComment.id,
        },
      });
      parentComment = reply;
      commentThreads.push(reply);

      // Add multiple replies to each layer
      for (let i = 0; i < 3; i++) {
        const subReply = await prisma.comment.create({
          data: {
            content: `Additional nested reply layer ${layer}-${i}`,
            createdUserId: allUsers[Math.floor(Math.random() * allUsers.length)].id,
            blogPostId: blogPost.id,
            repliedToId: parentComment.id,
          },
        });
        commentThreads.push(subReply);
      }
    }
  }

  // Add isolated comments on various posts
  for (let i = 0; i < 50; i++) {
    const blogPost = blogPosts[Math.floor(Math.random() * blogPosts.length)];
    await prisma.comment.create({
      data: {
        content: faker.lorem.sentence(),
        createdUserId: allUsers[Math.floor(Math.random() * allUsers.length)].id,
        blogPostId: blogPost.id,
      },
    });
  }

  console.log("Data seeding completed with realistic structure and complexity!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });