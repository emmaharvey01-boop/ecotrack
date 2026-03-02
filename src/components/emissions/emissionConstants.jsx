// Source: EPA Emission Factors for GHG Inventories, January 15, 2025 (Table 10)
export const BUSINESS_TRAVEL_FACTORS = {
  "Passenger Car":                                  { co2: 0.297, ch4: 0.0059,  n2o: 0.0053, unit: "vehicle-mile" },
  "Light-Duty Truck":                               { co2: 0.394, ch4: 0.0109,  n2o: 0.0088, unit: "vehicle-mile" },
  "Motorcycle":                                     { co2: 0.368, ch4: 0.0888,  n2o: 0.0188, unit: "vehicle-mile" },
  "Intercity Rail - Northeast Corridor":            { co2: 0.023, ch4: 0.0010,  n2o: 0.0001, unit: "passenger-mile" },
  "Intercity Rail - Other Routes":                  { co2: 0.149, ch4: 0.0120,  n2o: 0.0040, unit: "passenger-mile" },
  "Intercity Rail - National Average":              { co2: 0.096, ch4: 0.0080,  n2o: 0.0020, unit: "passenger-mile" },
  "Commuter Rail":                                  { co2: 0.133, ch4: 0.0105,  n2o: 0.0026, unit: "passenger-mile" },
  "Transit Rail (i.e. Subway, Tram)":              { co2: 0.093, ch4: 0.0075,  n2o: 0.0010, unit: "passenger-mile" },
  "Bus":                                            { co2: 0.066, ch4: 0.0046,  n2o: 0.0019, unit: "passenger-mile" },
  "Air Short Haul (< 300 miles)":                  { co2: 0.207, ch4: 0.0064,  n2o: 0.0066, unit: "passenger-mile" },
  "Air Medium Haul (>= 300 miles, < 2300 miles)":  { co2: 0.129, ch4: 0.0006,  n2o: 0.0041, unit: "passenger-mile" },
  "Air Long Haul (>= 2300 miles)":                 { co2: 0.163, ch4: 0.0006,  n2o: 0.0052, unit: "passenger-mile" }
};

export const COMMUTING_MODES = Object.keys(BUSINESS_TRAVEL_FACTORS).filter(m => !m.startsWith("Air"));

// Source: EPA Emission Factors for GHG Inventories, January 15, 2025 (Table 8)
export const UPSTREAM_TRANSPORT_VEHICLE_MILE = {
  "Passenger Car": { co2: 0.297, ch4: 0.0059, n2o: 0.0053, unit: "vehicle-mile" },
  "Light-Duty Truck": { co2: 0.394, ch4: 0.0109, n2o: 0.0088, unit: "vehicle-mile" },
  "Medium- and Heavy-Duty Truck": { co2: 1.298, ch4: 0.0115, n2o: 0.0376, unit: "vehicle-mile" },
};

export const UPSTREAM_TRANSPORT_TON_MILE = {
  "Medium- and Heavy-Duty Truck": { co2: 0.186, ch4: 0.0016, n2o: 0.0054, unit: "short ton-mile" },
  "Rail": { co2: 0.021, ch4: 0.0016, n2o: 0.0005, unit: "short ton-mile" },
  "Waterborne Craft": { co2: 0.077, ch4: 0.0310, n2o: 0.0020, unit: "short ton-mile" },
  "Aircraft": { co2: 1.086, ch4: 0, n2o: 0.0334, unit: "short ton-mile" },
};

// Source: EPA eGRID2023, January 2025 (Table 6) - Total Output Emission Factors (lb per MWh)
export const EGRID_SUBREGIONS = {
  "ASCC Alaska Grid":         { co2: 899.0,   ch4: 0.086, n2o: 0.012 },
  "ASCC Miscellaneous":       { co2: 519.4,   ch4: 0.026, n2o: 0.004 },
  "WECC Southwest":           { co2: 740.8,   ch4: 0.041, n2o: 0.006 },
  "WECC California":          { co2: 436.7,   ch4: 0.025, n2o: 0.003 },
  "ERCOT All":                { co2: 738.0,   ch4: 0.043, n2o: 0.006 },
  "FRCC All":                 { co2: 801.9,   ch4: 0.042, n2o: 0.005 },
  "HICC Miscellaneous":       { co2: 1122.1,  ch4: 0.146, n2o: 0.022 },
  "HICC Oahu":                { co2: 1489.4,  ch4: 0.134, n2o: 0.021 },
  "MRO East":                 { co2: 1402.0,  ch4: 0.116, n2o: 0.017 },
  "MRO West":                 { co2: 920.0,   ch4: 0.097, n2o: 0.014 },
  "NPCC New England":         { co2: 537.2,   ch4: 0.063, n2o: 0.008 },
  "WECC Northwest":           { co2: 631.7,   ch4: 0.054, n2o: 0.008 },
  "NPCC NYC/Westchester":     { co2: 974.7,   ch4: 0.025, n2o: 0.003 },
  "NPCC Long Island":         { co2: 1180.7,  ch4: 0.140, n2o: 0.018 },
  "NPCC Upstate NY":          { co2: 241.0,   ch4: 0.011, n2o: 0.001 },
  "Puerto Rico Miscellaneous":{ co2: 1543.0,  ch4: 0.077, n2o: 0.012 },
  "RFC East":                 { co2: 594.7,   ch4: 0.036, n2o: 0.005 },
  "RFC Michigan":             { co2: 962.1,   ch4: 0.082, n2o: 0.011 },
  "RFC West":                 { co2: 911.3,   ch4: 0.071, n2o: 0.010 },
  "WECC Rockies":             { co2: 1036.0,  ch4: 0.090, n2o: 0.013 },
  "SPP North":                { co2: 861.9,   ch4: 0.087, n2o: 0.012 },
  "SPP South":                { co2: 891.1,   ch4: 0.055, n2o: 0.008 },
  "SERC Mississippi Valley":  { co2: 739.4,   ch4: 0.032, n2o: 0.004 },
  "SERC Midwest":             { co2: 1238.3,  ch4: 0.132, n2o: 0.019 },
  "SERC South":               { co2: 840.9,   ch4: 0.055, n2o: 0.008 },
  "SERC Tennessee Valley":    { co2: 895.7,   ch4: 0.079, n2o: 0.011 },
  "SERC Virginia/Carolina":   { co2: 590.2,   ch4: 0.045, n2o: 0.006 },
  "US Average":               { co2: 771.5,   ch4: 0.057, n2o: 0.008 },
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

// Source: EPA Emission Factors for GHG Inventories, January 15, 2025 (Table 1)
export const STATIONARY_COMBUSTION_FACTORS = {
  // Coal and Coke (kg CO2 per mmBtu, HHV)
  "Natural Gas":                    { co2PerMmBtu: 53.06,  ch4PerMmBtu: 1.0,  n2oPerMmBtu: 0.10  },
  "Anthracite Coal":                { co2PerMmBtu: 103.69, ch4PerMmBtu: 11,   n2oPerMmBtu: 1.6   },
  "Bituminous Coal":                { co2PerMmBtu: 93.28,  ch4PerMmBtu: 11,   n2oPerMmBtu: 1.6   },
  "Sub-bituminous Coal":            { co2PerMmBtu: 97.17,  ch4PerMmBtu: 11,   n2oPerMmBtu: 1.6   },
  "Lignite Coal":                   { co2PerMmBtu: 97.72,  ch4PerMmBtu: 11,   n2oPerMmBtu: 1.6   },
  "Mixed (Commercial Sector)":      { co2PerMmBtu: 94.27,  ch4PerMmBtu: 11,   n2oPerMmBtu: 1.6   },
  "Mixed (Electric Power Sector)":  { co2PerMmBtu: 95.52,  ch4PerMmBtu: 11,   n2oPerMmBtu: 1.6   },
  "Mixed (Industrial Coking)":      { co2PerMmBtu: 93.90,  ch4PerMmBtu: 11,   n2oPerMmBtu: 1.6   },
  "Mixed (Industrial Sector)":      { co2PerMmBtu: 94.67,  ch4PerMmBtu: 11,   n2oPerMmBtu: 1.6   },
  "Coal Coke":                      { co2PerMmBtu: 113.67, ch4PerMmBtu: 11,   n2oPerMmBtu: 1.6   },
  // Other Fuels - Solid
  "Municipal Solid Waste":          { co2PerMmBtu: 90.70,  ch4PerMmBtu: 32,   n2oPerMmBtu: 4.2   },
  "Petroleum Coke (Solid)":         { co2PerMmBtu: 102.41, ch4PerMmBtu: 32,   n2oPerMmBtu: 4.2   },
  "Plastics":                       { co2PerMmBtu: 75.00,  ch4PerMmBtu: 32,   n2oPerMmBtu: 4.2   },
  "Tires":                          { co2PerMmBtu: 85.97,  ch4PerMmBtu: 32,   n2oPerMmBtu: 4.2   },
  // Biomass - Solid
  "Agricultural Byproducts":        { co2PerMmBtu: 118.17, ch4PerMmBtu: 32,   n2oPerMmBtu: 4.2   },
  "Peat":                           { co2PerMmBtu: 111.84, ch4PerMmBtu: 32,   n2oPerMmBtu: 4.2   },
  "Solid Byproducts":               { co2PerMmBtu: 105.51, ch4PerMmBtu: 32,   n2oPerMmBtu: 4.2   },
  "Wood and Wood Residuals":        { co2PerMmBtu: 93.80,  ch4PerMmBtu: 7.2,  n2oPerMmBtu: 3.6   },
  // Gaseous
  "Blast Furnace Gas":              { co2PerMmBtu: 274.32, ch4PerMmBtu: 0.022,n2oPerMmBtu: 0.10  },
  "Coke Oven Gas":                  { co2PerMmBtu: 46.85,  ch4PerMmBtu: 0.48, n2oPerMmBtu: 0.10  },
  "Fuel Gas":                       { co2PerMmBtu: 59.00,  ch4PerMmBtu: 3.0,  n2oPerMmBtu: 0.60  },
  "Propane Gas":                    { co2PerMmBtu: 61.46,  ch4PerMmBtu: 3.0,  n2oPerMmBtu: 0.60  },
  "Landfill Gas":                   { co2PerMmBtu: 52.07,  ch4PerMmBtu: 3.2,  n2oPerMmBtu: 0.63  },
  "Other Biomass Gases":            { co2PerMmBtu: 52.07,  ch4PerMmBtu: 3.2,  n2oPerMmBtu: 0.63  },
  // Petroleum Products (kg CO2 per mmBtu)
  "Distillate Fuel Oil No. 1":      { co2PerMmBtu: 73.25,  ch4PerMmBtu: 3.0,  n2oPerMmBtu: 0.60  },
  "Distillate Fuel Oil No. 2":      { co2PerMmBtu: 73.96,  ch4PerMmBtu: 3.0,  n2oPerMmBtu: 0.60  },
  "Distillate Fuel Oil No. 4":      { co2PerMmBtu: 75.04,  ch4PerMmBtu: 3.0,  n2oPerMmBtu: 0.60  },
  "Residual Fuel Oil No. 5":        { co2PerMmBtu: 72.93,  ch4PerMmBtu: 3.0,  n2oPerMmBtu: 0.60  },
  "Residual Fuel Oil No. 6":        { co2PerMmBtu: 75.10,  ch4PerMmBtu: 3.0,  n2oPerMmBtu: 0.60  },
  "Kerosene":                       { co2PerMmBtu: 75.20,  ch4PerMmBtu: 3.0,  n2oPerMmBtu: 0.60  },
  "Kerosene-Type Jet Fuel":         { co2PerMmBtu: 72.22,  ch4PerMmBtu: 3.0,  n2oPerMmBtu: 0.60  },
  "Liquefied Petroleum Gases (LPG)":{ co2PerMmBtu: 61.71,  ch4PerMmBtu: 3.0,  n2oPerMmBtu: 0.60  },
  "Motor Gasoline":                 { co2PerMmBtu: 70.22,  ch4PerMmBtu: 3.0,  n2oPerMmBtu: 0.60  },
  "Aviation Gasoline":              { co2PerMmBtu: 69.25,  ch4PerMmBtu: 3.0,  n2oPerMmBtu: 0.60  },
  "Propane":                        { co2PerMmBtu: 62.87,  ch4PerMmBtu: 3.0,  n2oPerMmBtu: 0.60  },
  "Crude Oil":                      { co2PerMmBtu: 74.54,  ch4PerMmBtu: 3.0,  n2oPerMmBtu: 0.60  },
  "Lubricants":                     { co2PerMmBtu: 74.27,  ch4PerMmBtu: 3.0,  n2oPerMmBtu: 0.60  },
  // Biomass - Liquid
  "Biodiesel (100%)":               { co2PerMmBtu: 73.84,  ch4PerMmBtu: 1.1,  n2oPerMmBtu: 0.11  },
  "Ethanol (100%)":                 { co2PerMmBtu: 68.44,  ch4PerMmBtu: 1.1,  n2oPerMmBtu: 0.11  },
  "Rendered Animal Fat":            { co2PerMmBtu: 71.06,  ch4PerMmBtu: 1.1,  n2oPerMmBtu: 0.11  },
  "Vegetable Oil":                  { co2PerMmBtu: 81.55,  ch4PerMmBtu: 1.1,  n2oPerMmBtu: 0.11  },
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
  market_co2_factor: "", market_ch4_factor: "", market_n2o_factor: "",
  steam_source_area: "", steam_fuel_type: "", steam_boiler_efficiency: "", steam_purchased: "",
  steam_market_co2_factor: "", steam_market_ch4_factor: "", steam_market_n2o_factor: "",
  steam_location_co2_factor: "", steam_location_ch4_factor: "", steam_location_n2o_factor: "",
};