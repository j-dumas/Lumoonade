const { appendToList, rebuild, keepFromList, sameString, slapToLowerCase } = require('../../../app/socket/utils/parser')

describe('Testing the parser util for the websocket service', () => {
	describe('SameString function', () => {
		test(`It should return true with two strings that are the same`, () => {
			let string1 = 'test'
			let string2 = 'test'
			expect(sameString(string1, string2)).toBeTruthy()
		})

		test(`It should return false with two strings that are not the same`, () => {
			let string1 = 'test'
			let string2 = string1 + '1'
			expect(sameString(string1, string2)).toBeFalsy()
		})
	})

	describe('KeepFromList function', () => {
		const mostlyCommonList = [
			{
				symbol: 'eth',
				content: ['3', '2', '1'],
				amount: 3001
			},
			{
				symbol: 'btc',
				content: ['1', '2', '3'],
				amount: 3002001
			}
		]
		test(`Testing 'keepFromList' with keeping only 'btc' with searchTerm set to 'symbol should have a value'`, () => {
			let keepVal = 'btc'
			let result = keepFromList(mostlyCommonList, {
				searchTerm: 'symbol',
				keep: [keepVal]
			})
			expect(result.length).toBe(1)
			expect(result[0].symbol).toBe(keepVal)
		})

		test(`Testing 'keepFromList' with keeping only 'btc' and 'eth' with searchTerm set to 'symbol' should have values`, () => {
			let keep = ['eth', 'btc']
			let result = keepFromList(mostlyCommonList, {
				searchTerm: 'symbol',
				keep
			})
			expect(result.length).toBe(2)
			result.forEach((res, index) => {
				expect(res.symbol).toBe(keep[index])
			})
		})

		test(`Testing 'keepFromList' with keeping only 'btc' with searchTerm set to 'amount' should not have any value'`, () => {
			let keep = ['btc']
			let result = keepFromList(mostlyCommonList, {
				searchTerm: 'amount',
				keep
			})
			expect(result.length).toBe(0)
		})
	})

	describe('Rebuild function', () => {
		test(`It should return unique values with a list containing duplicates, `, () => {
			let randomList = ['1', '2', '3', '1', '1', '4', '5']
			let expected = ['1', '2', '3', '4', '5']
			let rebuilt = rebuild(randomList)
			expect(rebuilt.length).not.toBe(randomList.length)
			expect(rebuilt).toStrictEqual(expected)
		})

		test(`It should not change with a list containing unique values`, () => {
			let randomList = ['1', '2', '3', '4', '5']
			let expected = randomList
			let rebuilt = rebuild(randomList)
			expect(rebuilt.length).toBe(randomList.length)
			expect(rebuilt).toStrictEqual(expected)
		})
	})

	describe('AppendToList function', () => {
		test(`Testing 'appendToList' adding a value that is already in the list. It should not change the original list`, () => {
			let someList = ['1', '2']
			someList = appendToList(someList, '1')
			expect(someList.length).toBe(2)
			expect(someList[someList.length - 1]).toBe('2')
		})

		test(`Testing 'appendToList' adding a value that is not already in the list. It should contain the new value`, () => {
			let newValue = '5'
			let someList = ['1', '2']
			someList = appendToList(someList, newValue)
			expect(someList.length).toBe(3)
			expect(someList[someList.length - 1]).toBe(newValue)
		})
	})

	describe('SlapToLowerCase function', () => {
		test(`Testing 'slapToLowerCase' turn every string in the array to lower case`, () => {
			let list = ['A', 'B', 'C']
			let expected = ['a', 'b', 'c']

			let res = slapToLowerCase(list)
			expect(expected).toStrictEqual(res)
		})

		test(`Testing 'slapToLowerCase' turn every string in the arry to lower case 2`, () => {
			let list = ['a', 'b', 'C']
			let expected = ['a', 'b', 'c']

			let res = slapToLowerCase(list)
			expect(expected).toStrictEqual(res)
		})
	})
})
