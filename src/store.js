import { applyNodeChanges, applyEdgeChanges } from "reactflow";
import {nanoid} from "nanoid";
import {create} from "zustand";

export const useStore = create((set, get) => ({
    nodes: [
        // { id: 'a', data: { label: 'oscillator' }, position: { x: 0, y: 0 } },
        // { id: 'b', data: { label: 'gain' }, position: { x: 50, y: 50 } },
        // { id: 'c', data: { label: 'output' }, position: { x: -50, y: 100 } }
      ],
    edges: [],

    onNodesChange: (changes) => {
        set({
            nodes: applyNodeChanges(changes, get().nodes)
        })
    },

    onEdgesChange: (changes) => {
        // console.log("Hello from onEdgesChange", get().edges)
        set({
            edges: applyEdgeChanges(changes, get().edges)
        })
    },

    addNode: (data) => {
        const id = nanoid(6);
        const node = {id, ...data}
        set({
            nodes: [node, ...get().nodes]
        })
    },
    
    addEdge: (data) => {
        console.log("Hello from addEdge")
        const id = nanoid(6);
        const edge = {id, ...data}
        set({
            edges: [edge, ...get().edges]
        })
    },

    updateTextNode: (id, messageContent) => {
        const newNodes = get().nodes.map(node => {
            if(node.id === id) {
                node.data.label = messageContent;
            }
            return node
        });

        set({
            nodes: newNodes
        })
        console.log(get())
    }
}));