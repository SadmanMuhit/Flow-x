'use client';

import { useUser } from '@/hooks/useUser';
import { useParams } from 'next/navigation';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import ReactFlow, {
  Background,
  Controls,
  addEdge,
  Node,
  Connection,
  useNodesState,
  useEdgesState,
  ReactFlowInstance,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { mockTemplate } from '@/lib/mock';
import { Card, CardContent } from '@/components/ui/card';
import {
  buildInitialFlow,
  EDGE_STYLE,
  reindexStepNumbers,
  TOOL_NODES,
} from '@/components/dashboard/workflows/flow-utils';
import { nodeTypes } from '@/components/dashboard/workflows/custom-node';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Page = () => {
  const params = useParams();
  const slug = params.slug as string;
  const { user } = useUser();

  /* ================= STATES ================= */
  const [nodes, setNodes, onNodesChange] = useNodesState<Node[]>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [template, setTemplate] = useState<any>(null);

  const [configuredSteps, setConfiguredSteps] = useState<Record<number, boolean>>(
    {}
  );
  const [userConnections, setUserConnections] = useState<any[]>([]);
  const [connLoading, setConnLoading] = useState(false);

  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  /* ================= HANDLERS ================= */

  const onNodesChangeControlled = useCallback(
    (changes: any) => {
      onNodesChange(changes);
    },
    [onNodesChange]
  );

  const onDragStart = (event: React.DragEvent, nodeType: any) => {
    event.dataTransfer.setData(
      'application/reactflow',
      JSON.stringify(nodeType)
    );
    event.dataTransfer.effectAllowed = 'move';
  };

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      if (!reactFlowWrapper.current || !rfInstance) return;

      const bounds = reactFlowWrapper.current.getBoundingClientRect();
      const nodeData = JSON.parse(
        event.dataTransfer.getData('application/reactflow')
      );

      const position = rfInstance.screenToFlowPosition({
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      });

      const newNodeId = `${nodeData.id}-${Date.now()}`;

      const newNode: Node = {
        id: newNodeId,
        type: 'custom',
        position,
        data: {
          label: nodeData.name,
          description: nodeData.description,
          icon: nodeData.icon,
          stepNumber: nodes.length + 1,
          isConfigured: false,
          config: null,
        },
      };

      setNodes((nds) => reindexStepNumbers([...nds, newNode], edges));

      if (selectedNode) {
        setEdges((eds) =>
          addEdge(
            {
              id: `e-${selectedNode.id}-${newNodeId}`,
              source: selectedNode.id,
              target: newNodeId,
              animated: true,
              style: EDGE_STYLE,
            },
            eds
          )
        );
      }
    },
    [rfInstance, selectedNode, nodes.length, edges]
  );

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) =>
        addEdge({ ...params, animated: true, style: EDGE_STYLE }, eds)
      );
    },
    [setEdges]
  );

  /* ================= EFFECTS ================= */

  useEffect(() => {
    const foundTemplate = mockTemplate.find((t) => t.id === slug);
    if (!foundTemplate) return;

    setTemplate(foundTemplate);

    const { nodes: initialNodes, edges: initialEdges } = buildInitialFlow(
      foundTemplate,
      {}
    );

    setNodes(reindexStepNumbers(initialNodes, initialEdges));
    setEdges(initialEdges);
  }, [slug, setNodes, setEdges]);

  /* ================= HELPERS ================= */

  const findProviderMeta = (label: string) => {
    const category = TOOL_NODES.find((cat) =>
      cat.items.some((i) => i.name === label)
    );
    const item = category?.items.find((i) => i.name === label);

    return {
      category: category?.category ?? 'custom',
      providerId: item?.id ?? null,
    };
  };

  const renderKVGrid = (pairs: Array<[string, React.ReactNode]>) => (
    <div className="grid grid-cols-2 gap-3 text-sm">
      {pairs.map(([k, v]) => (
        <div key={k}>
          <div className="text-gray-400">{k}</div>
          <div className="text-white font-medium">{v}</div>
        </div>
      ))}
    </div>
  );

  /* ================= UI ================= */

  return (
    <div className="flex h-screen bg-[#0B0F14]">
      {/* CANVAS */}
      <div className="flex-1 p-6 flex flex-col h-full">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-white">
            Edit: {template?.name || 'New Workflow'}
          </h1>
          <p className="text-gray-400">
            Drag items from the right to add to your flow.
          </p>
          <div className='flex items-center gap-3'>

          </div>
        </header>

        <Card className="bg-[#121826] border-[#1E293B] flex-1 overflow-hidden">
          <CardContent className="p-0 h-full">
            <div ref={reactFlowWrapper} className="w-full h-full">
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChangeControlled}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onInit={setRfInstance}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onNodeClick={(_, node) => setSelectedNode(node)}
                nodeTypes={nodeTypes}
                fitView
                className="bg-[#0B0F14]"
              >
                <Background color="#334155" gap={20} />
                <Controls />
              </ReactFlow>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SIDEBAR */}
      <div className="w-80 border-l border-[#1e293b] p-4 overflow-y-auto">
        <Tabs defaultValue="nodes">
          <TabsList className="w-full bg-[#0b0f14] mb-4">
            <TabsTrigger value="nodes" className="flex-1">
              Nodes
            </TabsTrigger>
            <TabsTrigger value="properties" className="flex-1">
              Properties
            </TabsTrigger>
          </TabsList>

          {/* NODES */}
          <TabsContent value="nodes" className="space-y-4">
            {TOOL_NODES.map((category) => (
              <div key={category.id}>
                <h3 className="text-sm text-gray-400 uppercase mb-2">
                  {category.category}
                </h3>

                {category.items.map((node) => (
                  <div
                    key={node.id}
                    draggable
                    onDragStart={(e) => onDragStart(e, node)}
                    className="flex items-center p-2 rounded-md hover:bg-[#1E293B] cursor-grab"
                  >
                    <div className="w-8 h-8 bg-[#1E293B] flex items-center justify-center mr-3 rounded">
                      <node.icon className="w-4 h-4 text-green-400" />
                    </div>
                    <div>
                      <p className="text-white text-sm">{node.name}</p>
                      <p className="text-gray-400 text-xs">
                        {node.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </TabsContent>

          {/* PROPERTIES */}
          <TabsContent value='properties'>
            {selectedNode ? (
              <div className='space-y-4'>
                <h3 className='text-lg font-medium text-white'>Node Properties</h3>
                <p>Details fot the selected node</p>
                {(() =>{
                  const d = selectedNode.data as any;
                  const label = d?.label ?? "";
                  const stepNumber = d?.stepNumber ?? null;
                  const {category:type, providerId} = findProviderMeta(label);

                  const isConfigured = typeof stepNumber == "number" ? !!configuredSteps[Number(stepNumber)]: false;
                  const accounts = providerId ? userConnections?.filter((c)=> c.platform == providerId) : [];

                  const info = [
                    ["Name", label || "-"],
                    ["Step", stepNumber ?? "-"],
                    ["Type", type],
                    ["Configured", isConfigured ? "Yes" : "No"],
                  ] as Array<[string, React.ReactNode]>;

                  const accountsContent = connLoading ? (
                    <div className='text-gray-500 text-sm'>Loading accounts...</div>
                  ): providerId ? (
                    accounts?.length > 0 ? (
                      <ul className='space-y-2'>
                        {accounts?.map((acc) =>(
                          <li key={acc.id} className='flex items-center justify-between bg-[#1E293B] rounded-md p-2 border border-[#334155]'>
                            <span className='text-sm text-gray-200'>{acc.account_name}</span>
                            <span className='text-xs text-gray-500'>{acc.platform}</span>
                          </li>
                        ))}
                      </ul>
                    ): (
                      <div className='text-gray-500 text-sm'>
                        No accounts connected for "{providerId}".
                      </div>
                    )
                  ): (
                    <div className='text-gray-500 text-sm'>this node doesn't require an external account</div>
                  )
                  return <div className='space-y-3'>
                  {renderKVGrid(info)}
                  <div className='pt-2'>
                    <div className='text-gray-400 mb-1'>
                      connected Accounts
                    </div>
                    {accountsContent  }
                  </div>
                  </div>; 
                })()}
              </div>
            ):(
              <div className='text-center py-8'>
                <p className='text-gray-400'>Select a node to view its properting</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      {/* Configuration Model (double click a node to open) */}
    </div>
  );
};

export default Page;