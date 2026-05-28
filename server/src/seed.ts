import { User } from "./models/User.model";
import { Record } from "./models/Record.model";
import mongoose from "mongoose";
import { SEED_USERS, RECORD_TEMPLATES } from "../src/data";


const USER_INDICES_FOR_RECORDS = [
  2, 3, 4, 5, 2, 3, 4, 5, 2, 3, 4, 5, 2, 3, 4, 5,
];

export const seedDatabase = async (): Promise<void> => {
  const userCount = await User.countDocuments();
  const recordCount = await Record.countDocuments();

  if (userCount > 0 && recordCount > 0) {
    return;
  }

  console.log("Seeding database...");

  let savedUsers: mongoose.Document[] = [];

  if (userCount === 0) {
    const userDocs = SEED_USERS.map((u) => new User(u));
    savedUsers = await Promise.all(userDocs.map((u) => u.save()));
    console.log(`${savedUsers.length} users created`);
  } else {
    savedUsers = await User.find().sort({ createdAt: 1 });
  }

  if (recordCount === 0) {
    const generalUsers = savedUsers.slice(2);

    const recordDocs = RECORD_TEMPLATES.map((template, i) => {
      const owner =
        generalUsers[USER_INDICES_FOR_RECORDS[i] - 2] ?? generalUsers[0];
      const daysOffset = (i + 1) * 5;
      return new Record({
        ...template,
        assignedTo: (owner as any)._id,
        dueDate: new Date(Date.now() + daysOffset * 24 * 60 * 60 * 1000),
      });
    });

    await Promise.all(recordDocs.map((r) => r.save()));
    console.log(`${recordDocs.length} records created`);
  }

  console.log("🌱  Seed complete");
  console.log("");
  console.log("   Test credentials:");
  console.log(
    "   Admin -> userId: admin001  password: admin123  role: Admin"
  );
  console.log(
    "   Admin -> userId: admin002  password: admin123  role: Admin"
  );
  console.log(
    "   General User ->  userId: user001   password: user123   role: General User"
  );
  console.log(
    "   General User ->  userId: user002   password: user123   role: General User"
  );
};
