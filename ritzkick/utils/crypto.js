export function SlugArrayToSymbolArray(slugs, currency, upperCase = false) {
    let symbols = []
    slugs.map((element, i) => {
        symbols.push(element.slug + '-' + currency)
    })
    return symbols
}