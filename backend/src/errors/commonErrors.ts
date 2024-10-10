const GENERIC_ERROR = "An error occurred";
const WRONG_FORMAT = "Wrong format";

/**
 * Represents a generic error.
 */
class GenericError extends Error {
    customMessage: string;
    customCode: number;

    constructor() {
        super();
        this.customMessage = GENERIC_ERROR;
        this.customCode = 500;
    }
}

class WrongFormatError extends Error {
    customMessage: string;
    customCode: number;

    constructor() {
        super();
        this.customMessage = WRONG_FORMAT;
        this.customCode = 400;
    }
}

export { GenericError, WrongFormatError };