/**
 * Creates or resets a Super Admin in the User collection — the accounts the
 * login route actually authenticates against.
 *
 *   node create-admin-user.js <email> <password> ["Full Name"]
 *
 * Supersedes setup-admin.js, which wrote to a separate `Admin` collection that
 * nothing reads.
 */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./models/User');

async function main() {
  const [email, password, fullName = 'Administrator'] = process.argv.slice(2);

  if (!email || !password) {
    console.error('Usage: node create-admin-user.js <email> <password> ["Full Name"]');
    process.exit(1);
  }
  if (password.length < 10) {
    console.error('Refusing to set a password shorter than 10 characters.');
    process.exit(1);
  }
  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI is not set.');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGODB_URI);

  const normalised = email.toLowerCase().trim();
  const hashed = await bcrypt.hash(password, 12);

  const existing = await User.findOne({ email: normalised });
  if (existing) {
    existing.password = hashed;
    existing.role = 'Super Admin';
    await existing.save();
    console.log(`Reset password for existing user ${normalised} and ensured Super Admin role.`);
  } else {
    await User.create({
      employeeId: `ADM-${Date.now()}`,
      fullName,
      email: normalised,
      password: hashed,
      mobileNumber: '0000000000',
      role: 'Super Admin',
    });
    console.log(`Created Super Admin ${normalised}.`);
  }

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
