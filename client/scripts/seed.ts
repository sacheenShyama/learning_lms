const {PrismaClient} = require('@prisma/client');

const database = new PrismaClient();
async function main() {
    try {
        await database.category.createMany({
            data: [
                {name: "Computer science"},
                {name: "Music"},
                {name: "Fitness"},
                {name: "Photography"},
                {name: "Accounting"},
                {name: "Engineering"},
                {name: "Filming"},

            ]
        })
    } catch (error) {
        console.log("error", error)
    }finally{
        await database.$disconnect();
    }
}
main();