const { denormalisedResponseEntities } = require('../../api-util/format');
const { getIntegrationSdk } = require('../../api-util/sdk');

const updateCreatorProfile = async data => {
  try {
    const iSdk = getIntegrationSdk();
    const { client_reference_id } = data;

    if (!client_reference_id) {
      console.log('client_reference_id missing in checkout session completed');
      return;
    }

    const userRes = await iSdk.users.show({
      id: client_reference_id,
    });

    const user = denormalisedResponseEntities(userRes)[0];
    const isCreator = user.attributes.profile.publicData.userType === 'creator';

    if (!isCreator) {
      console.log('User is not a creator');
      return;
    }

    const listingsRes = await iSdk.listings.query({
      authorId: user.id.uuid,
      pub_listingType: 'creators',
      perPage: 1,
    });

    const listing = denormalisedResponseEntities(listingsRes)[0];

    if (!!listing.id.uuid) {
      await iSdk.listings.update({
        id: listing.id.uuid,
        metadata: {
          isVerified: true,
          ranking: 1,
        },
      });
    }

    await iSdk.users.updateProfile({
      id: user.id,
      metadata: {
        isVerified: true,
      },
    });
  } catch (error) {
    console.log('Failed to update creator profile', error);
  }
};

module.exports = {
  updateCreatorProfile,
};
