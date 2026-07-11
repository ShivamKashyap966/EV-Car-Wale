const express = require('express');
const path = require('path');
const fs = require('fs');

const CAR_IMAGES_DIR = path.join(__dirname, '..', '..', '..', 'public', 'car_images');

function getBrandFolder(brand) {
  if (!brand) return '';
  const lower = brand.toLowerCase().trim();
  if (lower === 'mercedes-benz') return 'MERCEDES_BENZ';
  if (lower === 'force-motors') return 'FORCE';
  if (lower === 'volkswagen') return 'VOLKSWAGAN';
  if (lower === 'rolls-royce') return 'ROLLS_ROYCE';
  if (lower === 'maruti-suzuki') return 'MARUTI_SUZUKI';
  if (lower === 'mini') return 'MINI ';
  if (lower === 'tata' || lower === 'mahindra' || lower === 'hyundai') return lower;
  return lower.toUpperCase();
}

function getModelFolder(brand, model) {
  let modelFolder = model.toLowerCase().trim();
  const lowerBrand = brand.toLowerCase().trim();
  if (lowerBrand === 'tata') {
    if (modelFolder.includes('punch')) return 'tata_punch';
    if (modelFolder.includes('nexon')) return 'tata_nexon_ev';
    if (modelFolder.includes('harrier')) return 'tata_harrier_ev';
    if (modelFolder.includes('tiago')) return 'tata_tiago_EV';
    if (modelFolder.includes('tigor')) return 'TATA_TIGOR';
    if (modelFolder.includes('sierra')) return 'tata_sierra';
    if (modelFolder.includes('avinya')) return 'tata_avinya_ev';
    if (modelFolder.includes('curvv')) return 'tata_curve_ev';
  }
  return modelFolder.replace(/\s+/g, '_').replace(/-/g, '_');
}

function filenameToColorName(filename) {
  let name = filename.replace(/\.(jpg|jpeg|webp|png)$/i, '');
  name = name.trim();
  name = name.replace(/[-_]/g, ' ');
  name = name.replace(/\s+/g, ' ');
  return name.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
}

const IMAGE_EXTS = ['.jpg', '.jpeg', '.webp', '.png'];

const router = express.Router();

router.get('/list', (req, res) => {
  try {
    const { brand, model } = req.query;
    if (!brand || !model) {
      return res.status(400).json({ error: 'brand and model query params required' });
    }

    const brandFolder = getBrandFolder(brand);
    const modelFolder = getModelFolder(brand, model);

    const dirPath = path.join(CAR_IMAGES_DIR, brandFolder, modelFolder);

    if (!fs.existsSync(dirPath)) {
      return res.json({ colors: [] });
    }

    const files = fs.readdirSync(dirPath).filter(f => {
      const ext = path.extname(f).toLowerCase();
      return IMAGE_EXTS.includes(ext);
    });

    files.sort();

    const colors = files.map(f => {
      const name = filenameToColorName(f);
      return { filename: f, name, path: `car_images/${brandFolder}/${modelFolder}/${f}` };
    });

    res.json({ colors });
  } catch (err) {
    console.error('Error listing car images:', err);
    res.status(500).json({ error: 'Failed to list car images' });
  }
});

module.exports = router;
