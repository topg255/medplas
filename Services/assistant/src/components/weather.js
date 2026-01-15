import React, { useState, useEffect } from 'react';
import { FiSun, FiCloud, FiCloudRain, FiCloudSnow, FiWind, FiMapPin, FiCheckCircle, FiDroplet, FiThermometer } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

export const UsefulWidgets = ({ destination }) => {
  const [activeTab, setActiveTab] = useState('weather');
  const [weatherData, setWeatherData] = useState(null);
  const [currencyData, setCurrencyData] = useState(null);
  const [amount, setAmount] = useState(100);
  const [fromCurrency, setFromCurrency] = useState('EUR');
  const [toCurrency, setToCurrency] = useState('USD');
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [checklistItems, setChecklistItems] = useState([
    { id: 1, text: 'Passeport/Visa valide', checked: false },
    { id: 2, text: 'Ordonnances médicales', checked: false },
    { id: 3, text: 'Médicaments en quantité suffisante', checked: false },
    { id: 4, text: 'Assurance voyage médicale', checked: false },
    { id: 5, text: 'Contacts d\'urgence', checked: false },
    { id: 6, text: 'Adaptateur électrique', checked: false }
  ]);

  // Récupération des données météo
  useEffect(() => {
    if (destination && activeTab === 'weather') {
      const fetchWeather = async () => {
        try {
          // Remplacez par votre clé API OpenWeather
          const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${destination}&units=metric&appid=YOUR_OPENWEATHER_API_KEY&lang=fr`
          );
          setWeatherData(response.data);
        } catch (error) {
          console.error("Erreur lors de la récupération de la météo", error);
        }
      };
      fetchWeather();
    }
  }, [destination, activeTab]);

  // Récupération des taux de change
  useEffect(() => {
    if (activeTab === 'currency') {
      const fetchCurrency = async () => {
        try {
          // Remplacez par votre clé API ExchangeRate
          const response = await axios.get(
            `https://v6.exchangerate-api.com/v6/YOUR_EXCHANGERATE_API_KEY/latest/${fromCurrency}`
          );
          setCurrencyData(response.data.conversion_rates);
          if (response.data.conversion_rates[toCurrency]) {
            setConvertedAmount((amount * response.data.conversion_rates[toCurrency]).toFixed(2));
          }
        } catch (error) {
          console.error("Erreur lors de la récupération des taux de change", error);
        }
      };
      fetchCurrency();
    }
  }, [activeTab, fromCurrency, toCurrency, amount]);

  const handleCheckboxChange = (id) => {
    setChecklistItems(checklistItems.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const getWeatherIcon = (weatherId) => {
    if (weatherId >= 200 && weatherId < 300) return <FiCloudRain className="text-blue-400" />;
    if (weatherId >= 300 && weatherId < 600) return <FiCloudRain className="text-blue-300" />;
    if (weatherId >= 600 && weatherId < 700) return <FiCloudSnow className="text-blue-200" />;
    if (weatherId >= 700 && weatherId < 800) return <FiWind className="text-gray-400" />;
    if (weatherId === 800) return <FiSun className="text-yellow-400" />;
    return <FiCloud className="text-gray-300" />;
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 mt-16">
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px">
          {[
            { id: 'weather', label: 'Météo' },
            { id: 'currency', label: 'Convertisseur' },
            { id: 'checklist', label: 'Check-list' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'weather' && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-900 flex items-center">
                  <FiMapPin className="mr-2 text-blue-500" />
                  Conditions météo à {destination || 'votre destination'}
                </h3>
                
                {weatherData ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-blue-50 rounded-xl p-6 flex flex-col items-center justify-center">
                      <div className="text-5xl mb-4">
                        {getWeatherIcon(weatherData.weather[0].id)}
                      </div>
                      <div className="text-4xl font-bold text-gray-800">
                        {Math.round(weatherData.main.temp)}°C
                      </div>
                      <div className="text-gray-600 capitalize">
                        {weatherData.weather[0].description}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center">
                        <FiThermometer className="w-5 h-5 text-gray-500 mr-3" />
                        <span className="text-gray-700">
                          Ressenti : {Math.round(weatherData.main.feels_like)}°C
                        </span>
                      </div>
                      <div className="flex items-center">
                        <FiDroplet className="w-5 h-5 text-gray-500 mr-3" />
                        <span className="text-gray-700">
                          Humidité : {weatherData.main.humidity}%
                        </span>
                      </div>
                      <div className="flex items-center">
                        <FiWind className="w-5 h-5 text-gray-500 mr-3" />
                        <span className="text-gray-700">
                          Vent : {(weatherData.wind.speed * 3.6).toFixed(1)} km/h
                        </span>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-6">
                      <h4 className="font-medium text-gray-900 mb-3">Conseils pour votre voyage</h4>
                      <ul className="space-y-2 text-sm text-gray-700">
                        {weatherData.main.temp > 25 && (
                          <li className="flex items-start">
                            <span className="text-blue-500 mr-2">•</span>
                            Prévoyez des vêtements légers et de la crème solaire
                          </li>
                        )}
                        {weatherData.main.temp < 10 && (
                          <li className="flex items-start">
                            <span className="text-blue-500 mr-2">•</span>
                            Emportez des vêtements chauds pour les sorties
                          </li>
                        )}
                        {weatherData.weather[0].id >= 500 && weatherData.weather[0].id < 600 && (
                          <li className="flex items-start">
                            <span className="text-blue-500 mr-2">•</span>
                            Prévoir un parapluie ou imperméable
                          </li>
                        )}
                        <li className="flex items-start">
                          <span className="text-blue-500 mr-2">•</span>
                          Vérifiez les conditions météo avant votre départ
                        </li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Chargement des données météo...
                  </div>
                )}
              </div>
            )}

            {activeTab === 'currency' && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-900">Convertisseur de devises</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Montant</label>
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">De</label>
                      <select
                        value={fromCurrency}
                        onChange={(e) => setFromCurrency(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="EUR">Euro (EUR)</option>
                        <option value="USD">Dollar US (USD)</option>
                        <option value="GBP">Livre Sterling (GBP)</option>
                        <option value="CHF">Franc Suisse (CHF)</option>
                        <option value="CAD">Dollar Canadien (CAD)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Résultat</label>
                      <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 font-medium">
                        {convertedAmount} {toCurrency}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Vers</label>
                      <select
                        value={toCurrency}
                        onChange={(e) => setToCurrency(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="USD">Dollar US (USD)</option>
                        <option value="EUR">Euro (EUR)</option>
                        <option value="GBP">Livre Sterling (GBP)</option>
                        <option value="CHF">Franc Suisse (CHF)</option>
                        <option value="CAD">Dollar Canadien (CAD)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {currencyData && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Taux de change actuels</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <div className="bg-white p-2 rounded-lg shadow-xs">
                        <div className="font-medium">1 EUR = {(1 * currencyData.USD).toFixed(4)} USD</div>
                      </div>
                      <div className="bg-white p-2 rounded-lg shadow-xs">
                        <div className="font-medium">1 USD = {(1 / currencyData.USD * currencyData.EUR).toFixed(4)} EUR</div>
                      </div>
                      <div className="bg-white p-2 rounded-lg shadow-xs">
                        <div className="font-medium">1 EUR = {(1 * currencyData.GBP).toFixed(4)} GBP</div>
                      </div>
                      <div className="bg-white p-2 rounded-lg shadow-xs">
                        <div className="font-medium">1 CHF = {(1 * currencyData.EUR / currencyData.CHF).toFixed(4)} EUR</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'checklist' && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-900">Check-list avant départ</h3>
                <p className="text-gray-600">
                  Cochez les éléments que vous avez préparés pour votre voyage médical
                </p>
                
                <div className="space-y-3">
                  {checklistItems.map((item) => (
                    <motion.div
                      key={item.id}
                      whileHover={{ scale: 1.01 }}
                      className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer"
                      onClick={() => handleCheckboxChange(item.id)}
                    >
                      <div className={`flex items-center justify-center w-6 h-6 rounded-md border-2 ${
                        item.checked 
                          ? 'bg-blue-500 border-blue-500 text-white' 
                          : 'bg-white border-gray-300 text-transparent'
                      } mr-3`}>
                        <FiCheckCircle className="w-4 h-4" />
                      </div>
                      <span className={`${item.checked ? 'text-gray-500 line-through' : 'text-gray-800'}`}>
                        {item.text}
                      </span>
                    </motion.div>
                  ))}
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm font-medium">
                    + Ajouter un élément personnalisé
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default UsefulWidgets;