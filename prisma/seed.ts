import { prisma } from "./../src/db/connect"
import { faker } from "@faker-js/faker"

async function main() {

    // Tömma databasen
     await prisma.post.deleteMany()
     await prisma.user.deleteMany()

    // Generera fake-användare
    // for (let i = 0; i < 100; i++) {
    //     const user = await prisma.user.create({
    //         data: {
    //             username: faker.internet.userName(),
    //             email: faker.internet.email(),
    //             password: faker.internet.password()
    //         }
    //     });

    //     // Generera fake-inlägg kopplat till användare
    //     for (let j = 0; j < 10; j++) {
    //         const post = await prisma.post.create({
    //             data: {
    //                 title: faker.lorem.sentence(),
    //                 content: faker.lorem.paragraph(3),
    //                 published: faker.datatype.boolean(),
    //                 authorId: user.id
    //             }
    //         })
    //     }

    // }
}

    main()
        .then(async () => {
            await prisma.$disconnect()
        })
        .catch(async (e) => {
            console.error(e)
            await prisma.$disconnect()
            process.exit(1)
        })