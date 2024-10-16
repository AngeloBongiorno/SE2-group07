const GENERIC_ERROR = "An error occurred";
const WRONG_FORMAT = "Wrong format";
const INVALID_FUNCTION_PARAMETER = "Invalid function parameter";

/**
 * Represents a generic error.
 */
class GenericError extends Error {
    customMessage: string;
    customCode: number;
    details: string;

    constructor(details: string) {
        super();
        this.customMessage = GENERIC_ERROR;
        this.customCode = 500;
        this.details = details;
    }
}

class WrongFormatError extends Error {
    customMessage: string;
    customCode: number;
    details: string | null;

    constructor(details: string | null) {
        super();
        this.customMessage = WRONG_FORMAT;
        this.customCode = 400;
        this.details = details;
    }
}

class InvalidFunctionParameterError extends Error {
    customMessage: string;
    customCode: number;

    constructor() {
        super();
        this.customMessage = INVALID_FUNCTION_PARAMETER;
        this.customCode = 400;
    }
}

export { GenericError, WrongFormatError, InvalidFunctionParameterError };