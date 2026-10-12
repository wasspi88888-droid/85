import { FractionalAsset } from '../types';

export const INITIAL_FRACTIONAL_ASSETS: FractionalAsset[] = [
  {
    id: 'aapl',
    symbol: 'AAPL',
    name: 'Apple Inc.',
    category: 'Actions US',
    currentPriceUSDC: 228.45,
    change24h: 1.84,
    holdings: 0.15,
    totalValueUSDC: 34.26,
    description: 'Leader technologique mondial de la Silicon Valley. Investissez dès 1 USDC sans commission cachée.',
    dividendYield: '0.52% annuel',
    sparkline: [222, 224, 223, 226, 225, 227, 228.45],
  },
  {
    id: 'xau',
    symbol: 'XAU',
    name: 'Or Physique (Tokenisé LBMA)',
    category: 'Métaux Précieux',
    currentPriceUSDC: 84.10, // per gram
    change24h: 0.92,
    holdings: 0.5,
    totalValueUSDC: 42.05,
    description: 'Or physique 99.99% certifié conservé en coffre-fort haute sécurité en Suisse. Valeur refuge contre l’inflation.',
    sparkline: [82.5, 83.1, 82.8, 83.5, 83.9, 84.0, 84.1],
  },
  {
    id: 'tpbf-uemoa',
    symbol: 'TPBF 6.5%',
    name: 'Obligation UEMOA (Trésor Public)',
    category: 'Obligations UEMOA',
    currentPriceUSDC: 16.50,
    change24h: 0.15,
    holdings: 3.0,
    totalValueUSDC: 49.50,
    description: 'Obligations souveraines de l’Union Économique et Monétaire Ouest-Africaine à coupon garanti versé trimestriellement.',
    dividendYield: '6.50% / an (Garanti UEMOA)',
    sparkline: [16.4, 16.42, 16.45, 16.48, 16.49, 16.5, 16.5],
  },
];
