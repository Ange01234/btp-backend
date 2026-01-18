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

async function seedUser() {
  try {
    console.log('Connecting to:', DATABASE_URL.replace(/:([^:@]{8,})@/, ':****@')); // Mask password
    await mongoose.connect(DATABASE_URL);
    console.log('Connected to MongoDB');

    const userEmail = 'modestehounnouvi@gmail.com';
    const userPassword = 'Modesteh9@'; 
    const userName = 'Modeste Hounnouvi';

    const existingUser = await User.findOne({ email: userEmail });

    if (existingUser) {
      console.log(`User with email ${userEmail} already exists. Skipping.`);
    } else {
      const hashedPassword = await bcrypt.hash(userPassword, 10);
      const user = new User({
        email: userEmail,
        password: hashedPassword,
        name: userName,
      });

      await user.save();
      console.log('User successfully created!');
      console.log(`Email: ${userEmail}`);
      console.log(`Password: ${userPassword}`);
    }

  } catch (error) {
    console.error('Error seeding user:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

seedUser();
