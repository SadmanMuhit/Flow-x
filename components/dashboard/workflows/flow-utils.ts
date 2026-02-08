import {
  ArrowRight,
  Bell,
  Brain,
  Clock,
  Code,
  CreditCard,
  Database,
  FileText,
  Filter,
  Hash,
  Mail,
  MessageSquare,
  RotateCcw,
  Timer,
  Webhook,
  Zap,
} from "lucide-react";
import { Edge, Node } from "reactflow";

export interface Position {
  x: number;
  y: number;
}

export const ICON_MAP: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  Webhook,
  Mail,
  Database,
  Code,
  MessageSquare,
  FileText,
  Brain,
  Zap,
  Filter,
  ArrowRight,
  CreditCard,
  Clock,
  Hash,
  Bell,
  Timer,
  RotateCcw,
};

export const EDGE_STYLE = {
  stroke: "#10b981",
  strokeWidth: 2,
  strokeDasharray: "5,5",
};
export const TOOL_NODES = [
  {
    id: "integrations",
    category: "integrations",
    items: [
      {id: "gmail", name: "Gmail", icon: Mail, description: "trigger: new email * action: send email"},
      {id: "slack", name: "Slack", icon: Hash, description: "action: send email"},
      {id: "discord", name: "Discord", icon: MessageSquare, description: "action: send message"},
      {id: "notion", name: "Notion", icon: FileText, description: "action: create/update page"},
      {id: "sheets", name: "Google Sheets", icon: Database, description: "action: append row"},
      {id: "strip", name: "Strip", icon: CreditCard, description: "action: payment succeeded"},
      {id: "webhook-custom", name: "Webhook (Custom App)", icon: Webhook, description: "action: call HTTP"},
      {id: "openai", name: "OpenAI", icon: Brain, description: "action: generate text"},
      {id: "cloude", name: "Cloude", icon: Brain, description: "action: generate text"},
      {id: "gemini", name: "Gemini", icon: Brain, description: "action: generate text"},
    ]
  },
  {
    id: "triggers",
    category: "Triggers (Core)",
    items:[
      {id: "webhook-trigger", name: "webhook Trigger", icon: Webhook, description: "start on incoming HTTP request"},
      {id: "schedule-trigger", name: "Schedule Trigger", icon: Clock, description: "cron/interval"},
    ],
  },
  {
    id: "actions",
    category: "Actions (Core)",
    items:[
      {id: "http-request", name: "HTTP Request", icon: Code, description: "generic REST call (GET/POST)"},
      {id: "send-notification", name: "Send Notification", icon: Bell, description: "choose Slack/Discord/Email internally"},
    ],
  },
]
export const getIconForStep = (stepName: string): string => {
  const iconKeys = Object.keys(ICON_MAP);
  const foundKey = iconKeys.find((key) =>
    stepName.toLowerCase().includes(key.toLowerCase())
  );
  return foundKey || "ArrowRight";
};

export const getNodePosition = (index: number): Position => {
  const positions: Position[] = [
    { x: 150, y: 280 },
    { x: 400, y: 180 },
    { x: 650, y: 180 },
    { x: 900, y: 180 },
  ];
  return positions[index] || { x: 150 + index * 250, y: 280 };
};

export function reindexStepNumbers(nds: Node[], eds: Edge[]): Node[] {
  const isStep = (n: Node) =>
    typeof (n.data as any)?.stepNumber === "number";

  const stepNodes = nds.filter(isStep);
  const idSet = new Set(stepNodes.map((n) => n.id));

  const incomingCount = new Map<string, number>();
  const outgoingMap = new Map<string, string[]>();

  idSet.forEach((id) => incomingCount.set(id, 0));

  eds.forEach((e) => {
    if (idSet.has(e.target)) {
      incomingCount.set(e.target, (incomingCount.get(e.target) || 0) + 1);
    }
    if (idSet.has(e.source) && idSet.has(e.target)) {
      const arr = outgoingMap.get(e.source) || [];
      arr.push(e.target);
      outgoingMap.set(e.source, arr);
    }
  });

  const startId =
    [...idSet].find((id) => (incomingCount.get(id) || 0) === 0) ||
    stepNodes.sort((a, b) => a.position.x - b.position.x)[0]?.id;

  const chain: string[] = [];
  let cursor: string | undefined = startId;
  const visited = new Set<string>();

  while (cursor && !visited.has(cursor)) {
    visited.add(cursor);
    chain.push(cursor);

    const nextCandidates: string[] = outgoingMap.get(cursor) || [];
    if (!nextCandidates.length) break;

    cursor = nextCandidates
      .map((id) => nds.find((n) => n.id === id)!)
      .sort((a, b) => a.position.x - b.position.x)[0]?.id;
  }

  const remaining = [...idSet].filter((id) => !chain.includes(id));
  const remainingOrdered = remaining
    .map((id) => nds.find((n) => n.id === id)!)
    .sort((a, b) =>
      a.position.x === b.position.x
        ? a.position.y - b.position.y
        : a.position.x - b.position.x
    )
    .map((n) => n.id);

  const finalOrder = [...chain, ...remainingOrdered];
  const idToStep = new Map<string, number>();
  finalOrder.forEach((id, idx) => idToStep.set(id, idx + 1));

  return nds.map((n) => {
    const newStep = idToStep.get(n.id);
    return isStep(n) && newStep
      ? { ...n, data: { ...n.data, stepNumber: newStep } }
      : n;
  });
}

export function buildInitialFlow(
  foundTemplate: any,
  configuredSteps: Record<number, boolean>
) {
  let nodes: Node[] = foundTemplate.steps.map(
    (step: string, index: number) => ({
      id: `step-${index}`,
      type: "custom",
      position: getNodePosition(index),
      data: {
        label: step,
        description: `Step ${index + 1}`,
        icon: getIconForStep(step),
        isStartNode: index === 0,
        stepNumber: index + 1,
        isConfigured: !!configuredSteps[index + 1],
      },
    })
  );

  let edges: Edge[] = foundTemplate.steps.slice(1).map((_: unknown, index: number) => ({
    id: `edge-${index}-${index + 1}`,
    source: `step-${index}`,
    target: `step-${index + 1}`,
    sourceHandle: "right",
    targetHandle: "left",
    animated: true,
    style: EDGE_STYLE,
  }));

  return { nodes, edges };
}