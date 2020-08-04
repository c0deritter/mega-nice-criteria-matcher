import { expect } from 'chai'
import 'mocha'
import { matchCriteria, CustomMatcher } from '../src/matcher'

describe('matchCriteria', function() {
  it('should match an implicit = operator', function() {
    expect(matchCriteria({ a: 'a' }, { a: 'a' })).to.be.true
    expect(matchCriteria({ a: 'a' }, { a: 'b' })).to.be.false
    expect(matchCriteria({ }, { a: 'a' })).to.be.false
  })

  it('should match an implicit = operator', function() {
    expect(matchCriteria({ a: 'a' }, { a: 'a' })).to.be.true
    expect(matchCriteria({ a: 'a' }, { a: 'b' })).to.be.false
    expect(matchCriteria({ }, { a: 'a' })).to.be.false
  })

  it('should match an implicit = operator involving null', function() {
    expect(matchCriteria({ a: null }, { a: null })).to.be.true
    expect(matchCriteria({ a: null }, { a: 'NULL' })).to.be.true
    expect(matchCriteria({ }, { a: null })).to.be.false
    expect(matchCriteria({ }, { a: 'NULL' })).to.be.false
    expect(matchCriteria({ a: 'a' }, { a: null })).to.be.false
    expect(matchCriteria({ a: 'a' }, { a: 'NULL' })).to.be.false
  })

  it('should match an implicit = operator involving an array', function() {
    expect(matchCriteria({ a: 'z' }, { a: ['x','y','z']})).to.be.true
    expect(matchCriteria({ a: 'a' }, { a: ['x','y','z']})).to.be.false
    expect(matchCriteria({ }, { a: ['x','y','z']})).to.be.false
  })

  it('should match with operator =', function() {
    expect(matchCriteria({ a: 'a' }, { a: { operator: '=', value: 'a' }})).to.be.true
    expect(matchCriteria({ a: 'a' }, { a: { operator: '=', value: 'b' }})).to.be.false
    expect(matchCriteria({ }, { a: { operator: '=', value: 'b' }})).to.be.false
  })

  it('should match with operator >', function() {
    expect(matchCriteria({ a: 5 }, { a: { operator: '>', value: '4' }})).to.be.true
    expect(matchCriteria({ a: 5 }, { a: { operator: '>', value: '5' }})).to.be.false
    expect(matchCriteria({ }, { a: { operator: '>', value: '5' }})).to.be.false
  })

  it('should match with operator >=', function() {
    expect(matchCriteria({ a: 5 }, { a: { operator: '>=', value: '5' }})).to.be.true
    expect(matchCriteria({ a: 5 }, { a: { operator: '>=', value: '6' }})).to.be.false
    expect(matchCriteria({ }, { a: { operator: '>=', value: '6' }})).to.be.false
  })

  it('should match with operator <', function() {
    expect(matchCriteria({ a: 5 }, { a: { operator: '<', value: '6' }})).to.be.true
    expect(matchCriteria({ a: 5 }, { a: { operator: '<', value: '5' }})).to.be.false
    expect(matchCriteria({ }, { a: { operator: '<', value: '5' }})).to.be.false
  })

  it('should match with operator <=', function() {
    expect(matchCriteria({ a: 5 }, { a: { operator: '<=', value: '5' }})).to.be.true
    expect(matchCriteria({ a: 5 }, { a: { operator: '<=', value: '4' }})).to.be.false
    expect(matchCriteria({ }, { a: { operator: '<=', value: '4' }})).to.be.false
  })

  it('should match with operator <>', function() {
    expect(matchCriteria({ a: 'a' }, { a: { operator: '<>', value: 'aa' }})).to.be.true
    expect(matchCriteria({ a: 'a' }, { a: { operator: '<>', value: 'a' }})).to.be.false
    expect(matchCriteria({ }, { a: { operator: '<>', value: 'a' }})).to.be.false
  })

  it('should match with operator !=', function() {
    expect(matchCriteria({ a: 'a' }, { a: { operator: '!=', value: 'aa' }})).to.be.true
    expect(matchCriteria({ a: 'a' }, { a: { operator: '!=', value: 'a' }})).to.be.false
    expect(matchCriteria({ }, { a: { operator: '!=', value: 'a' }})).to.be.false
  })

  it('should match with operator IN', function() {
    expect(matchCriteria({ a: 'a' }, { a: { operator: 'IN', value: ['a'] }})).to.be.true
    expect(matchCriteria({ a: 'a' }, { a: { operator: 'IN', value: ['aa'] }})).to.be.false
    expect(matchCriteria({ }, { a: { operator: 'IN', value: ['aa'] }})).to.be.false
  })

  it('should match with operator IS NULL', function() {
    expect(matchCriteria({ a: null }, { a: { operator: 'IS', value: null }})).to.be.true
    expect(matchCriteria({ a: null }, { a: { operator: 'IS', value: 'NULL' }})).to.be.true
    expect(matchCriteria({  }, { a: { operator: 'IS', value: null }})).to.be.false
    expect(matchCriteria({  }, { a: { operator: 'IS', value: 'NULL' }})).to.be.false
    expect(matchCriteria({ a: 'a' }, { a: { operator: 'IS', value: null }})).to.be.false
    expect(matchCriteria({ a: 'a' }, { a: { operator: 'IS', value: 'NULL' }})).to.be.false
  })

  it('should match with operator IS NOT NULL', function() {
    expect(matchCriteria({ a: null }, { a: { operator: 'IS NOT', value: null }})).to.be.false
    expect(matchCriteria({ a: null }, { a: { operator: 'IS NOT', value: 'NULL' }})).to.be.false
    expect(matchCriteria({  }, { a: { operator: 'IS NOT', value: null }})).to.be.false
    expect(matchCriteria({  }, { a: { operator: 'IS NOT', value: 'NULL' }})).to.be.false
    expect(matchCriteria({ a: 'a' }, { a: { operator: 'IS NOT', value: null }})).to.be.true
    expect(matchCriteria({ a: 'a' }, { a: { operator: 'IS NOT', value: 'NULL' }})).to.be.true
  })

  it('should match with operator LIKE', function() {
    expect(matchCriteria({ a: 'a' }, { a: { operator: 'LIKE', value: 'a' }})).to.be.true
    expect(matchCriteria({ a: 'ab' }, { a: { operator: 'LIKE', value: 'a' }})).to.be.false
    expect(matchCriteria({ a: 'ab' }, { a: { operator: 'LIKE', value: 'a%' }})).to.be.true
    expect(matchCriteria({ a: 'ab' }, { a: { operator: 'LIKE', value: '%a' }})).to.be.false
    expect(matchCriteria({ a: 'ab' }, { a: { operator: 'LIKE', value: '%a%' }})).to.be.true
    expect(matchCriteria({ a: 'ab' }, { a: { operator: 'LIKE', value: 'b%' }})).to.be.false
    expect(matchCriteria({ a: 'ab' }, { a: { operator: 'LIKE', value: '%b' }})).to.be.true
    expect(matchCriteria({ a: 'ab' }, { a: { operator: 'LIKE', value: '%b%' }})).to.be.true
    expect(matchCriteria({ }, { a: { operator: 'LIKE', value: '%a%' }})).to.be.false
  })

  it('should accept multiple operator objects for one property', function() {
    expect(matchCriteria({ a: 5 }, { a: [{ operator: '>', value: 3 }, { operator: '<', value: 6 }]})).to.be.true
    expect(matchCriteria({ a: 1 }, { a: [{ operator: '>', value: 3 }, { operator: '<', value: 6 }]})).to.be.false
  })

  it('should match multiple connected criteria', function() {
    expect(matchCriteria({ a: 'a', b: 1 }, { a: ['a', 'b'], b: 1 })).to.be.true
    expect(matchCriteria({ a: 'b', b: 1 }, { a: ['a', 'b'], b: 1 })).to.be.true
    expect(matchCriteria({ a: 'a', b: 2 }, { a: ['a', 'b'], b: 1 })).to.be.false
    expect(matchCriteria({ a: 'b', b: 2 }, { a: ['a', 'b'], b: 1 })).to.be.false
  })

  it('should match an array of objects', function() {
    expect(matchCriteria({ a: [{ b: 2 }, { b: 1 }] }, { a: { b: 1 } })).to.be.true
    expect(matchCriteria({ a: [{ b: 2 }, { b: 1 }] }, { a: { b: 3 } })).to.be.false
  })

  it('should match the array length', function() {
    expect(matchCriteria({ a: [{ b: 2 }, { b: 1 }] }, { a: { arrayLength: 2 }})).to.be.true
    expect(matchCriteria({ a: [{ b: 2 }, { b: 1 }] }, { a: { arrayLength: 1 }})).to.be.false
    expect(matchCriteria({ a: [{ b: 2 }, { b: 1 }] }, { a: { arrayLength: 0 }})).to.be.false
    expect(matchCriteria({ a: [] }, { a: { arrayLength: 0 }})).to.be.true
    expect(matchCriteria({ a: null }, { a: { arrayLength: 0 }})).to.be.true
    expect(matchCriteria({ a: undefined }, { a: { arrayLength: 0 }})).to.be.true
  })

  it('should match an object', function() {
    expect(matchCriteria({ a: { b: 1 }}, { a: { b: 1 } })).to.be.true
    expect(matchCriteria({ a: { b: 1 }}, { a: { b: 3 } })).to.be.false
  })

  it('should match an object inside an object', function() {
    expect(matchCriteria({ a: { b: { c: 1 }}}, { a: { b: { c: 1 }}})).to.be.true
    expect(matchCriteria({ a: { b: { c: 1 }}}, { a: { b: { c: 3 }}})).to.be.false
  })

  it('should match an array inside an object', function() {
    expect(matchCriteria({ a: { b: [{ c: 2 }, { c: 1 }] }}, { a: { b: { c: 1 }}})).to.be.true
    expect(matchCriteria({ a: { b: [{ c: 2 }, { c: 1 }] }}, { a: { b: { c: 3 }}})).to.be.false
  })

  it('should use a custom matcher', function() {
    let customMatcher: CustomMatcher = {
      'A': [
        {
          field: 'a',
          match: (obj: any, criterium: number) => obj.a.indexOf(criterium) > -1
        }
      ]
    }

    expect(matchCriteria({ className: 'A', a: '123' }, { a: '1' }, customMatcher)).to.be.true
    expect(matchCriteria({ className: 'A', a: '123' }, { a: '4' }, customMatcher)).to.be.false
  })

  it('should use a custom matcher when property does not exist on the object', function() {
    let customMatcher: CustomMatcher = {
      'A': [
        {
          field: 'a',
          match: (obj: any, criterium: boolean) => criterium
        }
      ]
    }

    expect(matchCriteria({ className: 'A' }, { a: true }, customMatcher)).to.be.true
    expect(matchCriteria({ className: 'A' }, { a: false }, customMatcher)).to.be.false
  })
})