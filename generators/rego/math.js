/**
 * @license
 * Copyright 2012 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Generating Rego for math blocks.
 * @author q.neutron@gmail.com (Quynh Neutron)
 */
'use strict';

goog.provide('Blockly.Rego.math');

goog.require('Blockly.Rego');


Blockly.Rego['math_number'] = function(block) {
  // Numeric value.
  var code = Number(block.getFieldValue('NUM'));
  var order = code >= 0 ? Blockly.Rego.ORDER_ATOMIC :
              Blockly.Rego.ORDER_UNARY_NEGATION;
  return [code, order];
};
