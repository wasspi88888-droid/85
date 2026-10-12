export interface ApiEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  summary: string;
  description: string;
  tags: string[];
  parameters?: { name: string; in: string; required: boolean; description: string; type: string }[];
  requestBody?: {
    required: boolean;
    example: Record<string, unknown>;
  };
  responses: {
    status: number;
    description: string;
    example: Record<string, unknown>;
  }[];
}

export const SWAGGER_SPEC: {
  openapi: string;
  info: {
    title: string;
    version: string;
    description: string;
    contact: { name: string; email: string };
  };
  servers: { url: string; description: string }[];
  endpoints: ApiEndpoint[];
} = {
  openapi: '3.0.3',
  info: {
    title: '85 - The Everything App REST & WebSocket API',
    version: '1.0.0-PROD',
    description:
      'Spécification OpenAPI 3.0 officielle de la plateforme 85. Conçue pour haute scalabilité (1000+ utilisateurs simultanés), cache Redis TTL 5s, validation Zod stricte, cookies JWT httpOnly et sessions cryptographiques.',
    contact: {
      name: '85 Engineering & Platform Team',
      email: 'wasspi88888@gmail.com',
    },
  },
  servers: [
    { url: 'https://api.85app.com/v1', description: 'Production Gateway (Multi-Region Anycast)' },
    { url: 'https://staging-api.85app.com/v1', description: 'Staging Environment (Supabase + Upstash)' },
  ],
  endpoints: [
    {
      method: 'POST',
      path: '/api/auth/register',
      tags: ['Authentification'],
      summary: 'Inscription sécurisée via Wizard 6 Étapes',
      description: 'Valide les données Zod, crée l’utilisateur dans PostgreSQL 15, stocke le hash bcrypt 10 rounds.',
      requestBody: {
        required: true,
        example: {
          fullName: 'Kouamé Jean-Marc',
          phone: '+2250708091011',
          email: 'jm.kouame@example.ci',
          country: "Côte d'Ivoire",
          language: 'fr',
        },
      },
      responses: [
        {
          status: 201,
          description: 'Utilisateur créé avec succès',
          example: {
            userId: 'usr_85_01J98X7Z',
            status: 'WALLET_CREATION_PENDING',
            message: 'Identité validée, prêt pour génération de wallet biométrique',
          },
        },
      ],
    },
    {
      method: 'POST',
      path: '/api/auth/wallet',
      tags: ['Authentification', 'Wallet'],
      summary: 'Génération du Smart Wallet Biométrique sans phrase secrète',
      description: 'Génère l’adresse de compte abstrait ERC-4337 liée à l’attestation biométrique WebAuthn / Face ID.',
      requestBody: {
        required: true,
        example: {
          userId: 'usr_85_01J98X7Z',
          biometricChallengeResponse: 'attestation_webauthn_passkey_sig_valid',
          termsAccepted: true,
        },
      },
      responses: [
        {
          status: 200,
          description: 'Wallet activé & Session JWT émise en Cookie httpOnly',
          example: {
            walletAddress: '0x8542F9bC1628cD8F41A87bB60bE95a624fB2179a',
            balanceUSDC: 125.5,
            jwtCookieSet: true,
          },
        },
      ],
    },
    {
      method: 'GET',
      path: '/api/wallet/balance',
      tags: ['Wallet'],
      summary: 'Consultation du solde USDC en temps réel (Cache Redis TTL 5s)',
      description: 'Interroge le cache Redis ultrarapide (<2ms) avec fallback lecture PostgreSQL.',
      responses: [
        {
          status: 200,
          description: 'Solde temps réel récupéré',
          example: {
            walletAddress: '0x8542F9bC1628cD8F41A87bB60bE95a624fB2179a',
            balanceUSDC: 125.5,
            investedUSDC: 125.81,
            currency: 'USDC',
            lastUpdated: '2026-10-11T04:30:00.000Z',
          },
        },
      ],
    },
    {
      method: 'POST',
      path: '/api/wallet/kotani-pay/deposit',
      tags: ['Wallet', 'Kotani Pay'],
      summary: 'Initialisation on-ramp Mobile Money Kotani Pay',
      description: 'Génère la transaction Kotani Pay vers Wave, Orange, MTN, Moov avec taux 1$ = 650 FCFA.',
      requestBody: {
        required: true,
        example: {
          provider: 'Wave',
          amountFCFA: 25000,
          amountUSDC: 38.46,
          customerPhone: '+2250708091011',
        },
      },
      responses: [
        {
          status: 200,
          description: 'Paiement Kotani Pay initié & Webhook déclenché',
          example: {
            kotaniTxRef: 'KP_XOF_9281749',
            status: 'COMPLETED',
            usdcCredited: 38.46,
            newBalanceUSDC: 163.96,
          },
        },
      ],
    },
    {
      method: 'POST',
      path: '/api/chat/envelope/send',
      tags: ['Messagerie'],
      summary: 'Envoi d’une enveloppe cadeau USDC dans une conversation',
      description: 'Bloque le montant USDC dans le smart contract d’escrow et diffuse le message WebSocket.',
      requestBody: {
        required: true,
        example: {
          conversationId: 'conv_85_diallo',
          amountUSDC: 10.0,
          note: 'Joyeux anniversaire mon ami ! 🎁',
        },
      },
      responses: [
        {
          status: 201,
          description: 'Enveloppe créée et notification WebSocket envoyée',
          example: {
            messageId: 'msg_env_9821',
            claimed: false,
            txHash: '0x71a...92f',
          },
        },
      ],
    },
    {
      method: 'POST',
      path: '/api/telecom/renew',
      tags: ['Télécom'],
      summary: 'Souscription / Renouvellement Forfait Annuel 85 (35$ USDC)',
      description: 'Prélèvement automatique du wallet USDC et provisionnement SIM / eSIM avec connectivité 12 pays.',
      requestBody: {
        required: true,
        example: {
          planId: 'plan_unlimited_35',
          durationMonths: 12,
        },
      },
      responses: [
        {
          status: 200,
          description: 'Forfait activé pour 12 mois',
          example: {
            status: 'ACTIVE',
            validUntil: '2027-10-11T00:00:00Z',
            dataRemaining: 'ILLIMITÉ',
          },
        },
      ],
    },
    {
      method: 'POST',
      path: '/api/telecom/gift',
      tags: ['Télécom', 'Messagerie'],
      summary: 'Offrir un forfait 85 (35$) à un contact',
      description: 'Déduit 35 USDC et injecte un cadeau dans le chat du destinataire avec bon d’activation.',
      requestBody: {
        required: true,
        example: {
          recipientPhone: '+2250102030405',
          recipientAddress: '0x8591...321',
          contactName: 'Fatou Traoré',
        },
      },
      responses: [
        {
          status: 201,
          description: 'Forfait offert avec succès',
          example: {
            giftPassId: 'pass_gift_1928',
            deliveredTo: 'Fatou Traoré',
          },
        },
      ],
    },
    {
      method: 'POST',
      path: '/api/investments/trade',
      tags: ['Investissement'],
      summary: 'Achat / Vente d’actifs fractionnalisés (Actions US, Or XAU, Obligations UEMOA)',
      description: 'Exécution d’ordre instantané avec frais fixes de 1% + spread de liquidité.',
      requestBody: {
        required: true,
        example: {
          assetId: 'aapl',
          action: 'BUY',
          amountUSDC: 20.0,
        },
      },
      responses: [
        {
          status: 200,
          description: 'Ordre exécuté avec succès',
          example: {
            fractionPurchased: 0.0875,
            feeUSDC: 0.2,
            netInvested: 19.8,
            newPortfolioValue: 145.61,
          },
        },
      ],
    },
  ],
};

export const CI_CD_PIPELINE_YAML = `name: 85 Production CI/CD Pipeline (High-Scale 1000 Users)

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test-and-lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run test

  build-and-deploy:
    needs: test-and-lint
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - name: Build PWA Frontend
        run: |
          npm ci
          npm run build
      - name: Build Docker Image
        run: |
          docker build -t registry.85app.com/core-gateway:latest .
      - name: Deploy to Cloud Run / Kubernetes (1000 Concurrent Pods Autoscale)
        run: |
          echo "Deploying with Redis Cluster adapter and Supabase PgBouncer pooler..."
`;

export const DOCKER_COMPOSE_SPEC = `version: '3.9'

services:
  app-gateway:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
      - DATABASE_URL=postgresql://postgres:secure85@postgres:5432/eightyfive_db?sslmode=disable
      - REDIS_URL=redis://redis:6379
      - JWT_SECRET=85_super_app_jwt_secret_ultra_secure_2026
      - KOTANI_PAY_API_KEY=kp_live_sec_85_afrique_ci
    depends_on:
      - postgres
      - redis
    restart: always

  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: secure85
      POSTGRES_DB: eightyfive_db
    volumes:
      - pgdata:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes --requirepass redis85cache
    ports:
      - "6379:6379"
    volumes:
      - redisdata:/data

volumes:
  pgdata:
  redisdata:
`;
