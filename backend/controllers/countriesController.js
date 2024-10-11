import countriesModel from "../models/countriesModel.js";

const countries = [
    { name: "USA", code: "US", cities: ["Los Angeles", "San Francisco", "San Diego"] },
    { name: "Canada", code: "CA", cities: ["Ontario", "Quebec", "British Columbia"] },
    { name: "UK", code: "GB", cities: ["England", "Scotland", "Wales"] },
    { name: "India", code: "IN", cities: ["Maharashtra", "Delhi", "Karnataka"] },
    { name: "Australia", code: "AU", cities: ["Sydney", "Melbourne", "Brisbane"] },
    { name: "Germany", code: "DE", cities: ["Berlin", "Munich", "Hamburg"] },
    { name: "France", code: "FR", cities: ["Paris", "Lyon", "Marseille"] },
    { name: "Japan", code: "JP", cities: ["Tokyo", "Osaka", "Kyoto"] },
    { name: "Brazil", code: "BR", cities: ["São Paulo", "Rio de Janeiro", "Brasília"] },
    { name: "Mexico", code: "MX", cities: ["Mexico City", "Guadalajara", "Monterrey"] },
    { name: "South Africa", code: "ZA", cities: ["Cape Town", "Johannesburg", "Durban"] },
    { name: "China", code: "CN", cities: ["Beijing", "Shanghai", "Shenzhen"] },
    { name: "Italy", code: "IT", cities: ["Rome", "Milan", "Naples"] },
    { name: "Spain", code: "ES", cities: ["Madrid", "Barcelona", "Valencia"] },
    { name: "Russia", code: "RU", cities: ["Moscow", "Saint Petersburg", "Kazan"] },
    { name: "Netherlands", code: "NL", cities: ["Amsterdam", "Rotterdam", "The Hague"] },
    { name: "Sweden", code: "SE", cities: ["Stockholm", "Gothenburg", "Malmö"] },
    { name: "Switzerland", code: "CH", cities: ["Zurich", "Geneva", "Basel"] },
    { name: "South Korea", code: "KR", cities: ["Seoul", "Busan", "Incheon"] },
    { name: "Argentina", code: "AR", cities: ["Buenos Aires", "Córdoba", "Rosario"] },
    { name: "New Zealand", code: "NZ", cities: ["Auckland", "Wellington", "Christchurch"] },
    { name: "Turkey", code: "TR", cities: ["Istanbul", "Ankara", "Izmir"] },
    { name: "Egypt", code: "EG", cities: ["Cairo", "Alexandria", "Giza"] },
    { name: "Saudi Arabia", code: "SA", cities: ["Riyadh", "Jeddah", "Mecca"] },
    { name: "Nigeria", code: "NG", cities: ["Lagos", "Abuja", "Ibadan"] },
    { name: "Malaysia", code: "MY", cities: ["Kuala Lumpur", "George Town", "Johor Bahru"] },
    { name: "Indonesia", code: "ID", cities: ["Jakarta", "Surabaya", "Bandung"] },
    { name: "Thailand", code: "TH", cities: ["Bangkok", "Chiang Mai", "Phuket"] },
    { name: "Vietnam", code: "VN", cities: ["Ho Chi Minh City", "Hanoi", "Da Nang"] },
    { name: "Philippines", code: "PH", cities: ["Manila", "Cebu", "Davao City"] }
];


const getCountries = async (req, res) => {
    try {
        const countries = await countriesModel.find({})
        res.json({success:true, countries})
    } catch (error) {
        console.log(error);
        res.json({success:false, message:"Error when fetching countries!!"})
    }
}

const seedCountries = async () => {
    try {
        for (const country of countries) {
          // Check if the country already exists
          const existingCountry = await countriesModel.findOne({ code: country.code });
          if (!existingCountry) {
            await countriesModel.create(country); // Only create if it doesn't exist
          }
        }
        console.log('Countries seeded successfully');
      } catch (error) {
        console.error('Error seeding countries:', error);
      }
}

export { getCountries, seedCountries }