import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useMutation } from "@tanstack/react-query";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, ChevronRight } from "lucide-react";

const NAICS_CODES = ["11","21","22","23","31-33","42","44-45","48-49","51","52","53","54","55","56","61","62","71","72","81","92"];

const questions = [
  { key: "company_name", label: "Enter the name of your entity.", type: "text", required: true },
  { key: "ein", label: "Enter your entity Employer Identification Number (EIN).", type: "text" },
  { key: "naics_code", label: "Select your entity primary industry NAICS code.", type: "dropdown", options: NAICS_CODES },
  { key: "website", label: "Provide your entity website URL.", type: "text" },
  { key: "street_address", label: "Enter your headquarter office street address.", type: "text" },
  { key: "city", label: "Enter your headquarter office city.", type: "text" },
  { key: "state", label: "Enter your headquarter office state/province.", type: "text" },
  { key: "country", label: "Enter your headquarter office country.", type: "text" },
  { key: "postal_code", label: "Enter your headquarter office postal code.", type: "text" },
  { key: "contact_name", label: "Provide the name of the entity contact person.", type: "text" },
  { key: "contact_title", label: "Provide the title/position of the entity contact person.", type: "text" },
  { key: "contact_phone", label: "Enter the phone number of the entity contact person.", type: "text" },
  { key: "contact_email", label: "Enter the email address of the entity contact person.", type: "text" },
  { key: "verification_date", label: "Enter the date of verification (yyyy-mm-dd).", type: "text", placeholder: "yyyy-mm-dd" },
];

export default function CompanySurvey() {
  const navigate = useNavigate();
  const [form, setForm] = useState({});

  const saveMutation = useMutation({
    mutationFn: (data) => base44.entities.OrganizationInfo.create(data),
    onSuccess: (created) => {
      navigate(createPageUrl("OrganizationInfo"));
    },
  });

  const set = (key, value) => setForm(f => ({ ...f, [key]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    saveMutation.mutate(form);
  };

  return (
    <div className="min-h-screen bg-[#f0f4f8]">
      {/* Header banner */}
      <div className="bg-[#1B4332] h-2 w-full" />
      <div className="max-w-2xl mx-auto px-4 py-10">

        {/* Title card */}
        <div className="bg-white rounded-xl shadow-sm border-t-8 border-[#1B4332] p-8 mb-6">
          <div className="flex items-center gap-3 mb-3">
            <Building2 className="w-7 h-7 text-[#1B4332]" />
            <h1 className="text-2xl font-bold text-gray-800">Organization Information</h1>
          </div>
          <p className="text-gray-500 text-sm">
            Please complete the following questions about your organization. This information will be used to generate your GHG emissions report.
          </p>
          <p className="text-gray-500 text-xs mt-2">Only the company name is required — you can skip the rest and fill them in later.</p>
          <p className="text-red-500 text-xs mt-1">* Required</p>
        </div>

        {/* Questions */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {questions.map((q, i) => (
            <div key={q.key}>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <Label className="text-gray-800 font-medium text-sm leading-relaxed block mb-3">
                  {i + 1}. {q.label}
                  {q.required && <span className="text-red-500 ml-1">*</span>}
                </Label>

                {q.type === "text" && (
                  <Input
                    value={form[q.key] || ""}
                    onChange={e => set(q.key, e.target.value)}
                    placeholder={q.placeholder || "Your answer"}
                    required={q.required}
                    className="border-0 border-b border-gray-300 rounded-none focus-visible:ring-0 focus-visible:border-[#1B4332] px-0 text-sm"
                  />
                )}

                {q.type === "dropdown" && (
                  <Select value={form[q.key] || ""} onValueChange={v => set(q.key, v)}>
                    <SelectTrigger className="w-full border border-gray-200 rounded-lg text-sm">
                      <SelectValue placeholder="Choose..." />
                    </SelectTrigger>
                    <SelectContent>
                      {q.options.map(o => (
                        <SelectItem key={o} value={o}>{o}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              {/* Skip button after question 1 */}
              {i === 0 && (
                <div className="flex justify-end pt-1">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={!form.company_name || saveMutation.isPending}
                    onClick={() => saveMutation.mutate({ company_name: form.company_name })}
                    className="rounded-lg h-9 px-5 border-[#1B4332] text-[#1B4332] hover:bg-[#1B4332]/5 text-sm"
                  >
                    Skip & come back later
                  </Button>
                </div>
              )}
            </div>
          ))}

          {/* Submit */}
          <div className="flex flex-col sm:flex-row gap-3 justify-between items-center pt-2">
            <div className="flex gap-3 w-full sm:w-auto">
              <Button
                type="submit"
                disabled={!form.company_name || saveMutation.isPending}
                className="bg-[#1B4332] hover:bg-[#143728] text-white rounded-lg h-11 px-8 flex items-center gap-2"
              >
                {saveMutation.isPending ? "Saving..." : "Submit"}
                <ChevronRight className="w-4 h-4" />
              </Button>

            </div>
            <button
              type="button"
              onClick={() => setForm({})}
              className="text-sm text-gray-400 hover:text-gray-600 underline"
            >
              Clear form
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}