import React from 'react'
import './style.css';

function Input({lable,state,setState,placeholder,type}) {
  return (
    <div className='input-wrapper'>
         
        <p className='lable-input'>{lable}</p>
        <input className='custom-input'
          value={state}
          type={type}
          placeholder={placeholder}
          onChange={(e)=>setState(e.target.value)}
        />
    </div> 
  )
}

export default Input