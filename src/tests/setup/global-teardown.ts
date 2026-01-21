export default async function globalTeardown() {
  try {
    //clean up the database
  } catch (error) {
    console.error("Failed to connect to the database:", error);
    process.exit(1);
  }
}
