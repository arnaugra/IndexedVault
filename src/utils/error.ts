export const createError = function(name: string) {
    return class CustomError extends Error {
        constructor(message: string) {
            super(message);
            this.name = name;
        }

        static errorIsInstanceOf(error: unknown, callback: (error: CustomError) => void): void{
            if (error instanceof this) {
                callback(error);
            }
        }

    }
}
