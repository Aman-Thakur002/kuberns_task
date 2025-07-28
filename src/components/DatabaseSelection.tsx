import { Database, X } from "lucide-react";
import React, { useState } from "react";

interface DatabaseSelectionProps {
  connectDatabase: boolean;
  onConnectChange: (connect: boolean) => void;
}

const DatabaseSelection: React.FC<DatabaseSelectionProps> = ({
  connectDatabase,
  onConnectChange,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedDatabase, setSelectedDatabase] = useState<string | null>(null);

  const databases = [
    { name: "PostgreSQL", value: "postgres", color: "bg-blue-600" },
    { name: "MongoDB", value: "mongodb", color: "bg-green-600" },
    { name: "MySQL", value: "mysql", color: "bg-orange-600" },
    { name: "Snowflake", value: "snowflake", color: "bg-cyan-600" },
  ];

  const handleConnectClick = () => {
    setShowModal(true);
  };

  const handleDatabaseSelect = (dbValue: string) => {
    setSelectedDatabase(dbValue);
    onConnectChange(true);
    setShowModal(false);
  };

  const handleMaybeLater = () => {
    setSelectedDatabase(null);
    onConnectChange(false);
    setShowModal(false);
  };

  return (
    <div className="py-4">
      <div className="flex items-center justify-between mb-4 border-b border-dashed py-3">
        <h4 className="text-lg text-white">
          Database <p>Selection</p>
        </h4>
        <a href="#" className="text-blue-400 text-sm hover:underline">
          Need Help? Refer to our GitHub support resources for a smoother
          experience.
        </a>
      </div>

      <div className="bg-[#090909] border border-gray-700 rounded-xl shadow-lg px-4 py-2 my-4">
        <p className="text-gray-300 mb-6">
          Please be informed that the proper functioning of our application is
          dependent on a valid database connection during deployment. Failing to
          establish a correct database connection will result in an inability to
          access or manipulate essential data, rendering the application
          non-functional. It's crucial to ensure a reliable database connection
          to guarantee the app's operational success.
        </p>
      </div>

      <div className="flex space-x-4 w-[400px] mx-auto">
        <button
          onClick={handleConnectClick}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-colors shadow-md ${
            connectDatabase
              ? "bg-green-600 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          <Database className="w-4 h-4" />
          Connect Database
        </button>
        <button
          onClick={handleMaybeLater}
          className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-colors shadow-md ${
            !connectDatabase
              ? "bg-[#090909] text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          Maybe Later
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#151515] rounded-xl p-6 w-96 max-w-md mx-4 relative">
            {/* Close button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal header */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-white mb-2">
                Select Your Database
              </h3>
              <p className="text-gray-300 text-sm">
                Choose the database you want to connect to your application
              </p>
            </div>

            {/* Database options */}
            <div className="space-y-3">
              {databases.map((db) => (
                <button
                  key={db.value}
                  onClick={() => handleDatabaseSelect(db.value)}
                  className="w-full flex items-center gap-3 p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-left"
                >
                  <div className={`w-3 h-3 rounded-full ${db.color}`}></div>
                  <span className="text-white font-medium">{db.name}</span>
                </button>
              ))}
            </div>

            {/* Cancel button */}
            <div className="mt-6 pt-4 border-t border-gray-700">
              <button
                onClick={() => setShowModal(false)}
                className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Show selected database */}
      {selectedDatabase && connectDatabase && (
        <div className="mt-4 text-center">
          <p className="text-green-400 text-sm">
            Selected: {databases.find(db => db.value === selectedDatabase)?.name}
          </p>
        </div>
      )}

      {/* Show maybe later status */}
      {!connectDatabase && (
        <div className="mt-4 text-center">
          <p className="text-yellow-400 text-sm">
            No database connected
          </p>
        </div>
      )}
    </div>
  );
};

export default DatabaseSelection;