import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Ahlem from '../assets/ahlem.png'
import clinic from '../assets/clinicc.jpg'
import airport from '../assets/airport.jpg'
import hotel from '../assets/hotel.jpg'
import dent from '../assets/dental.jpg'

// Configuration des icônes personnalisées
const createCustomIcon = (iconUrl, size = [40, 40]) => {
  return L.icon({
    iconUrl,
    iconSize: size,
    iconAnchor: [size[0] / 2, size[1]],
    popupAnchor: [0, -size[1] / 2],
    className: 'partner-icon'
  });
};

const partnerIcons = {
  hotel: createCustomIcon('https://cdn-icons-png.flaticon.com/512/2776/2776067.png'),
  clinic: createCustomIcon('https://cdn-icons-png.flaticon.com/512/2965/2965878.png'),
  airport: createCustomIcon('https://cdn-icons-png.flaticon.com/512/2489/2489076.png')
};


// Données des partenaires (à remplacer par vos données réelles)
const partnersData = [
  {
    id: 1,
    name: "Dr Ahlem Hair Implants clinic",
    type: "clinic",
    position: [35.84510162190772, 10.619028295034528], // Paris
    description: "Clinique spécialisée en greffe de cheveux avec équipements de pointe et suivi personnalisé.",
    services: ["Consultation pré-opératoire", "Greffe FUE/DHI", "Suivi post-opératoire", "Transport VIP"],
    image: Ahlem
  },
  {
    id: 2,
    name: "Polyclinique el Kantaoui",
    type: "clinic",
    position: [35.86259588765769, 10.60946688693451], // Lyon
    description: "Centre d'excellence en chirurgie orthopédique et rééducation.",
    services: ["Bloc opératoire high-tech", "Équipe multilingue", "Accueil international"],
    image: clinic
  },
  {
    id: 3,
    name: "Aéroport International Enfidha-Hammamet",
    type: "airport",
    position: [36.08422079633679, 10.438861321573473], // Marseille
    description: "Terminal dédié aux patients médicaux avec services VIP.",
    services: ["Assistance personnalisée", "Lounge médicalisé", "Transferts privés"],
    image: airport
  },
  {
    id: 4,
    name: "Riath Palm",
    type: "hotel",
    position: [35.84110919635016, 10.629246595034282], // Nantes
    description: "Établissement spécialisé dans l'accueil post-opératoire.",
    services: ["Espace détente", "Suites familiales", "Accès handicapé"],
    image: hotel
  },
  {
    id: 5,
    name: "clinic Dr.Kallali Yassine",
    type: "clinic",
    position: [35.86330395703378, 10.609560512970994], // Toulouse
    description: "Clinique dentaire moderne proposant des soins esthétiques et chirurgicaux de haute qualité.",
    services: ["Blanchiment dentaire", "Implants et prothèses", "Orthodontie invisible", "Chirurgie buccale"],
    image: dent
  }
];

export const ServicesMap = () => {
  const [activePartner, setActivePartner] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'hotel', 'clinic', 'airport'

  const filteredPartners = filter === 'all'
    ? partnersData
    : partnersData.filter(partner => partner.type === filter);

  const centerPosition = [35.82351205785063, 10.635192328593353]; // Centre de la France

  return (
    <div className="bg-white rounded-3xl ml-7 mr-5 shadow-xl overflow-hidden border border-gray-100 mt-16">
      <div className="p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Carte de nos partenaires</h2>

        {/* Filtres */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            Tous
          </button>
          <button
            onClick={() => setFilter('hotel')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition flex items-center ${filter === 'hotel' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            <img src="https://cdn-icons-png.flaticon.com/512/2776/2776067.png" className="w-4 h-4 mr-2" alt="Hôtels" />
            Hôtels
          </button>
          <button
            onClick={() => setFilter('clinic')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition flex items-center ${filter === 'clinic' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            <img src="https://cdn-icons-png.flaticon.com/512/2965/2965878.png" className="w-4 h-4 mr-2" alt="Cliniques" />
            Cliniques
          </button>
          <button
            onClick={() => setFilter('airport')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition flex items-center ${filter === 'airport' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            <img src="https://cdn-icons-png.flaticon.com/512/2489/2489076.png" className="w-4 h-4 mr-2" alt="Aéroports" />
            Aéroports
          </button>
        </div>

        {/* Carte et détails */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 z-10">
          <div className="lg:col-span-2 h-[500px] z-10 rounded-xl overflow-hidden border border-gray-200">
            <MapContainer
              center={centerPosition}
              zoom={6}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />

              {filteredPartners.map(partner => (
                <Marker
                  key={partner.id}
                  position={partner.position}
                  icon={partnerIcons[partner.type]}
                  eventHandlers={{
                    click: () => setActivePartner(partner)
                  }}
                >
                  <Popup>
                    <div className="font-medium">{partner.name}</div>
                    <div className="text-sm text-gray-600 capitalize">{partner.type}</div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>

          {/* Détails du partenaire sélectionné */}
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            {activePartner ? (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{activePartner.name}</h3>
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <span className={`inline-block w-2 h-2 rounded-full mr-2 ${activePartner.type === 'hotel' ? 'bg-blue-500' :
                      activePartner.type === 'clinic' ? 'bg-green-500' : 'bg-amber-500'
                    }`}></span>
                  {activePartner.type === 'hotel' ? 'Hôtel Médical' :
                    activePartner.type === 'clinic' ? 'Clinique Partenaire' : 'Aéroport'}
                </div>

                <img
                  src={activePartner.image}
                  alt={activePartner.name}
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />

                <p className="text-gray-700 mb-4">{activePartner.description}</p>

                <h4 className="font-medium text-gray-900 mb-2">Services proposés :</h4>
                <ul className="space-y-2 mb-6">
                  {activePartner.services.map((service, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-600">{service}</span>
                    </li>
                  ))}
                </ul>

                <button className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium hover:shadow-md transition">
                  Contacter ce partenaire
                </button>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-700 mb-1">Sélectionnez un partenaire</h3>
                <p className="text-gray-500">Cliquez sur un marqueur dans la carte pour afficher les détails</p>
              </div>
            )}
          </div>
        </div>

        {/* Légende */}
        <div className="mt-6 flex flex-wrap gap-4 justify-center">
          <div className="flex items-center">
            <img src="https://cdn-icons-png.flaticon.com/512/2776/2776067.png" className="w-4 h-4 mr-2" alt="Hôtel" />
            <span className="text-sm text-gray-600">Hôtel médicalisé</span>
          </div>
          <div className="flex items-center">
            <img src="https://cdn-icons-png.flaticon.com/512/2965/2965878.png" className="w-4 h-4 mr-2" alt="Clinique" />
            <span className="text-sm text-gray-600">Clinique partenaire</span>
          </div>
          <div className="flex items-center">
            <img src="https://cdn-icons-png.flaticon.com/512/2489/2489076.png" className="w-4 h-4 mr-2" alt="Aéroport" />
            <span className="text-sm text-gray-600">Aéroport médical</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesMap;