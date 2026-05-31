import {faker} from '@faker-js/faker';

export const createPreviewImageUrl = (): string =>
  faker.image.url({width: 32, height: 32});

export const createDetailsImageUrl = (): string =>
  faker.image.url({width: 300, height: 300});
