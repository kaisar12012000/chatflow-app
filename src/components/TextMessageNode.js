import React, {useCallback, useContext, useState} from 'react'
import { Handle, Position } from "reactflow";
import "./styles/textMessageNode.css";
import { Message } from '@mui/icons-material';
import { useStore } from '../store.js';
import { shallow } from 'zustand/shallow';
import { MessageNodeContext } from '../context/messageNodeContext.js';

const selector = store => ({
    nodes: store.nodes,
    edges: store.edges,
    onNodesChange: store.onNodesChange,
    onEdgesChange: store.onEdgesChange,
    addEdge: store.addEdge,
    addNode: store.addNode
})

export default function TextMessageNode(props) {
    const {id, data} = props
    
    const store = useStore(selector, shallow)

    // const [isSelected, setIsSelected] = useState(false)
    const { selectedNode, setSelectedNode, setShowSettingsPanel } = useContext(MessageNodeContext)

    return (
        <div>
            <Handle type='target' position={Position.Left} />
            <div className={selectedNode===id ? 'main selected' : 'main'} onClick={() => {
                setSelectedNode(id)
                setShowSettingsPanel(true)
            }}>
                <div className='header'>
                    <h3>
                        Send message
                    </h3>
                    <Message />
                </div>
                <div className='message'>
                    {data?.label}
                </div>
            </div>
            <Handle type='source' isValidConnection={(connection) => store.edges.find(edge => edge?.source === id) === undefined} position={Position.Right} />
        </div>
    )
}
