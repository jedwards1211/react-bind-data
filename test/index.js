/* @flow */

import React from 'react';
import {mount} from 'enzyme';

import BindData from '../src/lib/BindData';
import Pager from './Pager';

describe('BindData', () => {
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
    
    let onFieldChange = jasmine.createSpy('onFieldChange');

    let localCallbacks = {
      onFirstNameChange: jasmine.createSpy('onFirstNameChange'),
      onLastNameChange:  jasmine.createSpy('onLastNameChange')
    };

    const Form = () => <BindData data={data} metadata={metadata} onFieldChange={onFieldChange}>
      <form>
        <input type="text" name="firstName" placeholder="First Name" onChange={localCallbacks.onFirstNameChange}/>
        <input type="text" name="lastName"  placeholder="Last Name"  onChange={localCallbacks.onLastNameChange }/>
      </form>
    </BindData>;

    let root = mount(<Form/>);
    let firstName = root.find({name: 'firstName'});
    let lastName  = root.find({name: 'lastName' });
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
      it('call local callbacks', () => {
        expect(localCallbacks.onLastNameChange ).toHaveBeenCalled();
        expect(localCallbacks.onFirstNameChange).toHaveBeenCalled();
      });
      it('call onFieldChange', () => {
        expect(onFieldChange.calls.allArgs()).toEqual([
          [['firstName'], 'James'],
          [['lastName' ], 'Bond' ]
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
    
    let onFieldChange = jasmine.createSpy('onFieldChange');
  
    let localCallbacks = {
      onPageChange:   jasmine.createSpy('onPageChange'),
      onOffsetChange: jasmine.createSpy('onOffsetChange')
    };
  
    const Form = () => <BindData data={data} metadata={metadata} onFieldChange={onFieldChange}>
      <Pager bindDataProps={{page: 'page', offset: 'offset'}} numPages={20} numButtons={5}
             onPageChange={localCallbacks.onPageChange}
             onOffsetChange={localCallbacks.onOffsetChange}/>
    </BindData>;
  
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
      it('call local callbacks', () => {
        expect(localCallbacks.onPageChange  .calls.allArgs()).toEqual([[6]]);
        expect(localCallbacks.onOffsetChange.calls.allArgs()).toEqual([[10]]);
      });
      it('call onFieldChange', () => {
        expect(onFieldChange.calls.allArgs()).toEqual([
          [['page'  ], 6],
          [['offset'], 10]
        ]);
      });
    });
  });
  describe('with paths names', () => {
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
      
      let onFieldChange = jasmine.createSpy('onFieldChange');
      
      let localCallbacks = {
        onFirstNameChange: jasmine.createSpy('onFirstNameChange'),
        onLastNameChange:  jasmine.createSpy('onLastNameChange'),
        onLine1Change: jasmine.createSpy('onLine1Change'),
        onCityChange: jasmine.createSpy('onCityChange'),
      };
  
      const Form = () => <BindData data={data} metadata={metadata} onFieldChange={onFieldChange}>
        <form>
          <div name="name">
            <input type="text" name="firstName" placeholder="First Name" onChange={localCallbacks.onFirstNameChange}/>
            <input type="text" name="lastName"  placeholder="Last Name"  onChange={localCallbacks.onLastNameChange }/>
          </div>
          <div name="addresses">
            <div name={0}>
              <input type="text" name="line1" placeholder="Line 1" onChange={localCallbacks.onLine1Change}/>
              <input type="text" name="city"  placeholder="City"   onChange={localCallbacks.onCityChange }/>
            </div>
          </div>
        </form>
      </BindData>;
  
      let root = mount(<Form/>);
      let firstName = root.find({name: 'firstName'});
      let lastName  = root.find({name: 'lastName' });
      let line1     = root.find({name: 'line1'    });
      let city      = root.find({name: 'city'     });
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
        it('call local callbacks', () => {
          expect(localCallbacks.onLastNameChange ).toHaveBeenCalled();
          expect(localCallbacks.onFirstNameChange).toHaveBeenCalled();
          expect(localCallbacks.onLine1Change    ).toHaveBeenCalled();
          expect(localCallbacks.onCityChange     ).toHaveBeenCalled();
        });
        it('call onFieldChange', () => {
          expect(onFieldChange.calls.allArgs()).toEqual([
            [['name', 'firstName'], 'James'],
            [['name', 'lastName' ], 'Bond' ],
            [['addresses', 0, 'line1'], '4'],
            [['addresses', 0, 'city' ], 'Fourdom']
          ]);
        });
      });
    });
  });
});
