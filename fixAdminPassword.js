const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('./models/Admin');

dotenv.config();

const fixPassword = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const username = 'Sahil Kayasth';
        const admin = await Admin.findOne({ username });

        if (!admin) {
            console.log(`Admin with username "${username}" not found.`);
            process.exit(1);
        }

        console.log(`Found admin: ${admin.username}. Updating password...`);
        
        // This will trigger the pre-save hook in models/Admin.js
        admin.password = 'adminsk@1612';
        await admin.save();

        console.log('Password updated and hashed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

fixPassword();
