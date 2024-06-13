import React, { useState } from "react";
import { MessageNodeContext } from "./messageNodeContext";

function MessageNodeContextProvider ({children}) {
    const [selectedNode, setSelectedNode] = useState("")
    const [showSettingsPanel, setShowSettingsPanel] = useState(false)

    return (
        <MessageNodeContext.Provider
         value={{
            selectedNode,
            setSelectedNode,
            showSettingsPanel,
            setShowSettingsPanel
         }}
        >
            {children}
        </MessageNodeContext.Provider>
    )
}

export default MessageNodeContextProvider;