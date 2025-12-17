const { denormalisedResponseEntities } = require('../api-util/format');
const { handleError, getIntegrationSdk } = require('../api-util/sdk');

module.exports = async (req, res) => {
  try {
    const iSdk = getIntegrationSdk();
    const listingsRes = await iSdk.listings.query({
      include: ['author', 'author.profileImage'],
      'fields.listing': [
        'title',
        'description',
        'price',
        'deleted',
        'state',
        'publicData',
        'metadata',
      ],
      'fields.user': ['profile.displayName', 'profile.abbreviatedName'],
      'fields.image': ['variants.listing-card', 'variants.listing-card-2x'],
      'imageVariant.listing-card': 'w:400;h:533;fit:crop',
      'imageVariant.listing-card-2x': 'w:800;h:1067;fit:crop',
      perPage: 8,
      pub_listingType: 'creators',
      meta_featured: true,
      sort: 'meta_ranking',
      states: 'published',
    });

    const listings = denormalisedResponseEntities(listingsRes);
    const formattedListings = listings.map(listing => {
      const {
        id,
        author,
        images,
        type,
        attributes: {
          publicData: { listingType, location, size_total_following },
          ...rest
        },
      } = listing;
      return {
        id,
        author,
        images,
        type,
        attributes: {
          ...rest,
          publicData: { listingType, location, size_total_following },
          price: null,
        },
      };
    });

    return res.json({ data: formattedListings });
  } catch (error) {
    handleError(res, error);
  }
};
