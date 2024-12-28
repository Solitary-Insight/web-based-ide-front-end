import { useDispatch, useSelector } from 'react-redux';
import { CodeiumEditor } from "@codeium/react-code-editor";
import { useState } from 'react';
export default function CodeEditor() {
    function getExtension(path){

       const extensions={
        "py":"python",
        "js":"javascript",
        "json":"json",
        "jsx":"jsx",
        "css":"css",
        "txt":"txt",
        "html":"html"
       }
       let ext=path.split(".")[1]
    console.log(ext);
       return extensions[ext]
           
    }

    const file_path = useSelector(state => state.file_path)
    const file_content = useSelector(state => state.file_content)
    const dispatch=useDispatch();
    const [code, setCode] = useState(file_content);

    return (
        <>
            <p className="text-danger">{file_path}</p>



            <div>
                <CodeiumEditor className='w-100'
                    language={getExtension(file_path)}
                    theme="vs-dark"
                    value={file_content} // Pass initial code value
                    onChange={(data)=>{
                        setCode(data)
                        // console.log(data);

                    }} // Handle code change
                />
            </div>
        </>
    );
};