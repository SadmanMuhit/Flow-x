import React, { useState } from "react";
import { ICON_MAP } from "./flow-utils";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle,
  ExternalLink,
  Key,
  Settings,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface NodeData {
  label: string;
  description: string;
  icon: string;
  isStartNode?: boolean;
  stepNumber: number;
}

interface Connection {
  id: string;
  platform: string;
  account_name: string;
  metadata: any;
  created_at: string;
  updated_at: string;
}

interface NodeConfigurationModelProps {
  isOpen: boolean;
  onClose: () => void;
  nodeData: NodeData | null;
  onConfigured: (stepNumber: number, config?: any) => void;
}

const OAUTH_PROVIDERS = [
  "stripe",
  "gmail",
  "slack",
  "discord",
  "notion",
  "sheets",
];

const API_KEY_PROVIDERS = ["openai", "gemini", "claude"];

const CORE_PROVIDERS = [
  "webhook-trigger",
  "schedule-trigger",
  "http-request",
  "send-notification",
  "ai-generate",
  "delay",
];

const getPlatformName = (label: string): string => {
  const lower = label.toLowerCase();

  if (lower.includes("gmail")) return "gmail";
  if (lower.includes("slack")) return "slack";
  if (lower.includes("discord")) return "discord";
  if (lower.includes("notion")) return "notion";
  if (lower.includes("sheets")) return "sheets";
  if (lower.includes("stripe")) return "stripe";
  if (lower.includes("openai")) return "openai";
  if (lower.includes("claude")) return "claude";
  if (lower.includes("gemini")) return "gemini";

  if (lower.includes("webhook")) return "webhook-trigger";
  if (lower.includes("schedule")) return "schedule-trigger";
  if (lower.includes("http")) return "http-request";
  if (lower.includes("notification")) return "send-notification";
  if (lower.includes("ai generate")) return "ai-generate";
  if (lower.includes("delay")) return "delay";

  return lower.replace(/\s+/g, "-");
};

const inputCls =
  "w-full px-3 py-2 bg-[#0B0F14] border border-gray-600 rounded-md text-white placeholder-gray-500 focus:border-green-400 focus:outline-none";

const selectCls =
  "w-full px-3 py-2 bg-[#0B0F14] border border-gray-600 rounded-md text-white focus:border-green-400 focus:outline-none";

const Field = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-300 mb-2">
      {label}
    </label>
    {children}
  </div>
);

const NodeConfigurationModel = ({
  isOpen,
  onClose,
  nodeData,
  onConfigured,
}: NodeConfigurationModelProps) => {
  const [connections] = useState<Connection[]>([]);
  const [loading] = useState(false);
  const [selectedConnection, setSelectedConnection] = useState<string | null>(
    null,
  );
  const [apiKey, setApiKey] = useState("");
  const [coreConfig, setCoreConfig] = useState<Record<string, any>>({});

  if (!isOpen || !nodeData) return null;

  const platformName = getPlatformName(nodeData.label);

  const isOAuth = OAUTH_PROVIDERS.includes(platformName);
  const isApiKey = API_KEY_PROVIDERS.includes(platformName);
  const isCore = CORE_PROVIDERS.includes(platformName);

  const IconComponent =
    (nodeData && ICON_MAP[nodeData.icon]) || ICON_MAP.ArrowRight || ArrowRight;

  const handleSave = () => {
    let config: any = {};

    if (isApiKey) {
      config = {
        apiKey: selectedConnection ? null : apiKey,
        savedKeyId: selectedConnection,
      };
    }

    if (isCore) {
      config = coreConfig;
    }

    onConfigured(nodeData.stepNumber, config);
    onClose();
  };

  const renderCoreConfiguration = () => {
    switch (platformName) {
      case "webhook-trigger":
        return (
          <div className="space-y-3">
            <Field label="Webhook URL">
              <div className="p-3 bg-[#0B0F14] border border-gray-600 rounded-md">
                <code className="text-sm text-green-400">
                  https://yourapp.com/webhook/{nodeData.stepNumber}
                </code>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Send a POST request with JSON payload to trigger this workflow.
              </p>
            </Field>
          </div>
        );

      case "schedule-trigger":
        return (
          <div className="space-y-4">
            <Field label="Schedule Type">
              <select
                className={selectCls}
                value={coreConfig.scheduleType || "interval"}
                onChange={(e) =>
                  setCoreConfig((prev) => ({
                    ...prev,
                    scheduleType: e.target.value,
                  }))
                }
              >
                <option value="interval">Interval</option>
                <option value="cron">Cron Expression</option>
              </select>
            </Field>

            {(coreConfig.scheduleType || "interval") === "interval" && (
              <Field label="Run Every">
                <select
                  className={selectCls}
                  value={coreConfig.intervalUnit || "minutes"}
                  onChange={(e) =>
                    setCoreConfig((prev) => ({
                      ...prev,
                      intervalUnit: e.target.value,
                      interval: 1,
                    }))
                  }
                >
                  <option value="seconds">Second</option>
                  <option value="minutes">Minute</option>
                  <option value="hours">Hour</option>
                </select>
              </Field>  
            )}

            {coreConfig.scheduleType === "cron" && (
              <Field label="Cron Expression">
                <input
                  type="text"
                  value={coreConfig.cronExpression || ""}
                  onChange={(e) =>
                    setCoreConfig((prev) => ({
                      ...prev,
                      cronExpression: e.target.value,
                    }))
                  }
                  placeholder="0 */5 * * *"
                  className={inputCls}
                />
                <p className="text-xs text-gray-400 mt-1">
                  Format: minute hour day month weekday
                </p>
              </Field>
            )}
          </div>
        );

      case "http-request":
        return (
          <div className="space-y-3">
            <Field label="HTTP Method">
              <select
                className={selectCls}
                value={coreConfig.method || "GET"}
                onChange={(e) =>
                  setCoreConfig((prev) => ({
                    ...prev,
                    method: e.target.value,
                  }))
                }
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
                <option value="PATCH">PATCH</option>
              </select>
            </Field>

            <Field label="URL">
              <input
                type="url"
                value={coreConfig.url || ""}
                onChange={(e) =>
                  setCoreConfig((prev) => ({
                    ...prev,
                    url: e.target.value,
                  }))
                }
                placeholder="https://api.example.com"
                className={inputCls}
              />
            </Field>
          </div>
        );

      case "send-notification":
        return (
          <div className="space-y-3">
            <Field label="Channel">
              <select
                className={selectCls}
                value={coreConfig.channel || "email"}
                onChange={(e) =>
                  setCoreConfig((prev) => ({
                    ...prev,
                    channel: e.target.value,
                  }))
                }
              >
                <option value="email">Email</option>
                <option value="slack">Slack</option>
                <option value="discord">Discord</option>
              </select>
            </Field>

            <Field label="Message">
              <textarea
                value={coreConfig.message || ""}
                onChange={(e) =>
                  setCoreConfig((prev) => ({
                    ...prev,
                    message: e.target.value,
                  }))
                }
                className={`${inputCls} h-24`}
              />
            </Field>
          </div>
        );

      case "delay":
        return (
          <Field label="Delay Duration">
            <div className="flex space-x-2">
              <input
                type="number"
                min={1}
                value={coreConfig.duration || ""}
                onChange={(e) =>
                  setCoreConfig((prev) => ({
                    ...prev,
                    duration: e.target.value,
                  }))
                }
                className={`${inputCls} flex-1`}
              />
              <select
                className={selectCls}
                value={coreConfig.unit || "seconds"}
                onChange={(e) =>
                  setCoreConfig((prev) => ({
                    ...prev,
                    unit: e.target.value,
                  }))
                }
              >
                <option value="milliseconds">ms</option>
                <option value="seconds">Seconds</option>
                <option value="minutes">Minutes</option>
              </select>
            </div>
          </Field>
        );

      default:
        return (
          <div className="p-3 bg-blue-900/20 border border-blue-800 rounded-md">
            <p className="text-sm text-blue-400">
              This node is ready to use. No configuration required.
            </p>
          </div>
        );
    }
  };

  const saveDisabled =
    (isApiKey && !selectedConnection && !apiKey.trim()) ||
    (platformName === "http-request" && !coreConfig.url) ||
    (platformName === "schedule-trigger" &&
      ((coreConfig.scheduleType === "interval" && !coreConfig.interval) ||
        (coreConfig.scheduleType === "cron" && !coreConfig.cronExpression)));

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
      <div className="bg-[#1E293B] rounded-lg p-6 w-full max-w-lg mx-4 border border-gray-700 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-md bg-[#0B0F14] flex items-center justify-center mr-3">
              <IconComponent className="w-4 h-4 text-green-400" />
            </div>
            <h2 className="text-lg font-semibold text-white">
              {nodeData.label}
            </h2>
          </div>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-gray-400 hover:text-white" />
          </button>
        </div>

        <div className="space-y-4">{isCore && renderCoreConfiguration()}</div>

        <div className="mt-6 flex justify-end gap-2">
          <Button
            variant="outline"
            className="border-[#334155] text-gray-300"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!!saveDisabled}
            className="bg-green-500 hover:bg-green-600 text-black font-medium"
          >
            Save Configuration
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NodeConfigurationModel;
