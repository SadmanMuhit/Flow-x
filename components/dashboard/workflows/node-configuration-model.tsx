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
  return (
    <div>
      
    </div>
  )
}

export default NodeConfigurationModel
