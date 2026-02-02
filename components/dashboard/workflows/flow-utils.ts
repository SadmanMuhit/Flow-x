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
    finalOrder.forEach((id, idx) => idToSetp.set)
}