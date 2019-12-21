const querystring = require('querystring');
const { DEFAULT_MIN_PRICE, DEFAULT_MAX_PRICE } = require('./constants');


function buildListingUrl(location, priceMin = DEFAULT_MIN_PRICE, priceMax = DEFAULT_MAX_PRICE, limit = 20, offset = 0, checkIn, checkOut) {
    const queryString = {
        query: location,
        price_min: priceMin,
        price_max: priceMax,
        items_per_grid: limit,
        items_offset: offset,
        "refinement_paths[]": '/homes',
    };

    if (checkIn) {
        queryString.checkin = checkIn;
    }

    if (checkOut) {
        queryString.checkout = checkOut;
    }

    return `http://api.airbnb.com/v2/explore_tabs?${querystring.stringify(queryString)}`;
}

/**
 *
 * @param {String} location
 * @param {function} getRequest
 * @param {number} priceMin
 * @param {number} priceMax
 * @param {number} limit
 * @param {number} offset
 * @param {string} checkIn
 * @param {string} checkOut
 * @return {Promise}
 */
function getHomeListings(location, getRequest, priceMin = DEFAULT_MIN_PRICE, priceMax = DEFAULT_MAX_PRICE, limit = 20, offset = 0, checkIn, checkOut) {
   const url = buildListingUrl(location, priceMin, priceMax, limit, offset, checkIn, checkOut);

    return getRequest(url);
}

/**
 *
 * @param {string} listingId
 * @param {function} getRequest
 * @param {number} limit
 * @param {number} offset
 * @return {Promise}
 */
function callForReviews(listingId, getRequest, limit = 50, offset = 0) {
    const queryString = {
        _order: 'language_country',
        _limit: limit,
        _offset: offset,
        _format: 'for_mobile_client',
        role: 'all',
        listing_id: listingId,
    };
    return getRequest(
        `https://api.airbnb.com/v2/reviews?${querystring.stringify(queryString)}`,
    );
}

module.exports = {
    getHomeListings,
    callForReviews,
    buildListingUrl,
};
