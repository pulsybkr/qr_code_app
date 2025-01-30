import bcrypt from 'bcrypt';

export const passwordHash = (password: string) => {
    return bcrypt.hashSync(password, 10);
}

export const passwordCompare = (password: string, hash: string) => {
    return bcrypt.compareSync(password, hash);
}

export const generateRandomPassword = () => {
    return Math.random().toString(36).substring(2, 8) + Math.random().toString(36).substring(2, 8);
}
