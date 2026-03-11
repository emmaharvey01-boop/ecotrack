import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Info } from "lucide-react";
import { StationaryCombustionFields, MobileCombustionFields, RefrigerationFields, FireSuppressionFields, STATIONARY_COMBUSTION_FUELS, REFRIGERANT_GWP_FACTORS, FIRE_SUPPRESSION_GWP_FACTORS } from "./CombustionFields";
import OffsetsFields from "./OffsetsFields";
import WasteFields from "./scope3/WasteFields";
import UpstreamTransportFields from "./scope3/UpstreamTransportFields";
import BusinessTravelFields from "./scope3/BusinessTravelFields";
import PurchasedElectricityFields from "./scope2/PurchasedElectricityFields";
import PurchasedSteamFields from "./scope2/PurchasedSteamFields";
import PurchasedHeatingCoolingFields from "./scope2/PurchasedHeatingCoolingFields";
import PurchasedGasesFields from "./scope1/PurchasedGasesFields";
import {
  BUSINESS_TRAVEL_FACTORS, UPSTREAM_TRANSPORT_VEHICLE_MILE, UPSTREAM_TRANSPORT_TON_MILE,
  EGRID_SUBREGIONS, PURCHASED_GASES_GWP_FACTORS, STATIONARY_COMBUSTION_FACTORS,
  EMISSION_FACTORS, WASTE_EMISSION_FACTORS, WASTE_DISPOSAL_LABELS, REPORTING_PERIODS, EMPTY_FORM,
} from "./emissionConstants";

const SCOPE_1_CATEGORIES = [
  { value: "stationary_combustion", label: "Stationary Combustion", sources: STATIONARY_COMBUSTION_FUELS.map(f => f.name), guidance: "Report emissions from fuel combustion in stationary equipment (boilers, furnaces, heaters). Enter the type and quantity of fuel consumed. Include all stationary sources owned or controlled by your organization." },
  { value: "mobile_sources", label: "Mobile Sources", sources: ["Mobile Sources"], guidance: "Report emissions from company-owned or controlled vehicles (cars, trucks, equipment). Enter fuel consumption or vehicle miles traveled. Include all mobile combustion sources like fleet vehicles and off-road equipment." },
  { value: "refrigeration_ac", label: "Refrigeration and A/C Equipment Use", sources: [], guidance: "Report fugitive emissions from refrigeration and air conditioning systems. Use the material balance approach: calculate net change in refrigerant inventory, amount transferred to/from equipment, and capacity changes. Multiply by the refrigerant's GWP factor." },
  { value: "fire_suppression", label: "Fire Suppression", sources: [], guidance: "Report fugitive emissions from fire suppression systems containing HFCs, PFCs, or other GHGs. Use material balance approach: net inventory change + transfers + capacity changes, multiplied by the gas-specific GWP factor." },
  { value: "purchased_gases", label: "Purchased Gases", sources: [], guidance: "Report emissions from purchased industrial gases (CO₂, N₂O, SF₆, etc.) that are released during use. Enter the quantity purchased/consumed and select the appropriate gas type with its GWP factor." },
];
const SCOPE_2_CATEGORIES = [
  { value: "purchased_electricity", label: "Purchased Electricity", sources: [], guidance: "Report emissions from purchased electricity consumption. Enter kWh consumed and select your eGRID subregion for location-based method. Optionally provide supplier-specific emission factors (CO₂, CH₄, N₂O in lb/MWh) for market-based method. Both methods will be calculated." },
  { value: "purchased_steam", label: "Purchased Steam", sources: [], guidance: "Report emissions from purchased steam. Enter mmBtu of steam purchased, boiler efficiency %, and fuel type used by supplier. Optionally provide supplier-specific factors (CO₂ in kg/mmBtu, CH₄ and N₂O in g/mmBtu) for market-based calculation." },
  { value: "purchased_heating", label: "Purchased Heating", sources: [], guidance: "Report emissions from purchased heating (district heat). Enter mmBtu purchased, boiler efficiency %, and fuel type. Optionally provide supplier-specific emission factors (CO₂, CH₄, N₂O) for market-based method." },
  { value: "purchased_cooling", label: "Purchased Cooling", sources: [], guidance: "Report emissions from purchased cooling (district cooling/chilled water). Enter mmBtu purchased, chiller efficiency %, and fuel type used by supplier. Optionally provide supplier-specific factors for market-based calculation." },
];
const SCOPE_3_CATEGORIES = [
  { value: "business_travel", label: "Business Travel", sources: [], guidance: "Report emissions from employee business travel in vehicles not owned/controlled by your organization. Enter travel mode (air, rail, car) and distance traveled. Include air travel, rental cars, taxis, and employee-owned vehicles used for business." },
  { value: "commuting", label: "Employee Commuting", sources: [], guidance: "Report emissions from employee commuting between home and work. Enter commute mode (car, bus, rail, etc.) and total miles traveled. Calculate based on number of employees, average commute distance, and frequency." },
  { value: "upstream_transport", label: "Upstream Transport and Distribution", sources: [], guidance: "Report emissions from transportation and distribution of purchased goods. Select vehicle-mile or ton-mile method, choose transport mode, and enter distance. Include inbound logistics and third-party distribution services." },
  { value: "waste", label: "Waste", sources: [], guidance: "Report emissions from disposal and treatment of waste generated in operations. Select waste material type (paper, food, plastics, etc.), disposal method (landfill, incineration, composting, recycling), and enter quantity in short tons, lbs, kg, or metric tons." },
];
const OFFSETS_CATEGORIES = [{ value: "offsets", label: "Carbon Offsets", sources: [], guidance: "Report carbon offsets purchased to compensate for emissions. Enter tonnes of CO₂e offset and optionally specify which GHG scope the offset applies to. Offsets will be shown as negative emissions in your inventory." }];

export default function EmissionForm({ open, onClose, onSubmit, editingRecord, isSubmitting }) {
  const [formData, setFormData] = useState({ ...EMPTY_FORM });

  useEffect(() => {
    if (editingRecord && open) {
      const catMap = {
        "Stationary Combustion": "stationary_combustion", "Mobile Sources": "mobile_sources",
        "Refrigeration and A/C Equipment Use": "refrigeration_ac", "Fire Suppression": "fire_suppression",
        "Purchased Gases": "purchased_gases", "Purchased Electricity": "purchased_electricity",
      };
      setFormData({
        ...EMPTY_FORM,
        company_name: editingRecord.company_name || "",
        scope: editingRecord.scope || "",
        scope_2_method: editingRecord.scope_2_method || "",
        category: catMap[editingRecord.category] || "",
        source: editingRecord.source || "",
        amount: editingRecord.amount?.toString() || "",
        reporting_period: editingRecord.reporting_period || "",
        notes: editingRecord.notes || "",
        vehicle_type: editingRecord.source_area || "",
        fuel_usage: editingRecord.quantity_combusted?.toString() || "",
        fuel_units: editingRecord.combustion_units || "",
        fuel_combusted: editingRecord.fuel_combusted || "",
        fuel_state: editingRecord.fuel_state || "",
        combustion_units: editingRecord.combustion_units || "",
        quantity_combusted: editingRecord.quantity_combusted?.toString() || "",
      });
    } else if (!open) {
      setFormData({ ...EMPTY_FORM });
    }
  }, [editingRecord, open]);

  const categories = formData.scope === "scope_1" ? SCOPE_1_CATEGORIES
    : formData.scope === "scope_2" ? SCOPE_2_CATEGORIES
    : formData.scope === "scope_3" ? SCOPE_3_CATEGORIES
    : formData.scope === "offsets" ? OFFSETS_CATEGORIES : [];

  const selectedCategory = categories.find(c => c.value === formData.category);
  const sources = selectedCategory?.sources || [];
  const emissionFactor = EMISSION_FACTORS[formData.source];
  const cat = formData.category;
  const isMobileCombustion = cat === "mobile_sources";
  const isStationaryCombustion = cat === "stationary_combustion";
  const isRefrigeration = cat === "refrigeration_ac";
  const isFireSuppression = cat === "fire_suppression";
  const isPurchasedGases = cat === "purchased_gases";
  const isPurchasedElectricity = cat === "purchased_electricity";
  const isPurchasedSteam = cat === "purchased_steam";
  const isPurchasedHeating = cat === "purchased_heating";
  const isPurchasedCooling = cat === "purchased_cooling";
  const isBusinessTravel = cat === "business_travel";
  const isCommuting = cat === "commuting";
  const isUpstreamTransport = cat === "upstream_transport";
  const isOffsets = cat === "offsets";
  const isWaste = cat === "waste";
  const hasDetailedFields = isMobileCombustion || isStationaryCombustion || isRefrigeration || isFireSuppression
    || isPurchasedGases || isPurchasedElectricity || isPurchasedSteam || isPurchasedHeating || isPurchasedCooling
    || isBusinessTravel || isCommuting || isUpstreamTransport || isWaste || isOffsets;

  const calcEmissions = () => {
    if (isWaste) {
      if (!formData.waste_material || !formData.waste_disposal || !formData.waste_weight) return null;
      const factors = WASTE_EMISSION_FACTORS[formData.waste_material];
      const factor = factors?.[formData.waste_disposal];
      if (factor == null) return null;
      let w = parseFloat(formData.waste_weight) || 0;
      if (formData.waste_unit === "lbs") w /= 2000;
      else if (formData.waste_unit === "kg") w /= 907.185;
      else if (formData.waste_unit === "metric_tons") w *= 1.10231;
      return (w * factor).toFixed(4);
    }
    if (isUpstreamTransport) {
      if (!formData.upstream_mode || !formData.travel_mode || !formData.travel_miles) return null;
      const t = formData.upstream_mode === "vehicle_mile" ? UPSTREAM_TRANSPORT_VEHICLE_MILE : UPSTREAM_TRANSPORT_TON_MILE;
      const f = t[formData.travel_mode]; if (!f) return null;
      return ((parseFloat(formData.travel_miles) || 0) * (f.co2 + (f.ch4/1000)*28 + (f.n2o/1000)*265) / 1000).toFixed(4);
    }
    if (isBusinessTravel || isCommuting) {
      if (!formData.travel_mode || !formData.travel_miles) return null;
      const f = BUSINESS_TRAVEL_FACTORS[formData.travel_mode]; if (!f) return null;
      return ((parseFloat(formData.travel_miles)||0) * (f.co2 + (f.ch4/1000)*28 + (f.n2o/1000)*265) / 1000).toFixed(4);
    }
    if (isMobileCombustion) {
      if (!formData.fuel_usage || !formData.fuel_units) return null;
      // Table 2: Motor Gasoline = 8.78 kg CO2/gal, CNG = 0.05444 kg CO2/scf (EPA Jan 2025)
      const ef = { gallons: 8.78, scf: 0.05444 };
      return ((parseFloat(formData.fuel_usage) * (ef[formData.fuel_units] || 0)) / 1000).toFixed(4);
    }
    if (isStationaryCombustion) {
      if (!formData.fuel_combusted || !formData.quantity_combusted || !formData.combustion_units) return null;
      const q = parseFloat(formData.quantity_combusted);
      const fuel = STATIONARY_COMBUSTION_FACTORS[formData.fuel_combusted]; if (!fuel) return null;
      let mmBtu = 0;
      if (formData.combustion_units === "mmBtu") mmBtu = q;
      else if (formData.combustion_units === "therm") mmBtu = q * 0.1;
      else if (formData.combustion_units === "SCF") mmBtu = q / (formData.fuel_combusted === "Propane Gas" ? 11000 : 1000);
      else if (formData.combustion_units === "short ton") mmBtu = q * 25;
      else if (formData.combustion_units === "gallon") mmBtu = q * (formData.fuel_combusted.includes("Fuel Oil") ? 0.138 : formData.fuel_combusted === "Kerosene" ? 0.135 : 0.09);
      else return null;
      return (mmBtu * fuel.co2PerMmBtu / 1000).toFixed(4);
    }
    if (isRefrigeration && formData.refrigeration_method === "material_balance") {
      if (!formData.gas_type || !formData.inventory_change || !formData.transfer_amount || !formData.capacity_change) return null;
      const total = (parseFloat(formData.inventory_change)||0) + (parseFloat(formData.transfer_amount)||0) + (parseFloat(formData.capacity_change)||0);
      return (total * (REFRIGERANT_GWP_FACTORS[formData.gas_type]||0) / 1000).toFixed(4);
    }
    if (isFireSuppression && formData.fire_suppression_method === "material_balance") {
      if (!formData.fire_suppression_gas || !formData.fire_inventory_change || !formData.fire_transfer_amount || !formData.fire_capacity_change) return null;
      const total = (parseFloat(formData.fire_inventory_change)||0) + (parseFloat(formData.fire_transfer_amount)||0) + (parseFloat(formData.fire_capacity_change)||0);
      return (total * (FIRE_SUPPRESSION_GWP_FACTORS[formData.fire_suppression_gas]||0) / 2204.62).toFixed(4);
    }
    if (isPurchasedGases) {
      if (!formData.purchased_gas_type || !formData.purchased_gas_amount) return null;
      return ((parseFloat(formData.purchased_gas_amount)||0) * (PURCHASED_GASES_GWP_FACTORS[formData.purchased_gas_type]||0) / 2204.62).toFixed(4);
    }
    if (formData.amount && emissionFactor) return (parseFloat(formData.amount) * emissionFactor.factor).toFixed(4);
    return null;
  };

  const calculatedEmissions = calcEmissions();

  const makeBase = () => ({
    company_name: formData.company_name,
    reporting_period: formData.reporting_period,
    notes: formData.notes,
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isWaste) {
      const factors = WASTE_EMISSION_FACTORS[formData.waste_material];
      const factor = factors?.[formData.waste_disposal] ?? 0;
      let w = parseFloat(formData.waste_weight) || 0;
      if (formData.waste_unit === "lbs") w /= 2000;
      else if (formData.waste_unit === "kg") w /= 907.185;
      else if (formData.waste_unit === "metric_tons") w *= 1.10231;
      return onSubmit({ ...makeBase(), scope: "scope_3", category: "Waste", source: `${formData.waste_material} - ${WASTE_DISPOSAL_LABELS[formData.waste_disposal]}`, amount: parseFloat(formData.waste_weight), unit: formData.waste_unit, emission_factor: factor, co2e_tonnes: w * factor });
    }
    if (isOffsets) {
      const t = parseFloat(formData.offsets_tonnes) || 0;
      return onSubmit({ ...makeBase(), scope: "offsets", category: "Offsets", source: formData.offsets_ghg_scope ? `Carbon Offsets - ${formData.offsets_ghg_scope}` : "Carbon Offsets", amount: t, unit: "tCO₂e", emission_factor: -1, co2e_tonnes: -t });
    }
    if (isUpstreamTransport) {
      const d = parseFloat(formData.travel_miles) || 0;
      const t = formData.upstream_mode === "vehicle_mile" ? UPSTREAM_TRANSPORT_VEHICLE_MILE : UPSTREAM_TRANSPORT_TON_MILE;
      const f = t[formData.travel_mode];
      return onSubmit({ ...makeBase(), scope: "scope_3", category: "Upstream Transport and Distribution", source: formData.travel_mode, amount: d, unit: f.unit, emission_factor: f.co2, co2e_tonnes: d * (f.co2 + (f.ch4/1000)*28 + (f.n2o/1000)*265) / 1000 });
    }
    if (isBusinessTravel || isCommuting) {
      const m = parseFloat(formData.travel_miles) || 0;
      const f = BUSINESS_TRAVEL_FACTORS[formData.travel_mode];
      return onSubmit({ ...makeBase(), scope: "scope_3", category: isBusinessTravel ? "Business Travel" : "Employee Commuting", source: formData.travel_mode, amount: m, unit: f.unit, emission_factor: f.co2, co2e_tonnes: m * (f.co2 + (f.ch4/1000)*28 + (f.n2o/1000)*265) / 1000 });
    }
    if (isPurchasedSteam) {
      const sp = parseFloat(formData.steam_purchased), eff = parseFloat(formData.steam_boiler_efficiency)/100;
      const mmBtu = sp / eff;
      const calcTonnes = (prefix) => {
        const c2 = formData[`${prefix}_co2_factor`], c4 = formData[`${prefix}_ch4_factor`], n2 = formData[`${prefix}_n2o_factor`];
        if (c2 !== "" || c4 !== "" || n2 !== "") {
          const f = ((parseFloat(c2)||0)/1000) + ((parseFloat(c4)||0)/1e6*28) + ((parseFloat(n2)||0)/1e6*265);
          return mmBtu * f;
        }
        const fuel = STATIONARY_COMBUSTION_FACTORS[formData.steam_fuel_type];
        return fuel ? mmBtu * fuel.co2PerMmBtu / 1000 : 0;
      };
      const mT = calcTonnes("steam_market"), lT = calcTonnes("steam_location");
      return onSubmit([
        { ...makeBase(), scope: "scope_2", scope_2_method: "market_based", category: "Purchased Steam", source: formData.steam_source_area, amount: sp, unit: "mmBtu", emission_factor: mT/sp, co2e_tonnes: mT },
        { ...makeBase(), scope: "scope_2", scope_2_method: "location_based", category: "Purchased Steam", source: formData.steam_source_area, amount: sp, unit: "mmBtu", emission_factor: lT/sp, co2e_tonnes: lT },
      ]);
    }
    if (isPurchasedHeating || isPurchasedCooling) {
      const purchased = parseFloat(formData.hc_purchased), eff = parseFloat(formData.hc_boiler_efficiency)/100;
      const mmBtu = purchased / eff;
      const calcT = (co2Key, ch4Key, n2oKey) => {
        const c2 = formData[co2Key], c4 = formData[ch4Key], n2 = formData[n2oKey];
        if (c2 !== "" || c4 !== "" || n2 !== "") {
          const f = ((parseFloat(c2)||0)/1000) + ((parseFloat(c4)||0)/1e6*28) + ((parseFloat(n2)||0)/1e6*265);
          return mmBtu * f;
        }
        const fuel = STATIONARY_COMBUSTION_FACTORS[formData.hc_fuel_type];
        return fuel ? mmBtu * fuel.co2PerMmBtu / 1000 : 0;
      };
      const mT = calcT("hc_market_co2_factor", "hc_market_ch4_factor", "hc_market_n2o_factor");
      const lT = calcT("hc_location_co2_factor", "hc_location_ch4_factor", "hc_location_n2o_factor");
      const catLabel = isPurchasedHeating ? "Purchased Heating" : "Purchased Cooling";
      return onSubmit([
        { ...makeBase(), scope: "scope_2", scope_2_method: "market_based", category: catLabel, source: formData.hc_source_area, amount: purchased, unit: "mmBtu", emission_factor: mT/purchased, co2e_tonnes: mT },
        { ...makeBase(), scope: "scope_2", scope_2_method: "location_based", category: catLabel, source: formData.hc_source_area, amount: purchased, unit: "mmBtu", emission_factor: lT/purchased, co2e_tonnes: lT },
      ]);
    }
    if (isPurchasedElectricity) {
      const kWh = parseFloat(formData.electricity_kwh), mWh = kWh/1000;
      const s = EGRID_SUBREGIONS[formData.egrid_subregion];
      const locFactor = s.co2 + (s.ch4*28) + (s.n2o*265);
      const locT = mWh * locFactor / 2204.62;
      const hasMarketFactors = formData.market_co2_factor !== "" || formData.market_ch4_factor !== "" || formData.market_n2o_factor !== "";
      let mktT, mktFactor, mktSrc;
      if (hasMarketFactors) {
        const co2 = parseFloat(formData.market_co2_factor) || 0;
        const ch4 = parseFloat(formData.market_ch4_factor) || 0;
        const n2o = parseFloat(formData.market_n2o_factor) || 0;
        const mktFactorLb = co2 + (ch4 * 28) + (n2o * 265);
        mktT = mWh * mktFactorLb / 2204.62; mktFactor = mktFactorLb / 1000; mktSrc = "Supplier";
      } else {
        mktT = locT; mktFactor = locFactor/1000; mktSrc = formData.egrid_subregion;
      }
      return onSubmit([
        { ...makeBase(), scope: "scope_2", scope_2_method: "market_based", category: "Purchased Electricity", source: mktSrc, amount: kWh, unit: "kWh", emission_factor: mktFactor, co2e_tonnes: mktT },
        { ...makeBase(), scope: "scope_2", scope_2_method: "location_based", category: "Purchased Electricity", source: formData.egrid_subregion, amount: kWh, unit: "kWh", emission_factor: locFactor/1000, co2e_tonnes: locT },
      ]);
    }

    const record = { ...makeBase(), scope: formData.scope, scope_2_method: formData.scope === "scope_2" ? formData.scope_2_method : undefined, category: selectedCategory?.label || formData.category, source: formData.source };
    if (isMobileCombustion) {
      const ef = { gallons: 8.78, scf: 0.05444 };
      Object.assign(record, { source: formData.vehicle_type, source_area: formData.vehicle_type, fuel_combusted: formData.fuel_units === "gallons" ? "Gasoline" : "Natural Gas", fuel_state: formData.fuel_units === "gallons" ? "liquid" : "gas", quantity_combusted: parseFloat(formData.fuel_usage), combustion_units: formData.fuel_units, amount: parseFloat(formData.fuel_usage), unit: formData.fuel_units, emission_factor: ef[formData.fuel_units]||0, co2e_tonnes: parseFloat(calculatedEmissions)||0 });
    } else if (isStationaryCombustion) {
      const fd = STATIONARY_COMBUSTION_FACTORS[formData.fuel_combusted];
      Object.assign(record, { source: formData.fuel_combusted, fuel_combusted: formData.fuel_combusted, fuel_state: formData.fuel_state, quantity_combusted: parseFloat(formData.quantity_combusted), combustion_units: formData.combustion_units, amount: parseFloat(formData.quantity_combusted), unit: formData.combustion_units, emission_factor: fd?.co2PerMmBtu||0, co2e_tonnes: parseFloat(calculatedEmissions)||0 });
    } else if (isRefrigeration && formData.refrigeration_method === "material_balance") {
      Object.assign(record, { source: formData.gas_type, amount: (parseFloat(formData.inventory_change)||0)+(parseFloat(formData.transfer_amount)||0)+(parseFloat(formData.capacity_change)||0), unit: "kg", emission_factor: REFRIGERANT_GWP_FACTORS[formData.gas_type]||0, co2e_tonnes: parseFloat(calculatedEmissions)||0 });
    } else if (isFireSuppression && formData.fire_suppression_method === "material_balance") {
      Object.assign(record, { source: formData.fire_suppression_gas, amount: (parseFloat(formData.fire_inventory_change)||0)+(parseFloat(formData.fire_transfer_amount)||0)+(parseFloat(formData.fire_capacity_change)||0), unit: "lbs", emission_factor: FIRE_SUPPRESSION_GWP_FACTORS[formData.fire_suppression_gas]||0, co2e_tonnes: parseFloat(calculatedEmissions)||0 });
    } else if (isPurchasedGases) {
      Object.assign(record, { source: formData.purchased_gas_type, amount: parseFloat(formData.purchased_gas_amount), unit: "lbs", emission_factor: PURCHASED_GASES_GWP_FACTORS[formData.purchased_gas_type]||0, co2e_tonnes: parseFloat(calculatedEmissions)||0 });
    } else {
      Object.assign(record, { amount: parseFloat(formData.amount), unit: emissionFactor?.unit||"", emission_factor: emissionFactor?.factor||0, co2e_tonnes: parseFloat(calculatedEmissions)||0 });
    }
    onSubmit(record);
    setFormData({ ...EMPTY_FORM });
  };

  const isSubmitDisabled = !formData.scope || !formData.category || !formData.reporting_period || (
    isMobileCombustion ? (!formData.vehicle_type || !formData.fuel_usage || !formData.fuel_units)
    : isStationaryCombustion ? (!formData.fuel_combusted || !formData.fuel_state || !formData.quantity_combusted || !formData.combustion_units)
    : isRefrigeration ? (!formData.refrigeration_method || (formData.refrigeration_method === "material_balance" && (!formData.gas_type || !formData.inventory_change || !formData.transfer_amount || !formData.capacity_change)))
    : isFireSuppression ? (!formData.fire_suppression_method || (formData.fire_suppression_method === "material_balance" && (!formData.fire_suppression_gas || !formData.fire_inventory_change || !formData.fire_transfer_amount || !formData.fire_capacity_change)))
    : isPurchasedGases ? (!formData.purchased_gas_type || !formData.purchased_gas_amount)
    : isPurchasedElectricity ? (!formData.electricity_kwh || !formData.egrid_subregion)
    : isPurchasedSteam ? (!formData.steam_source_area || !formData.steam_fuel_type || !formData.steam_boiler_efficiency || !formData.steam_purchased)
    : (isPurchasedHeating || isPurchasedCooling) ? (!formData.hc_source_area || !formData.hc_fuel_type || !formData.hc_boiler_efficiency || !formData.hc_purchased)
    : isUpstreamTransport ? (!formData.upstream_mode || !formData.travel_mode || !formData.travel_miles)
    : (isBusinessTravel || isCommuting) ? (!formData.travel_mode || !formData.travel_miles)
    : isWaste ? (!formData.waste_material || !formData.waste_disposal || !formData.waste_weight || !formData.waste_unit)
    : isOffsets ? !formData.offsets_tonnes
    : (!formData.source || !formData.amount)
  ) || isSubmitting;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[520px] max-h-[90vh] p-0 gap-0 rounded-2xl overflow-hidden flex flex-col">
        <DialogHeader className="p-6 pb-4 border-b border-slate-100 flex-shrink-0">
          <DialogTitle className="text-xl font-semibold text-slate-900">
            {editingRecord ? "Edit Emission Record" : "Add Emission Record"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-6 space-y-5 overflow-y-auto flex-1">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">Scope</Label>
                <Select value={formData.scope} onValueChange={(v) => setFormData({ ...formData, scope: v, scope_2_method: "", category: "", source: "" })}>
                  <SelectTrigger className="h-11 rounded-xl border-slate-200"><SelectValue placeholder="Select scope" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scope_1">Scope 1</SelectItem>
                    <SelectItem value="scope_2">Scope 2</SelectItem>
                    <SelectItem value="scope_3">Scope 3</SelectItem>
                    <SelectItem value="offsets">Offsets</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">Reporting Period</Label>
                <Select value={formData.reporting_period} onValueChange={(v) => setFormData({ ...formData, reporting_period: v })}>
                  <SelectTrigger className="h-11 rounded-xl border-slate-200"><SelectValue placeholder="Select period" /></SelectTrigger>
                  <SelectContent>{REPORTING_PERIODS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {formData.scope && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">Category</Label>
                  <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v, source: "" })}>
                    <SelectTrigger className="h-11 rounded-xl border-slate-200"><SelectValue placeholder="Select category" /></SelectTrigger>
                    <SelectContent>{categories.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}</SelectContent>
                  </Select>
                  {formData.category && selectedCategory?.guidance && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2 p-3 bg-blue-50 rounded-xl border border-blue-100">
                      <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-blue-800 leading-relaxed">{selectedCategory.guidance}</p>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {formData.category && !hasDetailedFields && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">Emission Source</Label>
                  <Select value={formData.source} onValueChange={(v) => setFormData({ ...formData, source: v })}>
                    <SelectTrigger className="h-11 rounded-xl border-slate-200"><SelectValue placeholder="Select source" /></SelectTrigger>
                    <SelectContent>{sources.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {isWaste && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}><WasteFields formData={formData} setFormData={setFormData} calculatedEmissions={calculatedEmissions} /></motion.div>}
              {isUpstreamTransport && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}><UpstreamTransportFields formData={formData} setFormData={setFormData} calculatedEmissions={calculatedEmissions} /></motion.div>}
              {(isBusinessTravel || isCommuting) && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}><BusinessTravelFields formData={formData} setFormData={setFormData} calculatedEmissions={calculatedEmissions} isCommuting={isCommuting} /></motion.div>}
              {isOffsets && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}><OffsetsFields formData={formData} setFormData={setFormData} /></motion.div>}
              {isPurchasedSteam && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}><PurchasedSteamFields formData={formData} setFormData={setFormData} /></motion.div>}
              {(isPurchasedHeating || isPurchasedCooling) && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}><PurchasedHeatingCoolingFields formData={formData} setFormData={setFormData} categoryLabel={isPurchasedHeating ? "Heating" : "Cooling"} /></motion.div>}
              {isPurchasedElectricity && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}><PurchasedElectricityFields formData={formData} setFormData={setFormData} /></motion.div>}
              {isPurchasedGases && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}><PurchasedGasesFields formData={formData} setFormData={setFormData} calculatedEmissions={calculatedEmissions} /></motion.div>}
              {isFireSuppression && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}><FireSuppressionFields formData={formData} setFormData={setFormData} calculatedEmissions={calculatedEmissions} /></motion.div>}
              {isRefrigeration && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}><RefrigerationFields formData={formData} setFormData={setFormData} calculatedEmissions={calculatedEmissions} /></motion.div>}
              {isStationaryCombustion && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}><StationaryCombustionFields formData={formData} setFormData={setFormData} calculatedEmissions={calculatedEmissions} /></motion.div>}
              {isMobileCombustion && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}><MobileCombustionFields formData={formData} setFormData={setFormData} calculatedEmissions={calculatedEmissions} /></motion.div>}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {formData.source && emissionFactor && !isMobileCombustion && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">Amount ({emissionFactor.unit})</Label>
                  <Input type="number" step="0.01" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} placeholder={`Enter amount in ${emissionFactor.unit}`} className="h-11 rounded-xl border-slate-200" />
                  {calculatedEmissions && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl mt-3">
                      <span className="text-sm text-emerald-700 font-medium">Calculated Emissions</span>
                      <span className="text-lg font-semibold text-emerald-800">{calculatedEmissions} tCO₂e</span>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700">Notes (Optional)</Label>
              <Textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} placeholder="Add any additional documentation or notes..." className="rounded-xl border-slate-200 resize-none" rows={3} />
            </div>
          </div>
          <div className="flex gap-3 p-6 pt-4 border-t border-slate-100 flex-shrink-0 bg-white">
            <Button type="button" variant="outline" onClick={onClose} className="h-11 rounded-xl px-4">Cancel</Button>
            <Button type="button" variant="outline" onClick={(e) => { e.preventDefault(); onSubmit({ isDraft: true, formData, company_name: formData.company_name }); }} disabled={isSubmitting} className="h-11 rounded-xl px-4 border-slate-300 text-slate-700 hover:bg-slate-50">
              Save as Draft
            </Button>
            <Button type="submit" disabled={isSubmitDisabled} className="flex-1 h-11 rounded-xl bg-[#1B4332] hover:bg-[#143728] text-white">
              {isSubmitting ? (editingRecord ? "Updating..." : "Adding...") : (editingRecord ? "Update Record" : "Add Record")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}