import process from "process";
import app from "./app";
import { prisma } from "./lib/prisma";
import config from "./config";
const port = config.port

const main = async () => {
    try {
      await prisma.$connect();
      console.log("prisma database connected successfully")
        app.listen(port, () => {
            
            console.log(`Server is running on port ${port}`);
        });
    } catch (error) {
        console.error("Error starting server:", error);
        await prisma.$disconnect()
        process.exit(1);
    }
};

main();