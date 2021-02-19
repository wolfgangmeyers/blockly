/**
 * @license
 * Copyright 2012 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Generating Rego for procedure blocks.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Blockly.Rego.procedures');

goog.require('Blockly.Rego');


Blockly.Rego['procedures_defreturn'] = function(block) {
  // Define a procedure with a return value.
  var funcName = Blockly.Rego.variableDB_.getName(
      block.getFieldValue('NAME'), Blockly.PROCEDURE_CATEGORY_NAME);
  var xfix1 = '';
  if (Blockly.Rego.STATEMENT_PREFIX) {
    xfix1 += Blockly.Rego.injectId(Blockly.Rego.STATEMENT_PREFIX,
        block);
  }
  if (Blockly.Rego.STATEMENT_SUFFIX) {
    xfix1 += Blockly.Rego.injectId(Blockly.Rego.STATEMENT_SUFFIX,
        block);
  }
  if (xfix1) {
    xfix1 = Blockly.Rego.prefixLines(xfix1, Blockly.Rego.INDENT);
  }
  var loopTrap = '';
  if (Blockly.Rego.INFINITE_LOOP_TRAP) {
    loopTrap = Blockly.Rego.prefixLines(
        Blockly.Rego.injectId(Blockly.Rego.INFINITE_LOOP_TRAP,
        block), Blockly.Rego.INDENT);
  }
  var branch = Blockly.Rego.statementToCode(block, 'STACK');
  var returnValue = Blockly.Rego.valueToCode(block, 'RETURN',
      Blockly.Rego.ORDER_NONE) || '';
  var xfix2 = '';
  if (branch && returnValue) {
    // After executing the function body, revisit this block for the return.
    xfix2 = xfix1;
  }
  if (returnValue) {
    returnValue = Blockly.Rego.INDENT + 'return ' + returnValue + ';\n';
  }
  var args = [];
  var variables = block.getVars();
  for (var i = 0; i < variables.length; i++) {
    args[i] = Blockly.Rego.variableDB_.getName(variables[i],
        Blockly.VARIABLE_CATEGORY_NAME);
  }
  var code = 'function ' + funcName + '(' + args.join(', ') + ') {\n' +
      xfix1 + loopTrap + branch + xfix2 + returnValue + '}';
  code = Blockly.Rego.scrub_(block, code);
  // Add % so as not to collide with helper functions in definitions list.
  Blockly.Rego.definitions_['%' + funcName] = code;
  return null;
};

// Defining a procedure without a return value uses the same generator as
// a procedure with a return value.
Blockly.Rego['procedures_defnoreturn'] =
    Blockly.Rego['procedures_defreturn'];

Blockly.Rego['procedures_callreturn'] = function(block) {
  // Call a procedure with a return value.
  var funcName = Blockly.Rego.variableDB_.getName(
      block.getFieldValue('NAME'), Blockly.PROCEDURE_CATEGORY_NAME);
  var args = [];
  var variables = block.getVars();
  for (var i = 0; i < variables.length; i++) {
    args[i] = Blockly.Rego.valueToCode(block, 'ARG' + i,
        Blockly.Rego.ORDER_NONE) || 'null';
  }
  var code = funcName + '(' + args.join(', ') + ')';
  return [code, Blockly.Rego.ORDER_FUNCTION_CALL];
};

Blockly.Rego['procedures_callnoreturn'] = function(block) {
  // Call a procedure with no return value.
  // Generated code is for a function call as a statement is the same as a
  // function call as a value, with the addition of line ending.
  var tuple = Blockly.Rego['procedures_callreturn'](block);
  return tuple[0] + ';\n';
};

Blockly.Rego['procedures_ifreturn'] = function(block) {
  // Conditionally return value from a procedure.
  var condition = Blockly.Rego.valueToCode(block, 'CONDITION',
      Blockly.Rego.ORDER_NONE) || 'false';
  var code = 'if (' + condition + ') {\n';
  if (Blockly.Rego.STATEMENT_SUFFIX) {
    // Inject any statement suffix here since the regular one at the end
    // will not get executed if the return is triggered.
    code += Blockly.Rego.prefixLines(
        Blockly.Rego.injectId(Blockly.Rego.STATEMENT_SUFFIX, block),
        Blockly.Rego.INDENT);
  }
  if (block.hasReturnValue_) {
    var value = Blockly.Rego.valueToCode(block, 'VALUE',
        Blockly.Rego.ORDER_NONE) || 'null';
    code += Blockly.Rego.INDENT + 'return ' + value + ';\n';
  } else {
    code += Blockly.Rego.INDENT + 'return;\n';
  }
  code += '}\n';
  return code;
};
