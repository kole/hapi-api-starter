import bcrypt from 'bcrypt';

export default function hashPassword(password) {
    // bcrypt the password string for safe storage
    return new Promise((resolve) => {
        return bcrypt.hash(password, 10).then((hash) => {
            resolve(hash);
        });
    });
}
