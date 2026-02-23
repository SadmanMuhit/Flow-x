import React, { useState } from 'react'
import { ICON_MAP } from './flow-utils';
import { ArrowRight } from 'lucide-react';
interface NodeData{
    label: string;
    description: string;
    icon: string;
    isStartNode?: boolean;
    stepNumber: number;
}
interface Connection{
    id: string;
    platform: string;
    account_name: string;
    metadata: any;
    created_at: string;
    updated_at: string;
}
interface NodeConfigurationModelPorps{
    isOpen: boolean;
    onClose: ()=> void;
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
    "scheduele-trigger",
    "http-request",
    "send-notification",
    "ai-generate",
    "delay",
];

const getPlatformName = (label: string): string =>{
    const lower = label.toLowerCase();
    if(lower.includes("gmail")) return "gmail";
    if(lower.includes("slack")) return "slack";
    if(lower.includes("discord")) return "discord";
    if(lower.includes("notion")) return "notion";
    if(lower.includes("sheets")) return "sheets";
    if(lower.includes("stripe")) return "stripe";
    if(lower.includes("openai")) return "openai";
    if(lower.includes("claude")) return "claude";
    if(lower.includes("gemini")) return "gemini";
    if(lower.includes("weebhook trigger")) return "weebhook trigger";
    if(lower.includes("schedule")) return "schedule-trigger";
    if(lower.includes("http")) return "http-request";
    if(lower.includes("notification")) return "send-notification";  
    if(lower.includes("ai generate")) return "ai-generate";
    if(lower.includes("condition")) return "condition";
    if(lower.includes("loop")) return "loop";
    if(lower.includes("delay")) return "delay";
    return label.toLowerCase().replace(/\s+/g, "-");
};
   const inputCls = "w-full py-2 bg-[#0B0F14] border border-gray-600 rounded-md text-white placeholder-gray-500 focus:border-green-400 focus:outline-none";
    const selectCls = "w-full px-3 py-2 bg-[#0B0F14] border border-gray-600 rounded-md text-white focus:border-green-400 focus:outline-none"
    const Field = ({
        label,
        children,
    }: {
        label:string;
        children: React.ReactNode;
    }) => (
        <div>
            <label htmlFor="" className='block text-sm font-medium text-gray-300 mb-2'>{label}</label>
            {children}
        </div>
    );
    const isAuthProvider = (p: string) =>
        OAUTH_PROVIDERS.includes(p.toLowerCase());
    const isCoreProvider = (p: string) =>
        CORE_PROVIDERS.includes(p.toLowerCase());
    const isApiKeyProvider = (p: string) =>
        API_KEY_PROVIDERS.includes(p.toLowerCase());
const NodeConfigurationModel = ({
    isOpen,
    onClose,
    nodeData,
    onConfigured
}: NodeConfigurationModelPorps) => {
    const [connections, setConnections] = useState<Connection[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedConnection, setSelectedConnection] = useState<string | null>(
        null
    );
    const [apiKey, setApikey] = useState("");
    const [apiEndpoint, setApiEndpoint] = useState("");
    const [coreConfig, setCoreConfig] = useState<Record<string, any>>({});

    const getDisplayName = (platform: string): string => {
        const names: Record<string, string> = {
            stripe: "Stripe",
            gmail: "Gmail",
            slack: "Slack",
            discord: "Discord",
            notion: "Notion",
            sheets: "Google Sheets",
            openai: "OpenAI",
            gemini: "Gemini",
            claude: "Cloude",
            "weebhook-trigger" : "Webhook Trigger",
            "schedule-trigger" : "Schedule Trigger",
            "http-request" : "HTTP Request",
            "send-notification" : "Send Notification",
            "ai-generate" : "AI Generate",
            condition: "Condition",
            loop: "Loop",
            delay: "Delay",
        };
        return names[platform.toLowerCase()] || platform;
    };

    const IconComponent = (nodeData && ICON_MAP[nodeData.icon]) || ICON_MAP.ArrowRight || ArrowRight;
    const platformName = nodeData ? getPlatformName(nodeData.label) : "";
    const isOAuth = isOAuthProvider(platformName);
    const isApiKey = isApiKeyProvider(platformName);
    const isCore = isCoreProvider(platformName);
    const displayName = getDisplayName  (platformName);

    if(!isOpen || !nodeData) return null;

    const handleSave = async () => {

    }

    const handleOAuthConnection = (platform: string) => {

    }

    const renderCoreConfiguration = () => {
        switch (platformName) {
            case "webhook-trigger":
                return (
                    <div className='space-y-3'>
                        <Field label='Webhook URL'>
                            <div className='p-3 bg-[#0B0F14] border border-gray-600 rounded-md'>
                                <code className='text-sm text-green-400'>
                                </code>
                            </div>
                            <p className='text-xs text-gray-400 mt-1'>
                                This URL will bg used to trigger the workflow. You can send a POST request with JSON payload to this URL to start the workflow.
                            </p>
                        </Field>
                    </div>
                )
                case "schedule-trigger":
                    return (
                        <div className='space-y-3'>
                            <Field label='Schedule Type'>
                                <select className={selectCls} value={coreConfig.scheduleType || "interval"} onChange={(e) =>
                                    setCoreConfig({...coreConfig,scheduleType: e.target.value})
                                }>
                                <option value="interval">Interval</option>
                                <option value="cron">Cron Expression</option>
                                </select>
                            </Field>
                            {
                                coreConfig.scheduleType == "core" ? (
                                    <Field label='Core Expression'>
                                        <input type='text' value={coreConfig.cronExpresion || ""}
                                        onChange={(e) =>
                                            setCoreConfig({
                                                ...coreConfig,
                                                cronExpression: e.target.value,
                                            })
                                        }
                                        placeholder='0 */5 ****'
                                        className={inputCls}
                                        />
                                    </Field>
                                ): ()
                            }
                        </div>
                    );
                break;
        
            default:
                break;
        }
    }
  return (
    <div>
      
    </div>
  )
}

export default NodeConfigurationModel
