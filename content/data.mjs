// Language-neutral facts. Add a product or reference here once; labels live in content/<locale>.mjs.

export const modules = [
  // family, model, m3/d, [L,W,H] mm, units, installed kW, running kW, empty t, operating t
  { family: 'sea', model: 'AquaSea-C50', cap: '50', capMax: 50, dims: [6058, 2438, 2591], units: 1, inst: '17', run: 13, empty: '6.5', full: '12' },
  { family: 'sea', model: 'AquaSea-C100E', cap: '100', capMax: 100, dims: [6058, 2438, 2591], units: 1, inst: '19', run: 15, empty: '10', full: '15' },
  { family: 'sea', model: 'AquaSea-C200E', cap: '200', capMax: 200, dims: [12192, 2438, 2591], units: 1, inst: '32', run: 25, empty: '12', full: '19' },
  { family: 'sea', model: 'AquaSea-C500E', cap: '500', capMax: 500, dims: [12192, 2438, 2896], units: 1, inst: '82', run: 55, empty: '17', full: '25' },
  { family: 'sea', model: 'AquaSea-C1000E', cap: '1,000', capMax: 1000, dims: [12192, 2438, 2896], units: 2, inst: '125', run: 100, empty: '28', full: '35', flagWeight: true },
  { family: 'reclaim', model: 'AquaReclaim-500', cap: '500', capMax: 500, dims: [9500, 2438, 3500], units: 1, inst: '37', run: 24, empty: '11', full: '40' },
  { family: 'reclaim', model: 'AquaReclaim-1000', cap: '1,000', capMax: 1000, dims: [11500, 2438, 3500], units: 1, inst: '51', run: 33, empty: '15', full: '45' },
  { family: 'biomax', model: 'AquaBiomax-100', cap: '100', capMax: 100, dims: [8600, 2100, 2400], units: 1, inst: '9', run: 4, empty: '6', full: '30' },
  { family: 'biomax', model: 'AquaBiomax-300', cap: '300', capMax: 300, dims: [9500, 2438, 3500], units: 1, inst: '17', run: 6, empty: '8', full: '60' },
  { family: 'biomax', model: 'AquaBiomax-500', cap: '500', capMax: 500, dims: [11500, 2438, 3500], units: 1, inst: '20', run: 8, empty: '10', full: '80' },
  { family: 'ultra', model: 'AquaUltra-1000', cap: '300–1,000', capMax: 1000, dims: [5800, 2438, 3200], units: 1, inst: '6–15', run: null, empty: '7', full: '25' },
  { family: 'ultra', model: 'AquaUltra-3000', cap: '1,000–3,000', capMax: 3000, dims: [11500, 2438, 3500], units: 1, inst: '15–32', run: null, empty: '15', full: '70' },
];

// param key, unit, inlet, outlet
export const waterQuality = {
  sea: [['temp', '°C', '5–35', '5–35'], ['cod', 'mg/L', '< 10', '—'], ['turb', 'NTU', '< 10', '0.1'], ['fe', 'mg/L', '< 0.1', '—'], ['mn', 'mg/L', '< 0.1', '—'], ['tds', 'mg/L', '20,000–45,000', '< 1,000']],
  reclaim: [['temp', '°C', '12–45', '12–45'], ['ph', '', '6–8', '6–8'], ['cod', 'mg/L', '< 150', '< 30'], ['ss', 'mg/L', '1,000–3,000', '—'], ['fe', 'mg/L', '< 0.1', '—'], ['hard', 'mg/L', '< 300', '< 50'], ['tds', 'mg/L', '1,000–5,000', '< 300']],
  biomax: [['temp', '°C', '12–40', '12–40'], ['cod', 'mg/L', '300', '50'], ['ss', 'mg/L', '200', '10'], ['nh3', 'mg/L', '35', '5'], ['tn', 'mg/L', '40', '15'], ['tp', 'mg/L', '4', '0.5']],
  ultra: [['temp', '°C', '12–35', '12–35'], ['cod', 'mg/L', '< 500', '< 500'], ['ss', 'mg/L', '< 15,000', '—'], ['hard', 'mg/L', '< 500', '< 500'], ['sdi', '', '—', '< 5']],
};

export const power = [['IEC', '400 V', '50 Hz'], ['GB', '380 V', '50 Hz'], ['ANSI', '460 V', '60 Hz'], ['JIS', '200 / 400 V', '50 / 60 Hz']];

export const membraneGrades = ['SW 400 R', 'SW 400 GR', 'SW 400 GR G2', 'SW 440 R', 'SW 440 R G2', 'SW 440 GR', 'SW 440 GR G2', 'SW 440 SR', 'SW 440 ES'];

// r: region, c: country key, s: sector key. `client` only where the source names one.
const R = (name, c, r, cap, year, model, extra = {}) => ({ name, c, r, cap, year, model, s: 'desal', ...extra });

export const references = [
  R('Al Khobar 2', 'sa', 'me', 636300, '2021/2022', '440 R', { client: 'Acciona Agua SA', feature: true }),
  R('Shuqaiq 3', 'sa', 'me', 453150, '2021/2022', '440 R', { client: 'Acciona Agua SA', feature: true }),
  R('Jubail 2', 'sa', 'me', 400000, '2020', '440 GR G2 / R', { client: 'Metito', feature: true }),
  R('Sohar', 'om', 'me', 250000, '2018', 'GR, SR'),
  R('Al Khobar 1', 'sa', 'me', 210000, '2019', '440 R', { client: 'Acciona Agua SA' }),
  R('Benisaf SWRO', 'dz', 'af', 200000, '2021', '440 R', { feature: true }),
  R('SWRO on Barges', 'sa', 'me', 153000, '2020', '440 R', { client: 'Metito', feature: true }),
  R('Mostaganem', 'dz', 'af', 150000, '2016/2019/2020', '440 R'),
  R('East Port Said I', 'eg', 'af', 150000, '2019', null),
  R('El Alamein', 'eg', 'af', 150000, '2018', 'GR, R'),
  R('El Galalah', 'eg', 'af', 150000, '2018', 'GR'),
  R('Duba', 'sa', 'me', 125000, '2019', '440 R', { client: 'Metito' }),
  R('Salalah', 'om', 'me', 120000, '2019', '440 SR, GR'),
  R('Hamma', 'dz', 'af', 100000, '2019/2021', '440 R'),
  R('Minjur', 'in', 'as', 100000, '2020', '400 GR G2'),
  R('Ain Sokhna Phase II', 'eg', 'af', 100000, '2018', '400 R'),
  R('Las Palmas III', 'es', 'eu', 70000, '2017–2021', '440 SR, 440 GR G2 & G1'),
  R('NCIC', 'eg', 'af', 64000, '2017', 'R'),
  R('Atacama', 'cl', 'am', 40000, '2021', '440 R + 440 ES'),
  R('Mansoura', 'eg', 'af', 40000, '2021', '400 GR + 440 R'),
  R('Barka II', 'om', 'me', 40000, '2016/2017', 'R'),
  R('Dabaa', 'eg', 'af', 40000, '2019', '400 R'),
  R('Fujairah 1', 'ae', 'me', 38000, '2019/2020', '440 GR'),
  R('Pembroke', 'mt', 'eu', 36000, '2016', 'GR, SR'),
  R('King Abdullah Economic City', 'sa', 'me', 30824, '2018', '440 R', { client: 'Metito Overseas' }),
  R('Al Ghubrah', 'om', 'me', 30000, '2020', '440 GR G2'),
  R('Sharma Complex', 'sa', 'me', 24000, '2018', '—', { client: 'Metito Overseas' }),
  R('SWCC DTRI (5,000)', 'sa', 'me', 5000, '2020', '—', { client: 'SWCC' }),
  R('Eastern Province Housing', 'sa', 'me', 4500, '2015', '—', { client: 'AES Arabia' }),
  R('Ras Al-Mishaab', 'sa', 'me', 4500, '2015', '—', { client: 'AES Arabia' }),
  R('Kindasa, Jeddah Sea Port', 'sa', 'me', 4200, '2021', '—', { client: 'Kindasa Water Service Factory Co.' }),
  R('Duba (Al Kawther)', 'sa', 'me', 2650, '2019', '—', { client: 'Al Kawther' }),
  R('SWCC DTRI (2,000)', 'sa', 'me', 2000, '2020', '—', { client: 'SWCC' }),
  R('Qingdao Baifa Phase I', 'cn', 'as', 100000, '2017–2019', 'SW440GR', { zh: '青岛百发一期', feature: true }),
  R('Qingdao Baifa Phase II', 'cn', 'as', 100000, '2021/2022', 'SW440GR', { zh: '青岛百发二期', feature: true }),
  R('Tianjin Dagang', 'cn', 'as', 100000, '2020', 'SW400R', { zh: '天津大港' }),
  R('Yulong Petrochemical', 'cn', 'as', 80000, '2023', 'SW440R', { zh: '裕龙石化', s: 'petro', feature: true }),
  R('Hebei Fengyue', 'cn', 'as', 75000, '2020', 'SW440R', { zh: '河北丰越' }),
  R('Liuheng Water', 'cn', 'as', 50000, '2016–2018', 'SW400GR, SW400R', { zh: '六横水务', s: 'utility' }),
  R('Tangshan Haigang Phase I', 'cn', 'as', 50000, '2022', 'SW440GR', { zh: '唐山海港一期' }),
  R('Dongying Port Nahai Water', 'cn', 'as', 50000, '2023', 'SW440R G2', { zh: '东营港纳海水务', s: 'utility' }),
  R('Tianwan Nuclear', 'cn', 'as', 30000, '2023', 'SW400GR', { zh: '田湾核电', s: 'power', feature: true }),
  R('Datang Leizhou Power', 'cn', 'as', 20000, '2020', 'SW400GR', { zh: '大唐雷州电厂', s: 'power' }),
  R('Datang Dongying Power', 'cn', 'as', 10000, '2019', 'SW400GR', { zh: '大唐东营电厂', s: 'power' }),
  R('Huaneng Weihai Power', 'cn', 'as', 9000, '2021', 'SW400GR', { zh: '华能威海电厂', s: 'power' }),
  R('China Resources Haifeng Power', 'cn', 'as', 5000, '2020', 'SW400GR', { zh: '华润海丰电厂', s: 'power' }),
  R('Laizhou Power', 'cn', 'as', 3600, '2018', 'SW400R', { zh: '莱州电厂', s: 'power' }),
];

// Set a public enquiry address to show the contact button on every page.
export const contact = { email: null };

export const site = {
  url: 'https://qizhangumich.github.io/watertreatment',
  locales: ['en', 'ar', 'zh'],
  pages: ['', 'applications', 'solutions', 'products', 'containerized', 'references', 'partnership'],
};
