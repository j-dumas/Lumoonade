import React, { useEffect, useRef } from 'react'

export default function ProfileSearchBar(props) {

    const ulListRef = useRef()
    const inputRef = useRef()

    useEffect(() =>{
        inputRef.current.addEventListener('click', (event) => {
            event.stopPropagation()
            ulListRef.current.style.display = 'block'
            props.onInputChange(event)
        })
        document.addEventListener('click', (event) =>{
            ulListRef.current.style.display = 'none'
        })
    }, [])

    function buttonClicked(event, element){
        event.preventDefault()
        inputRef.current.value = element.slug
    }

  return (
    <div className='search-bar'>
        <input type="text" placeholder="Slug" onChange={props.onInputChange} ref={inputRef} />
        <ul id='slug-results' ref={ulListRef}>
            {
                props.data.map((element, index) =>(
                    <button onClick={(event) => buttonClicked(event, element)} key={index}>{element.slug}</button>
                ))
            }
        </ul>
    </div>
  )
}
