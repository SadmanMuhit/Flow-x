'use client';
import { useUser } from '@/hooks/useUser';
import { useParams } from 'next/navigation';
import React, {useCallback, useEffect, useRef, useState } from 'react'
import {ReactFlow,Background,Controls,addEdge,Node,connection, useNodesState,useEdgesState} from "reactflow";
import "reactflow/dist/style.css";
import { mockTemplate } from '@/lib/mock';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { buildInitailFlow, EDGE_STYLE, reindexStepNumbers } from '@/components/dashboard/workflows/flow-utils';
import { Connection } from '@neondatabase/serverless';
import { nodeTypes } from '@/components/dashboard/workflows/custom-node';
import { Upload } from 'lucide-react';

const Page = () => {
    const params = useParams();
    const slug = params.slug as string;
    const {user} = useUser();

    const [selectedNode, setSelectedNode] = useState<Node | null>(null);
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useNodesState([]);

    const [template, setTemplate] = useState<any>(null);
    const [isModelOpen, setIsModelOpen] = useState(false);
    const [modelNodeData, setModelNodeData] = useState<any>(null);
    const [ReactFlowInstance, setReactFlowInstance] = useState<any>(null);
    const [nodeErrors, setNodeErrors] = useState<Record<string,string | null >>(
        {}
    );

    const [configuredSteps, setConfiguredSteps] = useState<Record<number,boolean>>({});
    const [userConnections, setUserConnections] = useState<any[]>([]);
    const [connLoading, setConnLoading] = useState(false);

    const ReactFlowWrapper = useRef<HTMLDivElement>(null);
    
    const handleNodeChange = useCallback((changes:any) =>{
        onNodesChange(changes);
        setNodes((nds) =>reindexStepNumbers(nds, edges));
    },[onNodesChange, setNodes, edges]);

    const onDragStart = useCallback((event: React.DragEvent, nodeType: any) =>{
        event.dataTransfer.setData(
            "application/reactflow",
            JSON.stringify(nodeType)
        );
        event.dataTransfer.effectAllowed = "move";
    }, []);

    const onDrop = useCallback(
        (event: React.DragEvent) => {
            event.preventDefault();
            if(!ReactFlowWrapper.current || !ReactFlowInstance) return;

            const bounds = ReactFlowWrapper.current.getBoundingClientRect();
            const nodeData = JSON.parse(
                event.dataTransfer.getData("application/reactflow")
            );
            const position = ReactFlowInstance.project({
                x: event.clientX - bounds.left,
                y: event.clientY - bounds.top,
            });
            const newId = `${nodeData.id}-${Date.now()}`;

            setNodes((nds)=> {
                const selectedStep = (selectedNode?.data as any)?.stepNumber ?? null;
                const currentStepCount = nds.reduce(
                    (count, n) =>
                        typeof (n.data as any)?.stepNumber == "number" ? count + 1 : count, 0
                );
                const insertionStep = selectedStep !== null ? selectedStep + 1 : currentStepCount + 1;
                const shifted = nds.map((n)=>{
                    const sn = (n.data as any)?.stepNumber;
                    return typeof sn == "number" && sn > insertionStep ? {...n, data: {...n.data, stepNumber: sn + 1}}: n;
                });
                const newNode = {
                    id: newId,
                    type: "custom",
                    position,
                    data: {
                        label: nodeData.name,
                        description: nodeData.description,
                        icon: nodeData.icon,
                        stepNumber: insertionStep,
                        isConfigured: false,
                        config: null,
                    },
                };
                return reindexStepNumbers(shifted.concat(newNode),edges);
            });
            if(selectedNode){
                setEdges((eds) => {
                    const newEdges = linkEdges(selectedNode.id, newId, eds);
                    setNodes((nds) => reindexStepNumbers(nds,newEdges));
                    return newEdges;
                })
            }
        },
        [ReactFlowInstance, selectedNode, edges, setEdges, setNodes]
    );
       const onConnect = useCallback(
        (params: Connection) => {
            const edgeId = `edge-${params.source}-${params.target}-${Date.now()}`;
            setEdges((eds) =>
            addEdge({...params, id: edgeId, animated: true, style: EDGE_STYLE},
                eds
            )
            );
        },
        [setEdges]
       );

       const onDragOver = useCallback((event: React.DragEvent)=> {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
       },[]);

       const onNodeClick = useCallback((event: React.MouseEvent, node: Node) =>{
        setSelectedNode(node);
       },[]);

       const openModel = useCallback((nodeData: any) =>
    {
        setModelNodeData(nodeData);
        setIsModelOpen(true);
    },
    []
    );

    const closeModel = useCallback(() =>{
        setIsModelOpen(false);
        setModelNodeData(null);
    },[])

       const onNodeDoubleClick = useCallback(
        (event: React.MouseEvent, node: Node) => {
            openModel(node.data);
        },
        [openModel]
       );

       useEffect(() =>{
        if(selectedNode){
            const updated = nodes.find((n) => n.id == selectedNode.id);
            if(
                updated && Boolean((updated.data as any)?.isConfigured) !==
                Boolean((selectedNode.data as any)?.isConfigured)
            ){
                selectedNode(updated);
            }
        }
       },[nodes, selectedNode]);
    useEffect(() =>{
     const foundTemplate = mockTemplate.find((t) => t.id == slug);
     if(!foundTemplate) return;
     setTemplate(foundTemplate);

     const {nodes: initialNodes,edges: initialEdges} = buildInitailFlow(foundTemplate,configuredSteps);
     setNodes(reindexStepNumbers(initialNodes, initialEdges));
     setEdges(initialEdges);
    },[slug,setNodes, setEdges]);
  return (
    <div className='flex h-full'>
      <div className='flex-1 p-6 flex flex-col h-full'>
        <div className='flex items-center justify-between mb-6'>
            <div>
                <h1 className='text-3xl font-bold text-white'>Edit Template: {template?.name || slug}</h1>
                <p className='text-gray-400'>{template?.description || "Design your workflow by connection nodes"}</p>
            </div>
            <div className='flex items-center gap-3'></div>
        </div>
                <Card className='bg-[#121826] border-[#1E293B] flex-1 relative'>
                    <CardContent className='p-0 h-full'>
                        <div ref={ReactFlowWrapper} className='w-full h-full'>
                            <ReactFlow
                            nodes={nodes} 
                            edges={edges} 
                            onNodesChange={handleNodeChange} 
                            onEdgesChange={onEdgesChange} 
                            onConnect={onConnect} 
                            onInit={setReactFlowInstance} 
                            onDrop={onDrop} 
                            onDragOver={onDragOver}
                            onNodeClick={onNodeClick}
                            onNodeDoubleClick={onNodeDoubleClick}
                            nodeTypes={nodeTypes}
                            fitView
                            attributionPositon= "bottom-right"
                            className="bg-[#0B0F14]"
                            >
                                <Background color='#334155' gap={16}/>
                                <Controls className='bg-[#1E293B] border-[#334155] text-gray-300'/>
                            </ReactFlow>
                        </div>
                    </CardContent>
                </Card>
      </div>
      <div className='w-80 border-l border-[#1e293b] p-4 overflow-y-auto'>

      </div>

    </div>
  );
};

export default Page
