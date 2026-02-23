export const BUSINESS_TRAVEL_FACTORS = {
  "Passenger Car":                                  { co2: 0.306, ch4: 0.009,   n2o: 0.006,  unit: "vehicle-mile" },
  "Light-Duty Truck":                               { co2: 0.405, ch4: 0.011,   n2o: 0.010,  unit: "vehicle-mile" },
  "Motorcycle":                                     { co2: 0.376, ch4: 0.091,   n2o: 0.019,  unit: "vehicle-mile" },
  "Intercity Rail - Northeast Corridor":            { co2: 0.058, ch4: 0.0055,  n2o: 0.0007, unit: "passenger-mile" },
  "Intercity Rail - Other Routes":                  { co2: 0.150, ch4: 0.0117,  n2o: 0.0038, unit: "passenger-mile" },
  "Intercity Rail - National Average":              { co2: 0.113, ch4: 0.0092,  n2o: 0.0026, unit: "passenger-mile" },
  "Commuter Rail":                                  { co2: 0.133, ch4: 0.0105,  n2o: 0.0026, unit: "passenger-mile" },
  "Transit Rail (i.e. Subway, Tram)":              { co2: 0.093, ch4: 0.0075,  n2o: 0.0010, unit: "passenger-mile" },
  "Bus":                                            { co2: 0.071, ch4: 0.0050,  n2o: 0.0021, unit: "passenger-mile" },
  "Air Short Haul (< 300 miles)":                  { co2: 0.207, ch4: 0.0064,  n2o: 0.0066, unit: "passenger-mile" },
  "Air Medium Haul (>= 300 miles, < 2300 miles)":  { co2: 0.129, ch4: 0.0006,  n2o: 0.0041, unit: "passenger-mile" },
  "Air Long Haul (>= 2300 miles)":                 { co2: 0.163, ch4: 0.0006,  n2o: 0.0052, unit: "passenger-mile" }
};

export const COMMUTING_MODES = Object.keys(BUSINESS_TRAVEL_FACTORS).filter(m => !m.startsWith("Air"));

export const UPSTREAM_TRANSPORT_VEHICLE_MILE = {
  "Passenger Car": { co2: 0.306, ch4: 0.009, n2o: 0.006, unit: "vehicle-mile" },
  "Light-Duty Truck": { co2: 0.405, ch4: 0.011, n2o: 0.010, unit: "vehicle-mile" },
  "Medium- and Heavy-Duty Truck": { co2: 1.360, ch4: 0.012, n2o: 0.038, unit: "vehicle-mile" },
};

export const UPSTREAM_TRANSPORT_TON_MILE = {
  "Medium- and Heavy-Duty Truck": { co2: 0.168, ch4: 0.0015, n2o: 0.0047, unit: "short ton-mile" },
  "Rail": { co2: 0.022, ch4: 0.0017, n2o: 0.0005, unit: "short ton-mile" },
  "Waterborne Craft": { co2: 0.082, ch4: 0.0326, n2o: 0.0021, unit: "short ton-mile" },
  "Aircraft": { co2: 0.905, ch4: 0, n2o: 0.0279, unit: "short ton-mile" },
};

export const EGRID_SUBREGIONS = {
  "ASCC Alaska Grid": { co2: 1052.1, ch4: 0.088, n2o: 0.012 }, "ASCC Miscellaneous": { co2: 495.8, ch4: 0.023, n2o: 0.004 },
  "WECC Southwest": { co2: 776.0, ch4: 0.051, n2o: 0.007 }, "WECC California": { co2: 497.4, ch4: 0.030, n2o: 0.004 },
  "ERCOT All": { co2: 771.1, ch4: 0.049, n2o: 0.007 }, "FRCC All": { co2: 813.8, ch4: 0.048, n2o: 0.006 },
  "HICC Miscellaneous": { co2: 1155.5, ch4: 0.124, n2o: 0.019 }, "HICC Oahu": { co2: 1575.4, ch4: 0.183, n2o: 0.025 },
  "MRO East": { co2: 1642.8, ch4: 0.123, n2o: 0.019 }, "MRO West": { co2: 936.5, ch4: 0.102, n2o: 0.015 },
  "NPCC New England": { co2: 538.4, ch4: 0.063, n2o: 0.008 }, "WECC Northwest": { co2: 602.1, ch4: 0.056, n2o: 0.008 },
  "NPCC NYC/Westchester": { co2: 885.2, ch4: 0.023, n2o: 0.003 }, "NPCC Long Island": { co2: 1200.7, ch4: 0.135, n2o: 0.018 },
  "NPCC Upstate NY": { co2: 274.6, ch4: 0.015, n2o: 0.002 }, "Puerto Rico Miscellaneous": { co2: 1593.5, ch4: 0.087, n2o: 0.014 },
  "RFC East": { co2: 657.4, ch4: 0.045, n2o: 0.006 }, "RFC Michigan": { co2: 1216.4, ch4: 0.116, n2o: 0.016 },
  "RFC West": { co2: 1000.1, ch4: 0.087, n2o: 0.012 }, "WECC Rockies": { co2: 1124.9, ch4: 0.101, n2o: 0.014 },
  "SPP North": { co2: 952.6, ch4: 0.100, n2o: 0.014 }, "SPP South": { co2: 970.4, ch4: 0.072, n2o: 0.010 },
  "SERC Mississippi Valley": { co2: 801.0, ch4: 0.040, n2o: 0.006 }, "SERC Midwest": { co2: 1369.9, ch4: 0.151, n2o: 0.022 },
  "SERC South": { co2: 893.3, ch4: 0.064, n2o: 0.009 }, "SERC Tennessee Valley": { co2: 933.1, ch4: 0.082, n2o: 0.012 },
  "SERC Virginia/Carolina": { co2: 823.0, ch4: 0.047, n2o: 0.007 }, "US Average": { co2: 856.1, ch4: 0.066, n2o: 0.009 },
};

export const PURCHASED_GASES_GWP_FACTORS = {
  "Carbon Dioxide (CO2)": 1, "Methane (CH4)": 28, "Nitrous Oxide (N2O)": 265,
  "Sulphur hexafluoride (SF6)": 23500, "Nitrogen Trifluoride (NF3)": 16100,
  "CF4 (PFC)": 6630, "C2F6 (PFC)": 11100, "C3F8 (PFC)": 8900, "C4F10 (PFC)": 9200,
  "C5F12 (PFC)": 8550, "C6F14 (PFC)": 7910, "HFC-23": 12400, "HFC-32": 677,
  "HFC-41": 116, "HFC-125": 3170, "HFC-134": 1120, "HFC-134a": 1300, "HFC-143": 328,
  "HFC-143a": 4800, "HFC-152a": 138, "HFC-227ea": 3350, "HFC-236fa": 8060,
  "HFC-245fa": 858, "HFC-365mfc": 804, "HFC-43-10mee": 1650,
};

export const STATIONARY_COMBUSTION_FACTORS = {
  "Natural Gas": { co2PerMmBtu: 53.06 }, "Distillate Fuel Oil No. 2": { co2PerMmBtu: 73.96 },
  "Residual Fuel Oil No. 6": { co2PerMmBtu: 75.10 }, "Kerosene": { co2PerMmBtu: 75.20 },
  "Liquefied Petroleum Gases (LPG)": { co2PerMmBtu: 61.71 }, "Anthracite Coal": { co2PerMmBtu: 103.69 },
  "Bituminous Coal": { co2PerMmBtu: 93.28 }, "Sub-bituminous Coal": { co2PerMmBtu: 97.17 },
  "Lignite Coal": { co2PerMmBtu: 97.72 }, "Mixed (Commercial Sector)": { co2PerMmBtu: 94.27 },
  "Mixed (Electric Power Sector)": { co2PerMmBtu: 95.52 }, "Mixed (Industrial Coking)": { co2PerMmBtu: 93.9 },
  "Mixed (Industrial Sector)": { co2PerMmBtu: 94.67 }, "Coal Coke": { co2PerMmBtu: 113.67 },
  "Municipal Solid Waste": { co2PerMmBtu: 90.7 }, "Petroleum Coke (Solid)": { co2PerMmBtu: 102.41 },
  "Plastics": { co2PerMmBtu: 75 }, "Tires": { co2PerMmBtu: 85.97 },
  "Agricultural Byproducts": { co2PerMmBtu: 118.17 }, "Peat": { co2PerMmBtu: 111.84 },
  "Solid Byproducts": { co2PerMmBtu: 105.51 }, "Wood and Wood Residuals": { co2PerMmBtu: 0 },
  "Propane Gas": { co2PerMmBtu: 61.46 }, "Landfill Gas": { co2PerMmBtu: 0 },
  "Biodiesel (100%)": { co2PerMmBtu: 73.84 }, "Ethanol (100%)": { co2PerMmBtu: 68.44 },
  "Rendered Animal Fat": { co2PerMmBtu: 71.06 }, "Vegetable Oil": { co2PerMmBtu: 81.55 },
};

export const EMISSION_FACTORS = {
  "Natural Gas": { factor: 0.00205, unit: "therms" },
  "Diesel": { factor: 0.00268, unit: "liters" },
  "Propane": { factor: 0.00159, unit: "liters" },
  "Fuel Oil": { factor: 0.00275, unit: "liters" },
  "Coal": { factor: 0.00247, unit: "kg" },
  "Fleet Vehicles - Gasoline": { factor: 0.00023, unit: "km" },
  "Fleet Vehicles - Diesel": { factor: 0.00027, unit: "km" },
  "Company Aircraft": { factor: 0.00025, unit: "km" },
  "Company Vessels": { factor: 0.00015, unit: "nautical miles" },
  "Refrigerants": { factor: 1.43, unit: "kg" },
  "Air Conditioning Units": { factor: 1.81, unit: "kg" },
  "Fire Suppressants": { factor: 7.14, unit: "kg" },
  "Grid Electricity": { factor: 0.000417, unit: "kWh" },
  "Renewable Electricity": { factor: 0.00002, unit: "kWh" },
  "Steam": { factor: 0.00022, unit: "kg" },
};

export const WASTE_EMISSION_FACTORS = {
  "Grains":                               { recycled: null,  landfilled: 2.06,  combusted: 0.05, composted: 0.11, anaerobically_digested: 0.14 },
  "Bread":                                { recycled: null,  landfilled: 1.49,  combusted: 0.05, composted: 0.11, anaerobically_digested: 0.14 },
  "Fruits and Vegetables":                { recycled: null,  landfilled: 1.05,  combusted: 0.05, composted: 0.11, anaerobically_digested: 0.14 },
  "Dairy Products":                       { recycled: null,  landfilled: 0.72,  combusted: 0.05, composted: 0.11, anaerobically_digested: 0.11 },
  "Yard Trimmings":                       { recycled: null,  landfilled: 0.36,  combusted: 0.05, composted: 0.14, anaerobically_digested: null  },
  "Grass":                                { recycled: null,  landfilled: 0.28,  combusted: 0.05, composted: 0.14, anaerobically_digested: 0.09  },
  "Leaves":                               { recycled: null,  landfilled: 0.28,  combusted: 0.05, composted: 0.14, anaerobically_digested: 0.12  },
  "Branches":                             { recycled: null,  landfilled: 0.58,  combusted: 0.05, composted: 0.14, anaerobically_digested: 0.15  },
  "Mixed Paper (general)":                { recycled: 0.07,  landfilled: 0.89,  combusted: 0.05, composted: null, anaerobically_digested: null  },
  "Mixed Paper (primarily residential)":  { recycled: 0.07,  landfilled: 0.86,  combusted: 0.05, composted: null, anaerobically_digested: null  },
  "Mixed Paper (primarily from offices)": { recycled: 0.03,  landfilled: 0.84,  combusted: 0.05, composted: null, anaerobically_digested: null  },
  "Mixed Metals":                         { recycled: 0.23,  landfilled: 0.02,  combusted: 0.01, composted: null, anaerobically_digested: null  },
  "Mixed Plastics":                       { recycled: 0.22,  landfilled: 0.02,  combusted: 2.34, composted: null, anaerobically_digested: null  },
  "Mixed Recyclables":                    { recycled: 0.09,  landfilled: 0.75,  combusted: 0.05, composted: null, anaerobically_digested: null  },
  "Food Waste":                           { recycled: null,  landfilled: 0.68,  combusted: 0.05, composted: 0.11, anaerobically_digested: 0.13  },
  "Mixed Organics":                       { recycled: null,  landfilled: 0.50,  combusted: 0.05, composted: 0.13, anaerobically_digested: null  },
  "Mixed MSW (municipal solid waste)":    { recycled: null,  landfilled: 0.58,  combusted: 0.43, composted: null, anaerobically_digested: null  },
  "Carpet":                               { recycled: null,  landfilled: 0.02,  combusted: 1.68, composted: null, anaerobically_digested: null  },
  "Desktop CPUs":                         { recycled: 0.01,  landfilled: 0.02,  combusted: 0.40, composted: null, anaerobically_digested: null  },
  "Portable Electronic Devices":          { recycled: 0.01,  landfilled: 0.02,  combusted: 0.89, composted: null, anaerobically_digested: null  },
  "Flat-panel Displays":                  { recycled: 0.02,  landfilled: 0.02,  combusted: 0.74, composted: null, anaerobically_digested: null  },
  "CRT Displays":                         { recycled: 0.02,  landfilled: 0.02,  combusted: 0.64, composted: null, anaerobically_digested: null  },
  "Electronic Peripherals":               { recycled: 0.05,  landfilled: 0.02,  combusted: 1.23, composted: null, anaerobically_digested: null  },
  "Hard-copy Devices":                    { recycled: 0.01,  landfilled: 0.02,  combusted: 1.92, composted: null, anaerobically_digested: null  },
  "Mixed Electronics":                    { recycled: 0.02,  landfilled: 0.02,  combusted: 0.96, composted: null, anaerobically_digested: null  },
  "Clay Bricks":                          { recycled: 0.02,  landfilled: 0.02,  combusted: null, composted: null, anaerobically_digested: null  },
  "Concrete":                             { recycled: 0.01,  landfilled: 0.02,  combusted: null, composted: null, anaerobically_digested: null  },
  "Fly Ash":                              { recycled: null,  landfilled: null,   combusted: null, composted: null, anaerobically_digested: null  },
  "Tires":                                { recycled: 0.10,  landfilled: 0.02,  combusted: 2.21, composted: null, anaerobically_digested: null  },
  "Asphalt Concrete":                     { recycled: 0.004, landfilled: 0.02,  combusted: null, composted: null, anaerobically_digested: null  },
  "Asphalt Shingles":                     { recycled: 0.03,  landfilled: 0.02,  combusted: 0.70, composted: null, anaerobically_digested: null  },
  "Drywall":                              { recycled: 0.05,  landfilled: 0.02,  combusted: null, composted: null, anaerobically_digested: null  },
  "Fiberglass Insulation":                { recycled: 0.05,  landfilled: 0.02,  combusted: null, composted: null, anaerobically_digested: null  },
  "Structural Steel":                     { recycled: 0.04,  landfilled: 0.02,  combusted: null, composted: null, anaerobically_digested: null  },
  "Vinyl Flooring":                       { recycled: null,  landfilled: 0.02,  combusted: 0.29, composted: null, anaerobically_digested: null  },
  "Wood Flooring":                        { recycled: null,  landfilled: 0.18,  combusted: null, composted: null, anaerobically_digested: 0.08  },
};

export const WASTE_DISPOSAL_LABELS = {
  recycled:               "Recycled",
  landfilled:             "Landfilled",
  combusted:              "Combusted (Waste-to-Energy)",
  composted:              "Composted",
  anaerobically_digested: "Anaerobically Digested",
};

export const REPORTING_PERIODS = ["2024", "2025", "2026", "2027", "2028"];

export const EMPTY_FORM = {
  company_name: "", scope: "", scope_2_method: "", category: "",
  upstream_mode: "", travel_mode: "", travel_miles: "", commute_distance: "",
  num_employees: "", offsets_tonnes: "", offsets_ghg_scope: "",
  waste_material: "", waste_disposal: "", waste_weight: "", waste_unit: "short_tons",
  source: "", amount: "", reporting_period: "", notes: "",
  vehicle_type: "", fuel_usage: "", fuel_units: "", miles_travelled: "",
  fuel_combusted: "", fuel_state: "", combustion_units: "", quantity_combusted: "",
  refrigeration_method: "", gas_type: "", inventory_change: "", transfer_amount: "", capacity_change: "",
  fire_suppression_method: "", fire_suppression_gas: "", fire_inventory_change: "", fire_transfer_amount: "", fire_capacity_change: "",
  purchased_gas_type: "", purchased_gas_amount: "",
  egrid_subregion: "", electricity_kwh: "", custom_emission_factor: "",
  steam_source_area: "", steam_fuel_type: "", steam_boiler_efficiency: "", steam_purchased: "",
  steam_market_co2_factor: "", steam_market_ch4_factor: "", steam_market_n2o_factor: "",
  steam_location_co2_factor: "", steam_location_ch4_factor: "", steam_location_n2o_factor: "",
};