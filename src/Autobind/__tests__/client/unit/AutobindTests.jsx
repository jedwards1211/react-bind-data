/* @flow */

import React from 'react';
import {mount} from 'enzyme';

import Autobind from '../../../../lib/Autoform.jsx';
import Pager from '../../../../common/Pager.jsx';

describe('Autobind', () => {
  describe('basic use case', () => {
    let data = {
      firstName: 'Andy',
      lastName: 'Edwards'
    };
    let metadata = {
      validation: {
        firstName: 'first name is OK!',
        lastName:  'last name is OK!'  
      }
    };
    let callbacks = {
      onFirstNameChange: jasmine.createSpy('onFirstNameChange'),
      onLastNameChange:  jasmine.createSpy('onLastNameChange'),
      onAutobindFieldChange: jasmine.createSpy('onAutobindFieldChange')
    };

    let localCallbacks = {
      onFirstNameChange: jasmine.createSpy('onFirstNameChange'),
      onLastNameChange:  jasmine.createSpy('onLastNameChange')
    };
    
    const Form = () => <Autobind data={data} callbacks={callbacks} metadata={metadata}>
      <form>
        <input type="text" autobindField="firstName" placeholder="First Name" onChange={localCallbacks.onFirstNameChange}/>
        <input type="text" autobindField="lastName"  placeholder="Last Name"  onChange={localCallbacks.onLastNameChange }/>
      </form>
    </Autobind>;
    
    let root = mount(<Form/>);
    let firstName = root.find({autobindField: 'firstName'});
    let lastName  = root.find({autobindField: 'lastName' });
    firstName.simulate('change', {target: {value: 'James'}});
    lastName .simulate('change', {target: {value: 'Bond'}});

    it('injects correct value props', () => {
      expect(firstName.prop('value')).toBe(data.firstName);
      expect(lastName .prop('value')).toBe(data.lastName);
    });
    it('injects correct validation props', () => {
      expect(firstName.prop('validation')).toBe(metadata.validation.firstName);
      expect(lastName .prop('validation')).toBe(metadata.validation.lastName);
    });
    describe('injected onChange props', () => {
      it('call root callbacks', () => {
        expect(callbacks.onLastNameChange .calls.allArgs()).toEqual([['Bond']]);
        expect(callbacks.onFirstNameChange.calls.allArgs()).toEqual([['James']]);
      });
      it('call local callbacks', () => {
        expect(localCallbacks.onLastNameChange .calls.allArgs()).toEqual([['Bond']]);
        expect(localCallbacks.onFirstNameChange.calls.allArgs()).toEqual([['James']]);
      });
      it('call onAutobindFieldChange', () => {
        expect(callbacks.onAutobindFieldChange.calls.allArgs()).toEqual([
          ['firstName', 'James'],
          ['lastName' , 'Bond' ]
        ]);
      });
    });
  });
  describe('multi-prop use case', () => {
    let data = {
      page: 2,
      offset: 5
    };
    let metadata = {
      validation: {
        page: 'page is OK!'
      }
    };
    let callbacks = {
      onPageChange:   jasmine.createSpy('onPageChange'),
      onOffsetChange: jasmine.createSpy('onOffsetChange'),
      onAutobindFieldChange: jasmine.createSpy('onAutobindFieldChange')
    };

    let localCallbacks = {
      onPageChange:   jasmine.createSpy('onPageChange'),
      onOffsetChange: jasmine.createSpy('onOffsetChange')
    };

    const Form = () => <Autobind data={data} callbacks={callbacks} metadata={metadata}>
      <Pager autobindProps={{page: 'page', offset: 'offset'}} numPages={20} numButtons={5}
             onPageChange={localCallbacks.onPageChange} 
             onOffsetChange={localCallbacks.onOffsetChange}/>
    </Autobind>;

    let root = mount(<Form/>);
    let pager = root.find(Pager);
    pager.find('a').findWhere(n => n && n.text() === '7').simulate('click');
    pager.find({ariaLabel: 'Next'}).simulate('click');
    
    it('injects correct value props', () => {
      expect(pager.prop('page'  )).toBe(data.page);
      expect(pager.prop('offset')).toBe(data.offset);
    });
    it('injects correct validation props', () => {
      expect(pager.prop('validation')).toBe(metadata.validation.page);
    });
    describe('injected onChange props', () => {
      it('call root callbacks', () => {
        expect(callbacks.onPageChange  .calls.allArgs()).toEqual([[6]]);
        expect(callbacks.onOffsetChange.calls.allArgs()).toEqual([[10]]);
      });
      it('call local callbacks', () => {
        expect(localCallbacks.onPageChange  .calls.allArgs()).toEqual([[6]]);
        expect(localCallbacks.onOffsetChange.calls.allArgs()).toEqual([[10]]);
      });
      it('call onAutobindFieldChange', () => {
        expect(callbacks.onAutobindFieldChange.calls.allArgs()).toEqual([
          ['page'  , 6],
          ['offset', 10]
        ]);
      });
    });
  });
  describe('with autobindPaths', () => {
    describe('basic use case', () => {
      let data = {
        name: {
          firstName: 'Andy',
          lastName: 'Edwards'
        },
        addresses: [
          {
            line1: '5 Five Way',
            city: 'Fivedom'
          }
        ]
      };
      let metadata = {
        validation: {
          name: {
            firstName: 'first name is OK!',
            lastName: 'last name is OK!'
          },
          addresses: [
            {
              line1: 'line1 is OK!',
              city: 'city is OK!'
            }
          ]
        }
      };
      let callbacks = {
        onFirstNameChange: jasmine.createSpy('onFirstNameChange'),
        onLastNameChange:  jasmine.createSpy('onLastNameChange'),
        onLine1Change: jasmine.createSpy('onLine1Change'),
        onCityChange: jasmine.createSpy('onCityChange'),
        onAutobindFieldChange: jasmine.createSpy('onAutobindFieldChange')
      };

      let localCallbacks = {
        onFirstNameChange: jasmine.createSpy('onFirstNameChange'),
        onLastNameChange:  jasmine.createSpy('onLastNameChange'),
        onLine1Change: jasmine.createSpy('onLine1Change'),
        onCityChange: jasmine.createSpy('onCityChange'),
      };

      const Form = () => <Autobind data={data} callbacks={callbacks} metadata={metadata}>
        <form>
          <div autobindPath="name">
            <input type="text" autobindField="firstName" placeholder="First Name" onChange={localCallbacks.onFirstNameChange}/>
            <input type="text" autobindField="lastName"  placeholder="Last Name"  onChange={localCallbacks.onLastNameChange }/>
          </div>
          <div autobindPath="addresses">
            <div autobindPath={[0]}>
              <input type="text" autobindField="line1" placeholder="Line 1" onChange={localCallbacks.onLine1Change}/>
              <input type="text" autobindField="city"  placeholder="City"   onChange={localCallbacks.onCityChange }/>
            </div>
          </div>
        </form>
      </Autobind>;

      let root = mount(<Form/>);
      let firstName = root.find({autobindField: 'firstName'});
      let lastName  = root.find({autobindField: 'lastName' });
      let line1     = root.find({autobindField: 'line1'    });
      let city      = root.find({autobindField: 'city'     });
      firstName.simulate('change', {target: {value: 'James'}});
      lastName .simulate('change', {target: {value: 'Bond'}});
      line1    .simulate('change', {target: {value: '4'}});
      city     .simulate('change', {target: {value: 'Fourdom'}});

      it('injects correct value props', () => {
        expect(firstName.prop('value')).toBe(data.name.firstName);
        expect(lastName .prop('value')).toBe(data.name.lastName);
        expect(line1    .prop('value')).toBe(data.addresses[0].line1);
        expect(city     .prop('value')).toBe(data.addresses[0].city);
      });
      it('injects correct validation props', () => {
        expect(firstName.prop('validation')).toBe(metadata.validation.name.firstName);
        expect(lastName .prop('validation')).toBe(metadata.validation.name.lastName);
        expect(line1    .prop('validation')).toBe(metadata.validation.addresses[0].line1);
        expect(city     .prop('validation')).toBe(metadata.validation.addresses[0].city);
      });
      describe('injected onChange props', () => {
        it('call root callbacks', () => {
          expect(callbacks.onLastNameChange .calls.allArgs()).toEqual([['Bond' , {autobindPath: ['name']}]]);
          expect(callbacks.onFirstNameChange.calls.allArgs()).toEqual([['James', {autobindPath: ['name']}]]);
          expect(callbacks.onLine1Change.calls.allArgs()).toEqual([['4', {autobindPath: ['addresses', 0]}]]);
          expect(callbacks.onCityChange.calls.allArgs()).toEqual([['Fourdom', {autobindPath: ['addresses', 0]}]]);
        });
        it('call local callbacks', () => {
          expect(localCallbacks.onLastNameChange .calls.allArgs()).toEqual([['Bond' , {autobindPath: ['name']}]]);
          expect(localCallbacks.onFirstNameChange.calls.allArgs()).toEqual([['James', {autobindPath: ['name']}]]);
          expect(localCallbacks.onLine1Change.calls.allArgs()).toEqual([['4', {autobindPath: ['addresses', 0]}]]);
          expect(localCallbacks.onCityChange.calls.allArgs()).toEqual([['Fourdom', {autobindPath: ['addresses', 0]}]]);
        });
        it('call onAutobindFieldChange', () => {
          expect(callbacks.onAutobindFieldChange.calls.allArgs()).toEqual([
            ['firstName', 'James', {autobindPath: ['name']}],
            ['lastName' , 'Bond' , {autobindPath: ['name']}],
            ['line1'    , '4'    , {autobindPath: ['addresses', 0]}],
            ['city',    'Fourdom', {autobindPath: ['addresses', 0]}],
          ]);
        });
      });
    });
  });
});
