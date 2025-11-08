/*

const mongoose = require('mongoose');
const LocalGovernment = require('../models/LocalGovernment');
require('dotenv').config();

const plateauLGAs = [
  { name: "Barkin Ladi", code: "BARKIN-LADI" },
  { name: "Bassa", code: "BASSA" },
  { name: "Bokkos", code: "BOKKOS" },
  { name: "Jos East", code: "JOS-EAST" },
  { name: "Jos North", code: "JOS-NORTH" },
  { name: "Jos South", code: "JOS-SOUTH" },
  { name: "Kanam", code: "KANAM" },
  { name: "Kanke", code: "KANKE" },
  { name: "Langtang North", code: "LANGTANG-NORTH" },
  { name: "Langtang South", code: "LANGTANG-SOUTH" },
  { name: "Mangu", code: "MANGU" },
  { name: "Mikang", code: "MIKANG" },
  { name: "Pankshin", code: "PANKSHIN" },
  { name: "Qua'an Pan", code: "QUAAN-PAN" },
  { name: "Riyom", code: "RIYOM" },
  { name: "Shendam", code: "SHENDAM" },
  { name: "Wase", code: "WASE" }
];

const seedLocalGovernments = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB');

    // Clear existing LGAs (optional)
    await LocalGovernment.deleteMany({});
    console.log('Cleared existing LGAs');

    // Insert Plateau State LGAs
    const savedLGAs = await LocalGovernment.insertMany(
      plateauLGAs.map(lga => ({
        ...lga,
        state: "Plateau State"
      }))
    );

    console.log(`✅ Successfully seeded ${savedLGAs.length} Local Governments for Plateau State:`);
    savedLGAs.forEach(lga => {
      console.log(`   - ${lga.name} (${lga.code})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding Local Governments:', error);
    process.exit(1);
  }
};

seedLocalGovernments();

*/