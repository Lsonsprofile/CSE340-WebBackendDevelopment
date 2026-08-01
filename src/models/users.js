import db from './db.js';

// import bcrypt for password hashing
import bcrypt from 'bcrypt';


const createUser = async (name, email, passwordHash) => {

    const defaultRole = 'user';

    const query = `
        INSERT INTO users 
        (name, email, password_hash, role_id)
        VALUES 
        ($1, $2, $3, 
        (SELECT role_id FROM roles WHERE role_name = $4))
        RETURNING user_id
    `;

    const queryParams = [
        name,
        email,
        passwordHash,
        defaultRole
    ];

    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to create user');
    }

    return result.rows[0].user_id;
};


const findUserByEmail = async (email) => {

    const query = `
        SELECT
            u.user_id,
            u.name,
            u.email,
            u.password_hash,
            r.role_name
        FROM users u
        JOIN roles r
        ON u.role_id = r.role_id
        WHERE u.email = $1
    `;

    const queryParams = [email];

    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        return null;
    }

    return result.rows[0];
};


const verifyPassword = async (password, passwordHash) => {

    return bcrypt.compare(password, passwordHash);

};


const authenticateUser = async (email, password) => {

    const user = await findUserByEmail(email);

    if (!user) {
        return null;
    }

    const passwordValid = await verifyPassword(
        password,
        user.password_hash
    );

    if (!passwordValid) {
        return null;
    }

    // Remove sensitive information before storing in session
    delete user.password_hash;

    return user;
};

// gets all registered users
const getAllUsers = async () => {

    const query = `
        SELECT
            u.name,
            u.email,
            r.role_name
        FROM users u
        JOIN roles r
        ON u.role_id = r.role_id
        ORDER BY u.name
    `;

    const result = await db.query(query);

    return result.rows;

};


export {
    createUser,
    authenticateUser,
    getAllUsers
};