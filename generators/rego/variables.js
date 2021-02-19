/**
 * @license
 * Copyright 2012 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Generating Rego for variable blocks.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Blockly.Rego.variables');

goog.require('Blockly.Rego');


Blockly.Rego['variables_get'] = function(block) {
  // Variable getter.
  var code = Blockly.Rego.variableDB_.getName(block.getFieldValue('VAR'),
      Blockly.VARIABLE_CATEGORY_NAME);
  return [code, Blockly.Rego.ORDER_ATOMIC];
};

Blockly.Rego['variables_set'] = function(block) {
  // Variable setter.
  var argument0 = Blockly.Rego.valueToCode(block, 'VALUE',
      Blockly.Rego.ORDER_ASSIGNMENT) || '0';
  var varName = Blockly.Rego.variableDB_.getName(
      block.getFieldValue('VAR'), Blockly.VARIABLE_CATEGORY_NAME);
  return varName + ' = ' + argument0 + ';\n';
};
