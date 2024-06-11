import { prisma } from "../../db/connect";
import { PrismaClient, Prisma } from '@prisma/client';
import { Request, Response } from 'express'; // typescript
import bcrypt from "bcrypt";


interface Query {
  limit?: string;
  sort?: string; // TODO - välj mellan valbara keys
  order?: 'asc' | 'desc'
}

/**
 * @description Get all users
 * @route GET /users
 */
export async function getUsers(req: Request<{}, {}, {}, Query>, res: Response) {

  //api/users/?limit=21&sort=username&order=asc
  // limit - pagination - default 10
  // sort - vad som man kan sorteras på - default "id"
  // order - stigande eller fallande - default "asc"
  const limit: number = req.query.limit ? parseInt(req.query.limit) : 10;
  const sortField = req.query.sort || 'id';
  const sortOrder = req.query.order || 'asc'

  const sort = {[sortField]: sortOrder} 


  console.log("Limit", limit, "SortField", sortField, "SortOrder", sortOrder)

  // use prisma to get all users with error handling
  try {
    const users = await prisma.user.findMany({
      take: limit, // Pagination, hur mycke tper request
      orderBy: sort // Sorterar på viss key och och stigande eller fallende ordning
     });

    // if no users are found, return a 404 error
    if (!users.length)
      return res.status(404).json({ message: "No users found" });

    res.status(200).json(users);
  } catch (error) {
    console.error("Error details:", error);
    res.status(500).json({ error: "Database query failed!" });
  }

  //   try {
  //     const result = await query("SELECT * FROM users");

  //     if (!result.length)
  //       return res.status(404).json({ message: "No users found" });

  //     res.status(200).json(result);
  //   } catch (error) {
  //     console.error("Error details:", error);

  //     res.status(500).json({ error: "Database query failed!" });
  //   }
}

/**
 * @description Get user
 * @route GET /users/:id
 */

export async function getUser(req: Request, res: Response) {
  // Rewrite to prism with error handling
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(id)
      }
    });

    if (!user)
      return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  }
  catch (error) {
    console.error("Error details:", error);
    res.status(500).json({ error: "Database query failed!" });
  }

  // try {
  //   const { id } = req.params;

  //   const result = await query("SELECT * FROM users WHERE id = ?", [id]);

  //   if (!result.length)
  //     return res.status(404).json({ message: "User not found" });

  //   res.status(200).json(result[0]);
  // } catch (error) {
  //   console.error("Error details:", error);

  //   res.status(500).json({ error: "Database query failed!" });
  // }
}

/**
 * @description Create user
 * @route POST /users/new
 */
export async function createUser(req: Request, res: Response) {
  // Rewrite to prism with error handling

  try {
    const { username, password, email } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email: email
      }
    });

    if (existingUser) {
      return res.status(400).json({ error: "User with this email already exists" });
    }

    // Krypterar lösenordet
    const saltRounds = 10;
    const hashedPassword = bcrypt.hashSync(password, saltRounds);

    const user = await prisma.user.create({
      data: {
        username: username,
        password: hashedPassword,
        email: email
      }
    });

    res.status(201).json({ id: user.id, message: "User created!" });
  } catch (error) {
    console.error("Error details:", error);

    res.status(500).json({ error: "Database query failed!" });
  }


  // try {
  //   const { username, password, email } = req.body;

  //   // Check if user already exists
  //   const existingUser = await query("SELECT id FROM users WHERE email = ?", [email]);
  //   if (existingUser.length > 0) {
  //     return res.status(400).json({ error: "User with this email already exists" });
  //   }

  //   // Krypterar lösenordet
  //   const saltRounds = 10;
  //   const hashedPassword = bcrypt.hashSync(password, saltRounds);

  //   const result = await query(
  //     "INSERT INTO users (username, password, email) VALUES (?, ?, ?)",
  //     [username, hashedPassword, email]
  //   );

  //   if (result.affectedRows < 1)
  //     return res.status(400).json({ error: "User not created!" });

  //   res.status(201).json({ id: result.insertId, message: "User created!" });
  // } catch (error) {
  //   console.error("Error details:", error);

  //   res.status(500).json({ error: "Database query failed!" });
  // }
}

/**
 * @description Update user
 * @route PUT /users/:id
 */

export async function updateUser(req: Request, res: Response) {

  //rewrite to prism with error handling

  try {
    const { id } = req.params;
    const { username, password, email } = req.body;
    console.log("id", id, "username", username, "password", password, "email", email)

    // Krypterar lösenordet
    const saltRounds = 10;
    const hashedPassword = bcrypt.hashSync(password, saltRounds);

    const user = await prisma.user.update({
      where: {
        id: parseInt(id)
      },
      data: {
        username: username,
        password: hashedPassword,
        email: email
      }
    });

    if (!user)
      return res.status(404).json({ error: "User not updated!" });

    res.status(200).json({ message: "User updated!" });
  } catch (error) {
    console.error("Error details:", error);

    res.status(500).json({ error: "Database query failed!" });
  }



  // try {
  //   const { id } = req.params;
  //   const { username, password, email } = req.body;

  //   // Krypterar lösenordet
  //   const saltRounds = 10;
  //   const hashedPassword = bcrypt.hashSync(password, saltRounds);

  //   const result = await query(
  //     "UPDATE users SET username = ?, password = ?, email = ? WHERE id = ?",
  //     [username, hashedPassword, email, id]
  //   );

  //   if (result.affectedRows < 1)
  //     return res.status(404).json({ error: "User not updated!" });

  //   res.status(200).json({ message: "User updated!" });
  // } catch (error) {
  //   console.error("Error details:", error);

  //   res.status(500).json({ error: "Database query failed!" });
  // }
}

/**
 * @description Update user
 * @route DELETE /users/:id
 */

export async function deleteUser(req: Request, res: Response) {

  //rewrite to prism with error handling
  try {
    const { id } = req.params;

    // but I also need to delete the posts that belong to the user
    const posts = await prisma.post.deleteMany({
      where: {
        authorId: parseInt(id)
      }
    });

    const user = await prisma.user.delete({
      where: {
        id: parseInt(id)
      }
    });

    if (!user)
      return res.status(404).json({ error: "User not deleted!" });

    res.status(200).json({ message: "User deleted!" });
  } catch (error) {
    console.error("Error details:", error);
    res.status(500).json({ error: "Database query failed!" });
  }

  // try {
  //   const { id } = req.params;

  //   const result = await query("DELETE FROM users WHERE id = ?", [id]);


  //   if (result.affectedRows < 1)
  //     return res.status(404).json({ error: "User not deleted!" });

  //   res.status(200).json({ message: "User deleted!" });

  // } catch (error) {

  //   console.error("Error details:", error);
  //   res.status(500).json({ error: "Database query failed!" });
  // }
}