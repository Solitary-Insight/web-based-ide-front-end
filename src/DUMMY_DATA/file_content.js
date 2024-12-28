export  const CONTENT = `import React from 'react';
import { ReactTerminal } from "react-terminal";
import "./terminal.css";

const Terminal = () => {
    const commands = {
        whoami: "jackharper",
        cd: (directory) => \`changed path to \${directory}\`
    };

    return (
        <ReactTerminal  
            commands={commands}
            themes={null}
            theme="dark"
            prompt="$"
            showControlBar={true}
            showControlButtons={true}
        />
    );
};

export default Terminal;`;
