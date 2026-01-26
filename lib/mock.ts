export interface Template {
    id: string;
    name: string;
    description: string;
    icon: string;
    category: string;
    steps: string[];
}

export const mockTemplate: Template[] = [
    {
        id: "tpl_stripe_notion",
        name: "Stripe -> Notion CRM",
        description: "Automatically create customer record in Notion when Stripe payments are recived",
        icon: "CreditCard",
        category: "Integrations",
        steps: ["Stripe", "Notion", "Send Notification"],
    },
    {
        id: "tpl_form_sheets",
        name: "Webhook -> Sheets -> Slack",
        description: "Process form submissions and notify your team instantly",
        icon: "Webhook",
        category: "Integrations",
        steps: ["Webhook Triggre", "Google Sheets", "Slack"],
    },
    {
        id: "tpl_email_ai",
        name: "Gmail -> AI Summarize -> Discord",
        description: "AI-powerd email summaries sent to your Discord server",
        icon: "Mail",
        category: "AI Workflow",
        steps: ["Gmail", "AI Generate", "Discord"],
    },
    {
        id: "tpl_webhook_validate",
        name: "Webhook -> Validate -> HTTP -> Email",
        description: "Process incoming webhooks with validation and notifications",
        icon: "Webhook",
        category: "Core workflow",
        steps: ["Webhook Trigger", "Condition", "HTTP Request", "Send Notification"],
    },
    {
        id: "tpl_schedule_report",
        name: "Daily Report -> AI -> Slack",
        description: "Generate automated daily reports with AI insights",
        icon: "Clock",
        category: "Automation",
        steps: ["Schedule Trigger", "AI generate", "HTTP Request", "Slack"],
    },
];