import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useMutation } from "@tanstack/react-query";
import { createPageUrl } from "@/utils";
import SurveyStep from "@/components/survey/SurveyStep";
import SurveyProgress from "@/components/survey/SurveyProgress";

const SECTIONS = [
  {
    title: "Organization Information",
    description: "Please provide basic details about your organization.",
    fields: [
      { key: "company_name", label: "Enter the name of your entity.", type: "text", required: true },
      { key: "ein", label: "Enter your entity Employer Identification Number (EIN).", type: "text" },
      { key: "naics_code", label: "Select your entity primary industry NAICS code (choose from the drop-down).", type: "dropdown", options: ["11","21","22","23","31-33","42","44-45","48-49","51","52","53","54","55","56","61","62","71","72","81","92"] },
      { key: "website", label: "Provide your entity website URL.", type: "text" },
      { key: "street_address", label: "Enter your headquarter office street address.", type: "text" },
      { key: "city", label: "Enter your headquarter office city.", type: "text" },
      { key: "state", label: "Enter your headquarter office state/province.", type: "text" },
      { key: "country", label: "Enter your headquarter office country.", type: "text" },
      { key: "postal_code", label: "Enter your headquarter office postal code.", type: "text" },
      { key: "contact_name", label: "Provide the name of the entity contact person.", type: "text" },
      { key: "contact_title", label: "Provide the title/position of the entity contact person.", type: "text" },
      { key: "contact_phone", label: "Enter the phone number of the entity contact person (10 digits).", type: "text" },
      { key: "contact_email", label: "Enter the email address of the entity contact person.", type: "text" },
      { key: "verification_date", label: "Enter the date of verification (yyyy-mm-dd).", type: "date" },
    ],
  },
  {
    title: "3rd Party Verification",
    description: "Provide details about your third-party verifier.",
    fields: [
      { key: "third_party_verifier_name", label: "Provide the name of the 3rd party verifier's organization.", type: "text" },
      { key: "third_party_verifier_contact", label: "Provide the name of the 3rd party verifier contact.", type: "text" },
      { key: "third_party_verifier_email", label: "Provide the email address of the 3rd party verifier.", type: "text" },
      { key: "third_party_verifier_phone", label: "Provide the telephone number of the 3rd party verifier.", type: "text" },
      { key: "third_party_verifier_address", label: "Provide the address of the 3rd party verifier.", type: "text" },
      { key: "scope1_third_party_verified", label: "Have all the reported Scope 1 emissions been assured at the limited assurance level?", type: "yesno" },
      { key: "scope1_verification_explanation", label: "If no, provide an explanation.", type: "textarea" },
      { key: "scope2_third_party_verified", label: "Have all the reported Scope 2 emissions been assured at the limited assurance level?", type: "yesno" },
      { key: "scope2_verification_explanation", label: "If no, provide an explanation.", type: "textarea" },
    ],
  },
  {
    title: "Inventory Boundary",
    description: "Define the boundaries of your emissions inventory.",
    fields: [
      { key: "inventory_start_date", label: "Enter the start date of the reporting period (yyyy-mm-dd).", type: "date" },
      { key: "inventory_end_date", label: "Enter the end date of the reporting period (yyyy-mm-dd).", type: "date" },
      { key: "consolidation_approach", label: "Select the consolidation approach your company uses.", type: "dropdown", options: ["Equity Share", "Financial Control", "Organizational Control"] },
      { key: "equity_share_percentage", label: "If you picked 'Equity Share', provide the percentage of equity shares of your legal entity.", type: "number" },
      { key: "subsidiary_reports_separately", label: "Does your subsidiary report separately from the parent company?", type: "yesno" },
      { key: "regions_excluded", label: "Are any regions or specific facilities excluded from your organizational boundary?", type: "yesno" },
      { key: "regions_excluded_details", label: "If yes, identify and provide details about any GHGs that exist within your current year's operations and are being excluded.", type: "textarea" },
      { key: "scope1_stationary_combustion", label: "Indicate Yes or No to confirm whether Scope 1 – Stationary Combustion is included in your reporting boundary.", type: "yesno" },
      { key: "scope1_process_emissions", label: "Indicate Yes or No to confirm whether Scope 1 – Process Emissions are included in your reporting boundary.", type: "yesno" },
      { key: "scope1_mobile_combustion", label: "Indicate Yes or No to confirm whether Scope 1 – Mobile Combustion is included in your reporting boundary.", type: "yesno" },
      { key: "scope1_fugitive_emissions", label: "Indicate Yes or No to confirm whether Scope 1 – Fugitive Sources are included in your reporting boundary.", type: "yesno" },
      { key: "scope2_location_electricity", label: "Indicate Yes or No to confirm whether Scope 2 – Location-Based Purchased Electricity is included in your reporting boundary.", type: "yesno" },
      { key: "scope2_location_heating", label: "Indicate Yes or No to confirm whether Scope 2 – Location-Based Purchased Heating is included in your reporting boundary.", type: "yesno" },
      { key: "scope2_location_cooling", label: "Indicate Yes or No to confirm whether Scope 2 – Location-Based Purchased Cooling is included in your reporting boundary.", type: "yesno" },
      { key: "scope2_market_electricity", label: "Indicate Yes or No to confirm whether Scope 2 – Market-Based Purchased Electricity is included in your reporting boundary.", type: "yesno" },
      { key: "scope2_market_heating", label: "Indicate Yes or No to confirm whether Scope 2 – Market-Based Purchased Heating is included in your reporting boundary.", type: "yesno" },
      { key: "scope2_market_cooling", label: "Indicate Yes or No to confirm whether Scope 2 – Market-Based Purchased Cooling is included in your reporting boundary.", type: "yesno" },
      { key: "includes_direct_biogenic", label: "Indicate whether your reporting boundary includes Direct Biogenic emissions (e.g., stationary, mobile).", type: "yesno" },
      { key: "includes_indirect_biogenic", label: "Indicate whether your reporting boundary includes Indirect Biogenic emissions, such as all location-based and all market-based.", type: "yesno" },
      { key: "facilities_excluded_inventory", label: "Have any facilities, operations and/or emissions sources been excluded from this inventory?", type: "yesno" },
      { key: "facilities_excluded_details", label: "If yes, provide details.", type: "textarea" },
    ],
  },
  {
    title: "Disclosure",
    description: "Provide your emissions totals and calculation methodology.",
    fields: [
      { key: "reporting_year", label: "Enter your reporting year (yyyy).", type: "text" },
      { key: "scope1_emission_factors_source", label: "Scope 1: Enter your total direct emissions from Stationary Combustion (in mtCO₂e).", type: "text" },
      { key: "scope2_emission_factors_source", label: "Scope 2: Enter your total direct emissions from Process Sources (in mtCO₂e).", type: "text" },
      { key: "gwp_factors_source", label: "GWP Factors Source used for calculations.", type: "text" },
      { key: "other_emission_factor_source", label: "Other emission factor source (if applicable).", type: "text" },
      { key: "calculation_approach", label: "Describe your calculation approach.", type: "textarea" },
      { key: "calculation_tools", label: "List the calculation tools or models used.", type: "textarea" },
      { key: "sources_excluded_materiality", label: "List any sources excluded based on materiality.", type: "textarea" },
      { key: "materiality_threshold", label: "Enter your materiality threshold (%).", type: "number" },
      { key: "mrr_field", label: "Enter your California MRR facility ID numbers (separate each with ;).", type: "text" },
    ],
  },
];

export default function CompanySurvey() {
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState(0);
  const [form, setForm] = useState({});

  const saveMutation = useMutation({
    mutationFn: (data) => base44.entities.OrganizationInfo.create(data),
    onSuccess: (created) => {
      navigate(createPageUrl(`CompanyDashboard`) + `?company=${encodeURIComponent(created.company_name)}`);
    },
  });

  const handleNext = () => {
    if (currentSection < SECTIONS.length - 1) {
      setCurrentSection(s => s + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      saveMutation.mutate(form);
    }
  };

  const handleBack = () => {
    setCurrentSection(s => s - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const updateField = (key, value) => setForm(f => ({ ...f, [key]: value }));

  const isLastSection = currentSection === SECTIONS.length - 1;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#1B4332] py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold text-white">GHG Emissions — Company Log</h1>
          <p className="text-emerald-200 mt-1 text-sm">Complete all sections to set up your company's emissions profile.</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <SurveyProgress sections={SECTIONS} currentSection={currentSection} />

        <SurveyStep
          section={SECTIONS[currentSection]}
          sectionIndex={currentSection}
          form={form}
          onChange={updateField}
          onNext={handleNext}
          onBack={handleBack}
          isFirst={currentSection === 0}
          isLast={isLastSection}
          isSaving={saveMutation.isPending}
        />
      </div>
    </div>
  );
}