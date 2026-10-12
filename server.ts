import express from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// In-memory / persistent KPI registry
let kpis = {
  registeredUsersCount: 1428,
  totalUsdcVolume: 845230.5,
  totalTransactionsCount: 12845,
  activeNodesCount: 12,
  onlineUsersCount: 1042,
  avgBlockTimeMs: 420,
  tps: 84.6,
  networkHealth: '100% Opérationnel',
};

// Registered users in current session
const registeredUsersStore: Array<{ id: string; fullName: string; country: string; createdAt: string }> = [];

// API Routes
app.get('/api/kpis', (req, res) => {
  res.json({
    ...kpis,
    currentSessionRegistrations: registeredUsersStore.length,
    timestamp: new Date().toISOString(),
  });
});

app.post('/api/users/register', (req, res) => {
  const { id, fullName, country } = req.body || {};
  kpis.registeredUsersCount += 1;
  kpis.totalTransactionsCount += 1;
  kpis.totalUsdcVolume += 10.0; // Simulated wallet creation grant
  
  if (id && fullName) {
    registeredUsersStore.push({
      id,
      fullName,
      country: country || "Côte d'Ivoire",
      createdAt: new Date().toISOString(),
    });
  }

  res.json({
    success: true,
    message: 'Utilisateur enregistré avec succès au réseau 85',
    kpis,
  });
});

// Cinema API
app.get('/api/services/cinema', (req, res) => {
  res.json([
    {
      id: 'movie-1',
      title: 'Dune: Deuxième Partie',
      director: 'Denis Villeneuve',
      duration: '2h 46m',
      genre: 'Science-Fiction / Aventure',
      rating: '4.8/5',
      poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
      cinemas: ['Majestic Ivoire (Cocody)', 'Pathé Cap Sud (Marcory)', 'Canal Olympia Yopougon'],
      showtimes: ['14:30', '17:45', '20:30', '22:15'],
      priceUSDC: 8.5,
    },
    {
      id: 'movie-2',
      title: 'Gladiator II',
      director: 'Ridley Scott',
      duration: '2h 28m',
      genre: 'Action / Historique',
      rating: '4.7/5',
      poster: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?auto=format&fit=crop&w=600&q=80',
      cinemas: ['Pathé Cap Sud (Marcory)', 'Majestic Prima (Zone 4)'],
      showtimes: ['15:00', '18:15', '21:00'],
      priceUSDC: 9.0,
    },
    {
      id: 'movie-3',
      title: 'Black Panther: Wakanda Forever',
      director: 'Ryan Coogler',
      duration: '2h 41m',
      genre: 'Action / Super-héros',
      rating: '4.9/5',
      poster: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80',
      cinemas: ['Majestic Ivoire', 'Canal Olympia'],
      showtimes: ['16:00', '19:30', '21:45'],
      priceUSDC: 8.0,
    },
  ]);
});

// Flights API
app.get('/api/services/flights', (req, res) => {
  res.json([
    {
      id: 'fl-1',
      airline: 'Air Côte d’Ivoire',
      airlineLogo: '🇨🇮 HF',
      flightNumber: 'HF 710',
      from: 'Abidjan (ABJ)',
      to: 'Dakar (DSS)',
      departureTime: '08:30',
      arrivalTime: '11:15',
      duration: '2h 45m',
      classType: 'Économique',
      priceUSDC: 185.0,
      availableSeats: 8,
    },
    {
      id: 'fl-2',
      airline: 'Asky Airlines',
      airlineLogo: '🇹🇬 KP',
      flightNumber: 'KP 024',
      from: 'Abidjan (ABJ)',
      to: 'Lomé (LFW)',
      departureTime: '13:00',
      arrivalTime: '14:20',
      duration: '1h 20m',
      classType: 'Économique',
      priceUSDC: 110.0,
      availableSeats: 14,
    },
    {
      id: 'fl-3',
      airline: 'Air France',
      airlineLogo: '🇫🇷 AF',
      flightNumber: 'AF 703',
      from: 'Abidjan (ABJ)',
      to: 'Paris (CDG)',
      departureTime: '23:15',
      arrivalTime: '06:40 (+1)',
      duration: '6h 25m',
      classType: 'Premium Economy',
      priceUSDC: 490.0,
      availableSeats: 5,
    },
  ]);
});

// Google Photos & Drive API mock endpoints
app.get('/api/services/photos/mock-data', (req, res) => {
  res.json({
    storageUsedGb: 4.8,
    totalStorageGb: 15.0,
    connectedService: req.query.service || 'Google Photos',
    photos: [
      {
        id: 'p1',
        title: 'Voyage Assinie & Plage',
        date: 'Hier',
        url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
        tag: 'Vacances',
      },
      {
        id: 'p2',
        title: 'Événement Tech Summit Abidjan',
        date: '08 Oct 2026',
        url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80',
        tag: 'Tech',
      },
      {
        id: 'p3',
        title: 'Cérémonie de Famille',
        date: '02 Oct 2026',
        url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=600&q=80',
        tag: 'Famille',
      },
      {
        id: 'p4',
        title: 'Reçus & Justificatifs 85',
        date: '28 Sep 2026',
        url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80',
        tag: 'Finance',
      },
      {
        id: 'p5',
        title: 'Visite Basilique Yamoussoukro',
        date: '20 Sep 2026',
        url: 'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=600&q=80',
        tag: 'Tourisme',
      },
      {
        id: 'p6',
        title: 'Session Studio & Design',
        date: '15 Sep 2026',
        url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80',
        tag: 'Projets',
      },
    ],
  });
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (req, res) => {
        res.sendFile(path.resolve(distPath, 'index.html'));
      });
    }
  }

  app.listen(PORT, () => {
    console.log(`[85 Server] Backend & Full-Stack app running on port ${PORT}`);
  });
}

startServer();
