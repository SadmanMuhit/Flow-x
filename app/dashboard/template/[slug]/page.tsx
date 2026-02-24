'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';

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
import {
  buildInitialFlow,
  EDGE_STYLE,
  reindexStepNumbers,
  TOOL_NODES,
} from '@/components/dashboard/workflows/flow-utils';
import { nodeTypes } from '@/components/dashboard/workflows/custom-node';

import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

import { Play, Save } from 'lucide-react';
import NodeConfigurationModel from '@/components/dashboard/workflows/node-configuration-model';

const Page = () => {
  const { slug } = useParams<{ slug: string }>();

  /* ================= STATE ================= */
  const [nodes, setNodes, onNodesChange] = useNodesState<Node[]>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [template, setTemplate] = useState<any>(null);

  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  // node.id => configured
  const [configuredSteps, setConfiguredSteps] = useState<Record<string, boolean>>(
    {}
  );

  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalNode, setModalNode] = useState<Node | null>(null);

  /* ================= HANDLERS ================= */

  const onDragStart = (event: React.DragEvent, nodeType: any) => {
    event.dataTransfer.setData(
      'application/reactflow',
      JSON.stringify(nodeType)
    );
    event.dataTransfer.effectAllowed = 'move';
  };

  const onDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      if (!reactFlowWrapper.current || !rfInstance) return;

      const bounds = reactFlowWrapper.current.getBoundingClientRect();
      const nodeMeta = JSON.parse(
        event.dataTransfer.getData('application/reactflow')
      );

      const position = rfInstance.screenToFlowPosition({
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      });

      const id = `${nodeMeta.id}-${Date.now()}`;

      const newNode: Node = {
        id,
        type: 'custom',
        position,
        data: {
          label: nodeMeta.name,
          description: nodeMeta.description,
          icon: nodeMeta.icon,
          stepNumber: nodes.length + 1,
        },
      };

      setNodes((nds) => reindexStepNumbers([...nds, newNode], edges));

      if (selectedNode) {
        setEdges((eds) =>
          addEdge(
            {
              id: `e-${selectedNode.id}-${id}`,
              source: selectedNode.id,
              target: id,
              animated: true,
              style: EDGE_STYLE,
            },
            eds
          )
        );
      }
    },
    [rfInstance, nodes.length, edges, selectedNode]
  );

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) =>
        addEdge({ ...params, animated: true, style: EDGE_STYLE }, eds)
      );
    },
    []
  );

  const onNodeDoubleClick = (_: any, node: Node) => {
    setModalNode(node);
    setIsModalOpen(true);
  };

  const handleSaveWorkflow = async () => {
    const unconfigured = nodes.filter((n) => !configuredSteps[n.id]);
    if (unconfigured.length > 0) {
      alert('Please configure all steps before saving.');
      return;
    }

    const payload = {
      templateId: slug,
      nodes,
      edges,
      configuredSteps,
    };

    console.log('SAVE PAYLOAD', payload);
    // 🔗 API call here
  };

  const handleTestWorkflow = async () => {
    console.log('TEST WORKFLOW');
    // 🔗 test execution logic here
  };

  /* ================= EFFECT ================= */

  useEffect(() => {
    const found = mockTemplate.find((t) => t.id === slug);
    if (!found) return;

    setTemplate(found);

    const { nodes, edges } = buildInitialFlow(found, {});
    setNodes(reindexStepNumbers(nodes, edges));
    setEdges(edges);
  }, [slug, setNodes, setEdges]);

  /* ================= UI ================= */

  return (
    <div className="flex h-screen bg-[#0B0F14]">
      {/* CANVAS */}
      <div className="flex-1 p-6 flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Edit Template: {template?.name}
            </h1>
            <p className="text-gray-400">
              {template?.description || 'Build your automation workflow'}
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleTestWorkflow}
              className="border-[#334155] text-gray-300"
            >
              <Play className="w-4 h-4 mr-2" />
              Test
            </Button>

            <Button
              onClick={handleSaveWorkflow}
              className="bg-green-500 hover:bg-green-600 text-black"
            >
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
          </div>
        </div>

        <Card className="bg-[#121826] border-[#1E293B] flex-1">
          <CardContent className="p-0 h-full">
            <div ref={reactFlowWrapper} className="w-full h-full">
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onInit={setRfInstance}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onNodeClick={(_, node) => setSelectedNode(node)}
                onNodeDoubleClick={onNodeDoubleClick}
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

          <TabsContent value="nodes" className="space-y-4">
            {TOOL_NODES.map((cat) => (
              <div key={cat.id}>
                <h3 className="text-sm text-gray-400 uppercase mb-2">
                  {cat.category}
                </h3>

                {cat.items.map((n) => (
                  <div
                    key={n.id}
                    draggable
                    onDragStart={(e) => onDragStart(e, n)}
                    className="flex items-center p-2 rounded-md hover:bg-[#1E293B] cursor-grab"
                  >
                    <div className="w-8 h-8 bg-[#1E293B] rounded flex items-center justify-center mr-3">
                      <n.icon className="w-4 h-4 text-green-400" />
                    </div>
                    <div>
                      <p className="text-white text-sm">{n.name}</p>
                      <p className="text-gray-400 text-xs">{n.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </TabsContent>

          <TabsContent value="properties">
            {selectedNode ? (
              <div className="space-y-3">
                <h3 className="text-lg font-medium text-white">
                  Node Properties
                </h3>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="text-gray-400">Name</div>
                    <div className="text-white">
                      {selectedNode.data.label}
                    </div>
                  </div>

                  <div>
                    <div className="text-gray-400">Step</div>
                    <div className="text-white">
                      {selectedNode.data.stepNumber}
                    </div>
                  </div>

                  <div>
                    <div className="text-gray-400">Configured</div>
                    <div className="text-white">
                      {configuredSteps[selectedNode.id] ? 'Yes' : 'No'}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-400 text-center mt-10">
                Select a node to view details
              </p>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* CONFIG MODAL */}
      <NodeConfigurationModel
        isOpen={isModalOpen}
        nodeData={modalNode?.data || null}
        onClose={() => setIsModalOpen(false)}
        onConfigured={(nodeId: string) =>
          setConfiguredSteps((p) => ({ ...p, [nodeId]: true }))
        }
      />
    </div>
  );
};

export default Page;