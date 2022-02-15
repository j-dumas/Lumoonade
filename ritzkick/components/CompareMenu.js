import React, { useState, useEffect } from 'react';
import Functions from '../services/CryptoService';
import ButtonFavorite from '../components/ButtonFavorite';
import SimplestItemView from './SimplestItemView'
import { useRouter } from 'next/router'

function CompareMenu(props) {
    const router = useRouter()
    const [compareList, setCompareList] = useState(props.slugs)
	const [searchList, setSearchList] = useState([])
    const [value, setValue] = useState()

    useEffect(() => {
        props.socket.emit(
            'update',
            props.socket.id,
            compareList
        )
    })

/*
    useEffect(() => {
        router.push(
            {
              pathname: `/compare`,
              query: {}
            },
            `/compare?param=test`,
            {shallow: true}
        );
    }, [])
*/

    function updateSearchList(event) {
        event.preventDefault()
        setSearchList(['BTC','ETH','ADA','BNB','DOGE','THETA','LTC'])
    }

    function addToCompareList(event) {
        event.preventDefault()

        if (compareList.length >= 5) return;
        const elementToAdd = event.target.value + '-' + props.currency

        let isDoubled = false
        compareList.map(element => {
            if (element === elementToAdd) {
                isDoubled = true
                return
            }
        })
        if (isDoubled) return

        const lastCompareList = compareList;
        lastCompareList.push(elementToAdd)
        setCompareList(lastCompareList)
        setSearchList([])
    }

    function removeFromCompareList(element) {
        const lastCompareList = compareList;
        lastCompareList.splice(lastCompareList.indexOf(element), 1)
        setCompareList(lastCompareList)
        setSearchList([])
    }

    return (
        <>
            <div className='column detailed-informations detailed-div max-width'>
                <div className='detailed-div-menu row space-between'>
                    <label className='detailed-div-title'>Comparing</label>
                    <div>
                        <select name="" id=""  className='detailed-chart-options-select'>
                            <option value="price">Price</option>
                            <option value="efficiency">Efficiency</option>
                            <option value="volume">Volume</option>
                            <option value="marketCap">Market cap</option>
                        </select>
                        <p className='detailed-div-title'>{'$ = ' + props.currency + '$'}</p>
                    </div>
                </div>
                <div className='row space-between detailed-div-item'>
                    <p className='detailed-div-item-label'>With</p>
                    <form action="" onSubmit={updateSearchList}>
                        <input type="search" />
                        <button type="submit" value="Submit">Search</button>
                    </form>
                </div>
                <form className='row detailed-div-item'>
                    {searchList.map(element => {
                        return(<button onClick={addToCompareList} key={element} value={element} className='dynamic-list-item'>{element}</button>)
                    })}
                </form>
                {compareList.length > 0 ?
                <div className='row'>
                    <p className='detailed-div-title'>Asset</p>
                    <p className='detailed-div-title'>Price</p>
                    <p className='detailed-div-title'>24h Change</p>
                    <p></p>
                </div>
                : <p></p> }
                <div className='column detailed-div-item'>
                    {compareList.map((element, i) => {
                        return(<SimplestItemView command={removeFromCompareList} slug={element} price={"10000"} changeNumber={"10$"} changePercentage={"1%"} key={element}/>)
                    })}
                </div>
            </div>
        </>
    )
}

export default CompareMenu
