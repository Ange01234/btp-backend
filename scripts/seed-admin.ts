import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '../.env') });

const DATABASE_URL = process.env.DATABASE_URL as string;

if (!DATABASE_URL) {
  console.error('DATABASE_URL is not defined in .env file');
  process.exit(1);
}

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String },
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

async function seedAdmin() {
  try {
    console.log('Connecting to:', DATABASE_URL.replace(/:([^:@]{8,})@/, ':****@')); // Mask password
    await mongoose.connect(DATABASE_URL);
    console.log('Connected to MongoDB');

    const adminEmail = 'admin@btp.com';
    const adminPassword = 'adminPassword123';
    const adminName = 'Administrator';

    const existingUser = await User.findOne({ email: adminEmail });

    if (existingUser) {
      console.log(`User with email ${adminEmail} already exists. Skipping.`);
    } else {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      const adminUser = new User({
        email: adminEmail,
        password: hashedPassword,
        name: adminName,
      });

      await adminUser.save();
      console.log('Admin user successfully created!');
      console.log(`Email: ${adminEmail}`);
      console.log(`Password: ${adminPassword}`);
    }

  } catch (error) {
    console.error('Error seeding admin user:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

seedAdmin();
