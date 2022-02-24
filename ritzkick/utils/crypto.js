export function SlugArrayToSymbolArray(slugs, currency, upperCase = false) {
    let symbols = []
    slugs.map((element, i) => {
        symbols.push(element.slug + '-' + currency)
    })
    return symbols
}

export function SymbolToSlug(symbol) {
    const slug = symbol.toString().split('-')[0]
    return slug
}

export function SlugToSymbol(slug) {
    const symbol = slug.toString().split('-')[1]
    return symbol
}

export function AreSlugsEqual(slug1, slug2) {
    return (SymbolToSlug(slug1).toLowerCase() == SymbolToSlug(slug2).toLowerCase())
}