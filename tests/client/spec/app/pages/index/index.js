import { shallow } from 'enzyme';
import Index from '../../../../src/client/pages/index/index.js';

describe('<Index />', () => {

  it('should render one index component', () => {
    const wrapper = shallow(<Index />)
    assert.equal(wrapper.find('.index').length(), 1)
  })
})