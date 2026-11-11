// Central site content. All business copy lives here so it can be updated in one place.
// Items flagged `draft: true` are placeholder content awaiting verification by Tuzuru Africa.

// Media URLs live in the media module (@/lib/cms/media, MR-05) and contact/navigation copy in
// the settings module (@/lib/cms/settings, MR-04). Content records reference media by key only.

export const discoveryPaths = [
  {
    key: 'travel',
    label: 'Travel',
    icon: 'Plane',
    blurb: 'Scheduled safaris, private journeys and tailor-made itineraries.',
    to: '/tours',
  },
  {
    key: 'stay',
    label: 'Stay',
    icon: 'BedDouble',
    blurb: 'Lodges, tented camps and coastal retreats matched to your trip.',
    to: '/plan-your-trip',
  },
  {
    key: 'explore',
    label: 'Explore',
    icon: 'Camera',
    blurb: 'Parks, coastlines, highlands and cities worth the journey.',
    to: '/destinations',
  },
  {
    key: 'experience',
    label: 'Experience',
    icon: 'MapPin',
    blurb: 'Wildlife, culture, food, water and open-sky adventure.',
    to: '/experiences',
  },
];

export const destinations = [
  {
    slug: 'maasai-mara',
    name: 'Maasai Mara',
    country: 'Kenya',
    region: 'Rift Valley',
    imageKey: 'mara',
    tagline: 'Big-cat country, open plains and the great migration',
    intro:
      'Kenya’s best-known reserve: rolling grassland, river crossings and resident predators, with conservancies that allow quieter, low-density viewing.',
    description:
      'The Mara is a landscape of long grass and scattered acacia, worked by prides of lion, cheetah on the termite mounds and leopards along the riverline. Between July and October the northern herds move through the ecosystem, and the Mara River becomes the setting for some of the most dramatic crossings on the continent. The surrounding conservancies offer night drives, walking safaris and a lower vehicle density than the reserve itself.',
    attractions: ['Mara River crossings', 'Musiara and Olare Motorogi conservancies', 'Mara Triangle', 'Maasai homestead visits'],
    bestTime: 'Wildlife viewing is strong year-round. River crossings are most associated with July to October; shorter grass from January to March favours predator viewing.',
    travelInfo:
      'Access is by light aircraft to several airstrips or by road from Nairobi. Park and conservancy fees apply and are usually included in a quoted itinerary. Confirm current entry requirements and fees with our team before travelling.',
    related: ['great-migration-safari', 'family-safari-mara', 'maasai-cultural-immersion'],
  },
  {
    slug: 'serengeti',
    name: 'Serengeti',
    country: 'Tanzania',
    region: 'Northern Tanzania',
    imageKey: 'serengeti',
    tagline: 'The endless plain, and the herds that move across it',
    intro:
      'A vast ecosystem of grassland and kopjes where the migration moves with the rains, and where a balloon at dawn is the quietest way to see it.',
    description:
      'The Serengeti rewards patience. Its central plains hold resident game throughout the year, while the western corridor and northern reaches follow the seasonal movement of wildebeest and zebra. Granite kopjes shelter lion and leopard; the plains open out for cheetah. Camps are spread far apart, which keeps the sense of space intact.',
    attractions: ['Seronera Valley', 'Grumeti and the western corridor', 'Northern Serengeti (Kogatende)', 'Dawn balloon flights'],
    bestTime: 'Movement follows the rains. The southern calving season is usually associated with the early months, northern river crossings with the middle of the year. Exact timing varies each season.',
    travelInfo:
      'Most itineraries combine the Serengeti with the Ngorongoro Conservation Area. Flights connect to several airstrips, and road transfers are long. Our team will confirm current park fees and entry requirements for your dates.',
    related: ['migration-safari', 'serengeti-balloon-safari'],
  },
  {
    slug: 'zanzibar',
    name: 'Zanzibar',
    country: 'Tanzania',
    region: 'Indian Ocean coast',
    imageKey: 'zanzibar',
    tagline: 'Swahili heritage, spice farms and a warm turquoise sea',
    intro:
      'Stone Town’s carved doors, spice-growing inland, and long white beaches along the northern and eastern coasts.',
    description:
      'Zanzibar works as well after a safari as it does on its own. Stone Town is a dense, walkable grid of coral-rag buildings, carved timber doors and markets; the coast opens into shallow, warm water and reef-protected swimming. Spice farm visits, dhow sailing and reef snorkelling fill days without hurry.',
    attractions: ['Stone Town and its carved doors', 'Spice farm visits', 'Nungwi and Kendwa beaches', 'Mnemba Atoll snorkelling'],
    bestTime: 'Generally warm year-round, with a wetter period in the middle of the year and a shorter wet spell early in the year. Conditions vary — we will advise for your dates.',
    travelInfo:
      'Ferries connect Dar es Salaam with Stone Town and flights serve Zanzibar International Airport. A visa or entry permit may be required depending on nationality; confirm current requirements before booking.',
    related: ['zanzibar-coast-retreat', 'swahili-coast-guide'],
  },
  {
    slug: 'amboseli',
    name: 'Amboseli',
    country: 'Kenya',
    region: 'Southern Kenya',
    imageKey: 'amboseli',
    tagline: 'Elephants, dust and Kilimanjaro on the horizon',
    intro:
      'Wide dust plains below Kilimanjaro, with some of the most closely studied elephant families in Africa.',
    description:
      'Amboseli is a compact park with enormous views. Its elephants are habituated to vehicles, the swamps draw hippo and waterbirds, and on clear mornings the mountain fills the southern horizon. The open terrain makes it a good first safari and a natural pairing with the Mara or Tsavo.',
    attractions: ['Elephant families of the swamps', 'Kilimanjaro viewpoints', 'Observation Hill', 'Maasai community land bordering the park'],
    bestTime: 'Clear mountain views are most common in the cooler months. Wildlife concentrates around water in the drier periods.',
    travelInfo:
      'Access by road from Nairobi or by light aircraft. Park fees apply. Best views of the mountain are early morning. Confirm current entry requirements with our team.',
    related: ['amboseli-elephants'],
  },
  {
    slug: 'cape-town',
    name: 'Cape Town & the Winelands',
    country: 'South Africa',
    region: 'Western Cape',
    imageKey: 'capetown',
    tagline: 'A mountain city, long coast and old vineyards',
    intro:
      'A city wrapped around a mountain, with beaches, gardens and wine country within easy reach.',
    description:
      'Cape Town compresses an unusual amount into a small area: the mountain and its cableway, the peninsula drive, penguin colonies, and the vineyards of Stellenbosch and Franschhoek an hour inland. It works well as the beginning or end of a longer African itinerary, where city days balance time in the bush.',
    attractions: ['Table Mountain', 'Cape Peninsula and Cape Point', 'Stellenbosch and Franschhoek winelands', 'V&A Waterfront'],
    bestTime: 'Summer months bring long dry days and wind. Shoulder months are quieter. Winter is cooler and wetter but greener and cheaper.',
    travelInfo:
      'Cape Town International Airport is a major gateway. Vehicle hire or a private driver is the usual way to reach the winelands. Confirm current visa and entry rules for your nationality.',
    related: ['cape-town-winelands'],
  },
  {
    slug: 'victoria-falls',
    name: 'Victoria Falls',
    country: 'Zambia & Zimbabwe',
    region: 'Zambezi River',
    imageKey: 'falls',
    tagline: 'The smoke that thunders, and a river full of life',
    intro:
      'The largest curtain of falling water in the world, with the Zambezi above and below it and adventure on both banks.',
    description:
      'Victoria Falls is both spectacle and base. The falls themselves can be walked in a morning; the surrounding river offers sunset cruises, rafting below the gorge, and game viewing in the national parks on either side. The Zimbabwean and Zambian banks each have their own character, and crossing between them is straightforward.',
    attractions: ['The falls walk and rainforest', 'Zambezi sunset cruises', 'White-water rafting in the gorge', 'Chobe day trips'],
    bestTime: 'Water volume peaks after the rains and is at its lowest in the drier months, when the gorge and rapids are more visible. Both seasons have advantages.',
    travelInfo:
      'Access via Victoria Falls Airport (Zimbabwe) or Livingstone (Zambia). Some nationalities need visas for one or both countries; confirm current requirements. Our team will advise on cross-border logistics.',
    related: ['victoria-falls-chobe'],
  },
];

export const experiences = [
  {
    slug: 'safari-wildlife',
    name: 'Safari & Wildlife',
    icon: 'Binoculars',
    imageKey: 'migration',
    blurb: 'Game drives, walking safaris and river crossings, led by guides who read the bush.',
    detail:
      'Days built around the best light: early mornings, long middle hours at camp, and late drives into golden dusk. Where conservancies allow it, we add walking and night drives.',
  },
  {
    slug: 'culture-community',
    name: 'Culture & Community',
    icon: 'Users',
    imageKey: 'culture',
    blurb: 'Homestead visits, markets, craft and food, arranged respectfully and on local terms.',
    detail:
      'Visits are arranged with the communities themselves, with time and a fair share of the value staying local. We favour smaller, hosted encounters over staged performances.',
  },
  {
    slug: 'beach-coast',
    name: 'Beach & Coast',
    icon: 'Waves',
    imageKey: 'escape',
    blurb: 'Indian Ocean water, dhow sailing and quiet sand after time on the plains.',
    detail:
      'The natural companion to a safari: shallow warm water, reef snorkelling, sailing and long unstructured afternoons. Coastal stays are chosen for access to the water and quiet at night.',
  },
  {
    slug: 'adventure',
    name: 'Adventure',
    icon: 'Mountain',
    imageKey: 'gorge',
    blurb: 'Rafting, gorges, balloon flights and highland trails for travellers who want to move.',
    detail:
      'Adventure is added in proportion to the rest of the trip — a single big day, or a route built around movement for travellers who want it.',
  },
  {
    slug: 'nature-landscapes',
    name: 'Nature & Landscapes',
    icon: 'Trees',
    imageKey: 'seasons',
    blurb: 'Rift Valley escarpments, craters, forests and the mountain horizons between them.',
    detail:
      'For travellers who care as much about the landscape as the wildlife: viewpoints, forests, crater floors and long drives with something to see.',
  },
  {
    slug: 'city-food',
    name: 'City & Food',
    icon: 'UtensilsCrossed',
    imageKey: 'door',
    blurb: 'Markets, spice farms, coffee and the food cultures of the coast and the highlands.',
    detail:
      'Half-days built around markets, cooking and tasting, usually at the start or end of a trip when you are already in town.',
  },
];

export const tours = [
  {
    slug: 'great-migration-safari',
    title: 'Great Migration Safari',
    destination: 'Maasai Mara & Serengeti',
    destinationSlug: 'maasai-mara',
    duration: '7 days / 6 nights',
    days: 7,
    imageKey: 'migration',
    experiences: ['Safari & Wildlife', 'Nature & Landscapes'],
    featured: true,
    overview:
      'Follow the herds through both halves of the Mara–Serengeti ecosystem, with time in the conservancies for quieter viewing and night drives.',
    highlights: [
      'Mara River crossing points with a specialist guide',
      'Private conservancy access away from the main reserve',
      'Two nights in the northern Serengeti',
      'Optional dawn balloon flight',
    ],
    itinerary: [
      { day: 1, title: 'Nairobi to the Mara', detail: 'Light-aircraft transfer to the Mara, afternoon game drive and camp briefing.' },
      { day: 2, title: 'Mara reserve and river', detail: 'Full day in the reserve, with time at the river crossing points and a picnic lunch on the plains.' },
      { day: 3, title: 'Conservancy day', detail: 'Morning and late-afternoon drives in the conservancy, with a guided walk where permitted.' },
      { day: 4, title: 'Cross into the Serengeti', detail: 'Road transfer across the border with game viewing en route, arriving at a northern Serengeti camp.' },
      { day: 5, title: 'Northern Serengeti', detail: 'Full day following the herds and the river line.' },
      { day: 6, title: 'Serengeti to Arusha', detail: 'Final morning drive, then a flight to Arusha for an overnight stay.' },
      { day: 7, title: 'Departure', detail: 'Transfer for your international flight or onward extension to Zanzibar.' },
    ],
    accommodation: 'Tented safari camps in the Mara conservancy and northern Serengeti, chosen for location and quiet rather than star ratings.',
    transport: 'Light aircraft and 4×4 safari vehicles with a guide throughout; cross-border road transfer between the Mara and the Serengeti.',
    inclusions: ['Accommodation on a full-board basis', 'Private 4×4 with guide', 'Internal flights and transfers', 'Park and conservancy fees as quoted'],
    exclusions: ['International flights', 'Visas and travel insurance', 'Drinks and personal items', 'Gratuities'],
    important:
      'Migration timing varies with rainfall and cannot be guaranteed on specific dates. River crossings are wildlife events, not scheduled sightings.',
  },
  {
    slug: 'serengeti-balloon-safari',
    title: 'Serengeti Balloon & Plains Safari',
    destination: 'Central Serengeti',
    destinationSlug: 'serengeti',
    duration: '5 days / 4 nights',
    days: 5,
    imageKey: 'balloon',
    experiences: ['Safari & Wildlife', 'Adventure'],
    featured: true,
    overview:
      'A short, focused Serengeti trip built around the quietest hour of the day — a dawn balloon over the plains, then game drives through the kopjes.',
    highlights: ['Dawn balloon flight with bush breakfast', 'Seronera Valley wildlife', 'Time among the granite kopjes', 'Optional Ngorongoro Crater day'],
    itinerary: [
      { day: 1, title: 'Arusha to the Serengeti', detail: 'Flight to Seronera, afternoon drive and camp arrival.' },
      { day: 2, title: 'Balloon at dawn', detail: 'Early launch over the plains, landing breakfast, then a slow drive back through the valleys.' },
      { day: 3, title: 'Full day in the park', detail: 'Morning and afternoon drives across the central plains, with a picnic lunch.' },
      { day: 4, title: 'Kopjes and cats', detail: 'A day focused on predator territory around the kopjes, with an evening drive.' },
      { day: 5, title: 'Departure', detail: 'Morning drive and flight out of the Serengeti.' },
    ],
    accommodation: 'A central Serengeti tented camp with views over the plains.',
    transport: 'Light aircraft to Seronera and 4×4 game drives throughout.',
    inclusions: ['Accommodation and meals as specified', 'Balloon flight and breakfast', 'Park fees', 'Guide and vehicle'],
    exclusions: ['International flights', 'Insurance', 'Drinks', 'Gratuities'],
    important: 'Balloon flights are weather-dependent and subject to weight limits and operator availability.',
  },
  {
    slug: 'zanzibar-coast-retreat',
    title: 'Zanzibar Coast Retreat',
    destination: 'Zanzibar',
    destinationSlug: 'zanzibar',
    duration: '6 days / 5 nights',
    days: 6,
    imageKey: 'escape',
    experiences: ['Beach & Coast', 'Culture & Community'],
    featured: true,
    overview:
      'Two unhurried days in Stone Town, then the northern coast for warm water, reef snorkelling and slow evenings.',
    highlights: ['Guided Stone Town walk', 'Spice farm visit', 'Dhow sunset sail', 'Reef snorkelling at Mnemba Atoll'],
    itinerary: [
      { day: 1, title: 'Arrive Stone Town', detail: 'Transfer and an evening walk along the waterfront.' },
      { day: 2, title: 'Stone Town and spice', detail: 'Morning heritage walk, afternoon spice farm visit.' },
      { day: 3, title: 'To the north coast', detail: 'Transfer north, with the afternoon free at the beach.' },
      { day: 4, title: 'Reef day', detail: 'Snorkelling trip to Mnemba Atoll with a dhow sail.' },
      { day: 5, title: 'Free day', detail: 'Time at the coast, or an optional cooking class in the village.' },
      { day: 6, title: 'Departure', detail: 'Transfer to the airport.' },
    ],
    accommodation: 'A restored Stone Town house, then a small beach property on the northern coast.',
    transport: 'Private transfers; boat for the reef trip.',
    inclusions: ['Accommodation and breakfast', 'Guided town and spice visits', 'Snorkelling excursion', 'Airport transfers'],
    exclusions: ['International flights', 'Meals not specified', 'Marine conservation fees', 'Insurance'],
    important: 'Reef trips depend on sea conditions. Zanzibar is a conservative coastal society; modest dress away from the beach is appreciated.',
  },
  {
    slug: 'gorilla-highlands-trek',
    title: 'Gorilla Highlands Trek',
    destination: 'Bwindi, Uganda',
    destinationSlug: 'bwindi',
    duration: '4 days / 3 nights',
    days: 4,
    imageKey: 'gorilla',
    experiences: ['Safari & Wildlife', 'Nature & Landscapes'],
    overview:
      'A short, focused trek into the Bwindi forest to spend a permitted hour with a habituated mountain gorilla family.',
    highlights: ['Permitted gorilla trekking', 'Forest walks with ranger guides', 'Community coffee visit', 'Highland scenery'],
    itinerary: [
      { day: 1, title: 'Kampala to the highlands', detail: 'Domestic flight or scenic drive to the Bwindi area.' },
      { day: 2, title: 'Trek day', detail: 'Early briefing, then trekking with ranger guides; one hour with the gorillas.' },
      { day: 3, title: 'Forest and community', detail: 'Slower day: forest walk, community coffee project, rest.' },
      { day: 4, title: 'Departure', detail: 'Return to Kampala or Entebbe.' },
    ],
    accommodation: 'A forest-edge lodge within reach of the trekking trailheads.',
    transport: 'Road transfers or domestic flight; trekking on foot with guides.',
    inclusions: ['Gorilla permit arrangement', 'Accommodation and meals', 'Ranger guides', 'Transfers'],
    exclusions: ['International flights', 'Uganda visa', 'Insurance', 'Gratuities'],
    important:
      'Gorilla permits are limited and must be secured well in advance. Trekking involves steep, dense forest and can take several hours.',
  },
  {
    slug: 'cape-town-winelands',
    title: 'Cape Town & Winelands Journey',
    destination: 'Cape Town, South Africa',
    destinationSlug: 'cape-town',
    duration: '8 days / 7 nights',
    days: 8,
    imageKey: 'winelands',
    experiences: ['City & Food', 'Nature & Landscapes'],
    overview:
      'City days, the peninsula drive and three nights among the vineyards, at an unhurried pace.',
    highlights: ['Table Mountain at first light', 'Cape Peninsula drive', 'Three winelands nights', 'Private tastings'],
    itinerary: [
      { day: 1, title: 'Arrival', detail: 'Airport transfer; evening at the waterfront.' },
      { day: 2, title: 'Mountain and city', detail: 'Cableway or early hike, then the city centre and gardens.' },
      { day: 3, title: 'Peninsula day', detail: 'Chapman’s Peak, Cape Point and the penguin colony.' },
      { day: 4, title: 'To the winelands', detail: 'Drive inland; afternoon tasting in Stellenbosch.' },
      { day: 5, title: 'Vineyards', detail: 'Full day of estate visits in Stellenbosch and Franschhoek.' },
      { day: 6, title: 'Free day in the valley', detail: 'Time at leisure, or a longer hike.' },
      { day: 7, title: 'Back to the coast', detail: 'Return to Cape Town for a final night.' },
      { day: 8, title: 'Departure', detail: 'Transfer to the airport.' },
    ],
    accommodation: 'A small city hotel, then a guest farm in the winelands.',
    transport: 'Private driver-guide throughout.',
    inclusions: ['Accommodation and breakfast', 'Private guide and vehicle', 'Selected tastings', 'Airport transfers'],
    exclusions: ['International flights', 'Most lunches and dinners', 'Insurance', 'Gratuities'],
    important: 'Table Mountain access depends on wind and cloud; the itinerary flexes around conditions.',
  },
  {
    slug: 'amboseli-elephants',
    title: 'Amboseli Elephants & Kilimanjaro',
    destination: 'Amboseli',
    destinationSlug: 'amboseli',
    duration: '4 days / 3 nights',
    days: 4,
    imageKey: 'amboseli',
    experiences: ['Safari & Wildlife', 'Nature & Landscapes'],
    overview:
      'A compact first safari: elephant families in the swamps, wide dust plains and, on clear mornings, the mountain behind them.',
    highlights: ['Elephant families at close range', 'Sunrise with Kilimanjaro', 'Birdlife of the swamps', 'Community conservancy visit'],
    itinerary: [
      { day: 1, title: 'Nairobi to Amboseli', detail: 'Road transfer with the afternoon free, then an evening drive.' },
      { day: 2, title: 'Full park day', detail: 'Sunrise drive, midday rest, late-afternoon game drive.' },
      { day: 3, title: 'Swamps and community', detail: 'Morning among the elephants, afternoon conservancy visit.' },
      { day: 4, title: 'Return', detail: 'Early drive and transfer back to Nairobi.' },
    ],
    accommodation: 'A lodge or tented camp with a view toward the mountain.',
    transport: 'Road transfer from Nairobi and 4×4 game drives.',
    inclusions: ['Accommodation and full board', 'Park fees', 'Guide and vehicle'],
    exclusions: ['International flights', 'Drinks', 'Insurance', 'Gratuities'],
    important: 'Kilimanjaro is often hidden by cloud; clear views are never guaranteed.',
  },
  {
    slug: 'victoria-falls-chobe',
    title: 'Victoria Falls & Chobe',
    destination: 'Victoria Falls & Botswana',
    destinationSlug: 'victoria-falls',
    duration: '5 days / 4 nights',
    days: 5,
    imageKey: 'gorge',
    experiences: ['Adventure', 'Safari & Wildlife'],
    overview:
      'The falls on foot, the river from a boat, and a day across the border in Chobe where the elephant herds gather.',
    highlights: ['Guided falls walk', 'Zambezi sunset cruise', 'Chobe river game viewing', 'Free morning for optional adventure'],
    itinerary: [
      { day: 1, title: 'Arrive Victoria Falls', detail: 'Transfer, then a guided walk through the rainforest viewpoints.' },
      { day: 2, title: 'River day', detail: 'Morning at leisure, sunset cruise on the Zambezi.' },
      { day: 3, title: 'Chobe', detail: 'Cross into Botswana for a river cruise and game drive.' },
      { day: 4, title: 'Adventure or rest', detail: 'Optional rafting, helicopter flight or a quiet day.' },
      { day: 5, title: 'Departure', detail: 'Transfer to the airport.' },
    ],
    accommodation: 'A small hotel within walking distance of the falls.',
    transport: 'Transfers and a cross-border day vehicle for Chobe.',
    inclusions: ['Accommodation and breakfast', 'Falls walk', 'Sunset cruise', 'Chobe day trip'],
    exclusions: ['Visas', 'Optional activities', 'Insurance', 'Gratuities'],
    important: 'Cross-border trips require valid documents for both countries. Water levels affect which activities run.',
  },
  {
    slug: 'maasai-cultural-immersion',
    title: 'Maasai Cultural Immersion',
    destination: 'Maasai Mara',
    destinationSlug: 'maasai-mara',
    duration: '3 days / 2 nights',
    days: 3,
    imageKey: 'culture',
    experiences: ['Culture & Community'],
    overview:
      'A hosted stay with a Maasai family and community guides, with time in the conservancy rather than the reserve.',
    highlights: ['Hosted homestead visit', 'Guided walk with community rangers', 'Beadwork and craft', 'Conservancy game drives'],
    itinerary: [
      { day: 1, title: 'Into the conservancy', detail: 'Transfer in, welcome, and an evening walk with a community guide.' },
      { day: 2, title: 'A day hosted', detail: 'Morning with the family, afternoon game drive in the conservancy.' },
      { day: 3, title: 'Return', detail: 'Final morning, then transfer back to Nairobi.' },
    ],
    accommodation: 'A community-owned camp in the conservancy.',
    transport: 'Road transfer and conservancy vehicles.',
    inclusions: ['Accommodation and meals', 'Community hosting and guide fees', 'Conservancy fees'],
    exclusions: ['International flights', 'Crafts and purchases', 'Insurance', 'Gratuities'],
    important: 'Visits are arranged with host families and paid for directly. Photography is by permission only.',
  },
];

export const guides = [
  {
    slug: 'when-to-travel-great-migration',
    title: 'When to travel for the Great Migration',
    category: 'Seasonal planning',
    imageKey: 'seasons',
    date: '2026-08-14',
    readingTime: '6 min read',
    excerpt:
      'The herds move with the rain, not the calendar. Here is how the year usually unfolds across the Mara and Serengeti, and what to plan around.',
    content: [
      {
        heading: 'The movement follows the rain',
        body: 'The migration is a response to grass and water, which means its timing shifts from year to year. Any honest answer starts there: no month guarantees a river crossing. What can be planned is where the herds are most likely to be, and which camps offer the best access when they arrive.',
      },
      {
        heading: 'Early in the year: the southern plains',
        body: 'Calving usually takes place on the southern Serengeti plains in the early months, when short grass and minerals draw the herds together. Predator activity around the calving grounds is high, and the landscape is at its most open.',
      },
      {
        heading: 'The middle of the year: north and west',
        body: 'As the grass dries, the herds move west along the corridor and then north toward the Mara River. This is the period most associated with crossings — dramatic, unpredictable, and best viewed with a guide who has spent the season on that stretch of river.',
      },
      {
        heading: 'The other months',
        body: 'Outside the movement, the Mara and Serengeti remain excellent. Resident game stays, grass is shorter and easier to read, and camps are quieter and often better value. For a first safari focused on cats rather than crowds, the quieter months are worth serious consideration.',
      },
    ],
  },
  {
    slug: 'swahili-coast-guide',
    title: 'A first-timer’s guide to the Swahili coast',
    category: 'Destinations',
    imageKey: 'door',
    date: '2026-07-02',
    readingTime: '7 min read',
    excerpt:
      'Stone Town, spice farms, dhow sailing and reef water: how to shape a few days on the coast without rushing any of it.',
    content: [
      {
        heading: 'Start with the town',
        body: 'Stone Town rewards walking. The carved doors, the coral-rag walls and the market are best seen early, before the heat, with someone who lives there. Two nights is enough for the town and a spice farm; an afternoon is not.',
      },
      {
        heading: 'Then choose your coast',
        body: 'The north has the liveliest water and the easiest swimming. The east is quieter, with a bigger tidal range and a slower rhythm. Both are beautiful; they suit different travellers.',
      },
      {
        heading: 'Tides structure the day',
        body: 'On much of the coast the water retreats a long way, twice a day. Plan snorkelling and sailing around the tide tables rather than around a fixed schedule, and keep the middle of the day for shade.',
      },
      {
        heading: 'Travel with respect',
        body: 'Zanzibar is a conservative Muslim society. Away from the beach, cover shoulders and knees, ask before photographing people, and buy directly from makers where you can.',
      },
    ],
  },
  {
    slug: 'packing-for-a-family-safari',
    title: 'Packing for a family safari',
    category: 'Practical advice',
    imageKey: 'vehicle',
    date: '2026-06-18',
    readingTime: '5 min read',
    excerpt:
      'Light aircraft limits, cold mornings, dusty afternoons and long days in a vehicle: what actually earns its place in the bag.',
    content: [
      {
        heading: 'Soft bags, small weights',
        body: 'Bush flights usually cap luggage at 15kg per person in a soft bag. This is the constraint that decides everything else — pack for it at home, not at the airstrip.',
      },
      {
        heading: 'Layers beat coats',
        body: 'Mornings in an open vehicle can be genuinely cold, and by midday you will want short sleeves. Thin layers, a warm fleece and a light windproof shell cover almost every case.',
      },
      {
        heading: 'Neutral colours, and no bright white',
        body: 'Muted tones work better for wildlife and for dust. Avoid camouflage patterns, which are restricted in several countries, and bring a hat that stays on in wind.',
      },
      {
        heading: 'For children',
        body: 'Bring their own binoculars if possible, a refillable bottle each, and something to do during the middle of the day. A private vehicle makes the pace far easier to manage.',
      },
    ],
  },
];

// Every gallery record carries credit and licence metadata as Payload-ready structure. Interim
// imagery is owner-approved under DL-009; provenance stays internal and is never rendered.
const INTERIM = {
  credit: '',
  licence: 'Owner-approved interim imagery — replacement via Payload CMS (DL-009)',
  licenceStatus: 'owner-approved-interim',
};

export const gallery = [
  { id: 'g1', imageKey: 'migration', caption: 'Herds moving across the Mara–Serengeti ecosystem', category: 'Safari & Wildlife', destination: 'Maasai Mara', ...INTERIM },
  { id: 'g2', imageKey: 'zanzibar', caption: 'A dhow at rest on the shallows', category: 'Beach & Coast', destination: 'Zanzibar', ...INTERIM },
  { id: 'g3', imageKey: 'amboseli', caption: 'Elephant families on the Amboseli plains', category: 'Safari & Wildlife', destination: 'Amboseli', ...INTERIM },
  { id: 'g4', imageKey: 'serengeti', caption: 'First light over the Serengeti', category: 'Nature & Landscapes', destination: 'Serengeti', ...INTERIM },
  { id: 'g5', imageKey: 'falls', caption: 'Mist rising from the gorge', category: 'Adventure', destination: 'Victoria Falls', ...INTERIM },
  { id: 'g6', imageKey: 'capetown', caption: 'The mountain from the harbour', category: 'City & Food', destination: 'Cape Town', ...INTERIM },
  { id: 'g7', imageKey: 'culture', caption: 'Beadwork and cloth in a Maasai homestead', category: 'Culture & Community', destination: 'Maasai Mara', ...INTERIM },
  { id: 'g8', imageKey: 'gorge', caption: 'The Zambezi above the falls', category: 'Nature & Landscapes', destination: 'Victoria Falls', ...INTERIM },
  { id: 'g9', imageKey: 'mara', caption: 'Golden grass and acacia in the Mara', category: 'Nature & Landscapes', destination: 'Maasai Mara', ...INTERIM },
  { id: 'g10', imageKey: 'winelands', caption: 'Vine rows running toward the mountains', category: 'City & Food', destination: 'Cape Town', ...INTERIM },
  { id: 'g11', imageKey: 'escape', caption: 'Evening palms on the northern coast', category: 'Beach & Coast', destination: 'Zanzibar', ...INTERIM },
  { id: 'g12', imageKey: 'door', caption: 'A carved Swahili door, Stone Town', category: 'Culture & Community', destination: 'Zanzibar', ...INTERIM },
];

export const faqGroups = [
  {
    group: 'General enquiries',
    items: [
      { q: 'What does Tuzuru Africa do?', a: 'We plan and coordinate travel across East and Southern Africa — safaris, coastal stays, cultural visits and city time — and support you from first enquiry through to your return.' },
      { q: 'How do I start planning a trip?', a: 'Send an enquiry through the Plan Your Trip page with your dates, party and what you would like to see. A specialist will reply with questions and an outline of options.' },
      { q: 'Do you only work with the itineraries shown on the site?', a: 'No. The tours listed are starting points. Most travellers end up with a variation built around their dates, interests and pace.' },
    ],
  },
  {
    group: 'Tours and packages',
    items: [
      { q: 'Can tours be customised?', a: 'Yes. Dates, duration, accommodation level and pace can all be adjusted. Tell us what matters most and we will shape the itinerary around it.' },
      { q: 'Are group departures available?', a: 'Availability of shared departures depends on the season and the itinerary. Ask our team and we will confirm what is running for your dates.' },
      { q: 'How much walking or driving is involved?', a: 'It varies by trip. Safari days usually include two drives of a few hours each; trekking itineraries involve considerably more. Each tour page notes what to expect.' },
    ],
  },
  {
    group: 'Pricing and payments',
    items: [
      { q: 'Why are prices shown as “on request”?', a: 'Because accommodation, park fees and flights change with season and availability. We quote once we know your dates, party size and preferred level of accommodation, so the figure reflects the trip you are actually taking.' },
      { q: 'What is included in a quotation?', a: 'Every quotation lists what is included and excluded — typically accommodation, meals, guides, transfers and park fees in, and international flights, visas, insurance and gratuities out.' },
      { q: 'Which currencies do you quote in?', a: 'Quotations are normally issued in US dollars. Local currencies may be used for services on the ground. Confirm with your specialist when you enquire.' },
    ],
  },
  {
    group: 'Reservations and cancellations',
    items: [
      { q: 'Is my trip confirmed when I submit an enquiry?', a: 'No. An enquiry starts a conversation and is never a reservation. A trip is only confirmed once a written quotation has been accepted and the stated deposit terms have been met.' },
      { q: 'What are your cancellation terms?', a: 'Cancellation terms depend on the lodges and operators involved and are set out in the Booking and Cancellation Policy and in your quotation. Please read them before confirming.' },
      { q: 'Can I change my dates after confirming?', a: 'Amendments are often possible but depend on supplier terms. Tell us as early as possible and we will confirm what can be changed and at what cost.' },
    ],
  },
  {
    group: 'Travel practicalities',
    items: [
      { q: 'Do I need vaccinations or a visa?', a: 'Requirements depend on your nationality and route and can change. We will point you to the current official guidance, but confirmation should always come from the relevant embassy or a travel health professional.' },
      { q: 'Is a safari suitable for children?', a: 'Often, yes — with the right vehicle, pace and accommodation. Some camps set minimum ages, and long drives can be hard for young children. Tell us the ages and we will advise honestly.' },
      { q: 'How do I reach you while travelling?', a: 'You will be given contact details for the team handling your trip, including a WhatsApp number for use on the ground.' },
    ],
  },
];

export const whyTuzuru = [
  {
    icon: 'Map',
    title: 'Planning, not guesswork',
    body: 'A specialist works through dates, distances, seasons and pace with you before anything is booked. The itinerary is built to be travelled, not just read.',
  },
  {
    icon: 'Compass',
    title: 'Guides who know the ground',
    body: 'Trips are led by guides who have spent seasons in these landscapes and communities, and who can read a day as it unfolds.',
  },
  {
    icon: 'HeartHandshake',
    title: 'Hosted by people, not staged',
    body: 'Cultural visits are arranged with host families and community guides, on their terms and with a fair share of the value staying local.',
  },
  {
    icon: 'BedDouble',
    title: 'Stays chosen for place',
    body: 'Lodges and camps are selected for location, quiet and character rather than star ratings, and matched to how you actually like to travel.',
  },
  {
    icon: 'LifeBuoy',
    title: 'Support that answers',
    body: 'One team from enquiry to return, with a contact you can reach on WhatsApp if plans change on the ground.',
  },
];

export function findTour(slug) {
  return tours.find((t) => t.slug === slug);
}

export function findDestination(slug) {
  return destinations.find((d) => d.slug === slug);
}

export function findGuide(slug) {
  return guides.find((g) => g.slug === slug);
}

export function toursByDestination(slug) {
  return tours.filter((t) => t.destinationSlug === slug);
}

export function formatDate(value) {
  return new Date(value).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}