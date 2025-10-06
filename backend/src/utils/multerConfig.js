import multer from "multer";

// Use memory storage for serverless/object storage flows
const storage = multer.memoryStorage();

export const upload = multer({ storage });
