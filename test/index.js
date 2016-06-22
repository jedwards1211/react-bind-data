/* @flow */

import 'babel-polyfill'
import React from 'react'
import {mount} from 'enzyme'

import bindData from '../src'
import Pager from './Pager'

describe('bindData', () => {
  describe('basic use case', () => {
    let onFieldChange = jasmine.createSpy('onFieldChange')

    let data = bindData({
      data: {
        firstName: 'Andy',
        lastName: 'Edwards'
      },
      metadata: {
        validation: {
          firstName: 'first name is OK!',
          lastName: 'last name is OK!'
        }
      },
      onFieldChange
    })

    const Form = () => <form>
      <input name="firstName" type="text" {...data('firstName')} placeholder="First Name" />
      <input name="lastName" type="text" {...data('lastName')} placeholder="Last Name" />
    </form>

    let root = mount(<Form />)
    let firstName = root.find({name: 'firstName'})
    let lastName  = root.find({name: 'lastName' })
    firstName.simulate('change', {target: {value: 'James'}})
    lastName .simulate('change', {target: {value: 'Bond'}})

    it('injects correct value props', () => {
      expect(firstName.prop('value')).toBe('Andy')
      expect(lastName .prop('value')).toBe('Edwards')
    })
    it('injects correct validation props', () => {
      expect(firstName.prop('validation')).toBe('first name is OK!')
      expect(lastName .prop('validation')).toBe('last name is OK!')
    })
    describe('injected onChange props', () => {
      it('call onFieldChange', () => {
        expect(onFieldChange.calls.allArgs()).toEqual([
          [['firstName'], 'James'],
          [['lastName' ], 'Bond' ]
        ])
      })
    })
  })
  describe('path use case', () => {
    let onFieldChange = jasmine.createSpy('onFieldChange')

    let data = bindData({
      data: {
        document: {
          firstName: 'Andy',
          lastName: 'Edwards'
        }
      },
      metadata: {
        validation: {
          document: {
            firstName: 'first name is OK!',
            lastName: 'last name is OK!'
          }
        }
      },
      onFieldChange
    })

    const Form = () => <form>
      <input name="firstName" type="text" {...data(['document', 'firstName'])} placeholder="First Name" />
      <input name="lastName" type="text" {...data(['document', 'lastName'])} placeholder="Last Name" />
    </form>

    let root = mount(<Form />)
    let firstName = root.find({name: 'firstName'})
    let lastName  = root.find({name: 'lastName' })
    firstName.simulate('change', {target: {value: 'James'}})
    lastName .simulate('change', {target: {value: 'Bond'}})

    it('injects correct value props', () => {
      expect(firstName.prop('value')).toBe('Andy')
      expect(lastName .prop('value')).toBe('Edwards')
    })
    it('injects correct validation props', () => {
      expect(firstName.prop('validation')).toBe('first name is OK!')
      expect(lastName .prop('validation')).toBe('last name is OK!')
    })
    describe('injected onChange props', () => {
      it('call onFieldChange', () => {
        expect(onFieldChange.calls.allArgs()).toEqual([
          [['document', 'firstName'], 'James'],
          [['document', 'lastName' ], 'Bond' ]
        ])
      })
    })
  })
  describe('multi-prop use case', () => {
    let onFieldChange = jasmine.createSpy('onFieldChange')

    let data = bindData({
      data: {
        page: 2,
        offset: 5
      },
      metadata: {
        validation: {
          page: 'page is OK!'
        }
      },
      onFieldChange
    })

    const Form = () => <Pager {...data({page: 'page', offset: 'offset'})} numPages={20} numButtons={5} />

    let root = mount(<Form />)
    let pager = root.find(Pager)
    pager.find('a').findWhere(n => n && n.text() === '7').simulate('click')
    pager.find({ariaLabel: 'Next'}).simulate('click')

    it('injects correct value props', () => {
      expect(pager.prop('page'  )).toBe(2)
      expect(pager.prop('offset')).toBe(5)
    })
    it('injects correct validation props', () => {
      expect(pager.prop('validation')).toBe('page is OK!')
    })
    describe('injected onChange props', () => {
      it('call onFieldChange', () => {
        expect(onFieldChange.calls.allArgs()).toEqual([
          [['page'  ], 6],
          [['offset'], 10]
        ])
      })
    })
  })
  describe('.sub', () => {
    it('works', () => {
      let onFieldChange = jasmine.createSpy('onFieldChange')

      let data = bindData({
        data: {
          document: {
            firstName: 'Andy',
            lastName: 'Edwards'
          }
        },
        metadata: {
          validation: {
            document: {
              firstName: 'first name is OK!',
              lastName: 'last name is OK!'
            }
          }
        },
        onFieldChange
      }).sub('document')

      const Form = () => <form>
        <input name="firstName" type="text" {...data('firstName')} placeholder="First Name" />
        <input name="lastName" type="text" {...data('lastName')} placeholder="Last Name" />
      </form>

      let root = mount(<Form />)
      let firstName = root.find({name: 'firstName'})
      let lastName  = root.find({name: 'lastName' })
      firstName.simulate('change', {target: {value: 'James'}})
      lastName .simulate('change', {target: {value: 'Bond'}})

      it('injects correct value props', () => {
        expect(firstName.prop('value')).toBe('Andy')
        expect(lastName .prop('value')).toBe('Edwards')
      })
      it('injects correct validation props', () => {
        expect(firstName.prop('validation')).toBe('first name is OK!')
        expect(lastName .prop('validation')).toBe('last name is OK!')
      })
      describe('injected onChange props', () => {
        it('call onFieldChange', () => {
          expect(onFieldChange.calls.allArgs()).toEqual([
            [['document', 'firstName'], 'James'],
            [['document', 'lastName' ], 'Bond' ]
          ])
        })
      })
    })
  })
})
