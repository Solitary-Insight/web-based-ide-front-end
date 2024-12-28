import React, { useEffect, useState } from 'react';
import { ReactTerminal } from "react-terminal";
import './terminal.css'
import io from 'socket.io-client';
import { BASE_URL, useSocket } from '../../Sockets/SocketProvider';

; // Update this URL to match your server's URL

const Terminal = () => {
    var socket = useSocket()
    if(!socket){
        socket=io(BASE_URL, {
            withCredentials: false,
            extraHeaders: {
                "my-custom-header": "abcd"
            }
        });
    }
    const [terminal_message,setTerminalMsg]=useState("")
    const [user,SetUser]=useState("")
    const [cmd_no,set_smd_no]=useState(0)
    useEffect(() => {
        socket.emit("Terminal:WHOAMI",'whoami')
        socket.on("Terminal:OUTPUT", (data) => {
            setTerminalMsg(data)
            console.log(data);
        })
        socket.on("Terminal:USER", (data) => {
            SetUser(data+"$")
            console.log(data);
        })
        // return () => {
        //     socket.off("Terminal:OUTPUT",()=>{
        //         console.log("Hi");
        //     });
        // };
    },[socket])

    const commands = {
        whoami: "jackharper",
        cd: (directory) => `changed path to ${directory}`
    };
    return (
        <div>
        <ReactTerminal
            commands={{}}
            themes={null}
            
            theme="dark"
            prompt={user}
            showControlBar={true}
            errorMessage={"<p>Hello</p>"}
            defaultHandler={(terminal_text) => {
               
                if (socket && socket.connected) {
                    if(cmd_no>=3){
                        socket.emit("Terminal:INPUT", 'clear');
                    
                    }
                    socket.emit("Terminal:INPUT", terminal_text);
                    console.log("UI");
                } else {
                    console.warn("Socket is not connected, cannot send terminal input.");
                }
                set_smd_no(cmd_no+1)

            }}
        />
        <div className="terminal-output">
            <pre>{terminal_message}</pre> {/* Display the terminal message */}
        </div>
    </div>
    );
};

export default Terminal;