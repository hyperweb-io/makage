import { extractSubgraph } from '../src/index';
import graph from '../../../__fixtures__/jsonld-tools/graph.json';

it('image:cosmjs-roadmap-announcement', () => {
  const subgraph = extractSubgraph(graph, 'image:cosmjs-roadmap-announcement');
  expect(subgraph).toMatchSnapshot();
});