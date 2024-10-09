/**
 * Represents an error for invalid input when interacting with the DB
 */

const INVALID_INPUT = "An invalid input was provided";
const ITEM_ALREADY_EXISTS = "Item id already in use!";
const ITEM_NOT_FOUND = "This item does not exist in the database";

class InvalidInputError extends Error {


    customMessage: string;
    customCode: number;

    constructor() {
        super();
        this.customMessage = INVALID_INPUT;
        this.customCode = 500;
    }
}

class ItemAlreadyExistsError extends Error {
    customMessage: string;
    customCode: number;

    constructor() {
        super();
        this.customMessage = ITEM_ALREADY_EXISTS;
        this.customCode = 500;
    }
}


class ItemNotFoundError extends Error {
    customMessage: string;
    customCode: number;

    constructor() {
        super();
        this.customMessage = ITEM_NOT_FOUND;
        this.customCode = 500;
    }
}




export { InvalidInputError, ItemAlreadyExistsError, ItemNotFoundError } 
