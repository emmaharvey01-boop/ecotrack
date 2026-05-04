import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { file_url } = await req.json();
    if (!file_url) return Response.json({ error: 'file_url is required' }, { status: 400 });

    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `You are an expert in greenhouse gas (GHG) emissions reporting. Analyze this utility bill or invoice PDF and extract the key data needed to log an emissions record.

Extract the following fields and return them as a JSON object:
- bill_type: type of bill (electricity, natural_gas, water, fuel_oil, propane, steam, heating, cooling, or other)
- supplier_name: utility/supplier name
- account_number: account or meter number if present
- billing_period: billing period as a string (e.g. "January 2024" or "Q1 2024")
- consumption_amount: the primary consumption/usage quantity (number only)
- consumption_unit: the unit of measurement (kWh, MWh, therms, CCF, SCF, MMBtu, gallons, lbs, etc.)
- total_cost: total bill amount in USD (number only, no currency symbol)
- egrid_subregion: if there is any reference to a utility or region, suggest the likely US eGRID subregion (e.g. CAMX, ERCT, MROE, etc.) — leave empty string if unknown
- fuel_type: for gas bills, the fuel type (e.g. Natural Gas, Propane Gas, Fuel Oil No. 2)
- notes: any other relevant details (tariff type, service address, etc.)

Return ONLY a valid JSON object with these fields. If a field cannot be determined, use empty string or null.`,
      file_urls: [file_url],
      response_json_schema: {
        type: "object",
        properties: {
          bill_type: { type: "string" },
          supplier_name: { type: "string" },
          account_number: { type: "string" },
          billing_period: { type: "string" },
          consumption_amount: { type: "number" },
          consumption_unit: { type: "string" },
          total_cost: { type: "number" },
          egrid_subregion: { type: "string" },
          fuel_type: { type: "string" },
          notes: { type: "string" }
        }
      }
    });

    return Response.json({ success: true, data: result });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});