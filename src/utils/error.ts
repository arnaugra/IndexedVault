export const createError = function(name: string) {
    return class CustomError extends Error {
        constructor(message: string) {
            super(message);
            this.name = name;
        }
    }
}
