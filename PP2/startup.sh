if ! npm i > log.txt; then 
    echo "Failed to install dependencies";
    exit 1;
fi
echo "Dependencies installed successfully";

# if ! npx prisma migrate dev --name init >> log.txt; then 
#     echo "Failed to migrate database";
#     exit 1;
# fi
# echo "Database migrated successfully";

# if ! npx prisma generate >> log.txt; then 
#     echo "Failed to generate Prisma Client";
#     exit 1;
# fi
# echo "Prisma Client generated successfully";

if [ -f .env ]; then
    echo ".env file already exists. Deleting it..."
    rm .env
fi

echo "SALT_ROUNDS=\"edit me\"" >> .env
echo "JWT_SECRET=\"edit me\"" >> .env
echo "JWT_REFRESH_SECRET=\"edit me\"" >> .env
echo "ADMIN_KEY=\"123\"" >> .env
echo ".env file created successfully";

if ! python3 --version >> log.txt; then 
    echo "Python not found";
    exit 1;
fi
echo "Python found";

if ! gcc -v >> log.txt 2>&1; then 
    echo "GCC not found";
    exit 1;
fi
echo "GCC found";

if ! g++ -v >> log.txt 2>&1; then 
    echo "G++ not found";
    exit 1;
fi
echo "G++ found";

if ! java --version >> log.txt; then 
    echo "Java not found";
    exit 1;
fi
echo "Java found";

if ! node --version >> log.txt; then 
    echo "Node.js not found";
    exit 1;
fi
echo "Node.js found";

if ! node lib/Startup/addAdmin.mjs; then 
    echo "Failed to add admin";
    exit 1;
fi
echo "Admin added successfully";
