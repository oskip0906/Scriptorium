/*
Note: This code is entirely sourced from ChatGPT-4o.
It is used to generate detailed fake data for the database to test the application.
*/


import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

const languages = ['javascript', 'python', 'cpp', 'c', 'java', 'ruby', 'rust', 'swift', 'r', 'php', 'go'];

const languageCodeSamples = {
  javascript: (i: number) => `
  // JavaScript Example ${i}
  // FizzBuzz Algorithm
  for (let num = 1; num <= 15; num++) {
    if (num % 3 === 0 && num % 5 === 0) console.log('FizzBuzz');
    else if (num % 3 === 0) console.log('Fizz');
    else if (num % 5 === 0) console.log('Buzz');
    else console.log(num);
  }
  `,
  python: (i: number) => `
  # Python Example ${i}
  # Prime Number Check
  n = 29
  is_prime = True
  for i in range(2, int(n ** 0.5) + 1):
      if n % i == 0:
          is_prime = False
          break
  if is_prime:
      print(f"{n} is a prime number.")
  else:
      print(f"{n} is not a prime number.")
  `,
  cpp: (i: number) => `
  // C++ Example ${i}
  // Fibonacci Sequence
  #include <iostream>
  using namespace std;

  int main() {
      int t1 = 0, t2 = 1, nextTerm = 0, n = 10;
      cout << "Fibonacci Sequence up to " << n << " terms: ";
      for (int i = 1; i <= n; ++i) {
          cout << t1 << " ";
          nextTerm = t1 + t2;
          t1 = t2;
          t2 = nextTerm;
      }
      return 0;
  }
  `,
  c: (i: number) => `
  /* C Example ${i} */
  // Factorial Calculation
  #include <stdio.h>

  int main() {
      int n = 5, factorial = 1;
      for (int i = 1; i <= n; ++i) {
          factorial *= i;
      }
      printf("Factorial of %d is %d\\n", n, factorial);
      return 0;
  }
  `,
  java: (i: number) => `
  // Java Example ${i}
  // Sum of an Array
  public class Main {
      public static void main(String[] args) {
          int[] numbers = {1, 2, 3, 4, 5};
          int sum = 0;
          for (int num : numbers) {
              sum += num;
          }
          System.out.println("Sum of the array: " + sum);
      }
  }
  `,
  ruby: (i: number) => `
  # Ruby Example ${i}
  # Reverse a String
  str = "Hello, Ruby World!"
  puts "Original: #{str}"
  puts "Reversed: #{str.reverse}"
  `,
  rust: (i: number) => `
  // Rust Example ${i}
  // Find Maximum in a List
  fn main() {
      let numbers = vec![10, 20, 5, 40, 30];
      let max = numbers.iter().max().unwrap();
      println!("The maximum value in the list is: {}", max);
  }
  `,
  swift: (i: number) => `
    // Swift Example ${i}
    // Check for Palindrome
    let str = "racecar"
    if str == String(str.reversed()) {
        print("\\(str) is a palindrome.")
    } else {
        print("\\(str) is not a palindrome.")
    }
  `,
  r: (i: number) => `
  # R Example ${i}
  # Mean of a Vector
  numbers <- c(1, 2, 3, 4, 5)
  mean_value <- mean(numbers)
  cat("The mean of the vector is:", mean_value, "\\n")
`,
  php: (i: number) => `
  // PHP Example ${i}
  // Find Even Numbers
  <?php
  for ($i = 1; $i <= 10; $i++) {
      if ($i % 2 == 0) {
          echo $i . " is even\\n";
      }
  }
  ?>
  `,
  go: (i: number) => `
  // Go Example ${i}
  // Count Words in a String
  package main

  import (
      "fmt"
      "strings"
  )

  func main() {
      str := "This is a simple Go program"
      words := strings.Fields(str)
      fmt.Printf("The string contains %d words.\\n", len(words))
  }
  `,
};

function getRandomLanguage(): string {
  return languages[Math.floor(Math.random() * languages.length)];
}

function getRandomRating() {
  return Math.floor(Math.random() * 201) - 100; // Generates a rating between -100 and 100
}

async function main() {
  const admin = await prisma.user.create({
    data: {
      userName: 'adminUser',
      firstName: 'Alex',
      lastName: 'Morgan',
      email: 'admin@example.com',
      avatar: faker.image.avatar(),
      phoneNumber: faker.phone.number(),
      password: '123',
      role: 'admin',
    },
  });

  const users = await Promise.all(
    Array.from({ length: 5 }).map(() =>
      prisma.user.create({
        data: {
          userName: faker.internet.username(),
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          email: faker.internet.email(),
          avatar: faker.image.avatar(),
          phoneNumber: faker.phone.number(),
          password: '123',
          role: 'user',
        },
      })
    )
  );

  const allUsers = [admin, ...users];

  const tags = await Promise.all(
    [
      'JavaScript', 'Web Development', 'Machine Learning', 'Python', 'Data Science', 
      'Algorithms', 'Programming', 'AI', 'Cloud Computing', 'DevOps', 
      'Cybersecurity', 'Blockchain', 'IoT', 'Big Data', 'Mobile Development', 
      'Game Development', 'AR/VR', 'UI/UX Design', 'Software Testing', 'Database Management'
    ].map((tag) =>
      prisma.tag.create({ data: { name: tag } })
    )
  );

  const codeTemplates: { id: number }[] = [];
  for (const language of languages) {
    const numTemplates = Math.floor(Math.random() * 10) + 1; // 1 to 10 templates per language
    for (let i = 1; i <= numTemplates; i++) {
      const code = languageCodeSamples[language as keyof typeof languageCodeSamples](i);
      const template = await prisma.codeTemplate.create({
        data: {
          title: `${language} Code Example ${i}`,
          explanation: faker.lorem.sentence(),
          code,
          language,
          createdUserId: allUsers[Math.floor(Math.random() * allUsers.length)].id,
        },
      });
      codeTemplates.push(template);
    }
  }

  const blogPosts = await Promise.all(
    Array.from({ length: 50 }).map((_, i) =>
      prisma.blogPost.create({
        data: {
          title: `Blog Post Title ${i + 1}`,
          description: faker.lorem.sentence(),
          content: faker.lorem.paragraphs(),
          tags: i % 3 === 0
            ? { connect: [tags[i % tags.length], tags[(i + 1) % tags.length]] }
            : undefined,
          codeTemplates: i % 5 === 0
            ? { connect: [{ id: (codeTemplates[i % codeTemplates.length] as { id: number }).id }] }
            : undefined,
          createdUserId: allUsers[Math.floor(Math.random() * allUsers.length)].id,
          rating: getRandomRating(),
        },
      })
    )
  );

  const commentThreads = [];
  for (const blogPost of blogPosts) {
    if (Math.random() < 0.7) { // 70% chance to create a base comment
      const baseComment = await prisma.comment.create({
        data: {
          content: faker.lorem.sentence(),
          createdUserId: allUsers[Math.floor(Math.random() * allUsers.length)].id,
          blogPostId: blogPost.id,
          rating: getRandomRating(),
        },
      });
      commentThreads.push(baseComment);

      let parentComment = baseComment;
      for (let layer = 1; layer <= 5; layer++) {
        if (Math.random() < 0.5) { // 50% chance to create a nested reply
          const reply = await prisma.comment.create({
            data: {
              content: `Nested reply layer ${layer}`,
              createdUserId: allUsers[layer % allUsers.length].id,
              repliedToId: parentComment.id,
              rating: getRandomRating(),
            },
          });
          parentComment = reply;
          commentThreads.push(reply);

          for (let i = 0; i < 3; i++) {
            if (Math.random() < 0.3) { // 30% chance to create an additional nested reply
              const subReply = await prisma.comment.create({
                data: {
                  content: `Additional nested reply ${layer}-${i}`,
                  createdUserId: allUsers[Math.floor(Math.random() * allUsers.length)].id,
                  repliedToId: parentComment.id,
                  rating: getRandomRating(),
                },
              });
              commentThreads.push(subReply);
            }
          }
        }
      }
    }
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