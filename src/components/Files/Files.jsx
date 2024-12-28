import React, { useEffect, useState } from 'react';
import axios from 'axios'; // or use fetch
import { BASE_URL } from '../../Sockets/SocketProvider';
import { useDispatch, useSelector } from 'react-redux';

function Files(props) {
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    const dispatch = useDispatch();


    const file_tree = useSelector((state) => state.files);
    function fetchFileContent(f_path){
        dispatch({ type: 'update_path', payload: f_path })
        // dispatch({ type: 'update_path', payload: f_path })
    }
    useEffect(() => {
        const fetchFileTree = async () => {
            try {
                const response = await axios.get(BASE_URL + '/file-tree'); // Adjust URL if needed
                dispatch({ type: 'load_files', payload: response.data });
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchFileTree();
    }, []);
    const [cwd, set_cwd] = useState("/")
    return (
        <div className='mt-3 files text-light'>
            <p className='fw-bold text-center'>Files</p>
            {<Files_Item path={JSON.stringify(file_tree)} parent={""}  ></Files_Item>}
        </div>
    );
}

export default Files;

function Files_Item(props) {
    const [expand, shouldExpand] = useState(false)
    const parent = props.parent;
    const dispatch = useDispatch();

  async  function fetchFileContent(f_path){
        console.log(f_path);
        dispatch({ type: 'update_path', payload: f_path })
        try {
            const response = await axios.get(BASE_URL + `/file-content?file_path=${f_path}`); // Adjust URL if needed
            dispatch({ type: 'update_content', payload: response.data });
        } catch (err) {
            console.log(err);
        }

    }


    const path = JSON.parse(props.path)
    return (
        Object.keys(path).map((file, i, a) => {

            if (path[file]) {

                return <div className='p-1  rounded  '   >
                    <p className={path[file] ? "  fw-bold shadow   ps-1   text-light " : " "} onClick={() => { shouldExpand(!expand) }}>{file}</p>
                    {expand ? <Files_Item path={JSON.stringify(path[file])} parent={parent + "/" + file}></Files_Item> : null}
                </div>
            } else {
                // parent[file]=null;
                const f_path=parent + "/" + file;
                return <p className='ps-2 shadow-sm  text-light' onClick={() => { fetchFileContent(f_path); }} >{file}</p>

            }

        })
    )
}


