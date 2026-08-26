import bcrypt from "bcrypt";
import { pool } from "../src/configuration/db";

async function seedAdmin() {
    try {
        const email = "admin@exam.com";
        const password = "Admin123";

        const existingAdmin = await pool.query(
            `SELECT id FROM users WHERE email = $1`,
            [email]
        );

        if (existingAdmin.rows.length > 0) {
            console.log("The admin panel already exists.");
            return;
        }

        const passwordHash = await bcrypt.hash(password, 10);

        await pool.query(
            `INSERT INTO users
                (first_name, last_name, email, password_hash, role, is_active)
             VALUES
                ($1, $2, $3, $4, 'ADMIN', true)`,
            ["Admin", "Exam", email, passwordHash]
        );

        console.log("Admin created successfully.");
    } catch (error) {
        console.error("Error occurred while creating the admin :", error);
    } finally {
        await pool.end();
    }
}

seedAdmin();