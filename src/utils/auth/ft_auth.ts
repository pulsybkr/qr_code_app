import bcrypt from 'bcrypt';

export const passwordHash = (password: string) => {
    return bcrypt.hashSync(password, 10);
}

export const passwordCompare = (password: string, hash: string) => {
    return bcrypt.compareSync(password, hash);
}