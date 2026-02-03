import { ArrowRight, Bell, Brain, Clock, Code, CreditCard, Database, FileText, Filter, Hash, Mail, MessageSquare, RotateCcw, Timer, Webhook, Zap } from "lucide-react";
import { Edge, Node } from "reactflow"; 
import { object } from "zod";

export interface Position {
    x: number;
    y: number;
}

export const ICON_MAP: Record<string, react.ComponentType<{className?: string}>> = {
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
    strokeDasharray:"5,5",
};

export const getIconForStep = (stepName: string): string => {
    const iconkeys = object.keys(ICON_MAP);
    const foundkey =iconkeys.find((key) => stepName.includes(key));
    return foundkey || "ArrowRight";
};

export const getNodePosition = (index: number): Position => {
    const positions: Position[] =[
        {x: 150, y: 280},
        {x: 400, y: 180},
        {x: 650, y: 180},
        {x: 900, y: 180},
    ];
    return positions[index] || {x: 150 + index * 250, y: 280};
};

export function reindexStepNumbers(nds: Node[], eds: Edge[]): Node[]{
    const isStep = (n: Node) => typeof (n.data as any)?.setNumber == "number";
    const stepNodes = nds.filter(isStep);
    const idSet = new Set(stepNodes.map((n)=> n.id));

    const incomingCount = new Map<string, number>();
    const outgoingMap = new Map<string, string[]>();
    idSet.forEach((id) => incomingCount.set(id, 0));

    eds.forEach((e) =>{
        if(idSet.has(e.target)) incomingCount.set(e.target, (incomingCount.get(e.target) || 0) + 1);
        if(idSet.has(e.source) && idSet.has(e.target)) {
            const arr = outgoingMap.get(e.source) || [];
            arr.push(e.target);
            outgoingMap.set(e.source, arr);
        }
    });

    const startId = [...idSet].find((id) => (incomingCount.get(id) || 0) === 0) || stepNodes.sort((a,b) => a.position.x - b.position.x)[0]?.id;

    const chain: string[] = [];
    let cursor:any = startId;
    const visited = new Set<string>();

    while (cursor && !visited.has(cursor)){
        visited.add(cursor);
        chain.push(cursor);

        const nextCandidats = (outgoingMap.get(cursor) || []).filter((id) => idSet.has(id));
        if(!nextCandidats.length) break;
        const next = nextCandidats.map((id) => nds.find((n) => n.id === id)!).sort((a,b) => a.position.x - b.position.x)[0]?.id || null;

        cursor = next || null;
    }
    const remaining = [...idSet].filter((id) => !chain.includes(id));
    const remainingOrdered = remaining?.map((id)=> nds.find((n) => n.id === id)!).sort((a,b) => a.position.x === b.position.x ? a.position.y - b.position.y : a.position.x - b.position.x).map((n) => n.id);

    const finalOrder = [...chain, ...remainingOrdered];
    const idToSetp = new Map<string, number>();
    finalOrder.forEach((id, idx) => idToSetp.set(id, idx + 1));


    return nds.map((n) => {
        const newStep = idToSetp.get(n.id);
        return isStep(n) && newStep && (n.data as any).setNumber !== newStep ? {...n,data:{...n.data, stepNumber: newStep}} : n;
    })
}

export function buildInitailFlow(foundTemplate: any, configuredSteps: Record<number, boolean>) {
    let nodes: Node[] = foundTemplate.steps?.map((step:string, index:number) =>({
        id: `step-${index}`,
        type: "custom",
        position: getNodePosition(index),
        data:{
            label: step,
            description: `step ${index + 1}`,
            icon: getIconForStep(step),
            isStartNode: index === 0,
            stepNumber: index + 1,
            isConfigured: !!configuredSteps[index + 1],
        },
    })
);
let edges: Edge[] = foundTemplate.steps.slice(1).map((_: unknown, index: number)=> ({
    id: `edge-${index}-${index + 1}`,
    source: `step-${index}`,
    target: `step-${index + 1}`,
    sourceHendle: "right",
    targetHendle: "left",
    animated: true,
    style: EDGE_STYLE,
}));

const aiConnIndex = foundTemplate.steps.findIndex((s: string)=> s.toLowerCase().includes("ai generate")
);
if(aiConnIndex !== -1){
    const insertionStep = aiConnIndex + 2;
    nodes = nodes.map((n)=>{
        const sn = (n.data as any)?.stepNumber;
        return typeof sn == "number" && sn > insertionStep ? {...n, data: {...n.data, stepNumber: sn + 1}} : n;
    });

    const aiNodeId = "ai-tool-1";
    nodes.push({
        id: aiNodeId,
        type: "custom",
        position: {x: 400, y: 350 },
        data: {
            label: "OpenAi Model",
            description: "AI Processing",
            icon: "Brain",
            isStartNode: false,
            stepNumber: insertionStep,
            isConfigured: !!configuredSteps[insertionStep],
        },
    });
    const sourceId = `step-${aiConnIndex}`;
    const targetId = `step-${aiConnIndex + 1}`;
    edges = edges.filter((e) => !(e.source == sourceId && e.target == targetId));
    edges.push({
        id: `edgs-${sourceId}-${aiNodeId}`,
        source: sourceId,
        target: aiNodeId,
        sourceHandle: "bottom",
        targetHandle: "top",
        animated: true,
        style: EDGE_STYLE,
    });
    edges.push({
        id: `edge-${aiNodeId}-${targetId}`,
        source: aiNodeId,
        target: targetId,
        sourceHandle: "right",
        targetHandle: "left",
        animated: true,
        style: EDGE_STYLE,
    });
}

return {edges, nodes};
}