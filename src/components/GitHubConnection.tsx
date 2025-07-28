import type React from "react";
import { useState } from "react";
import {
  Github,
  Loader2,
  CheckCircle,
  AlertCircle,
  Gitlab,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface GitHubConnectionProps {
  selectedOrg: string;
  selectedRepo: string;
  selectedBranch: string;
  onOrgChange: (org: string) => void;
  onRepoChange: (repo: string) => void;
  onBranchChange: (branch: string) => void;
}

type ConnectionStatus = "disconnected" | "connecting" | "connected" | "error";

const GitHubConnection: React.FC<GitHubConnectionProps> = ({
  selectedOrg,
  selectedRepo,
  selectedBranch,
  onOrgChange,
  onRepoChange,
  onBranchChange,
}) => {
  const [githubStatus, setGithubStatus] =
    useState<ConnectionStatus>("disconnected");
  const [gitlabStatus, setGitlabStatus] =
    useState<ConnectionStatus>("disconnected");
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [showMobileConfig, setShowMobileConfig] = useState(false);

  // Mock data that gets populated after connection
  const [orgs, setOrgs] = useState<string[]>([]);
  const [repos, setRepos] = useState<string[]>([]);
  const [branches, setBranches] = useState<string[]>([]);

  const mockOrgs = [
    "Adith Narein T",
    "Microsoft",
    "Google",
    "Facebook",
    "Vercel",
    "OpenAI",
  ];
  const mockRepos = [
    "Kuberns Page",
    "Next.js App",
    "React Dashboard",
    "API Server",
    "ML Pipeline",
    "Mobile App",
  ];
  const mockBranches = [
    "main",
    "develop",
    "feature/auth",
    "staging",
    "production",
    "hotfix/bug-123",
  ];

  const connectToGitHub = async () => {
    if (githubStatus !== "disconnected") return;
    setGithubStatus("connecting");

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setGithubStatus("connected");
      setOrgs(mockOrgs);
      setRepos(mockRepos);
      setBranches(mockBranches);
      if (!selectedOrg && mockOrgs.length > 0) onOrgChange(mockOrgs[0]);
      if (!selectedRepo && mockRepos.length > 0) onRepoChange(mockRepos[0]);
      if (!selectedBranch && mockBranches.length > 0)
        onBranchChange(mockBranches[0]);

      // Auto-expand mobile config after connection
      setShowMobileConfig(true);
    } catch (error) {
      setGithubStatus("error");
    }
  };

  const configureGitHub = async () => {
    setIsConfiguring(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsConfiguring(false);
    alert("GitHub configuration updated successfully!");
  };

  const getStatusColorClasses = (status: ConnectionStatus) => {
    switch (status) {
      case "connected":
        return "bg-blue-900/30 border border-blue-600";
      case "connecting":
        return "bg-blue-900/30 border border-blue-600 animate-pulse";
      case "error":
        return "bg-red-900/30 border border-red-600";
      default:
        return "bg-[#151515] border border-gray-700 opacity-50";
    }
  };

  const getStatusText = (status: ConnectionStatus) => {
    switch (status) {
      case "connected":
        return { text: "CONNECTED", color: "text-green-400" };
      case "connecting":
        return { text: "CONNECTING...", color: "text-blue-400" };
      case "error":
        return { text: "ERROR", color: "text-red-400" };
      default:
        return { text: "NOT CONNECTED", color: "text-gray-500" };
    }
  };

  const getStatusIcon = (status: ConnectionStatus) => {
    switch (status) {
      case "connected":
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case "connecting":
        return <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />;
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-400" />;
      default:
        return <Github className="w-5 h-5 text-white" />;
    }
  };

  return (
    <div className="mb-8">
      {/* Header Section - Responsive */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between border-b border-dashed my-3 space-y-4 lg:space-y-0 py-2">
        {/* Title */}
        <div className="lg:w-52">
          <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
            Choose your Version Control System
          </h3>
        </div>

        {/* Connection Options */}
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mb-3">
          {/* GitHub Connection */}
          <div
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg cursor-pointer transition-all ${getStatusColorClasses(
              githubStatus
            )}`}
            onClick={connectToGitHub}
          >
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium">Github</p>
              <span className={`text-xs ${getStatusText(githubStatus).color}`}>
                {getStatusText(githubStatus).text}
              </span>
            </div>
            {getStatusIcon(githubStatus)}
          </div>

          {/* GitLab Connection */}
          <div
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg cursor-pointer ${getStatusColorClasses(
              gitlabStatus
            )}`}
          >
            <div className="flex-1 min-w-0">
              <p className="text-gray-400">Gitlab</p>
              <span className={`text-xs ${getStatusText(gitlabStatus).color}`}>
                {getStatusText(gitlabStatus).text}
              </span>
            </div>
            <Gitlab fill="orange" className="text-orange-400" />
          </div>
        </div>

        {/* Help Section */}
        <div className="text-center lg:text-left">
          <h4 className="text-white font-medium">Need Help?</h4>
          <p className="text-gray-400 text-sm">Documentation & Support</p>
        </div>
      </div>

      {/* Configuration Section */}
      <div className="space-y-6">
        {/* Mobile Expand/Collapse Button */}
          <button
            onClick={() => setShowMobileConfig(!showMobileConfig)}
            className="lg:hidden w-full flex items-center justify-between p-3 bg-[#151515] border border-gray-700 rounded-lg text-white"
          >
            <span>Repository Configuration</span>
            {showMobileConfig ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </button>
        

        {/* Configuration Form - Responsive */}
        <div
          
        >
          {/* Desktop Layout */}
          <div className="hidden lg:grid lg:grid-cols-3 lg:gap-4">
            {/* Organization Select */}
            <div>
              <select
                value={selectedOrg}
                onChange={(e) => onOrgChange(e.target.value)}
                className="w-full bg-[#151515] border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Organization</option>
                {orgs.map((org) => (
                  <option key={org} value={org}>
                    {org}
                  </option>
                ))}
              </select>
              <label className="block text-gray-400 text-sm mt-2">
                Select Organization
              </label>
            </div>

            {/* Repository Select */}
            <div>
              <select
                value={selectedRepo}
                onChange={(e) => onRepoChange(e.target.value)}
                className="w-full bg-[#151515] border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={!selectedOrg}
              >
                <option value="">Select Repository</option>
                {repos.map((repo) => (
                  <option key={repo} value={repo}>
                    {repo}
                  </option>
                ))}
              </select>
              <label className="block text-gray-400 text-sm mt-2">
                Select Repository
              </label>
            </div>

            {/* Branch Select and Configure Button */}
            <div className="flex gap-2">
              <div className="flex-1">
                <select
                  value={selectedBranch}
                  onChange={(e) => onBranchChange(e.target.value)}
                  className="w-full bg-[#151515] border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={!selectedRepo}
                >
                  <option value="">Select Branch</option>
                  {branches.map((branch) => (
                    <option key={branch} value={branch}>
                      {branch}
                    </option>
                  ))}
                </select>
                <label className="block text-gray-400 text-sm mt-2">
                  Select Branch
                </label>
              </div>
              <div className="flex-1">
                <button
                  onClick={configureGitHub}
                  disabled={
                    isConfiguring ||
                    !selectedOrg ||
                    !selectedRepo ||
                    !selectedBranch
                  }
                  className="text-gray-400 hover:text-white w-full h-[48px] flex items-center justify-center  transition-colors border border-transparent rounded-lg disabled:opacity-50"
                >
                  {isConfiguring ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      <span className="hidden sm:inline">Configuring...</span>
                      <span className="sm:hidden">...</span>
                    </>
                  ) : (
                    <>
                      <span className="mr-2">⚙️</span>
                      <span className="hidden sm:inline">Configure Github</span>
                      <span className="sm:hidden">Configure</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile/Tablet Layout */}
          <div className="lg:hidden space-y-4">
            {/* Organization Select */}
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Select Organization
              </label>
              <select
                value={selectedOrg}
                onChange={(e) => onOrgChange(e.target.value)}
                className="w-full bg-[#151515] border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Organization</option>
                {orgs.map((org) => (
                  <option key={org} value={org}>
                    {org}
                  </option>
                ))}
              </select>
            </div>

            {/* Repository Select */}
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Select Repository
              </label>
              <select
                value={selectedRepo}
                onChange={(e) => onRepoChange(e.target.value)}
                className="w-full bg-[#151515] border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={!selectedOrg}
              >
                <option value="">Select Repository</option>
                {repos.map((repo) => (
                  <option key={repo} value={repo}>
                    {repo}
                  </option>
                ))}
              </select>
            </div>

            {/* Branch Select */}
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Select Branch
              </label>
              <select
                value={selectedBranch}
                onChange={(e) => onBranchChange(e.target.value)}
                className="w-full bg-[#151515] border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={!selectedRepo}
              >
                <option value="">Select Branch</option>
                {branches.map((branch) => (
                  <option key={branch} value={branch}>
                    {branch}
                  </option>
                ))}
              </select>
            </div>

            {/* Configure Button */}
            <button
              onClick={configureGitHub}
              disabled={
                isConfiguring ||
                !selectedOrg ||
                !selectedRepo ||
                !selectedBranch
              }
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:opacity-50 text-white px-4 py-3 rounded-lg flex items-center justify-center transition-colors"
            >
              {isConfiguring ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Configuring...
                </>
              ) : (
                <>
                  <span className="mr-2">⚙️</span>
                  Configure Github
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GitHubConnection;
