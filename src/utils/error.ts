export const createError = (name: string) => {
    return class CustomError extends Error {
        constructor(message: string) {
            super(message);
            this.name = name;
        }
    }
}
