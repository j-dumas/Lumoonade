/**
 * User Summary Response Model
 * @typedef {object} UserSummaryResponse
 * @property {string} username - Username
 * @property {string} email - Email
 * @property {number} wallet_list - Length of the list of wallets
 * @property {number} favorite_list - Length of the list of favorite currencies
 * @property {number} sessions - Number of sessions open
 * @property {number} watchlist_list - Length of the watchlist
 */

/**
 * Wallet Model
 * @typedef {object} Wallet
 * @property {string} owner - ID of the Owner (User)
 * @property {string} slug - Slug of the Asset
 * @property {number} amount - Amount of Asset in the Wallet
 */

/**
 * Favorite Model
 * @typedef {object} Favorite
 * @property {string} owner - ID of the Owner (User)
 * @property {string} slug - Slug of the Asset
 */

/**
 * Watchlist Model
 * @typedef {object} Watchlist
 * @property {string} owner - ID of the Owner (User)
 * @property {string} slug - Slug of the Asset
 * @property {number} target - Target price to notify
 */

/**
 * Complete User Response Model
 * @typedef {object} UserResponse
 * @property {string} username - Username
 * @property {string} email - Email
 * @property {array<Wallet>} wallet_list - List of wallets
 * @property {array<Favorite>} favorite_list - List of favorites
 * @property {number} sessions - Number of sessions open
 * @property {array<Watchlist>} watchlist_list - List of slugs to watch
 */
