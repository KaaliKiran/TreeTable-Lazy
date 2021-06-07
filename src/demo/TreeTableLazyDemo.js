import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import '../../index.css';
import ReactDOM from 'react-dom';

import React, { useState, useEffect } from 'react';
import { TreeTable } from 'primereact/treetable';
import { Column } from 'primereact/column';

const TreeTableLazyDemo = () => {
    const [nodes, setNodes] = useState([]);
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
            setNodes(loadNodes(first, rows));
            setTotalRecords(1000);
        }, 500);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const loadNodes = (first, rows) => {
        let nodes = [];

        for (let i = 0; i < rows; i++) {
            let node = {
                key: (first + i),
                data: {
                    name: 'Item ' + (first + i),
                    size: Math.floor(Math.random() * 1000) + 1 + 'kb',
                    type: 'Type ' + (first + i)
                },
                leaf: false
            };

            nodes.push(node);
        }

        return nodes;
    }

    const onExpand = (event) => {
        if (!event.node.children) {
            setLoading(true);

            setTimeout(() => {
                this.loading = false;
                let lazyNode = { ...event.node };

                lazyNode.children = [
                    {
                        data: {
                            name: lazyNode.data.name + ' - 0',
                            size: Math.floor(Math.random() * 1000) + 1 + 'kb',
                            type: 'File'
                        },
                    },
                    {
                        data: {
                            name: lazyNode.data.name + ' - 1',
                            size: Math.floor(Math.random() * 1000) + 1 + 'kb',
                            type: 'File'
                        }
                    }
                ];

                let _nodes = nodes.map(node => {
                    if (node.key === event.node.key) {
                        node = lazyNode;
                    }

                    return node;
                });

                setLoading(false);
                setNodes(_nodes);
            }, 250);
        }
    }

    const onPage = (event) => {
        setLoading(true);

        //imitate delay of a backend call
        setTimeout(() => {
            setFirst(event.first);
            setRows(event.rows);
            setNodes(loadNodes(event.first, event.rows));
            setLoading(false);
        }, 500);
    }

    return (
        <div>
            <div className="card">
                <TreeTable value={nodes} lazy paginator totalRecords={totalRecords}
                    first={first} rows={rows} onPage={onPage} onExpand={onExpand} loading={loading}>
                    <Column field="name" header="Name" expander></Column>
                    <Column field="size" header="Size"></Column>
                    <Column field="type" header="Type"></Column>
                </TreeTable>
            </div>
        </div>
    );
}
                
const rootElement = document.getElementById("root");
ReactDOM.render(<TreeTableLazyDemo />, rootElement);