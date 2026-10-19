/* eslint-disable @typescript-eslint/no-require-imports */
const sharp = require('sharp');
const path = require('path');

const WIDTH = 1440;
const HEIGHT = 280;

const ARTIFACT_DIR = '/Users/mkpmobile/.gemini/antigravity-ide/brain/ce2bf3d7-4855-4ee2-b62e-c117e4a40ab4';
const SRC_VISA = path.join(ARTIFACT_DIR, 'promo_visa_card_1792421074175.jpg');
const SRC_TOPUP = path.join(ARTIFACT_DIR, 'promo_topup_fx_1792421099436.jpg');
const SRC_RECEIVE = path.join(ARTIFACT_DIR, 'promo_receive_pay_1792421118873.jpg');

// Helper to create soft radial feather mask for seamless blending
function createRadialMask(w, h, innerRadiusPercent = 65) {
  return Buffer.from(`
    <svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="fade" cx="50%" cy="50%" r="50%">
          <stop offset="${innerRadiusPercent}%" stop-color="#fff" stop-opacity="1"/>
          <stop offset="98%" stop-color="#fff" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="${w}" height="${h}" fill="url(#fade)"/>
    </svg>
  `);
}

async function buildVisaBanner() {
  console.log('Generating Banner 1: VISA Platinum Card...');
  
  // Crop the 3D card from the source image (avoiding top and bottom AI text)
  const cardRaw = await sharp(SRC_VISA)
    .extract({ left: 340, top: 40, width: 720, height: 500 })
    .resize(440, 250, { fit: 'inside' })
    .toBuffer();

  const cardMeta = await sharp(cardRaw).metadata();
  const mask = createRadialMask(cardMeta.width, cardMeta.height, 68);

  const maskedCard = await sharp(cardRaw)
    .ensureAlpha()
    .composite([{ input: mask, blend: 'dest-in' }])
    .png()
    .toBuffer();

  const svg = `
  <svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#080e1b"/>
        <stop offset="35%" stop-color="#0c1626"/>
        <stop offset="70%" stop-color="#081a27"/>
        <stop offset="100%" stop-color="#04151f"/>
      </linearGradient>

      <radialGradient id="glow1" cx="82%" cy="50%" r="55%">
        <stop offset="0%" stop-color="#0d9488" stop-opacity="0.32"/>
        <stop offset="45%" stop-color="#06b6d4" stop-opacity="0.14"/>
        <stop offset="85%" stop-color="#080e1b" stop-opacity="0"/>
      </radialGradient>

      <linearGradient id="btn1" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#0d9488"/>
        <stop offset="100%" stop-color="#06b6d4"/>
      </linearGradient>

      <linearGradient id="accentLine1" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#2dd4bf" stop-opacity="0.6"/>
        <stop offset="100%" stop-color="#06b6d4" stop-opacity="0"/>
      </linearGradient>
    </defs>

    <!-- Background -->
    <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg1)"/>
    <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#glow1)"/>

    <!-- Subtle Cyber Grid -->
    <g opacity="0.1" stroke="#2dd4bf" stroke-width="1">
      <line x1="0" y1="56" x2="${WIDTH}" y2="56" stroke-dasharray="4 6"/>
      <line x1="0" y1="140" x2="${WIDTH}" y2="140" stroke-dasharray="4 6"/>
      <line x1="0" y1="224" x2="${WIDTH}" y2="224" stroke-dasharray="4 6"/>
      <line x1="220" y1="0" x2="220" y2="${HEIGHT}" stroke-dasharray="4 8"/>
      <line x1="520" y1="0" x2="520" y2="${HEIGHT}" stroke-dasharray="4 8"/>
      <line x1="880" y1="0" x2="880" y2="${HEIGHT}" stroke-dasharray="4 8"/>
    </g>

    <!-- Glowing Accent Top Line -->
    <rect x="0" y="0" width="600" height="2" fill="url(#accentLine1)"/>

    <!-- Left Content Safe Area (x: 52px) -->
    <!-- 1. Category Badge -->
    <g transform="translate(52, 32)">
      <rect width="252" height="24" rx="12" fill="#0f2636" stroke="#14b8a6" stroke-width="1" stroke-opacity="0.6"/>
      <circle cx="14" cy="12" r="4" fill="#2dd4bf"/>
      <text x="26" y="16.5" fill="#5eead4" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="700" letter-spacing="1">KARTU DEBIT • VISA PLATINUM</text>
    </g>

    <!-- 2. Main Headline -->
    <text x="52" y="104" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="32" font-weight="800" letter-spacing="-0.5">
      Belanja Global Bebas Biaya Konversi
    </text>

    <!-- 3. Subtitle -->
    <text x="52" y="138" fill="#94a3b8" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14.5" font-weight="500">
      Akses jutaan merchant dunia dengan kartu virtual VISA resmi langsung dari saldo USD Anda.
    </text>

    <!-- 4. Interactive CTA Button -->
    <g transform="translate(52, 172)">
      <rect width="230" height="40" rx="20" fill="#0d9488" opacity="0.3" transform="translate(0, 3)"/>
      <rect width="230" height="40" rx="20" fill="url(#btn1)"/>
      <text x="24" y="25" fill="#04131d" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="700" letter-spacing="0.2">
        Ajukan Kartu Sekarang
      </text>
      <path d="M192 20 L202 20 M197 15 L202 20 L197 25" stroke="#04131d" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    </g>

    <!-- Feature Row Tags -->
    <g transform="translate(304, 184)">
      <text x="0" y="14" fill="#64748b" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="500">
        • Instan Aktif  • 0 Biaya Bulanan  • Terhubung Apple Pay
      </text>
    </g>

    <!-- Floating Sparkles -->
    <circle cx="940" cy="65" r="2.5" fill="#2dd4bf" opacity="0.6"/>
    <circle cx="1380" cy="80" r="3" fill="#38bdf8" opacity="0.5"/>
    <circle cx="1360" cy="220" r="2" fill="#5eead4" opacity="0.5"/>
  </svg>
  `;

  const topOffset = Math.round((HEIGHT - cardMeta.height) / 2);
  const leftOffset = WIDTH - cardMeta.width - 55;

  await sharp(Buffer.from(svg))
    .composite([{ input: maskedCard, top: topOffset, left: leftOffset, blend: 'over' }])
    .jpeg({ quality: 94 })
    .toFile('public/banners/promo-visa-card.jpg');

  console.log('✓ Banner 1 generated: 1440x280 (VISA Platinum)');
}

async function buildTopUpBanner() {
  console.log('Generating Banner 2: Top-Up FX...');

  // Crop the 3D currency exchange elements (center coins & exchange arrows)
  const fxRaw = await sharp(SRC_TOPUP)
    .extract({ left: 350, top: 160, width: 730, height: 490 })
    .resize(440, 250, { fit: 'inside' })
    .toBuffer();

  const fxMeta = await sharp(fxRaw).metadata();
  const mask = createRadialMask(fxMeta.width, fxMeta.height, 66);

  const maskedFx = await sharp(fxRaw)
    .ensureAlpha()
    .composite([{ input: mask, blend: 'dest-in' }])
    .png()
    .toBuffer();

  const svg = `
  <svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#060e18"/>
        <stop offset="35%" stop-color="#0b1723"/>
        <stop offset="70%" stop-color="#061a1e"/>
        <stop offset="100%" stop-color="#041416"/>
      </linearGradient>

      <radialGradient id="glow2" cx="80%" cy="50%" r="55%">
        <stop offset="0%" stop-color="#10b981" stop-opacity="0.28"/>
        <stop offset="40%" stop-color="#0f766e" stop-opacity="0.14"/>
        <stop offset="85%" stop-color="#060e18" stop-opacity="0"/>
      </radialGradient>

      <linearGradient id="btn2" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#10b981"/>
        <stop offset="100%" stop-color="#14b8a6"/>
      </linearGradient>

      <linearGradient id="accentLine2" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#10b981" stop-opacity="0.7"/>
        <stop offset="100%" stop-color="#14b8a6" stop-opacity="0"/>
      </linearGradient>
    </defs>

    <!-- Background -->
    <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg2)"/>
    <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#glow2)"/>

    <!-- Subtle Cyber Grid -->
    <g opacity="0.1" stroke="#10b981" stroke-width="1">
      <line x1="0" y1="56" x2="${WIDTH}" y2="56" stroke-dasharray="4 6"/>
      <line x1="0" y1="140" x2="${WIDTH}" y2="140" stroke-dasharray="4 6"/>
      <line x1="0" y1="224" x2="${WIDTH}" y2="224" stroke-dasharray="4 6"/>
      <line x1="220" y1="0" x2="220" y2="${HEIGHT}" stroke-dasharray="4 8"/>
      <line x1="520" y1="0" x2="520" y2="${HEIGHT}" stroke-dasharray="4 8"/>
      <line x1="880" y1="0" x2="880" y2="${HEIGHT}" stroke-dasharray="4 8"/>
    </g>

    <!-- Glowing Accent Top Line -->
    <rect x="0" y="0" width="600" height="2" fill="url(#accentLine2)"/>

    <!-- Left Content Safe Area (x: 52px) -->
    <!-- 1. Category Badge -->
    <g transform="translate(52, 32)">
      <rect width="254" height="24" rx="12" fill="#0c2621" stroke="#10b981" stroke-width="1" stroke-opacity="0.6"/>
      <circle cx="14" cy="12" r="4" fill="#10b981"/>
      <text x="26" y="16.5" fill="#6ee7b7" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="700" letter-spacing="1">GARANSI KURS • 0% MARKUP VALAS</text>
    </g>

    <!-- 2. Main Headline -->
    <text x="52" y="104" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="32" font-weight="800" letter-spacing="-0.5">
      Top Up Rupiah Instan Jadi Saldo USD
    </text>

    <!-- 3. Subtitle -->
    <text x="52" y="138" fill="#94a3b8" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14.5" font-weight="500">
      Konversi otomatis via QRIS &amp; Virtual Account bank nasional dengan acuan kurs transparan.
    </text>

    <!-- 4. Interactive CTA Button -->
    <g transform="translate(52, 172)">
      <rect width="216" height="40" rx="20" fill="#10b981" opacity="0.3" transform="translate(0, 3)"/>
      <rect width="216" height="40" rx="20" fill="url(#btn2)"/>
      <text x="24" y="25" fill="#031b14" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="700" letter-spacing="0.2">
        Mulai Top Up Saldo
      </text>
      <path d="M178 20 L188 20 M183 15 L188 20 L183 25" stroke="#031b14" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    </g>

    <!-- Feature Row Tags -->
    <g transform="translate(290, 184)">
      <text x="0" y="14" fill="#64748b" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="500">
        • Kurs Kunci 15 Menit  • QRIS &amp; Semua Bank  • Saldo Otomatis Masuk
      </text>
    </g>

    <!-- Floating Sparkles -->
    <circle cx="910" cy="75" r="2.5" fill="#10b981" opacity="0.6"/>
    <circle cx="1370" cy="190" r="3" fill="#f59e0b" opacity="0.6"/>
    <circle cx="1340" cy="60" r="2" fill="#6ee7b7" opacity="0.4"/>
  </svg>
  `;

  const topOffset = Math.round((HEIGHT - fxMeta.height) / 2);
  const leftOffset = WIDTH - fxMeta.width - 55;

  await sharp(Buffer.from(svg))
    .composite([{ input: maskedFx, top: topOffset, left: leftOffset, blend: 'over' }])
    .jpeg({ quality: 94 })
    .toFile('public/banners/promo-topup-fx.jpg');

  console.log('✓ Banner 2 generated: 1440x280 (Top-Up FX)');
}

async function buildReceiveBanner() {
  console.log('Generating Banner 3: Receive Payments...');

  // Crop the 3D phone and network orbits from the right half of source
  const recvRaw = await sharp(SRC_RECEIVE)
    .extract({ left: 580, top: 120, width: 680, height: 530 })
    .resize(440, 250, { fit: 'inside' })
    .toBuffer();

  const recvMeta = await sharp(recvRaw).metadata();
  const mask = createRadialMask(recvMeta.width, recvMeta.height, 66);

  const maskedRecv = await sharp(recvRaw)
    .ensureAlpha()
    .composite([{ input: mask, blend: 'dest-in' }])
    .png()
    .toBuffer();

  const svg = `
  <svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg3" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#070c1a"/>
        <stop offset="35%" stop-color="#0a1528"/>
        <stop offset="70%" stop-color="#07172b"/>
        <stop offset="100%" stop-color="#04101e"/>
      </linearGradient>

      <radialGradient id="glow3" cx="80%" cy="50%" r="55%">
        <stop offset="0%" stop-color="#0284c7" stop-opacity="0.32"/>
        <stop offset="40%" stop-color="#38bdf8" stop-opacity="0.14"/>
        <stop offset="85%" stop-color="#070c1a" stop-opacity="0"/>
      </radialGradient>

      <linearGradient id="btn3" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#0284c7"/>
        <stop offset="100%" stop-color="#38bdf8"/>
      </linearGradient>

      <linearGradient id="accentLine3" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.7"/>
        <stop offset="100%" stop-color="#0284c7" stop-opacity="0"/>
      </linearGradient>
    </defs>

    <!-- Background -->
    <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg3)"/>
    <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#glow3)"/>

    <!-- Subtle Cyber Grid -->
    <g opacity="0.1" stroke="#38bdf8" stroke-width="1">
      <line x1="0" y1="56" x2="${WIDTH}" y2="56" stroke-dasharray="4 6"/>
      <line x1="0" y1="140" x2="${WIDTH}" y2="140" stroke-dasharray="4 6"/>
      <line x1="0" y1="224" x2="${WIDTH}" y2="224" stroke-dasharray="4 6"/>
      <line x1="220" y1="0" x2="220" y2="${HEIGHT}" stroke-dasharray="4 8"/>
      <line x1="520" y1="0" x2="520" y2="${HEIGHT}" stroke-dasharray="4 8"/>
      <line x1="880" y1="0" x2="880" y2="${HEIGHT}" stroke-dasharray="4 8"/>
    </g>

    <!-- Glowing Accent Top Line -->
    <rect x="0" y="0" width="600" height="2" fill="url(#accentLine3)"/>

    <!-- Left Content Safe Area (x: 52px) -->
    <!-- 1. Category Badge -->
    <g transform="translate(52, 32)">
      <rect width="254" height="24" rx="12" fill="#0f2438" stroke="#0284c7" stroke-width="1" stroke-opacity="0.6"/>
      <circle cx="14" cy="12" r="4" fill="#38bdf8"/>
      <text x="26" y="16.5" fill="#7dd3fc" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="700" letter-spacing="1">TAGIHAN GLOBAL • CAIR OTOMATIS</text>
    </g>

    <!-- 2. Main Headline -->
    <text x="52" y="104" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="32" font-weight="800" letter-spacing="-0.5">
      Terima Dana Luar Negeri ke Saldo USD
    </text>

    <!-- 3. Subtitle -->
    <text x="52" y="138" fill="#94a3b8" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14.5" font-weight="500">
      Kirim tautan tagihan ke klien global, konversi otomatis tanpa potongan tersembunyi.
    </text>

    <!-- 4. Interactive CTA Button -->
    <g transform="translate(52, 172)">
      <rect width="258" height="40" rx="20" fill="#0284c7" opacity="0.3" transform="translate(0, 3)"/>
      <rect width="258" height="40" rx="20" fill="url(#btn3)"/>
      <text x="24" y="25" fill="#031220" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="700" letter-spacing="0.2">
        Terima Pembayaran Sekarang
      </text>
      <path d="M220 20 L230 20 M225 15 L230 20 L225 25" stroke="#031220" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    </g>

    <!-- Feature Row Tags -->
    <g transform="translate(332, 184)">
      <text x="0" y="14" fill="#64748b" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="500">
        • Tautan Bayar Aman  • Konversi Otomatis  • Laporan Mutasi Real-Time
      </text>
    </g>

    <!-- Floating Sparkles -->
    <circle cx="930" cy="70" r="2.5" fill="#38bdf8" opacity="0.6"/>
    <circle cx="1370" cy="75" r="3" fill="#7dd3fc" opacity="0.5"/>
    <circle cx="1350" cy="210" r="2" fill="#fbbf24" opacity="0.5"/>
  </svg>
  `;

  const topOffset = Math.round((HEIGHT - recvMeta.height) / 2);
  const leftOffset = WIDTH - recvMeta.width - 55;

  await sharp(Buffer.from(svg))
    .composite([{ input: maskedRecv, top: topOffset, left: leftOffset, blend: 'over' }])
    .jpeg({ quality: 94 })
    .toFile('public/banners/promo-receive-pay.jpg');

  console.log('✓ Banner 3 generated: 1440x280 (Receive Payments)');
}

async function main() {
  await buildVisaBanner();
  await buildTopUpBanner();
  await buildReceiveBanner();
  console.log('All 3 banners successfully generated for compact banner height!');
}

main().catch(err => {
  console.error('Error generating banners:', err);
  process.exit(1);
});
