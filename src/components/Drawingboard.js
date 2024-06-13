import React, { useContext, useEffect, useMemo, useState } from 'react'
import "./styles/drawingBoard.css";
import MessageIcon from '@mui/icons-material/Message';
import ReactFlow, { Background, MiniMap } from 'reactflow';
import {shallow} from "zustand/shallow";
import {useStore} from "../store";
import 'reactflow/dist/style.css';
import { nanoid } from 'nanoid';
import TextMessageNode from './TextMessageNode';
import { MessageNodeContext } from '../context/messageNodeContext';
import { ArrowLeft } from '@mui/icons-material';

// function SidePanel (props) {
//     const {setGrabbed} = props
//     return (
//         <div>
//             <div draggable onMouseDown={() => setGrabbed(true)} onMouseUp={() => {
//                     if (grabbed) {
//                         setGrabbed(false)
//                         store.addNode({
//                             position: {...clientCordinates},
//                             data: {
//                                 label: "Test message"
//                             } 
//                         }) 
//                         setClientCordinates({x:window.innerWidth*.7, y:50})
//                     }                            
//                 }} className='message-box'>
//                 <p>
//                     <MessageIcon />
//                 </p>
//                 <p>
//                     Message
//                 </p>
//             </div>
//         </div>
//     )
// }

const selector = (store) => ({
    nodes: store.nodes,
    edges: store.edges,
    onNodesChange: store.onNodesChange,
    onEdgesChange: store.onEdgesChange,
    addEdge: store.addEdge,
    addNode: store.addNode,
    updateTextNode: store.updateTextNode
});

export default function Drawingboard() {

    const nodeTypes = useMemo(() => ({textMessageNode: TextMessageNode}), [])

    const [grabbed, setGrabbed] = useState(false)
    const [textMsg, setTextMsg] = useState("")
    const [clientCordinates, setClientCordinates] = useState({
        x: 0, y: 0
    })
    const [saveError, setSaveError] = useState(false)

    const store = useStore(selector, shallow)

    const { selectedNode, setSelectedNode, showSettingsPanel, setShowSettingsPanel } = useContext(MessageNodeContext)
    
    const onTextChangeHandler = (e) => {
        const {key, keyCode} = e;
        // console.log(typeof e.target.value)
        if (key === "Enter" && keyCode===13) {
            store.updateTextNode(selectedNode, e.target.value)
            setSelectedNode("")
            setShowSettingsPanel(false)
            // console.log(selectedNode, e.target.value)
        } else {
            setTextMsg(e.target.value)
        }
    }

    const saveHandler = () => {
        console.log(store.nodes, store.edges)
        let count = 0;

        store.nodes.forEach((node) => {
            let found = false;
            store.edges.forEach(edge => {
                if (edge.target === node.id) {
                    found = true
                }
            })
            if (!found) {
                count += 1;
            }
        })

        if (count > 1) {
            setSaveError(true)
        } else {
            setSaveError(false)
        }
        console.log(count)
    }
    
    return (
        <div className='board'>
            <div className='top-bar'>
                <span></span>
                <span>
                    {saveError && <p style={{ fontWeight: "bold", color: "#000", backgroundColor: "red", border: "none", borderRadius: 10, padding: 5 }}>Cannot save flow</p>}
                </span>
                <span>
                    <button onClick={saveHandler}>
                        Save Changes
                    </button>
                </span>
            </div>
            <div style={{
            cursor: grabbed ? "grabbing" : "auto"
        }} className='drawing-board'>
                <div 
                  onMouseMove={(e) => {
                    if(grabbed) {
                        setClientCordinates({
                            x: e.clientX, y: e.clientY
                        })
                    }
                  }}
                  onMouseUp={() => {
                    if (grabbed) {
                        console.log("Hello", clientCordinates)
                        store.addNode({
                            id: nanoid(6), data: { label: 'This is a test message' }, position: { ...clientCordinates }, type: "textMessageNode"
                        })
                        setGrabbed(false)
                        setClientCordinates({
                            x: 0, y: 0
                        })
                    }
                  }}
                  className='flowchart' 
                >
                    <ReactFlow
                     style={{
                        position: "fixed", zIndex: 0, top: 0, left: 0
                     }}
                      nodes={store.nodes}
                      nodeTypes={nodeTypes}
                      edges={store.edges}
                      onNodesChange={store.onNodesChange}
                      onEdgesChange={store.onEdgesChange}
                      onConnect={store.addEdge}
                    //   fitView
                    >
                        <Background />
                        <MiniMap />
                        {grabbed &&
                        <div style={{
                            position: "relative",
                            zIndex: 2,
                            // cursor: "grabbing",
                            width: "20%",
                            top: clientCordinates.y-50,
                            left:clientCordinates.x - window.innerWidth*.1
                        }} className='message-box'>
                            <p>
                                <MessageIcon />
                            </p>
                            <p>
                                Message
                            </p>
                        </div>
                    }
                    </ReactFlow>
                </div>
                <div className='side-panel'>
                    {/* <SidePanel setGrabbed={setGrabbed} /> */}
                    {showSettingsPanel ? <div>
                        {/* Hello {selectedNode} */}
                        <div style={{
                            display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderBottom: "2px solid #aaa"
                        }}>
                            <ArrowLeft style={{ cursor: "pointer" }} onClick={() => {
                                setShowSettingsPanel(false)
                                setSelectedNode("")
                            }} />
                            <h3>
                                Message
                            </h3>
                            <span></span>
                        </div>
                        <div style={{
                            marginInline: 20, marginBlock: 40, 
                        }}>
                            <em>Text Message</em><br /><br />
                            <textarea onKeyDown={onTextChangeHandler} rows={5} style={{ width: "100%", borderRadius: 10, padding: 5 }} placeholder='Type your message here...' ></textarea>
                        </div>
                    </div> : <div 
                    //   draggable 
                      onMouseDown={() => setGrabbed(true)}
                      onMouseMove={() => console.log("Moving dragable element")}
                      onMouseUp={() => console.log("Hello 106")}
                      className='message-box'>
                        <p>
                            <MessageIcon />
                        </p>
                        <p>
                            Message
                        </p>
                    </div>}
                </div>
            </div>
        </div>
    )
}
