import React, { useState } from 'react'
import { ICON_MAP } from './flow-utils';
import { ArrowRight, Settings, X } from 'lucide-react';
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
    const isOAuth = isAuthProvider(platformName);
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
                                ): (
                                    <Field label="Interval (minutes)">
                                        <input type="number" min={1} value={coreConfig.interval || ""}
                                        onChange={(e) => setCoreConfig({ ...coreConfig, interval: e.target.value})}
                                        placeholder='5' className={inputCls}/>
                                    </Field>
                                )
                            }
                        </div>
                    );
                    case "http-request":
                        return(
                            <div className='space-y-3'>
                                <Field label="HTTP Method">
                                    <select className={selectCls} 
                                    value={coreConfig.method || "GET"}
                                    onChange={(e) => setCoreConfig({...coreConfig, method:e.target.value})}>
                                        <option value="GET">GET</option>
                                        <option value="POST">POST</option>
                                        <option value="PUT">PUT</option>
                                        <option value="DELETE">DELETE</option>
                                        <option value="PATCH">PATCH</option>
                                    </select>
                                </Field>
                                <Field label='url'><input type="url" value={coreConfig.url || ""} onChange={(e)=> setCoreConfig({...coreConfig, url: e.target.value})
                            } placeholder='https://api.example.com/endpoint' className={inputCls}/></Field>
                            </div>
                        );
                        case "send-notification":
                            return (
                                <div className='space-y-3'>
                                    <Field label="Notification Channel">
                                        <select className={selectCls} value={coreConfig.channel || "email"} onChange={(e)=> setCoreConfig({...coreConfig, channel: e.target.value})}>
                                            <option value="email">Email</option>
                                            <option value="slack">Slack</option>
                                            <option value="discord">Discord</option>
                                        </select>
                                    </Field>
                                    <Field label="Message Template">
                                        <textarea value={coreConfig.message || ""}
                                        onChange={(e)=> setCoreConfig({...coreConfig, message:e.target.value})}
                                        placeholder='Your notification message...' className={`${inputCls} h-20`}/>
                                    </Field>
                                </div>
                            );
                            case "ai-generate":
                                return(
                                    <div className='space-y-3'>
                                        <Field label="AI provider">
                                            <select
                                            className={selectCls}
                                            value={coreConfig.provider || "openai"}
                                            onChange={(e)=> setCoreConfig({...coreConfig, provider: e.target.value})}
                                            >
                                                <option value="openai">OpenAI</option>
                                                <option value="Cloud">Cloud</option>
                                                <option value="gemini">Gemini</option>
                                            </select>
                                        </Field>
                                        <Field label="promt Template">
                                            <textarea value={coreConfig.prompt || ""}
                                            onChange={(e)=> setCoreConfig({...coreConfig,prompt:e.target.value})}
                                            placeholder='Your AI prompt template'
                                            className={`${inputCls} h-20`}/>
                                        </Field>
                                    </div>
                                );
                                case "delay": 
                                return(
                                    <div className='space-y-3'>
                                        <Field label="Delay Duration">
                                            <div className='flex space-x-2'>
                                                <input type="number" min={1} value={coreConfig.duration || ""}
                                                onChange={(e)=> setCoreConfig({...coreConfig, duration: e.target.value})
                                                } placeholder='5' className={`${inputCls} flex-1`}/>
                                                <select className={selectCls}
                                                value={coreConfig.unit || "seconds"} onChange={(e)=> setCoreConfig({...coreConfig, unit: e.target.value})
                                                }>
                                                    <option value="milliseconds">ms</option>
                                                    <option value="seconds">seconds</option>
                                                    <option value="minutes">minutes</option>
                                                </select>
                                            </div>
                                        </Field>
                                    </div>
                                );  
            default:
                return(
                    <div className='p-3 bg-blue-900/20 border border-blue-800 rounded-md'>
                        <p className='text-sm text-blue-400'>this {displayName} node is ready to use. No additional configuration required.</p>
                    </div>
                );
        }
    };
    const saveDisabled = (isApiKey && !selectedConnection && !apiKey.trim()) || (platformName === "http-request" && !coreConfig.url);
  return (
    <div className='fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50'>
      <div className='bg-[#1E293B] rounded-lg p-6 w-full max-w-lg mx-4 border border-gray-700 max-h-[90vh] overflow-y-auto'>
        <div className='flex items-center justify-between mb-4'>
            <div className='flex items-center'>
                <div className='w-8 h-8 rounded-md bg-[#0B0F14] flex items-center justify-center mr-3'>
                    <IconComponent className='w-4 h-4 text-green-400'/>
                </div>
                <h2 className='text-lg font-semibold text-white'>{nodeData.label}</h2>
            </div>
            <button onClick={onClose} className='text-gray-400 hover:text-white transition-colors'>
                <X className='w-5 h-5'/>
            </button>
        </div>
        <div className='space-y-4'>
            {loading ? (
                <div className='flex items-center justify-center py-8'>
                    <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-green-400'>

                    </div>
                </div>
            ):(<>{
                isOAuth && (
                    <div className='space-y-3'>
                        <h3 className='text-sm font-medium text-gray-300 flex items-center'>
                            <Settings className='w-4 h-4 mr-2'/>
                            connected {displayName} accounts
                        </h3>
                        <div className='space-y-2'>
                            {connections?.length > 0 ? (
                                connections.map((connection)=> (
                                    <div key={connection.id} className={`p-3 rounded-md border cursor-pointer transition-colors ${selectedConnection === connection.id ? 'border-green-400 bg-green-900/20' : 'border-gray-700 bg-[#0B0F14]'}`} onClick={()=> setSelectedConnection(connection.id)}>
                                        <div className="flex items-center justify-between">
                            
                                        </div>
                                    </div>
                                ))
                            ): (<></>)}
                        </div>
                    </div>
                )
            }
            </>)}
        </div>
      </div>
    </div>
  )
}

export default NodeConfigurationModel
