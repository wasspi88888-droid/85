import React, { useState } from 'react';
import {
  X,
  Film,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  QrCode,
  Ticket,
  ChevronRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';

interface Movie {
  id: string;
  title: string;
  genre: string;
  duration: string;
  poster: string;
  priceUSDC: number;
}

const MOVIES: Movie[] = [
  {
    id: 'm-1',
    title: 'Dune: Deuxième Partie',
    genre: 'Science-Fiction / Aventure',
    duration: '2h 46m',
    poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
    priceUSDC: 8.5,
  },
  {
    id: 'm-2',
    title: 'Gladiator II',
    genre: 'Action / Historique',
    duration: '2h 28m',
    poster: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?auto=format&fit=crop&w=600&q=80',
    priceUSDC: 9.0,
  },
  {
    id: 'm-3',
    title: 'Black Panther: Wakanda Forever',
    genre: 'Action / Marvel',
    duration: '2h 41m',
    poster: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80',
    priceUSDC: 8.0,
  },
];

const CINEMAS = [
  { id: 'c-1', name: 'Majestic Cinéma Ivoire', hall: 'Salle VIP 1', location: 'Cocody, Abidjan' },
  { id: 'c-2', name: 'Pathé Cap Sud', hall: 'Salle Dolby Atmos 4', location: 'Marcory, Abidjan' },
  { id: 'c-3', name: 'Canal Olympia Yopougon', hall: 'Salle Bleue', location: 'Yopougon, Abidjan' },
];

const SHOWTIMES = ['15:30', '18:15', '20:45', '22:30'];

interface CinemaTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CinemaTicketModal: React.FC<CinemaTicketModalProps> = ({ isOpen, onClose }) => {
  const { balance, updateBalance, addTransaction, showToast, openKotaniModal, user } = useApp();

  const [selectedMovie, setSelectedMovie] = useState<Movie>(MOVIES[0]);
  const [selectedCinema, setSelectedCinema] = useState(CINEMAS[0]);
  const [selectedTime, setSelectedTime] = useState(SHOWTIMES[1]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>(['D4', 'D5']);
  const [isProcessing, setIsProcessing] = useState(false);
  const [purchasedTicket, setPurchasedTicket] = useState<{
    ticketNumber: string;
    movie: string;
    cinema: string;
    hall: string;
    time: string;
    seats: string[];
    totalUSDC: number;
  } | null>(null);

  if (!isOpen) return null;

  const totalCost = Number((selectedMovie.priceUSDC * selectedSeats.length).toFixed(2));
  const hasEnoughBalance = balance >= totalCost;

  const toggleSeat = (seatId: string) => {
    if (selectedSeats.includes(seatId)) {
      if (selectedSeats.length > 1) {
        setSelectedSeats(selectedSeats.filter((s) => s !== seatId));
      }
    } else {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const handlePurchaseTicket = () => {
    if (!hasEnoughBalance) {
      showToast('Solde USDC insuffisant. Veuillez recharger via Kotani Pay.');
      openKotaniModal();
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      const newBal = Number((balance - totalCost).toFixed(2));
      updateBalance(newBal);

      const ticketRef = `TCK-${Math.floor(100000 + Math.random() * 900000)}`;

      addTransaction({
        type: 'service_payment',
        title: `Tickets Cinéma: ${selectedMovie.title}`,
        amountUSDC: -totalCost,
        amountFCFA: Math.round(totalCost * 650),
        status: 'completed',
        category: 'Services',
        note: `${selectedCinema.name} (${selectedSeats.join(', ')}) • Réf: ${ticketRef}`,
      });

      setPurchasedTicket({
        ticketNumber: ticketRef,
        movie: selectedMovie.title,
        cinema: selectedCinema.name,
        hall: selectedCinema.hall,
        time: selectedTime,
        seats: selectedSeats,
        totalUSDC: totalCost,
      });

      setIsProcessing(false);

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      showToast(`Paiement de ${totalCost} USDC validé ! Vos e-billets sont prêts.`);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-3">
      <div className="bg-white rounded-3xl max-w-md w-full max-h-[92vh] overflow-hidden flex flex-col shadow-2xl border border-gray-100 animate-scale-up">
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#FF6B35]">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-gray-900 leading-tight">
                Cinéma & Billetterie 85
              </h3>
              <p className="text-[11px] text-gray-500">
                Pathé & Majestic • Règlement instantané USDC
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
          {purchasedTicket ? (
            /* E-Ticket Ready View */
            <div className="space-y-4 text-center animate-fade-in">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-black text-lg text-gray-900">E-Billet Confirmé !</h4>
                <p className="text-xs text-gray-500">
                  Présentez ce QR Code à l’entrée de la salle
                </p>
              </div>

              {/* Ticket Card */}
              <div className="bg-gradient-to-b from-gray-900 to-gray-800 text-white rounded-3xl p-5 border border-gray-700 shadow-xl relative overflow-hidden text-left space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-orange-400 block">
                      RÉFÉRENCE : {purchasedTicket.ticketNumber}
                    </span>
                    <h5 className="font-extrabold text-base text-white mt-0.5">
                      {purchasedTicket.movie}
                    </h5>
                    <p className="text-xs text-gray-300">{purchasedTicket.cinema}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-[#FF6B35] text-white text-[10px] font-black">
                    85 PASS
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 p-2.5 bg-white/10 rounded-2xl text-[11px]">
                  <div>
                    <span className="text-gray-400 block text-[9px]">Salle</span>
                    <span className="font-bold">{purchasedTicket.hall}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[9px]">Séance</span>
                    <span className="font-bold">{purchasedTicket.time}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[9px]">Sièges</span>
                    <span className="font-bold text-orange-300">
                      {purchasedTicket.seats.join(', ')}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-dashed border-gray-600 flex items-center justify-between">
                  <div className="p-2 bg-white rounded-xl">
                    <QrCode className="w-16 h-16 text-gray-900" />
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-gray-400 block">Payé via Smart Wallet</span>
                    <span className="font-black text-sm text-emerald-400">
                      {purchasedTicket.totalUSDC.toFixed(2)} USDC
                    </span>
                    <span className="text-[9px] text-gray-400 block">
                      ~{(purchasedTicket.totalUSDC * 650).toLocaleString()} FCFA
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setPurchasedTicket(null)}
                className="w-full py-3 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-extrabold text-xs transition cursor-pointer"
              >
                Acheter d’autres places
              </button>
            </div>
          ) : (
            /* Booking Form */
            <div className="space-y-4">
              {/* Select Movie */}
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-800 uppercase tracking-wider block">
                  1. Choisir le Film
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {MOVIES.map((movie) => (
                    <button
                      key={movie.id}
                      onClick={() => setSelectedMovie(movie)}
                      className={`rounded-2xl overflow-hidden border p-1 text-left transition cursor-pointer ${
                        selectedMovie.id === movie.id
                          ? 'border-[#FF6B35] ring-2 ring-[#FF6B35]/20 bg-orange-50/30'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={movie.poster}
                        alt={movie.title}
                        className="w-full h-24 object-cover rounded-xl"
                      />
                      <div className="p-1.5">
                        <span className="font-bold text-[11px] text-gray-900 line-clamp-1 block">
                          {movie.title}
                        </span>
                        <span className="text-[10px] text-[#FF6B35] font-extrabold block">
                          ${movie.priceUSDC}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Select Cinema */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-gray-800 uppercase tracking-wider block">
                  2. Cinéma & Complexe
                </label>
                <div className="space-y-1.5">
                  {CINEMAS.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => setSelectedCinema(c)}
                      className={`p-3 rounded-2xl border flex items-center justify-between text-xs cursor-pointer transition ${
                        selectedCinema.id === c.id
                          ? 'border-[#FF6B35] bg-orange-50/40 text-gray-900 font-bold'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-[#FF6B35]" />
                        <div>
                          <span className="font-bold block">{c.name}</span>
                          <span className="text-[10px] text-gray-400 font-normal">
                            {c.location} • {c.hall}
                          </span>
                        </div>
                      </div>
                      {selectedCinema.id === c.id && (
                        <CheckCircle2 className="w-4 h-4 text-[#FF6B35]" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Showtimes & Seats */}
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-800 uppercase tracking-wider block">
                  3. Séance & Sièges
                </label>
                <div className="flex gap-2">
                  {SHOWTIMES.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                        selectedTime === time
                          ? 'bg-[#FF6B35] text-white shadow-2xs'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>

                {/* Seat Selector Grid */}
                <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200/80 space-y-2">
                  <div className="w-3/4 mx-auto h-1.5 bg-gray-300 rounded-full mb-3" title="Écran" />
                  <span className="text-[9px] uppercase tracking-widest text-center text-gray-400 block mb-2 font-bold">
                    Écran de projection
                  </span>

                  <div className="grid grid-cols-6 gap-1.5 max-w-xs mx-auto">
                    {['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'D1', 'D2', 'D3', 'D4', 'D5', 'D6'].map(
                      (seat) => {
                        const isSelected = selectedSeats.includes(seat);
                        return (
                          <button
                            key={seat}
                            onClick={() => toggleSeat(seat)}
                            className={`py-1 rounded-md text-[10px] font-bold transition cursor-pointer ${
                              isSelected
                                ? 'bg-[#FF6B35] text-white shadow-2xs'
                                : 'bg-white border border-gray-200 text-gray-700 hover:border-[#FF6B35]'
                            }`}
                          >
                            {seat}
                          </button>
                        );
                      }
                    )}
                  </div>
                  <span className="text-[10px] text-gray-500 text-center block mt-1">
                    {selectedSeats.length} siège(s) sélectionné(s) : {selectedSeats.join(', ')}
                  </span>
                </div>
              </div>

              {/* Price summary & CTA */}
              <div className="p-3.5 bg-orange-50 rounded-2xl border border-orange-200 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-gray-600 block">Total à régler en USDC :</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-base font-black text-gray-900">{totalCost.toFixed(2)} USDC</span>
                    <span className="text-[10px] text-gray-500">
                      (~{(totalCost * 650).toLocaleString()} FCFA)
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
                onClick={handlePurchaseTicket}
                disabled={isProcessing}
                className="w-full py-4 rounded-2xl bg-[#FF6B35] hover:bg-[#E85520] text-white font-black text-sm shadow-md transition active:scale-98 cursor-pointer disabled:bg-gray-300"
              >
                {isProcessing
                  ? 'Traitement du smart contract...'
                  : hasEnoughBalance
                  ? `Payer ${totalCost.toFixed(2)} USDC & Obtenir mes billets`
                  : 'Solde insuffisant • Recharger via Kotani Pay'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
