import React from "react";
import { planDetails } from "../types";
import { Database } from "lucide-react";

interface AppDetailsFormProps {
  appName: string;
  region: string;
  template: string;
  plan: string;
  onAppNameChange: (name: string) => void;
  onRegionChange: (region: string) => void;
  onTemplateChange: (template: string) => void;
  onPlanChange: (plan: string) => void;
}

const AppDetailsForm: React.FC<AppDetailsFormProps> = ({
  appName,
  region,
  template,
  plan,
  onAppNameChange,
  onRegionChange,
  onTemplateChange,
  onPlanChange,
}) => {
  const regions = [
    "United States - Michigan",
    "United States - California",
    "Europe - Frankfurt",
    "Asia - Singapore",
  ];

  const templates = ["Vue.js", "React.js", "Next.js", "Angular", "Svelte"];

  const plans = ["Starter", "Pro"];

  return (
    <div className="">
      <div className="flex  justify-between border-b border-dashed mb-3 py-3">
        <h3 className="text-xl font-semibold text-white mb-2 w-52">
          Fill in the details of your App
        </h3>
        <div className="text-right mb-4">
          <a href="#" className="text-blue-400 text-sm hover:underline">
            Need Help? Refer to our GitHub support resources for a smoother
            experience.
          </a>
        </div>
      </div>

      <div className="mb-8">
        <h4 className="text-lg text-white ">Basic Details</h4>
        <p className="text-gray-400 mb-6">
          Enter the basic details of your application such as the name, region
          of deployment and the framework or the template for your application.
        </p>
        <div className="grid grid-cols-3 gap-6">
          <div>
            <input
              type="text"
              value={appName}
              onChange={(e) => onAppNameChange(e.target.value)}
              placeholder="CloudCity"
              className="w-full bg-[#090909] border border-gray-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
            <label className="block text-gray-400 text-sm mb-2">
              🏢 Choose a name
            </label>
          </div>
          <div>
            <select
              value={region}
              onChange={(e) => onRegionChange(e.target.value)}
              className="w-full bg-[#090909] border border-gray-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            >
              {regions.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            <label className="block text-gray-400 text-sm mb-2">
              🌍 Choose Region
            </label>
          </div>
          <div>
            <select
              value={template}
              onChange={(e) => onTemplateChange(e.target.value)}
              className="w-full bg-[#090909] border border-gray-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            >
              {templates.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <label className="block text-gray-400 text-sm mb-2">
              🔧 Choose Template
            </label>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="max-w-[70%]">
            <h4 className="text-lg text-white">Plan Type</h4>
            <p className="text-gray-400 mb-6">
              Select the plan type that best suits your application's needs.
              Each plan offers different features, resources, and limitations.
              Choose the plan that aligns with your requirements and budget.
            </p>
          </div>
          <button className="text-blue-400 hover:underline text-sm bg-blue-700/20 px-4 py-2 rounded-lg flex items-center gap-2">
          <Database className="w-4 h-4" />
            Upgrade Plan
          </button>
        </div>

        <div className="bg-[#090909] border border-gray-700 rounded-xl overflow-hidden">
          <div className="grid grid-cols-7 bg-[#151515] text-gray-300 text-sm font-medium">
            <div className="p-4">Plan type</div>
            <div className="p-4">Storage</div>
            <div className="p-4">Bandwidth</div>
            <div className="p-4">Memory (RAM)</div>
            <div className="p-4">CPU</div>
            <div className="p-4">Monthly Cost</div>
            <div className="p-4">Price per hour</div>
          </div>
          {plans.map((planType) => {
            const details = planDetails[planType];
            const isSelected = plan === planType;
            return (
              <div
                key={planType}
                className={`grid grid-cols-7 border-t border-[#444444] cursor-pointer transition-colors ${
                  isSelected
                    ? "bg-green-900/30 border-green-600"
                    : "hover:bg-gray-750"
                }`}
                onClick={() => onPlanChange(planType)}
              >
                <div className="p-4 flex items-center">
                  <span
                    className={`px-4 py-1 rounded-lg text-xs font-semibold mr-3 ${
                      planType === "Starter"
                        ? "bg-green-600 text-white"
                        : "bg-blue-600 text-white"
                    }`}
                  >
                    {planType}
                  </span>
                </div>
                <div className="p-4 text-gray-300">{details.storage}</div>
                <div className="p-4 text-gray-300">{details.bandwidth}</div>
                <div className="p-4 text-gray-300">{details.memory}</div>
                <div className="p-4 text-gray-300">{details.cpu}</div>
                <div className="p-4 text-gray-300">{details.monthlyCost}</div>
                <div className="p-4 text-gray-300">{details.pricePerHour}</div>
              </div>
            );
          })}
        </div>
        <p className="text-gray-500 text-xs mt-2">
          *{planDetails[plan]?.description}
        </p>
      </div>
    </div>
  );
};

export default AppDetailsForm;
