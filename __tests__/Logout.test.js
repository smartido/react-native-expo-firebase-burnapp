import React from 'react';
import renderer from 'react-test-renderer';
import Logout from '../screens/Logout';

describe('<Logout />', () => {
  it('Logout component has 5 child', () => {
    const tree = renderer.create(<Logout />).toJSON();
    expect(tree.children.length).toBe(5);
  });

  it('capturing Snapshot of Logout', () => {
    const tree = renderer.create(<Logout />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
