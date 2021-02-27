const mockData = require('./mockData');
const expect = require('chai').expect;

describe('index.js', () => {
  const index = require('../index.js');
  const options = {
    data: mockData,
    filePath: './demo',
    config: {
      accessId: 'xx',
      dslId: 41,
      generator: [],
      plugin: [],
      uploadUrl: '',
      value: '17679'
    }
  };

  it('index check param', async () => {
    expect(options).to.be.an('object');
    expect(options.filePath).to.be.a('string');
  });

  it('index callback result', async () => {
    const { data } = await index(options);
    expect(data.code).to.be.an('object');
    expect(data.code.panelDisplay).to.be.an('array');
  });
});
