/**
 * @license
 * Copyright 2012 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Generating Rego for logic blocks.
 * @author q.neutron@gmail.com (Quynh Neutron)
 */
'use strict';

goog.provide('Blockly.Rego.logic');

goog.require('Blockly.Rego');

Blockly.Rego['logic_compare'] = function(block) {
  // Comparison operator.
  var OPERATORS = {
    'EQ': '==',
    'NEQ': '!=',
    'LT': '<',
    'LTE': '<=',
    'GT': '>',
    'GTE': '>='
  };
  var operator = OPERATORS[block.getFieldValue('OP')];
  var order = (operator == '==' || operator == '!=') ?
      Blockly.Rego.ORDER_EQUALITY : Blockly.Rego.ORDER_RELATIONAL;
  var argument0 = Blockly.Rego.valueToCode(block, 'A', order) || '0';
  var argument1 = Blockly.Rego.valueToCode(block, 'B', order) || '0';
  var code = argument0 + ' ' + operator + ' ' + argument1;
  return [code, order];
};

Blockly.Rego['logic_negate'] = function(block) {
  // Negation.
  var order = Blockly.Rego.ORDER_LOGICAL_NOT;
  var argument0 = Blockly.Rego.valueToCode(block, 'BOOL', order) ||
      'true';
  var code = '!' + argument0;
  return [code, order];
};

Blockly.Rego['logic_boolean'] = function(block) {
  // Boolean values true and false.
  var code = (block.getFieldValue('BOOL') == 'TRUE') ? 'true' : 'false';
  return [code, Blockly.Rego.ORDER_ATOMIC];
};

Blockly.Rego['logic_null'] = function(block) {
  // Null data type.
  return ['null', Blockly.Rego.ORDER_ATOMIC];
};
