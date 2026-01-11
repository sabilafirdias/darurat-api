const { Emergency } = require('../models');

async function seed() {
  const data = [
    { category: 'polisi', name: 'Nomor Darurat Polri', number: '110', description: 'Layanan darurat kepolisian nasional.' },
    { category: 'ambulans', name: 'Ambulans Nasional', number: '118', description: 'Layanan ambulans darurat 24 jam.' },
    { category: 'kebakaran', name: 'Pemadam Kebakaran', number: '113', description: 'Layanan pemadam kebakaran nasional.' },
    { category: 'bnpb', name: 'BNPB', number: '115', description: 'Badan Nasional Penanggulangan Bencana.' }
  ];

  for (const item of data) {
    await Emergency.upsert(item);
  }
  console.log('Emergency data seeded successfully');
}

seed().catch(console.error);