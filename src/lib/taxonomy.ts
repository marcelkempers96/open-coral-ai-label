export interface TaxonomyNode {
  id: string
  name: string
  path: string
  color?: string
  synonyms?: string[]
  children?: TaxonomyNode[]
}

export const starterTaxonomy: TaxonomyNode = {
  id: 'hard',
  name: 'Hard Coral',
  path: 'hard',
  children: [
    {
      id: 'hard/massive', name: 'Massive', path: 'hard/massive', children: [
        { id: 'hard/massive/eusmilia_fastigiata', name: 'Eusmilia fastigiata', path: 'hard/massive/Eusmilia fastigiata' },
        { id: 'hard/massive/favia_fragum', name: 'Favia fragum', path: 'hard/massive/Favia fragum' },
        { id: 'hard/massive/isophyllia_sinuosa', name: 'Isophyllia sinuosa', path: 'hard/massive/Isophyllia sinuosa' },
      ],
    },
    { id: 'hard/foliose', name: 'Foliose', path: 'hard/foliose', children: [] },
    { id: 'hard/branching', name: 'Branching', path: 'hard/branching', children: [] },
    { id: 'hard/solitary', name: 'Solitary', path: 'hard/solitary', children: [] },
  ],
}

