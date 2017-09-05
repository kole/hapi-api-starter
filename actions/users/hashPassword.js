import bcrypt from 'bcrypt';

export default function hashPassword(password) {
    // bcrypt the password string for safe storage
    return new Promise((resolve, reject) => {
        return bcrypt.hash(password, 10).then((hash) => {
            if (hash) {
                return resolve(hash);
            }
            return reject();
        });
    });
}
