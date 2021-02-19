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


Blockly.Rego['controls_if'] = function(block) {
  // If/elseif/else condition.
  var n = 0;
  var code = '', branchCode, conditionCode;
  if (Blockly.Rego.STATEMENT_PREFIX) {
    // Automatic prefix insertion is switched off for this block.  Add manually.
    code += Blockly.Rego.injectId(Blockly.Rego.STATEMENT_PREFIX,
        block);
  }
  do {
    conditionCode = Blockly.Rego.valueToCode(block, 'IF' + n,
        Blockly.Rego.ORDER_NONE) || 'false';
    branchCode = Blockly.Rego.statementToCode(block, 'DO' + n);
    if (Blockly.Rego.STATEMENT_SUFFIX) {
      branchCode = Blockly.Rego.prefixLines(
          Blockly.Rego.injectId(Blockly.Rego.STATEMENT_SUFFIX,
          block), Blockly.Rego.INDENT) + branchCode;
    }
    code += (n > 0 ? ' else ' : '') +
        'if (' + conditionCode + ') {\n' + branchCode + '}';
    ++n;
  } while (block.getInput('IF' + n));

  if (block.getInput('ELSE') || Blockly.Rego.STATEMENT_SUFFIX) {
    branchCode = Blockly.Rego.statementToCode(block, 'ELSE');
    if (Blockly.Rego.STATEMENT_SUFFIX) {
      branchCode = Blockly.Rego.prefixLines(
          Blockly.Rego.injectId(Blockly.Rego.STATEMENT_SUFFIX,
          block), Blockly.Rego.INDENT) + branchCode;
    }
    code += ' else {\n' + branchCode + '}';
  }
  return code + '\n';
};

Blockly.Rego['controls_ifelse'] = Blockly.Rego['controls_if'];

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

Blockly.Rego['logic_operation'] = function(block) {
  // Operations 'and', 'or'.
  var operator = (block.getFieldValue('OP') == 'AND') ? '&&' : '||';
  var order = (operator == '&&') ? Blockly.Rego.ORDER_LOGICAL_AND :
      Blockly.Rego.ORDER_LOGICAL_OR;
  var argument0 = Blockly.Rego.valueToCode(block, 'A', order);
  var argument1 = Blockly.Rego.valueToCode(block, 'B', order);
  if (!argument0 && !argument1) {
    // If there are no arguments, then the return value is false.
    argument0 = 'false';
    argument1 = 'false';
  } else {
    // Single missing arguments have no effect on the return value.
    var defaultArgument = (operator == '&&') ? 'true' : 'false';
    if (!argument0) {
      argument0 = defaultArgument;
    }
    if (!argument1) {
      argument1 = defaultArgument;
    }
  }
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

Blockly.Rego['logic_ternary'] = function(block) {
  // Ternary operator.
  var value_if = Blockly.Rego.valueToCode(block, 'IF',
      Blockly.Rego.ORDER_CONDITIONAL) || 'false';
  var value_then = Blockly.Rego.valueToCode(block, 'THEN',
      Blockly.Rego.ORDER_CONDITIONAL) || 'null';
  var value_else = Blockly.Rego.valueToCode(block, 'ELSE',
      Blockly.Rego.ORDER_CONDITIONAL) || 'null';
  var code = value_if + ' ? ' + value_then + ' : ' + value_else;
  return [code, Blockly.Rego.ORDER_CONDITIONAL];
};
