import { test, expect, jest, describe, afterAll, afterEach, beforeAll, beforeEach} from "@jest/globals"
import { cleanup } from "../db/cleanup";

const URL = "/officequeue";


beforeAll(async () => {
    await cleanup();
})

afterAll(async () => {
    await cleanup();
})

describe("next customer with two queues", () => {
    
})