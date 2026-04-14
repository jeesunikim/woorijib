// Curated data for common home issues by region
// Top 50 metro areas with their common housing stock issues

export interface RegionalIssue {
  issue: string;
  description: string;
  prevalence: "very_common" | "common" | "occasional";
  typicalCost: string;
  yearsBuiltAffected?: string;
}

export interface RegionalData {
  region: string;
  housingContext: string;
  medianHomeAge: number;
  commonIssues: RegionalIssue[];
}

// Zip code prefix to region mapping (first 3 digits)
const zipPrefixToRegion: Record<string, string> = {
  // San Francisco Bay Area
  "940": "san_francisco",
  "941": "san_francisco",
  "942": "sacramento",
  "943": "san_jose",
  "944": "san_jose",
  "945": "oakland",
  "946": "oakland",
  "947": "oakland",
  "948": "richmond_ca",
  "949": "san_rafael",
  
  // Los Angeles
  "900": "los_angeles",
  "901": "los_angeles",
  "902": "los_angeles",
  "903": "los_angeles",
  "904": "los_angeles",
  "905": "los_angeles",
  "906": "los_angeles",
  "907": "los_angeles",
  "908": "los_angeles",
  "910": "pasadena",
  "911": "pasadena",
  "912": "glendale",
  "913": "san_fernando",
  "914": "san_fernando",
  "915": "san_fernando",
  "916": "san_fernando",
  "917": "industry_ca",
  "918": "industry_ca",
  
  // New York
  "100": "manhattan",
  "101": "manhattan",
  "102": "manhattan",
  "103": "staten_island",
  "104": "bronx",
  "110": "queens",
  "111": "long_island",
  "112": "brooklyn",
  "113": "brooklyn",
  "114": "brooklyn",
  "115": "western_nassau",
  "116": "long_island",
  "117": "long_island",
  "118": "long_island",
  "119": "long_island",
  
  // Chicago
  "606": "chicago",
  "607": "chicago",
  "608": "chicago",
  "609": "kankakee",
  "600": "north_suburbs_chi",
  "601": "north_suburbs_chi",
  
  // Boston
  "021": "boston",
  "022": "boston",
  "023": "brockton",
  "024": "boston_nw",
  "017": "framingham",
  "018": "lowell",
  "019": "lynn",
  
  // Seattle
  "980": "seattle",
  "981": "seattle",
  "982": "everett",
  "983": "tacoma",
  "984": "tacoma",
  
  // Denver
  "800": "denver",
  "801": "denver",
  "802": "denver",
  "803": "boulder",
  "804": "denver_east",
  "805": "longmont",
  
  // Austin
  "787": "austin",
  "786": "austin",
  "785": "san_marcos",
  
  // Miami
  "331": "miami",
  "332": "miami",
  "333": "fort_lauderdale",
  "334": "west_palm",
  
  // Phoenix
  "850": "phoenix",
  "851": "phoenix",
  "852": "phoenix",
  "853": "phoenix",
  
  // Portland
  "972": "portland",
  "973": "salem",
  "970": "portland",
  "971": "portland",
  
  // Minneapolis
  "554": "minneapolis",
  "553": "minneapolis",
  "555": "minneapolis",
  
  // Detroit
  "481": "detroit",
  "482": "detroit",
  "483": "royal_oak",
  "484": "flint",
  
  // Atlanta
  "303": "atlanta",
  "304": "atlanta",
  "300": "atlanta_north",
  "301": "atlanta_north",
  "302": "atlanta",
  
  // Philadelphia
  "190": "philadelphia",
  "191": "philadelphia",
  "192": "west_chester",
  "193": "west_chester",
  "194": "norristown",
  
  // DC Metro
  "200": "dc",
  "201": "dc",
  "202": "dc",
  "203": "dc",
  "204": "dc",
  "205": "dc",
  "220": "arlington",
  "221": "arlington",
  "222": "arlington",
  "223": "alexandria",
  
  // Houston
  "770": "houston",
  "772": "houston",
  "773": "houston",
  "774": "houston",
  "775": "houston",
};

const regionalData: Record<string, RegionalData> = {
  san_francisco: {
    region: "San Francisco Bay Area",
    housingContext: "Many Victorian and Edwardian homes (1880s-1920s), plus mid-century construction. High seismic zone with specific retrofit requirements.",
    medianHomeAge: 1942,
    commonIssues: [
      {
        issue: "Knob and Tube Wiring",
        description: "Original electrical wiring from pre-1940s homes that lacks grounding and poses fire risk when insulated over.",
        prevalence: "very_common",
        typicalCost: "$8,000 - $20,000",
        yearsBuiltAffected: "Pre-1945",
      },
      {
        issue: "Galvanized Steel Pipes",
        description: "Original plumbing that corrodes from the inside, reducing water pressure and eventually leaking.",
        prevalence: "very_common",
        typicalCost: "$5,000 - $15,000",
        yearsBuiltAffected: "Pre-1960",
      },
      {
        issue: "Unreinforced Masonry Foundation",
        description: "Brick or stone foundations that lack the reinforcement needed to withstand earthquakes.",
        prevalence: "common",
        typicalCost: "$15,000 - $40,000",
        yearsBuiltAffected: "Pre-1950",
      },
      {
        issue: "Seismic Soft Story",
        description: "Multi-unit buildings with weak ground floors (garages, large openings) that can collapse in earthquakes.",
        prevalence: "common",
        typicalCost: "$60,000 - $200,000",
        yearsBuiltAffected: "Pre-1978",
      },
      {
        issue: "Lead Paint",
        description: "Interior and exterior paint containing lead, particularly in homes built before 1978.",
        prevalence: "very_common",
        typicalCost: "$3,000 - $10,000 per room",
        yearsBuiltAffected: "Pre-1978",
      },
      {
        issue: "Single-Pane Windows",
        description: "Original wood-frame windows that are drafty and inefficient but may be protected by historic preservation rules.",
        prevalence: "very_common",
        typicalCost: "$500 - $1,500 per window",
        yearsBuiltAffected: "Pre-1970",
      },
    ],
  },
  
  oakland: {
    region: "Oakland / East Bay",
    housingContext: "Mix of Craftsman bungalows, mid-century homes, and post-war construction. Similar seismic concerns to SF.",
    medianHomeAge: 1950,
    commonIssues: [
      {
        issue: "Cripple Wall Bracing",
        description: "Unbraced short walls between foundation and floor that can fail in earthquakes.",
        prevalence: "very_common",
        typicalCost: "$3,000 - $7,000",
        yearsBuiltAffected: "Pre-1960",
      },
      {
        issue: "Galvanized Steel Pipes",
        description: "Corroding water supply lines that reduce pressure and cause rusty water.",
        prevalence: "very_common",
        typicalCost: "$5,000 - $15,000",
        yearsBuiltAffected: "Pre-1960",
      },
      {
        issue: "Cast Iron Drain Lines",
        description: "Original sewer pipes that rust and crack, often discovered during kitchen/bath remodels.",
        prevalence: "common",
        typicalCost: "$4,000 - $12,000",
        yearsBuiltAffected: "Pre-1975",
      },
      {
        issue: "Asbestos Siding",
        description: "Cement-asbestos shingle siding common in mid-century homes, requires special handling if disturbed.",
        prevalence: "common",
        typicalCost: "$8,000 - $15,000 to remove",
        yearsBuiltAffected: "1940-1970",
      },
      {
        issue: "Knob and Tube Wiring",
        description: "Older ungrounded electrical system that may be partially active even if panel was upgraded.",
        prevalence: "common",
        typicalCost: "$8,000 - $20,000",
        yearsBuiltAffected: "Pre-1945",
      },
    ],
  },
  
  chicago: {
    region: "Chicago Metro",
    housingContext: "Classic Chicago bungalows, greystones, and two-flats. Extreme temperature swings stress building materials.",
    medianHomeAge: 1945,
    commonIssues: [
      {
        issue: "Terra Cotta Block Foundation",
        description: "Hollow clay tile foundations that crack and deteriorate, allowing water infiltration.",
        prevalence: "very_common",
        typicalCost: "$10,000 - $30,000",
        yearsBuiltAffected: "1900-1940",
      },
      {
        issue: "Brick Tuckpointing",
        description: "Deteriorating mortar joints in masonry exteriors that allow water penetration and freeze damage.",
        prevalence: "very_common",
        typicalCost: "$5,000 - $20,000",
        yearsBuiltAffected: "Pre-1970",
      },
      {
        issue: "Lead Service Lines",
        description: "Water supply pipes from street to home often contain lead, requiring city coordination to replace.",
        prevalence: "very_common",
        typicalCost: "$3,000 - $8,000 (homeowner portion)",
        yearsBuiltAffected: "Pre-1986",
      },
      {
        issue: "Balloon Frame Construction",
        description: "Wall framing with continuous studs that allow fire to spread rapidly between floors.",
        prevalence: "common",
        typicalCost: "$2,000 - $5,000 to add fire blocking",
        yearsBuiltAffected: "Pre-1940",
      },
      {
        issue: "Flat Roof Membrane",
        description: "Built-up or EPDM roofing that requires regular maintenance and replacement every 15-25 years.",
        prevalence: "very_common",
        typicalCost: "$8,000 - $15,000",
        yearsBuiltAffected: "All ages",
      },
      {
        issue: "Radiator Heating System",
        description: "Aging boilers and radiators that need maintenance, with asbestos-wrapped pipes common in older systems.",
        prevalence: "common",
        typicalCost: "$6,000 - $15,000 (boiler replacement)",
        yearsBuiltAffected: "Pre-1960",
      },
    ],
  },

  boston: {
    region: "Greater Boston",
    housingContext: "Historic colonial homes to triple-deckers. Harsh winters stress roofing and masonry.",
    medianHomeAge: 1955,
    commonIssues: [
      {
        issue: "Ice Dams",
        description: "Poor attic insulation and ventilation causes ice buildup at roof edges, leading to interior leaks.",
        prevalence: "very_common",
        typicalCost: "$3,000 - $10,000 (insulation fix)",
        yearsBuiltAffected: "Pre-1990",
      },
      {
        issue: "Stone Foundation",
        description: "Fieldstone or brick foundations that lack waterproofing and allow significant moisture entry.",
        prevalence: "very_common",
        typicalCost: "$10,000 - $40,000",
        yearsBuiltAffected: "Pre-1920",
      },
      {
        issue: "Lead Paint",
        description: "Massachusetts has strict lead laws, and most pre-1978 homes have lead paint that must be addressed before sale.",
        prevalence: "very_common",
        typicalCost: "$5,000 - $15,000",
        yearsBuiltAffected: "Pre-1978",
      },
      {
        issue: "Buried Oil Tank",
        description: "Many homes converted from oil heat still have abandoned underground tanks that can leak.",
        prevalence: "common",
        typicalCost: "$2,000 - $10,000+ (if contamination)",
        yearsBuiltAffected: "Pre-1985",
      },
      {
        issue: "Aluminum Wiring",
        description: "1960s-70s homes may have aluminum branch wiring that poses fire risk at connections.",
        prevalence: "occasional",
        typicalCost: "$3,000 - $10,000 (pigtailing)",
        yearsBuiltAffected: "1965-1975",
      },
    ],
  },

  seattle: {
    region: "Seattle Metro",
    housingContext: "Craftsman homes, mid-century ranches, and newer construction. Wet climate drives moisture issues.",
    medianHomeAge: 1968,
    commonIssues: [
      {
        issue: "Moisture in Crawl Space",
        description: "High water table and rain cause standing water and mold in crawl spaces without vapor barriers.",
        prevalence: "very_common",
        typicalCost: "$3,000 - $12,000",
        yearsBuiltAffected: "All ages",
      },
      {
        issue: "Oil Tank Decommissioning",
        description: "Former oil-heated homes often have buried tanks that need professional removal and soil testing.",
        prevalence: "common",
        typicalCost: "$2,500 - $15,000",
        yearsBuiltAffected: "Pre-1980",
      },
      {
        issue: "Unreinforced Masonry (URM)",
        description: "Brick chimneys and foundations that pose collapse risk in the seismic zone.",
        prevalence: "common",
        typicalCost: "$5,000 - $20,000",
        yearsBuiltAffected: "Pre-1975",
      },
      {
        issue: "Cedar Shake Roof",
        description: "Original wood roofing that has exceeded lifespan, with moss and rot common in damp climate.",
        prevalence: "common",
        typicalCost: "$15,000 - $30,000",
        yearsBuiltAffected: "Pre-1990",
      },
      {
        issue: "Polybutylene Pipes",
        description: "Plastic supply pipes installed 1978-1995 known to fail suddenly, often excluded from insurance.",
        prevalence: "occasional",
        typicalCost: "$4,000 - $15,000",
        yearsBuiltAffected: "1978-1995",
      },
    ],
  },

  denver: {
    region: "Denver Metro",
    housingContext: "Mix of Victorian-era homes, post-war ranches, and newer construction. High altitude UV exposure and expansive soils.",
    medianHomeAge: 1975,
    commonIssues: [
      {
        issue: "Expansive Soil Foundation Cracks",
        description: "Bentonite clay soils expand and contract dramatically, causing foundation movement and cracking.",
        prevalence: "very_common",
        typicalCost: "$5,000 - $30,000",
        yearsBuiltAffected: "All ages",
      },
      {
        issue: "Hail Damage to Roof",
        description: "Frequent hailstorms damage asphalt shingles, requiring replacement every 10-15 years in many areas.",
        prevalence: "very_common",
        typicalCost: "$8,000 - $20,000",
        yearsBuiltAffected: "All ages",
      },
      {
        issue: "Evaporator Cooler Issues",
        description: "Swamp coolers common in older homes need annual maintenance and roof penetration can leak.",
        prevalence: "common",
        typicalCost: "$500 - $3,000",
        yearsBuiltAffected: "Pre-1990",
      },
      {
        issue: "Radon",
        description: "Colorado has high radon levels; most homes need testing and many require mitigation systems.",
        prevalence: "very_common",
        typicalCost: "$800 - $2,500",
        yearsBuiltAffected: "All ages",
      },
      {
        issue: "Wood Rot at South/West Exposures",
        description: "Intense UV and dry/wet cycles cause accelerated deterioration on sun-facing trim and siding.",
        prevalence: "common",
        typicalCost: "$2,000 - $10,000",
        yearsBuiltAffected: "All ages",
      },
    ],
  },

  austin: {
    region: "Austin Metro",
    housingContext: "Rapid growth area with homes from all eras. Limestone geology and extreme heat create unique challenges.",
    medianHomeAge: 1995,
    commonIssues: [
      {
        issue: "Foundation Movement on Limestone",
        description: "Homes on shallow limestone or expansive clay experience significant foundation shifting.",
        prevalence: "very_common",
        typicalCost: "$5,000 - $25,000",
        yearsBuiltAffected: "All ages",
      },
      {
        issue: "HVAC Undersizing",
        description: "Many homes have A/C systems that can't keep up with extreme summer heat, especially after efficiency improvements.",
        prevalence: "common",
        typicalCost: "$6,000 - $15,000",
        yearsBuiltAffected: "Pre-2010",
      },
      {
        issue: "Polybutylene Pipes",
        description: "Plastic supply pipes that fail suddenly, common in homes from the 80s and early 90s.",
        prevalence: "common",
        typicalCost: "$4,000 - $12,000",
        yearsBuiltAffected: "1978-1995",
      },
      {
        issue: "Cedar Fence Rot",
        description: "Extreme heat and termites rapidly deteriorate cedar fencing, needing replacement every 8-12 years.",
        prevalence: "very_common",
        typicalCost: "$3,000 - $8,000",
        yearsBuiltAffected: "All ages",
      },
      {
        issue: "Attic Radiant Barrier",
        description: "Many older homes lack radiant barriers, causing excessive cooling costs and HVAC strain.",
        prevalence: "common",
        typicalCost: "$1,500 - $3,000",
        yearsBuiltAffected: "Pre-2005",
      },
    ],
  },

  miami: {
    region: "Miami / South Florida",
    housingContext: "Concrete block construction, hurricane zone requirements, and high humidity challenges.",
    medianHomeAge: 1982,
    commonIssues: [
      {
        issue: "Hurricane Impact Windows",
        description: "Many older homes lack impact-rated windows, affecting insurance rates and storm protection.",
        prevalence: "very_common",
        typicalCost: "$15,000 - $40,000",
        yearsBuiltAffected: "Pre-2002",
      },
      {
        issue: "Roof Tie-Down Straps",
        description: "Homes built before modern hurricane codes often lack proper roof-to-wall connections.",
        prevalence: "very_common",
        typicalCost: "$1,500 - $5,000",
        yearsBuiltAffected: "Pre-1994",
      },
      {
        issue: "Chinese Drywall",
        description: "Corrosive drywall from 2001-2009 that damages wiring and HVAC, particularly in homes built during boom.",
        prevalence: "occasional",
        typicalCost: "$100,000+",
        yearsBuiltAffected: "2001-2009",
      },
      {
        issue: "Stucco Moisture Intrusion",
        description: "Improper stucco installation allows water behind walls, causing hidden mold and rot.",
        prevalence: "common",
        typicalCost: "$10,000 - $50,000",
        yearsBuiltAffected: "1990-2010",
      },
      {
        issue: "A/C System Mold",
        description: "High humidity causes mold growth in ductwork and air handlers if not properly maintained.",
        prevalence: "very_common",
        typicalCost: "$2,000 - $8,000",
        yearsBuiltAffected: "All ages",
      },
    ],
  },

  phoenix: {
    region: "Phoenix Metro",
    housingContext: "Desert climate with extreme heat. Mostly newer construction but with unique material challenges.",
    medianHomeAge: 1990,
    commonIssues: [
      {
        issue: "Roof Tile Underlayment",
        description: "Felt underlayment under concrete tiles fails in extreme heat, causing leaks even with intact tiles.",
        prevalence: "very_common",
        typicalCost: "$8,000 - $20,000",
        yearsBuiltAffected: "Pre-2010",
      },
      {
        issue: "Polybutylene Pipes",
        description: "Plastic supply lines that fail from chlorine exposure in desert water, often suddenly flooding homes.",
        prevalence: "common",
        typicalCost: "$4,000 - $15,000",
        yearsBuiltAffected: "1978-1995",
      },
      {
        issue: "Dual Pane Seal Failure",
        description: "Extreme temperature cycles cause window seal failures, resulting in foggy glass and reduced efficiency.",
        prevalence: "very_common",
        typicalCost: "$200 - $500 per window",
        yearsBuiltAffected: "10+ years old",
      },
      {
        issue: "Stucco Cracks",
        description: "Thermal expansion causes cracking in stucco exteriors, allowing water intrusion during monsoons.",
        prevalence: "very_common",
        typicalCost: "$2,000 - $8,000",
        yearsBuiltAffected: "All ages",
      },
      {
        issue: "Evaporator Coil Deterioration",
        description: "A/C coils fail faster in desert conditions due to dust and extreme cycling.",
        prevalence: "common",
        typicalCost: "$1,500 - $4,000",
        yearsBuiltAffected: "All ages",
      },
    ],
  },

  manhattan: {
    region: "New York City",
    housingContext: "Pre-war co-ops, brownstones, and modern high-rises. Building-specific issues vary widely.",
    medianHomeAge: 1950,
    commonIssues: [
      {
        issue: "Window Air Conditioner Loads",
        description: "Older electrical systems not designed for modern A/C loads, causing circuit overloads.",
        prevalence: "very_common",
        typicalCost: "$2,000 - $8,000",
        yearsBuiltAffected: "Pre-1970",
      },
      {
        issue: "Lead Paint in Pre-War Units",
        description: "NYC Local Law 1 requires landlords to address lead paint; buyers should test before purchase.",
        prevalence: "very_common",
        typicalCost: "$3,000 - $15,000",
        yearsBuiltAffected: "Pre-1960",
      },
      {
        issue: "Cast Iron Stack Pipes",
        description: "Building drain stacks that corrode and fail, often a shared responsibility with building.",
        prevalence: "common",
        typicalCost: "$5,000 - $20,000",
        yearsBuiltAffected: "Pre-1975",
      },
      {
        issue: "Plaster Walls Deterioration",
        description: "Original plaster separating from lath, causing cracks and eventual collapse.",
        prevalence: "common",
        typicalCost: "$3,000 - $10,000 per room",
        yearsBuiltAffected: "Pre-1945",
      },
      {
        issue: "Steam Radiator Issues",
        description: "Pre-war steam heating systems require specialized maintenance and can be noisy or uneven.",
        prevalence: "very_common",
        typicalCost: "$500 - $3,000 per unit",
        yearsBuiltAffected: "Pre-1950",
      },
    ],
  },

  portland: {
    region: "Portland Metro",
    housingContext: "Craftsman bungalows, mid-century homes, and newer construction. Wet climate similar to Seattle.",
    medianHomeAge: 1968,
    commonIssues: [
      {
        issue: "Moss and Debris on Roof",
        description: "Constant moisture promotes moss growth that damages shingles and holds water against roofing.",
        prevalence: "very_common",
        typicalCost: "$300 - $800 annually",
        yearsBuiltAffected: "All ages",
      },
      {
        issue: "Basement Moisture",
        description: "High water table and rain cause seepage in older basements without modern waterproofing.",
        prevalence: "very_common",
        typicalCost: "$5,000 - $20,000",
        yearsBuiltAffected: "Pre-1980",
      },
      {
        issue: "Original Wood Windows",
        description: "Single-pane wood windows that are drafty and require ongoing maintenance to prevent rot.",
        prevalence: "very_common",
        typicalCost: "$400 - $1,200 per window (restoration)",
        yearsBuiltAffected: "Pre-1970",
      },
      {
        issue: "Oil Tank Decommissioning",
        description: "Buried oil tanks from former heating systems need removal and potential soil remediation.",
        prevalence: "common",
        typicalCost: "$2,500 - $15,000",
        yearsBuiltAffected: "Pre-1985",
      },
      {
        issue: "Seismic Retrofitting",
        description: "Portland is in a seismic zone; older homes often lack foundation bolting and cripple wall bracing.",
        prevalence: "common",
        typicalCost: "$3,000 - $10,000",
        yearsBuiltAffected: "Pre-1970",
      },
    ],
  },

  minneapolis: {
    region: "Minneapolis / St. Paul",
    housingContext: "Classic bungalows, Victorians, and mid-century homes. Extreme cold requires robust building systems.",
    medianHomeAge: 1955,
    commonIssues: [
      {
        issue: "Ice Dam Formation",
        description: "Inadequate attic insulation and ventilation cause ice dams that damage roofs and interiors.",
        prevalence: "very_common",
        typicalCost: "$3,000 - $10,000 (prevention)",
        yearsBuiltAffected: "Pre-1980",
      },
      {
        issue: "Foundation Heaving",
        description: "Frost penetration can lift foundations not set below frost line (4-5 feet in Minnesota).",
        prevalence: "common",
        typicalCost: "$5,000 - $25,000",
        yearsBuiltAffected: "Pre-1950",
      },
      {
        issue: "Outdated Boiler Systems",
        description: "Many homes still use original steam or hot water boilers that are inefficient and need replacement.",
        prevalence: "common",
        typicalCost: "$8,000 - $20,000",
        yearsBuiltAffected: "Pre-1970",
      },
      {
        issue: "Asbestos Insulation",
        description: "Vermiculite attic insulation (often containing asbestos) and pipe wrap common in older homes.",
        prevalence: "common",
        typicalCost: "$5,000 - $15,000",
        yearsBuiltAffected: "1940-1990",
      },
      {
        issue: "Stucco Moisture Problems",
        description: "EIFS (synthetic stucco) traps moisture, causing hidden rot in walls.",
        prevalence: "occasional",
        typicalCost: "$20,000 - $60,000",
        yearsBuiltAffected: "1985-2005",
      },
    ],
  },

  atlanta: {
    region: "Atlanta Metro",
    housingContext: "Mix of historic homes and rapid suburban development. Humid climate and clay soils.",
    medianHomeAge: 1988,
    commonIssues: [
      {
        issue: "EIFS (Synthetic Stucco) Failure",
        description: "Improperly installed exterior insulation finish systems trap moisture and rot framing.",
        prevalence: "common",
        typicalCost: "$30,000 - $100,000",
        yearsBuiltAffected: "1985-2005",
      },
      {
        issue: "Termite Damage",
        description: "High termite pressure in Georgia requires ongoing treatment and inspection.",
        prevalence: "very_common",
        typicalCost: "$500 - $5,000+ depending on damage",
        yearsBuiltAffected: "All ages",
      },
      {
        issue: "Red Clay Foundation Issues",
        description: "Expansive clay soils cause foundation settling and cracking.",
        prevalence: "common",
        typicalCost: "$5,000 - $20,000",
        yearsBuiltAffected: "All ages",
      },
      {
        issue: "Crawl Space Moisture",
        description: "High humidity causes mold and wood rot in ventilated crawl spaces.",
        prevalence: "very_common",
        typicalCost: "$5,000 - $15,000 (encapsulation)",
        yearsBuiltAffected: "All ages",
      },
      {
        issue: "Polybutylene Pipes",
        description: "Gray plastic pipes that fail suddenly, very common in 1980s-90s Atlanta construction.",
        prevalence: "common",
        typicalCost: "$4,000 - $12,000",
        yearsBuiltAffected: "1978-1995",
      },
    ],
  },

  philadelphia: {
    region: "Philadelphia Metro",
    housingContext: "Historic rowhomes, Victorian twins, and suburban ranches. Four-season climate stresses materials.",
    medianHomeAge: 1955,
    commonIssues: [
      {
        issue: "Rowhome Shared Walls",
        description: "Party wall conditions and neighboring issues can affect your property, requiring coordinated repairs.",
        prevalence: "very_common",
        typicalCost: "Varies widely",
        yearsBuiltAffected: "All ages",
      },
      {
        issue: "Brick Pointing Deterioration",
        description: "Masonry joints weather over time, allowing water penetration and freeze damage.",
        prevalence: "very_common",
        typicalCost: "$5,000 - $20,000",
        yearsBuiltAffected: "Pre-1980",
      },
      {
        issue: "Flat Roof Drainage",
        description: "Many rowhomes have flat or low-slope roofs that require proper drainage and regular maintenance.",
        prevalence: "very_common",
        typicalCost: "$5,000 - $15,000",
        yearsBuiltAffected: "All ages",
      },
      {
        issue: "Knob and Tube Wiring",
        description: "Original electrical systems in pre-war homes that pose fire risks and insurance issues.",
        prevalence: "common",
        typicalCost: "$8,000 - $20,000",
        yearsBuiltAffected: "Pre-1945",
      },
      {
        issue: "Lead Service Lines",
        description: "Many older homes have lead water pipes from street to home, requiring testing and possible replacement.",
        prevalence: "common",
        typicalCost: "$3,000 - $8,000",
        yearsBuiltAffected: "Pre-1950",
      },
    ],
  },

  dc: {
    region: "Washington DC Metro",
    housingContext: "Historic rowhouses, mid-century colonials, and modern construction. Humid summers and freeze-thaw winters.",
    medianHomeAge: 1960,
    commonIssues: [
      {
        issue: "Rowhome Foundation Issues",
        description: "Many DC rowhomes have rubble or brick foundations that allow water infiltration.",
        prevalence: "very_common",
        typicalCost: "$10,000 - $40,000",
        yearsBuiltAffected: "Pre-1940",
      },
      {
        issue: "Brick Repointing",
        description: "Historic masonry requires periodic repointing; using wrong mortar type damages brick.",
        prevalence: "very_common",
        typicalCost: "$5,000 - $25,000",
        yearsBuiltAffected: "Pre-1960",
      },
      {
        issue: "Lead Paint Compliance",
        description: "DC has strict lead disclosure and remediation requirements for pre-1978 properties.",
        prevalence: "very_common",
        typicalCost: "$3,000 - $15,000",
        yearsBuiltAffected: "Pre-1978",
      },
      {
        issue: "Aging HVAC in Historic Homes",
        description: "Retrofitting modern HVAC into historic homes often compromises efficiency or appearance.",
        prevalence: "common",
        typicalCost: "$10,000 - $30,000",
        yearsBuiltAffected: "Pre-1960",
      },
      {
        issue: "Tree Root Sewer Intrusion",
        description: "Mature trees in older neighborhoods penetrate clay sewer pipes, causing backups.",
        prevalence: "common",
        typicalCost: "$3,000 - $15,000",
        yearsBuiltAffected: "Pre-1970",
      },
    ],
  },

  houston: {
    region: "Houston Metro",
    housingContext: "Newer construction dominant, but with unique challenges from flooding, humidity, and expansive soils.",
    medianHomeAge: 1990,
    commonIssues: [
      {
        issue: "Foundation on Expansive Clay",
        description: "Houston's gumbo clay causes dramatic foundation movement; watering foundations is common practice.",
        prevalence: "very_common",
        typicalCost: "$5,000 - $30,000",
        yearsBuiltAffected: "All ages",
      },
      {
        issue: "Flood Zone Concerns",
        description: "Many homes in or near flood zones require elevation certificates and flood insurance.",
        prevalence: "very_common",
        typicalCost: "Insurance: $1,000 - $10,000/year",
        yearsBuiltAffected: "All ages",
      },
      {
        issue: "Hurricane Strap Requirements",
        description: "Homes built before modern codes often lack proper roof-to-wall connections.",
        prevalence: "common",
        typicalCost: "$1,500 - $5,000",
        yearsBuiltAffected: "Pre-2000",
      },
      {
        issue: "Mold from Humidity",
        description: "High humidity and A/C cycling create conditions for mold growth in walls and attics.",
        prevalence: "very_common",
        typicalCost: "$2,000 - $10,000",
        yearsBuiltAffected: "All ages",
      },
      {
        issue: "Cast Iron Drain Line Failure",
        description: "Original cast iron sewer pipes under slab corrode and fail, requiring tunneling or rerouting.",
        prevalence: "common",
        typicalCost: "$8,000 - $25,000",
        yearsBuiltAffected: "Pre-1985",
      },
    ],
  },

  detroit: {
    region: "Detroit Metro",
    housingContext: "Early 20th century housing stock with classic Detroit architecture. Cold winters and economic history affect maintenance levels.",
    medianHomeAge: 1950,
    commonIssues: [
      {
        issue: "Deferred Maintenance",
        description: "Many homes have decades of deferred maintenance; thorough inspection is critical.",
        prevalence: "very_common",
        typicalCost: "Varies widely",
        yearsBuiltAffected: "All ages",
      },
      {
        issue: "Galvanized Plumbing",
        description: "Original steel water pipes corroded internally, causing low pressure and rusty water.",
        prevalence: "very_common",
        typicalCost: "$5,000 - $15,000",
        yearsBuiltAffected: "Pre-1960",
      },
      {
        issue: "Basement Water Infiltration",
        description: "Block and poured foundations allow water entry; sump pumps are essential.",
        prevalence: "very_common",
        typicalCost: "$3,000 - $15,000",
        yearsBuiltAffected: "Pre-1980",
      },
      {
        issue: "Boiler Systems",
        description: "Steam and hot water heating systems need specialized maintenance and eventual replacement.",
        prevalence: "common",
        typicalCost: "$6,000 - $15,000",
        yearsBuiltAffected: "Pre-1960",
      },
      {
        issue: "Roof Condition",
        description: "Harsh winters accelerate roof wear; many homes need roof replacement on purchase.",
        prevalence: "very_common",
        typicalCost: "$8,000 - $15,000",
        yearsBuiltAffected: "All ages",
      },
    ],
  },
};

// Fallback for unknown regions
const defaultRegionalData: RegionalData = {
  region: "Your Area",
  housingContext: "Local housing stock varies. Common issues depend on the age and style of homes in your specific neighborhood.",
  medianHomeAge: 1980,
  commonIssues: [
    {
      issue: "Roof Condition",
      description: "Asphalt shingle roofs typically last 20-30 years and are the most common repair need in any region.",
      prevalence: "common",
      typicalCost: "$8,000 - $20,000",
    },
    {
      issue: "HVAC System Age",
      description: "Heating and cooling systems typically last 15-20 years and may need replacement or major repair.",
      prevalence: "common",
      typicalCost: "$6,000 - $15,000",
    },
    {
      issue: "Water Heater",
      description: "Tank water heaters last 10-15 years; inspection should note age and condition.",
      prevalence: "common",
      typicalCost: "$1,000 - $3,000",
    },
    {
      issue: "Plumbing Condition",
      description: "Pipe materials and age affect longevity; polybutylene, galvanized, and cast iron may need replacement.",
      prevalence: "common",
      typicalCost: "$4,000 - $15,000",
    },
    {
      issue: "Electrical Panel",
      description: "Homes with federal Pacific, Zinsco, or undersized panels may need upgrades for safety and insurance.",
      prevalence: "occasional",
      typicalCost: "$2,000 - $5,000",
    },
  ],
};

export function getRegionFromZip(zipCode: string): string | null {
  const prefix = zipCode.substring(0, 3);
  return zipPrefixToRegion[prefix] || null;
}

export function getRegionalData(zipCode: string): RegionalData {
  const regionKey = getRegionFromZip(zipCode);
  if (regionKey && regionalData[regionKey]) {
    return regionalData[regionKey];
  }
  return defaultRegionalData;
}

export function isKnownRegion(zipCode: string): boolean {
  return getRegionFromZip(zipCode) !== null;
}
