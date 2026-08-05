// eslint-disable-next-line @typescript-eslint/no-require-imports
require("dotenv").config();
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("MONGODB_URI is required to apply MongoDB indexes.");

async function main() {
  const databaseName = process.env.MONGODB_DATABASE || new URL(uri).pathname.replace(/^\//, "");
  if (!databaseName) throw new Error("MONGODB_DATABASE is required when MONGODB_URI has no database path.");
  const client = new MongoClient(uri, { appName: "PetSaathi Web index manager" });
  try {
    await client.connect();
    const collection = client.db(databaseName).collection("Booking");
    const name = "Booking_referenceId_key";
    const indexes = await collection.listIndexes().toArray();
    if (indexes.some((index) => index.name === name)) await collection.dropIndex(name);
    await collection.createIndex({ referenceId: 1 }, { name, unique: true, partialFilterExpression: { referenceId: { $type: "string" } } });
    console.log("Applied the optional booking-reference partial unique index.");
  } finally {
    await client.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
