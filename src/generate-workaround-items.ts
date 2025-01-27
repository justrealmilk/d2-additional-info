import { getAll, loadLocal } from '@d2api/manifest-node';
import { writeFile } from './helpers.js';

loadLocal();

const inventoryItems = getAll('DestinyInventoryItemDefinition');
const collectibles = getAll('DestinyCollectibleDefinition');

const itemReplacementTable: Record<number, number> = {};

Object.values(inventoryItems).forEach((item) => {
  if (
    item.itemCategoryHashes?.includes(1) &&
    item.collectibleHash &&
    collectibles[item.collectibleHash] &&
    (collectibles[item.collectibleHash].sourceHash === 1618754228 ||
      collectibles[item.collectibleHash].sourceHash === 2627087475)
  ) {
    const badItem = Object.values(inventoryItems).find(
      (correspondingItem) =>
        correspondingItem.hash !== item.hash &&
        correspondingItem.displayProperties.name === item.displayProperties.name &&
        correspondingItem.inventory!.bucketTypeHash === 2422292810
    );
    if (badItem) {
      itemReplacementTable[badItem.hash] = item.hash;
    }
  }
});

writeFile('./output/item-def-workaround-replacements.json', itemReplacementTable);
