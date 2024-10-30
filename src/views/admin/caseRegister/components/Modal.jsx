// components/Modal.js
import React from 'react';
import ReactDOM from 'react-dom';
import Card from "components/card";

const Modal =({isVisible}) =>{
    if( !isVisible) return null;

    return(
        <Card extra={"w-full pb-10 p-4 h-full"}>
        <div className='fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex-justify-center items-center'>
            <div className='w-[600px] flex flex-col'>
                <button className='text-white text-xl place-self-end'>X</button>
                <div className='bg-white p-2 rounded'>
                   Hey Modal
                </div>
                </div>

        </div>
        </Card>
    )
}

export default Modal;
