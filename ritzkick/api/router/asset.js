const express = require('express')
const mongoose = require('mongoose')
const Asset = require('../../db/model/asset')
const Crypto = require('../../db/model/crypto')
const crypto = require('../../application/crypto/crypto')
const { parser, refactorSymbolData, fetchSymbol, fetchMarketData } = require('../../utils/yahoo')
const router = express.Router()

router.get('/api/crypto/all', async (req, res) => {
	try {
		// Api calls are going to be fetched from the DB
		// Not the case right now, but this is for development purpuses
		const btc = await crypto.getPrice(crypto.btc_contacts)
		const eth = await crypto.getPrice(crypto.eth_contacts)
		res.send({
			btc,
			eth
		})
	} catch (e) {
		res.status(400).send({
			error: e.message
		})
	}
})

router.get('/api/crypto/:slug', async (req, res) => {
	try {
		const slug = req.params.slug
		let data = await fetchSymbol(slug, req.query)
		let response = {}
		data.forEach(d => {
			let a = refactorSymbolData(d)
			response[a.symbol] = {...a}
			delete response[a.symbol].symbol
		})
		res.send(response)
	} catch (e) {
		res.status(400).send({
			error: e.message
		})
	}
})

router.get('/api/crypto/test/:slug', async (req, res) => {
	try {
		const slug = req.params.slug
		let data = await fetchMarketData(slug)

		// All the informations we want to fetch from the data received.
		// This will be populate alot depending on how many cryptos we want to fetch 
		let want = {
			currency: '',
			regularMarketChange: '',
			regularMarketChangePercent: '',
			regularMarketPrice: '',
			regularMarketVolume: '',
			averageDailyVolume3Month: '',
			averageDailyVolume10Day: '',
			coinImageUrl: '',
			fromCurrency: '',
			marketCap: '',
			volume24Hr: '',
			symbol: ''
		}
		
		let response = {}
		
		data.result.forEach(d => {
			parser(d, want)
			response[want.symbol] = {
				...want
			}
			delete response[want.symbol].symbol
		})

		//parverV2(data.result[0], want)
		res.send(response)
	} catch (e) {
		res.status(400).send({
			error: e.message
		})
	}
})


module.exports = router
