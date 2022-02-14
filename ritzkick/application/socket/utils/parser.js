/**
 * Append a value to the list
 * @param {list} list
 * @param {any} content
 * @returns a set cast as a list of all unique values
 */
const appendToList = (list, content) => {
	list.push(...content)
	return rebuild(list)
}

/**
 * Rebuild the list to a unique set list
 * @param {list} list
 * @returns a list of unique values
 */
const rebuild = (list) => {
	return [...new Set(list)]
}

/**
 * Keep certain information about a list
 * @param {list} list
 * @param {object} config
 * @returns a list of wanted values
 */
const keepFromList = (list, config) => {
	let result = []
	// See if we provided a search term
	let searchTerm = config.searchTerm
	list.forEach((content) => {
		let value = content[searchTerm]
		if ([...config.keep].find((_) => sameString(_, value))) {
			result.push(content)
		}
	})
	return result
}

const sameString = (s1, s2) => {
	return s1.toLowerCase() === s2.toLowerCase()
}

module.exports = {
	appendToList,
	rebuild,
	keepFromList
}
