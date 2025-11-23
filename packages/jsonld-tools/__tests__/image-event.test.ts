import { extractSubgraph } from '../src/index';
import graph from '../../../__fixtures__/jsonld-tools/graph.json';

it('event:cosmjs-roadmap', () => {
  const subgraph = extractSubgraph(graph, 'event:cosmjs-roadmap');
  expect(subgraph).toMatchSnapshot();
});