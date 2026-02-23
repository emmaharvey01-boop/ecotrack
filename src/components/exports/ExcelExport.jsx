import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

// Simple CSV/Excel export helper
function toCSV(rows) {
  return rows.map(row =>
    row.map(cell => {
      const val = cell == null ? "" : String(cell);
      return val.includes(",") || val.includes('"') || val.includes("\n")
        ? `"${val.replace(/"/g, '""')}"`
        : val;
    }).join(",")
  ).join("\n");
}

export function exportToExcel(orgInfo, emissionRecords) {
  const companyName = orgInfo?.company_name || "Company";

  // ---- Sheet 1: Organization Information ----
  const orgRows = [
    ["Category", "Please fill in here", "Data Type", "Guidance"],
    ["Organization Information", orgInfo?.company_name || "", "Text", "Enter the name of your entity."],
    ["Organization Information", orgInfo?.ein || "", "Text", "Enter your Entity Employer Identification Number (EIN)."],
    ["Organization Information", orgInfo?.naics_code || "", "Dropdown", "Select your entity primary industry NAICS code."],
    ["Organization Information", orgInfo?.website || "", "Free Text", "Provide your entity website URL."],
    ["Organization Information", orgInfo?.street_address || "", "Text", "Enter your headquarter office street address."],
    ["Organization Information", orgInfo?.city || "", "Text", "Enter your headquarter office city."],
    ["Organization Information", orgInfo?.state || "", "Free Text", "Enter your headquarter office state/province."],
    ["Organization Information", orgInfo?.country || "", "Free Text", "Enter your headquarter office country."],
    ["Organization Information", orgInfo?.postal_code || "", "Numeric", "Enter your headquarter office postal code."],
    ["Organization Information", orgInfo?.contact_name || "", "Text", "Enter the name of the entity contact person."],
    ["Organization Information", orgInfo?.contact_title || "", "Numeric (10 digits)", "Enter the title/position of the entity contact person."],
    ["Organization Information", orgInfo?.contact_phone || "", "Numeric (10 digits)", "Enter the phone number of the entity contact person (10 digits)."],
    ["Organization Information", orgInfo?.contact_email || "", "Free Text", "Enter the email address of the entity contact person."],
    ["Organization Information", orgInfo?.verification_date || "", "Date", "Enter the date of verification (yyyy-mm-dd)."],
    ["3rd Party Verification", orgInfo?.third_party_verifier_name || "", "Free Text", "Provide the name of the 3rd party verifier's organization."],
    ["3rd Party Verification", orgInfo?.third_party_verifier_contact || "", "Free Text", "Provide the name of the 3rd party verifier."],
    ["3rd Party Verification", orgInfo?.third_party_verifier_address || "", "Free Text", "Provide the address of the 3rd party verifier."],
    ["3rd Party Verification", orgInfo?.third_party_verifier_phone || "", "Numeric (10 digits)", "Provide the telephone number of the 3rd party verifier."],
    ["3rd Party Verification", orgInfo?.third_party_verifier_email || "", "Free Text", "Provide the address of the 3rd party verifier."],
    ["Inventory", orgInfo?.inventory_start_date || "", "Date", "Enter the state of the reporting period (yyyy-mm-dd)."],
    ["Inventory", orgInfo?.inventory_end_date || "", "Date", "Enter the end date of the reporting period (yyyy-mm-dd)."],
    ["Inventory Boundary", orgInfo?.consolidation_approach || "", "Dropdown", "Select the consolidation approach your company uses."],
    ["Inventory Boundary", orgInfo?.equity_share_percentage || "", "Numeric", "Provide the percentage of equity shares."],
    ["Inventory Boundary", orgInfo?.subsidiary_reports_separately || "", "Yes/No", "Does your subsidiary report separately from the parent company?"],
    ["Inventory Boundary", orgInfo?.regions_excluded || "", "Yes/No", "Are any regions or specific facilities excluded from your organizational boundary?"],
    ["Inventory Boundary", orgInfo?.regions_excluded_details || "", "Free Text", "If Yes, identify and provide clarification."],
    ["Inventory Boundary", orgInfo?.scope1_stationary_combustion || "", "Yes/No", "Indicate Yes or No to confirm whether Scope 1 – Stationary Combustion is included in your reporting boundary."],
    ["Inventory Boundary", orgInfo?.scope1_process_emissions || "", "Yes/No", "Indicate Yes or No to confirm whether Scope 1 – Process Emissions are included in your reporting boundary."],
    ["Inventory Boundary", orgInfo?.scope1_mobile_combustion || "", "Yes/No", "Indicate Yes or No to confirm whether Scope 1 – Mobile Combustion is included in your reporting boundary."],
    ["Inventory Boundary", orgInfo?.scope1_fugitive_emissions || "", "Yes/No", "Indicate Yes or No to confirm whether Scope 1 – Fugitive Emissions are included in your reporting boundary."],
    ["Inventory Boundary", orgInfo?.scope2_location_electricity || "", "Yes/No", "Indicate Yes or No to confirm whether Scope 2 – Location-Based Purchased Electricity is included in your reporting boundary."],
    ["Inventory Boundary", orgInfo?.scope2_location_heating || "", "Yes/No", "Indicate Yes or No to confirm whether Scope 2 – Location-Based Purchased Heating is included in your reporting boundary."],
    ["Inventory Boundary", orgInfo?.scope2_location_cooling || "", "Yes/No", "Indicate Yes or No to confirm whether Scope 2 – Location-Based Purchased Cooling is included in your reporting boundary."],
    ["Inventory Boundary", orgInfo?.scope2_market_electricity || "", "Yes/No", "Indicate Yes or No to confirm whether Scope 2 – Market-Based Purchased Electricity is included in your reporting boundary."],
    ["Inventory Boundary", orgInfo?.scope2_market_heating || "", "Yes/No", "Indicate Yes or No to confirm whether Scope 2 – Market-Based Purchased Heating is included in your reporting boundary."],
    ["Inventory Boundary", orgInfo?.scope2_market_cooling || "", "Yes/No", "Indicate Yes or No to confirm whether Scope 2 – Market-Based Purchased Cooling is included in your reporting boundary."],
    ["Inventory Boundary", orgInfo?.includes_direct_biogenic || "", "Yes/No", "Indicate whether your reporting boundary includes Direct Biogenic emissions."],
    ["Inventory Boundary", orgInfo?.includes_indirect_biogenic || "", "Yes/No", "Indicate whether your reporting boundary includes Indirect Biogenic emissions."],
    ["Inventory Boundary", orgInfo?.facilities_excluded_inventory || "", "Yes/No", "Have any facilities, operations and/or emissions sources been excluded from this inventory?"],
    ["Inventory Boundary", orgInfo?.facilities_excluded_details || "", "Free Text", "If Yes to the question above, provide details."],
  ];

  // Calculate scope totals from emission records
  const scope1Total = emissionRecords.filter(r => r.scope === "scope_1").reduce((s, r) => s + (r.co2e_tonnes || 0), 0);
  const scope1Stationary = emissionRecords.filter(r => r.scope === "scope_1" && r.category === "Stationary Combustion").reduce((s, r) => s + (r.co2e_tonnes || 0), 0);
  const scope1Process = emissionRecords.filter(r => r.scope === "scope_1" && r.category === "Process Emissions").reduce((s, r) => s + (r.co2e_tonnes || 0), 0);
  const scope1Fugitive = emissionRecords.filter(r => r.scope === "scope_1" && (r.category === "Refrigeration and A/C Equipment Use" || r.category === "Fire Suppression")).reduce((s, r) => s + (r.co2e_tonnes || 0), 0);
  const scope2Total = emissionRecords.filter(r => r.scope === "scope_2" && r.scope_2_method === "market_based").reduce((s, r) => s + (r.co2e_tonnes || 0), 0);
  const scope2Electricity = emissionRecords.filter(r => r.scope === "scope_2" && r.scope_2_method === "market_based" && r.category === "Purchased Electricity").reduce((s, r) => s + (r.co2e_tonnes || 0), 0);
  const scope2Steam = emissionRecords.filter(r => r.scope === "scope_2" && r.scope_2_method === "market_based" && r.category === "Purchased Steam").reduce((s, r) => s + (r.co2e_tonnes || 0), 0);
  const scope2LocationTotal = emissionRecords.filter(r => r.scope === "scope_2" && r.scope_2_method === "location_based").reduce((s, r) => s + (r.co2e_tonnes || 0), 0);
  const scope2LocationElectricity = emissionRecords.filter(r => r.scope === "scope_2" && r.scope_2_method === "location_based" && r.category === "Purchased Electricity").reduce((s, r) => s + (r.co2e_tonnes || 0), 0);
  const scope2LocationSteam = emissionRecords.filter(r => r.scope === "scope_2" && r.scope_2_method === "location_based" && r.category === "Purchased Steam").reduce((s, r) => s + (r.co2e_tonnes || 0), 0);

  const disclosureRows = [
    ["Disclosure", scope1Total.toFixed(4), "Numeric", "Enter your Scope 1 total direct emissions (in mtCO₂e)."],
    ["Disclosure", scope1Stationary.toFixed(4), "Numeric", "Scope 1: Enter your total direct emissions from Stationary Combustion (in mtCO₂e)."],
    ["Disclosure", scope1Process.toFixed(4), "Numeric", "Scope 1: Enter your total direct emissions from Process Sources (in mtCO₂e)."],
    ["Disclosure", scope1Fugitive.toFixed(4), "Numeric", "Scope 1: Enter your total direct emissions from Fugitive Sources (in mtCO₂e)."],
    ["3rd Party Verification", orgInfo?.scope1_third_party_verified || "", "Yes/No", "Please confirm that all the reported Scope 1 emissions have been assured at the limited assurance level."],
    ["3rd Party Verification", orgInfo?.scope1_verification_explanation || "", "Free Text", "If no to previous response, provide an explanation."],
    ["Disclosure", scope2Total.toFixed(4), "Numeric", "Enter your Scope 2 total direct emissions (in mtCO₂e)."],
    ["Disclosure", scope2Electricity.toFixed(4), "Numeric", "Scope 2: Enter your total indirect emissions from Purchased/Acquired Electricity (in mtCO₂e)."],
    ["Disclosure", scope2Steam.toFixed(4), "Numeric", "Scope 2: Enter your total indirect emissions from Purchased/Acquired Steam (in mtCO₂e)."],
    ["Disclosure", scope2LocationTotal.toFixed(4), "Numeric", "Scope 2 location-based total (in mtCO₂e)."],
    ["Disclosure", scope2LocationElectricity.toFixed(4), "Numeric", "Scope 2 location-based Purchased Electricity (in mtCO₂e)."],
    ["Disclosure", scope2LocationSteam.toFixed(4), "Numeric", "Scope 2 location-based Purchased Steam (in mtCO₂e)."],
    ["3rd Party Verification", orgInfo?.scope2_third_party_verified || "", "Yes/No", "Please confirm that all the reported Scope 2 emissions have been assured at the limited assurance level."],
    ["3rd Party Verification", orgInfo?.scope2_verification_explanation || "", "Free Text", "If no to previous response, provide an explanation."],
    ["Methods", orgInfo?.reporting_year || "", "Date", "Select the year for source of emissions factors (yyyy)."],
    ["Methods", orgInfo?.other_emission_factor_source || "", "Free Text", "If Other, specify."],
    ["Methods", orgInfo?.scope1_emission_factors_source || "", "Free Text", "List the source of emissions factors and years you are using for Scope 1."],
    ["Methods", orgInfo?.scope2_emission_factors_source || "", "Free Text", "Enter the source of emissions factors you are using for Scope 2."],
    ["Methods", orgInfo?.gwp_factors_source || "", "Free Text", "Enter the source of Global Warming Potential (GWP) factors you are using."],
    ["Methods", orgInfo?.calculation_approach || "", "Free Text", "Describe the calculation approach you are using."],
    ["Methods", orgInfo?.calculation_tools || "", "Free Text", "Specify any process-specific calculations, including the tools or models used."],
    ["Sources Excluded", orgInfo?.sources_excluded_materiality || "", "Free Text", "List any sources excluded based on the materiality threshold."],
    ["Sources Excluded", orgInfo?.materiality_threshold || "", "Numeric", "Provide the quantity of emissions associated with sources excluded under the materiality threshold."],
    ["MRR Field", orgInfo?.mrr_field || "", "Free Text", "Provide the California Mandated Reporting Regulations (MRR) facility ID numbers associated with your company."],
  ];

  const allOrgRows = [...orgRows, ...disclosureRows];

  // ---- Sheet 2: Emission Records ----
  const emissionHeaders = ["Scope", "Category", "Source", "Amount", "Unit", "Emission Factor", "CO2e (tonnes)", "Reporting Period", "Scope 2 Method", "Notes", "Company"];
  const emissionDataRows = emissionRecords.map(r => [
    r.scope || "", r.category || "", r.source || "",
    r.amount || "", r.unit || "", r.emission_factor || "",
    r.co2e_tonnes || "", r.reporting_period || "",
    r.scope_2_method || "", r.notes || "", r.company_name || "",
  ]);

  // Build combined CSV with separator between "sheets"
  const csv = [
    `ORGANIZATION INFORMATION - ${companyName}`,
    toCSV(allOrgRows),
    "",
    `EMISSION RECORDS - ${companyName}`,
    toCSV([emissionHeaders, ...emissionDataRows]),
  ].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${companyName.replace(/\s+/g, "_")}_GHG_Report.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function ExcelExportButton({ orgInfo, emissionRecords, disabled }) {
  return (
    <Button
      onClick={() => exportToExcel(orgInfo, emissionRecords)}
      disabled={disabled}
      className="bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl h-11 px-5"
    >
      <Download className="w-4 h-4 mr-2" />
      Export Report
    </Button>
  );
}