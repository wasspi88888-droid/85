import React, { useState } from 'react';
import {
  X,
  Plane,
  Calendar,
  Clock,
  User,
  CheckCircle2,
  QrCode,
  ArrowRight,
  ShieldCheck,
  Luggage,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';

interface Flight {
  id: string;
  airline: string;
  airlineCode: string;
  flightNumber: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  priceUSDC: number;
}

const FLIGHT_ROUTES: Flight[] = [
  {
    id: 'f-1',
    airline: 'Air Côte d’Ivoire',
    airlineCode: 'HF',
    flightNumber: 'HF 710',
    from: 'Abidjan (ABJ)',
    to: 'Dakar (DSS)',
    departureTime: '08:30',
    arrivalTime: '11:15',
    duration: '2h 45m',
    priceUSDC: 185.0,
  },
  {
    id: 'f-2',
    airline: 'Asky Airlines',
    airlineCode: 'KP',
    flightNumber: 'KP 024',
    from: 'Abidjan (ABJ)',
    to: 'Lomé (LFW)',
    departureTime: '13:00',
    arrivalTime: '14:20',
    duration: '1h 20m',
    priceUSDC: 110.0,
  },
  {
    id: 'f-3',
    airline: 'Air France',
    airlineCode: 'AF',
    flightNumber: 'AF 703',
    from: 'Abidjan (ABJ)',
    to: 'Paris (CDG)',
    departureTime: '23:15',
    arrivalTime: '06:40 (+1)',
    duration: '6h 25m',
    priceUSDC: 490.0,
  },
  {
    id: 'f-4',
    airline: 'Air Côte d’Ivoire',
    airlineCode: 'HF',
    flightNumber: 'HF 522',
    from: 'Abidjan (ABJ)',
    to: 'Cotonou (COO)',
    departureTime: '16:40',
    arrivalTime: '18:00',
    duration: '1h 20m',
    priceUSDC: 135.0,
  },
];

interface FlightBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FlightBookingModal: React.FC<FlightBookingModalProps> = ({ isOpen, onClose }) => {
  const { balance, updateBalance, addTransaction, showToast, openKotaniModal, user } = useApp();

  const [selectedFlight, setSelectedFlight] = useState<Flight>(FLIGHT_ROUTES[0]);
  const [passengerName, setPassengerName] = useState<string>(user?.fullName || 'Kouamé Jean-Marc');
  const [cabinClass, setCabinClass] = useState<'economy' | 'business'>('economy');
  const [isBooking, setIsBooking] = useState(false);
  const [boardingPass, setBoardingPass] = useState<{
    bookingRef: string;
    flight: Flight;
    passenger: string;
    seat: string;
    gate: string;
    boardingTime: string;
    totalUSDC: number;
  } | null>(null);

  if (!isOpen) return null;

  const classMultiplier = cabinClass === 'business' ? 1.8 : 1.0;
  const finalPrice = Number((selectedFlight.priceUSDC * classMultiplier).toFixed(2));
  const hasEnoughBalance = balance >= finalPrice;

  const handleBookFlight = () => {
    if (!hasEnoughBalance) {
      showToast('Solde USDC insuffisant pour ce vol. Veuillez recharger votre wallet.');
      openKotaniModal();
      return;
    }

    setIsBooking(true);

    setTimeout(() => {
      const newBal = Number((balance - finalPrice).toFixed(2));
      updateBalance(newBal);

      const ref = `85AIR-${Math.floor(100000 + Math.random() * 900000)}`;

      addTransaction({
        type: 'service_payment',
        title: `Billet d’avion: ${selectedFlight.from} → ${selectedFlight.to}`,
        amountUSDC: -finalPrice,
        amountFCFA: Math.round(finalPrice * 650),
        status: 'completed',
        category: 'Services',
        note: `${selectedFlight.airline} (${selectedFlight.flightNumber}) • Réf: ${ref}`,
      });

      setBoardingPass({
        bookingRef: ref,
        flight: selectedFlight,
        passenger: passengerName,
        seat: cabinClass === 'business' ? '2A' : '14C',
        gate: 'B12',
        boardingTime: '07:45',
        totalUSDC: finalPrice,
      });

      setIsBooking(false);

      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.5 },
      });

      showToast(`Vol ${selectedFlight.flightNumber} réservé avec succès !`);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-3">
      <div className="bg-white rounded-3xl max-w-md w-full max-h-[92vh] overflow-hidden flex flex-col shadow-2xl border border-gray-100 animate-scale-up">
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#FF6B35]">
              <Plane className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-gray-900 leading-tight">
                Vols & Billetterie Aérienne
              </h3>
              <p className="text-[11px] text-gray-500">
                Air Côte d’Ivoire, Asky • Règlement en USDC
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {boardingPass ? (
            /* Boarding Pass View */
            <div className="space-y-4 text-center animate-fade-in">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-black text-lg text-gray-900">Carte d’Embarquement Émise</h4>
                <p className="text-xs text-gray-500">
                  Enregistrée dans votre wallet 85 • Prête pour l’aéroport
                </p>
              </div>

              {/* Boarding Pass Ticket */}
              <div className="bg-gradient-to-br from-[#1E293B] to-[#0F172A] text-white rounded-3xl p-5 border border-gray-700 shadow-xl relative text-left space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <Plane className="w-5 h-5 text-[#FF6B35]" />
                    <span className="font-extrabold text-sm tracking-wide">
                      {boardingPass.flight.airline}
                    </span>
                  </div>
                  <span className="font-mono text-xs text-orange-400 font-bold">
                    {boardingPass.bookingRef}
                  </span>
                </div>

                {/* Route Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-gray-400 block">Départ</span>
                    <span className="text-xl font-black text-white">{boardingPass.flight.from.substring(0, 3)}</span>
                    <span className="text-[10px] text-gray-300 block">{boardingPass.flight.from}</span>
                  </div>

                  <div className="flex flex-col items-center px-3">
                    <span className="text-[9px] text-gray-400">{boardingPass.flight.duration}</span>
                    <div className="w-16 h-0.5 bg-orange-400 my-1 relative">
                      <Plane className="w-3 h-3 text-white absolute -top-1.5 left-1/2 -translate-x-1/2 rotate-90" />
                    </div>
                    <span className="text-[9px] text-emerald-400 font-bold">Direct</span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-gray-400 block">Arrivée</span>
                    <span className="text-xl font-black text-white">{boardingPass.flight.to.substring(0, 3)}</span>
                    <span className="text-[10px] text-gray-300 block">{boardingPass.flight.to}</span>
                  </div>
                </div>

                {/* Details Bar */}
                <div className="grid grid-cols-4 gap-2 p-3 bg-white/5 rounded-2xl text-[10px]">
                  <div>
                    <span className="text-gray-400 block">Vol</span>
                    <span className="font-bold text-white">{boardingPass.flight.flightNumber}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Porte</span>
                    <span className="font-bold text-white">{boardingPass.gate}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Siège</span>
                    <span className="font-bold text-orange-400">{boardingPass.seat}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Embarquement</span>
                    <span className="font-bold text-white">{boardingPass.boardingTime}</span>
                  </div>
                </div>

                {/* Passenger Name & QR */}
                <div className="pt-2 border-t border-dashed border-gray-600 flex items-center justify-between">
                  <div>
                    <span className="text-[9px] text-gray-400 block">Passager</span>
                    <span className="font-bold text-xs text-white uppercase">{boardingPass.passenger}</span>
                    <span className="text-[9px] text-emerald-400 block mt-0.5">
                      Bagage cabine + soute 23kg inclus
                    </span>
                  </div>

                  <div className="p-1.5 bg-white rounded-xl">
                    <QrCode className="w-12 h-12 text-gray-900" />
                  </div>
                </div>
              </div>

              <button
                onClick={() => setBoardingPass(null)}
                className="w-full py-3 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-extrabold text-xs transition cursor-pointer"
              >
                Réserver un autre vol
              </button>
            </div>
          ) : (
            /* Flight Search & Booking form */
            <div className="space-y-4">
              {/* Route list */}
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-800 uppercase tracking-wider block">
                  1. Sélectionner votre Trajet
                </label>
                <div className="space-y-2">
                  {FLIGHT_ROUTES.map((flight) => {
                    const isSelected = selectedFlight.id === flight.id;
                    const price = Number((flight.priceUSDC * classMultiplier).toFixed(2));

                    return (
                      <div
                        key={flight.id}
                        onClick={() => setSelectedFlight(flight)}
                        className={`p-3.5 rounded-2xl border transition cursor-pointer ${
                          isSelected
                            ? 'border-[#FF6B35] bg-orange-50/40 shadow-xs'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-extrabold text-gray-900">
                            {flight.airline} • {flight.flightNumber}
                          </span>
                          <span className="font-black text-sm text-[#FF6B35]">
                            {price.toFixed(2)} USDC
                          </span>
                        </div>

                        <div className="mt-2 flex items-center justify-between text-xs text-gray-800">
                          <div>
                            <span className="font-black">{flight.departureTime}</span>
                            <span className="text-[10px] text-gray-500 block">{flight.from}</span>
                          </div>

                          <div className="flex flex-col items-center">
                            <span className="text-[9px] text-gray-400">{flight.duration}</span>
                            <ArrowRight className="w-4 h-4 text-gray-400 my-0.5" />
                            <span className="text-[9px] text-emerald-600 font-bold">Sans escale</span>
                          </div>

                          <div className="text-right">
                            <span className="font-black">{flight.arrivalTime}</span>
                            <span className="text-[10px] text-gray-500 block">{flight.to}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Class Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-gray-800 uppercase tracking-wider block">
                  2. Classe de Voyage
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setCabinClass('economy')}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold transition border cursor-pointer ${
                      cabinClass === 'economy'
                        ? 'border-[#FF6B35] bg-orange-50/60 text-gray-900 ring-2 ring-[#FF6B35]/20 font-black'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    Classe Économique
                  </button>
                  <button
                    onClick={() => setCabinClass('business')}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold transition border cursor-pointer ${
                      cabinClass === 'business'
                        ? 'border-[#FF6B35] bg-orange-50/60 text-gray-900 ring-2 ring-[#FF6B35]/20 font-black'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    Classe Affaires (+80%)
                  </button>
                </div>
              </div>

              {/* Passenger Info */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-gray-800 uppercase tracking-wider block">
                  3. Nom du Passager (Passeport)
                </label>
                <input
                  type="text"
                  value={passengerName}
                  onChange={(e) => setPassengerName(e.target.value)}
                  placeholder="Kouamé Jean-Marc"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 text-xs font-bold text-gray-900 outline-none focus:border-[#FF6B35]"
                />
              </div>

              {/* Price summary & CTA */}
              <div className="p-3.5 bg-orange-50 rounded-2xl border border-orange-200 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-gray-600 block">Total Billet Vol :</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-base font-black text-gray-900">{finalPrice.toFixed(2)} USDC</span>
                    <span className="text-[10px] text-gray-500">
                      (~{(finalPrice * 650).toLocaleString()} FCFA)
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-gray-500 block">Votre Solde :</span>
                  <span
                    className={`font-black text-xs ${
                      hasEnoughBalance ? 'text-emerald-600' : 'text-red-500'
                    }`}
                  >
                    {balance.toFixed(2)} USDC
                  </span>
                </div>
              </div>

              <button
                onClick={handleBookFlight}
                disabled={isBooking || !passengerName.trim()}
                className="w-full py-4 rounded-2xl bg-[#FF6B35] hover:bg-[#E85520] text-white font-black text-sm shadow-md transition active:scale-98 cursor-pointer disabled:bg-gray-300"
              >
                {isBooking
                  ? 'Émission du billet d’avion...'
                  : hasEnoughBalance
                  ? `Confirmer le Vol (${finalPrice.toFixed(2)} USDC)`
                  : 'Solde insuffisant • Recharger via Kotani Pay'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
