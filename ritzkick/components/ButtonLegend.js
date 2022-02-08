import React, {useState, useEffect} from 'react';
import Icons from './Icons';

function ButtonLegend(props) {
    const [selected, setSelected] = useState(props.value)
    const handleSelected = () => {
        setSelected(!selected)
        props.sendData(selected);
    }

    return (
        <>
        <div className=''>
            <div onClick={handleSelected} className="legend-button" style={selected?{'backgroundColor': props.backgroundColor}:{'backgroundColor':'dimgray'}}>
                {props.name}
            </div>
        </div>
        </>
    )
}

export default ButtonLegend